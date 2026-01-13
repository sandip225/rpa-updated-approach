# WhatsApp Bot Integration Guide

## Overview
यह guide आपको WhatsApp Business API के साथ guided flow को integrate करने में मदद करेगा।

## Step 1: Meta Business Account Setup

### 1.1 Create Meta Business Account
- Go to https://business.facebook.com
- Sign up or login with your account
- Create a new business account

### 1.2 Create WhatsApp Business App
- Go to https://developers.facebook.com
- Create a new app (type: Business)
- Add WhatsApp product to your app
- Go to WhatsApp > Getting Started

### 1.3 Get Required Credentials
You'll need these environment variables:

```
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=verify_token_123
```

## Step 2: Configure Webhook

### 2.1 Set Webhook URL
In Meta App Dashboard:
- Go to WhatsApp > Configuration
- Set Webhook URL: `https://your-domain.com/api/whatsapp/webhook`
- Set Verify Token: `verify_token_123` (or your custom token)

### 2.2 Subscribe to Messages
- In Webhook Fields, select: `messages`
- This will send incoming messages to your webhook

## Step 3: Environment Setup

### 3.1 Add to .env file
```bash
WHATSAPP_BUSINESS_ACCOUNT_ID=your_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_API_TOKEN=your_token
WHATSAPP_VERIFY_TOKEN=verify_token_123
```

### 3.2 Restart Backend
```bash
cd unified-portal/backend
uvicorn app.main:app --reload --port 8000
```

## Step 4: Test the Bot

### 4.1 Send Test Message
Send a WhatsApp message to your business number with:
```
Hello
```

### 4.2 Expected Response
Bot will respond with:
```
🙏 नमस्ते! Welcome to Gujarat Citizen Services Portal

Please select a service:
1️⃣ Gas (गैस)
2️⃣ Electricity (बिजली)
3️⃣ Water (पानी)
4️⃣ Property (संपत्ति)
```

### 4.3 Complete Flow
1. Type service name (e.g., "Gas")
2. Select provider (e.g., "Gujarat Gas")
3. Enter your details
4. Confirm submission
5. Get tracking ID

## Step 5: API Endpoints

### Check Status
```bash
curl http://localhost:8000/api/whatsapp/status
```

Response:
```json
{
  "status": "active",
  "configured": true,
  "active_sessions": 5,
  "services": ["gas", "electricity", "water", "property"]
}
```

### Webhook Verification
```bash
curl "http://localhost:8000/api/whatsapp/webhook?hub.verify_token=verify_token_123&hub.challenge=test_challenge"
```

## Step 6: Production Deployment

### 6.1 Update CORS
Add your production domain to CORS in `main.py`:
```python
allow_origins=[
    "https://your-domain.com",
    ...
]
```

### 6.2 Use HTTPS
WhatsApp requires HTTPS for webhook. Use:
- Nginx with SSL
- AWS ALB with SSL
- Cloudflare

### 6.3 Database Integration
Currently uses in-memory sessions. For production:
- Store sessions in database
- Add user authentication
- Track applications in DB

## Step 7: Troubleshooting

### Issue: Webhook not receiving messages
- Check webhook URL is HTTPS
- Verify token matches
- Check firewall/security groups

### Issue: Messages not sending
- Verify API token is valid
- Check phone number format (include country code)
- Check rate limits

### Issue: Bot not responding
- Check backend logs
- Verify environment variables
- Test with `/api/whatsapp/status`

## Step 8: Advanced Features (Future)

### 8.1 Rich Messages
- Send images/documents
- Interactive buttons
- List selections

### 8.2 User Authentication
- Link WhatsApp to portal account
- Track applications per user
- Send status updates

### 8.3 Analytics
- Track conversation flow
- Monitor completion rates
- Analyze user behavior

## Support

For issues or questions:
1. Check Meta WhatsApp API docs: https://developers.facebook.com/docs/whatsapp
2. Review backend logs: `unified-portal/backend/app/routers/whatsapp.py`
3. Test webhook: `http://localhost:8000/api/whatsapp/status`

---

**Note**: Demo mode is active if `WHATSAPP_API_TOKEN` is not set. Messages will be logged instead of sent.
