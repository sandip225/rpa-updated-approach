from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
import json
from datetime import datetime
import httpx
from app.config import settings

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

# WhatsApp Configuration from settings
WHATSAPP_BUSINESS_ACCOUNT_ID = settings.WHATSAPP_BUSINESS_ACCOUNT_ID
WHATSAPP_PHONE_NUMBER_ID = settings.WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_API_TOKEN = settings.WHATSAPP_API_TOKEN
WHATSAPP_VERIFY_TOKEN = settings.WHATSAPP_VERIFY_TOKEN

# Service data (same as web)
SERVICES = {
    "gas": {"name": "Gas", "nameHindi": "गैस", "providers": ["Gujarat Gas", "HP Gas", "Indane"]},
    "electricity": {"name": "Electricity", "nameHindi": "बिजली", "providers": ["GUVNL", "DGVCL", "UGVCL"]},
    "water": {"name": "Water", "nameHindi": "पानी", "providers": ["Water Board", "Municipal Corp"]},
    "property": {"name": "Property", "nameHindi": "संपत्ति", "providers": ["Land Records", "Municipal"]}
}

# Store user sessions (in production, use database)
user_sessions = {}


@router.get("/webhook")
async def verify_webhook(request: Request):
    """Verify webhook with WhatsApp"""
    # Log all query parameters
    print(f"All query params: {dict(request.query_params)}")
    print(f"Request URL: {request.url}")
    
    verify_token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    mode = request.query_params.get("hub.mode")
    
    print(f"Webhook verification request: mode={mode}, verify_token={verify_token}, challenge={challenge}")
    
    # If no parameters, return OK for Meta's initial check
    if not mode and not verify_token and not challenge:
        print("No parameters provided - returning 200 OK for Meta's health check")
        return PlainTextResponse(content="OK", status_code=200)
    
    if mode == "subscribe" and verify_token == WHATSAPP_VERIFY_TOKEN:
        print(f"Verification successful, returning challenge: {challenge}")
        return PlainTextResponse(content=str(challenge), status_code=200)
    
    print(f"Verification failed: mode={mode}, expected_token={WHATSAPP_VERIFY_TOKEN}, received_token={verify_token}")
    raise HTTPException(status_code=403, detail="Invalid verify token")


@router.post("/webhook")
async def handle_webhook(request: Request):
    """Handle incoming WhatsApp messages"""
    try:
        data = await request.json()
        
        # Check if this is a message event
        if data.get("entry"):
            for entry in data["entry"]:
                for change in entry.get("changes", []):
                    if change.get("field") == "messages":
                        messages = change.get("value", {}).get("messages", [])
                        for message in messages:
                            await process_message(message, change.get("value", {}))
        
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


async def process_message(message: dict, value: dict):
    """Process incoming message and send response"""
    from_number = message.get("from")
    message_id = message.get("id")
    message_type = message.get("type")
    
    # Get or create user session
    if from_number not in user_sessions:
        user_sessions[from_number] = {
            "step": "welcome",
            "selected_service": None,
            "selected_provider": None,
            "form_data": {}
        }
    
    session = user_sessions[from_number]
    
    # Handle different message types
    if message_type == "text":
        text = message.get("text", {}).get("body", "").lower().strip()
        await handle_text_message(from_number, text, session, message_id)
    elif message_type == "button":
        button_id = message.get("button", {}).get("payload", "")
        await handle_button_message(from_number, button_id, session, message_id)
    elif message_type == "interactive":
        button_reply = message.get("interactive", {}).get("button_reply", {})
        button_id = button_reply.get("id", "")
        await handle_button_message(from_number, button_id, session, message_id)


async def handle_text_message(phone: str, text: str, session: dict, message_id: str):
    """Handle text messages"""
    step = session.get("step")
    
    if step == "welcome":
        # Send welcome message with service options
        await send_service_menu(phone)
        session["step"] = "service_select"
    
    elif step == "service_select":
        # Check if user selected a service
        service_key = None
        for key in SERVICES.keys():
            if key in text or SERVICES[key]["name"].lower() in text:
                service_key = key
                break
        
        if service_key:
            session["selected_service"] = service_key
            await send_provider_menu(phone, service_key)
            session["step"] = "provider_select"
        else:
            await send_message(phone, "❌ Please select a valid service: Gas, Electricity, Water, or Property")
    
    elif step == "provider_select":
        # Check if user selected a provider
        service_key = session.get("selected_service")
        providers = SERVICES[service_key]["providers"]
        
        selected_provider = None
        for provider in providers:
            if provider.lower() in text:
                selected_provider = provider
                break
        
        if selected_provider:
            session["selected_provider"] = selected_provider
            await send_form_message(phone, service_key, selected_provider)
            session["step"] = "form_fill"
        else:
            await send_message(phone, f"❌ Please select a valid provider from: {', '.join(providers)}")
    
    elif step == "form_fill":
        # Collect form data
        session["form_data"]["user_input"] = text
        await send_confirmation(phone, session)
        session["step"] = "confirmation"


async def handle_button_message(phone: str, button_id: str, session: dict, message_id: str):
    """Handle button clicks"""
    if button_id.startswith("service_"):
        service_key = button_id.replace("service_", "")
        session["selected_service"] = service_key
        await send_provider_menu(phone, service_key)
        session["step"] = "provider_select"
    
    elif button_id.startswith("provider_"):
        provider_name = button_id.replace("provider_", "").replace("_", " ")
        session["selected_provider"] = provider_name
        service_key = session.get("selected_service")
        await send_form_message(phone, service_key, provider_name)
        session["step"] = "form_fill"
    
    elif button_id == "confirm":
        # Submit application
        await submit_application(phone, session)
        session["step"] = "welcome"
        user_sessions[phone] = {
            "step": "welcome",
            "selected_service": None,
            "selected_provider": None,
            "form_data": {}
        }
    
    elif button_id == "restart":
        user_sessions[phone] = {
            "step": "welcome",
            "selected_service": None,
            "selected_provider": None,
            "form_data": {}
        }
        await send_welcome_message(phone)


async def send_welcome_message(phone: str):
    """Send welcome message"""
    message = """🙏 नमस्ते! Welcome to Gujarat Citizen Services Portal

Apply for name change in your utility connections:
• Gas (गैस)
• Electricity (बिजली)
• Water (पानी)
• Property (संपत्ति)

Type the service name to continue!"""
    
    await send_message(phone, message)


async def send_service_menu(phone: str):
    """Send service selection menu"""
    message = """🙏 नमस्ते! Welcome to Gujarat Citizen Services Portal

Please select a service:

1️⃣ Gas (गैस)
2️⃣ Electricity (बिजली)
3️⃣ Water (पानी)
4️⃣ Property (संपत्ति)

Type the service name or number to continue!"""
    
    await send_message(phone, message)


async def send_provider_menu(phone: str, service_key: str):
    """Send provider selection menu"""
    service = SERVICES[service_key]
    providers = service["providers"]
    
    provider_list = "\n".join([f"{i+1}️⃣ {p}" for i, p in enumerate(providers)])
    
    message = f"""✅ You selected: {service['name']} ({service['nameHindi']})

Now select your provider:

{provider_list}

Type the provider name to continue!"""
    
    await send_message(phone, message)


async def send_form_message(phone: str, service_key: str, provider: str):
    """Send form message"""
    service = SERVICES[service_key]
    
    message = f"""✅ You selected: {provider}

Please provide your details for name change:

📝 Enter your:
• Current Name
• New Name
• Consumer ID (if available)

Type your details (you can send multiple messages)"""
    
    await send_message(phone, message)


async def send_confirmation(phone: str, session: dict):
    """Send confirmation message"""
    service_key = session.get("selected_service")
    provider = session.get("selected_provider")
    service = SERVICES[service_key]
    
    message = f"""📋 Confirmation Summary:

Service: {service['name']} ({service['nameHindi']})
Provider: {provider}
Details: {session['form_data'].get('user_input', 'N/A')}

✅ Ready to submit?

Type 'YES' to confirm or 'NO' to cancel"""
    
    await send_message(phone, message)


async def submit_application(phone: str, session: dict):
    """Submit application"""
    tracking_id = f"GF{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    message = f"""✅ Application Submitted Successfully!

📌 Tracking ID: {tracking_id}

Your application for name change has been submitted.

⏱️ Estimated Processing Time: 5-7 business days

You can track your application status anytime by typing 'TRACK {tracking_id}'

Thank you for using Gujarat Citizen Services Portal! 🙏"""
    
    await send_message(phone, message)


async def send_message(phone: str, text: str):
    """Send message via WhatsApp API"""
    if not WHATSAPP_API_TOKEN:
        print(f"[DEMO] Would send to {phone}: {text}")
        return
    
    url = f"https://graph.facebook.com/v18.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {
            "body": text
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")


@router.get("/status")
async def get_status():
    """Get WhatsApp integration status"""
    return {
        "status": "active",
        "configured": bool(WHATSAPP_API_TOKEN),
        "active_sessions": len(user_sessions),
        "services": list(SERVICES.keys())
    }
