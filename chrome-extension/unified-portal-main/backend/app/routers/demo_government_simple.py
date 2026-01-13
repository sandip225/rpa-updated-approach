from fastapi import APIRouter, Form
from fastapi.responses import HTMLResponse
import random
from datetime import datetime

router = APIRouter(prefix="/demo-govt", tags=["Demo Government"])

# Supplier mapping - all suppliers map to one of 4 base templates
SUPPLIER_TEMPLATES = {
    # Electricity suppliers -> electricity template
    'torrent-power': 'electricity', 'pgvcl': 'electricity', 'ugvcl': 'electricity', 
    'mgvcl': 'electricity', 'dgvcl': 'electricity',
    # Gas suppliers -> gas template
    'gujarat-gas': 'gas', 'sabarmati-gas': 'gas', 'adani-gas': 'gas', 
    'torrent-gas': 'gas', 'vadodara-gas': 'gas', 'irm-energy': 'gas',
    # Water suppliers -> water template
    'gwssb': 'water', 'amc-water': 'water', 'smc-water': 'water', 
    'vmc-water': 'water', 'rmc-water': 'water',
    # Property suppliers -> property template
    'anyror': 'property', 'e-dhara': 'property', 'e-nagar': 'property', 
    'talati': 'property', 'mamlatdar': 'property', 'indiafilings': 'property', 'ezylegal': 'property'
}

def get_rpa_script():
    return '''
    <script>
    const urlParams = new URLSearchParams(window.location.search);
    const isRpaMode = urlParams.get('rpa') === 'true';
    const formDataParam = urlParams.get('data');
    
    if (isRpaMode && formDataParam) {
        try {
            const parsedData = JSON.parse(decodeURIComponent(formDataParam));
            setTimeout(() => startRpaAutoFill(parsedData), 1000);
        } catch (e) {
            console.error('Parse error:', e);
            setTimeout(() => startRpaAutoFill({}), 1000);
        }
    }

    function startRpaAutoFill(userData) {
        const rpaStatus = document.getElementById('rpaStatus');
        rpaStatus.style.display = 'block';
        
        const form = document.getElementById('applicationForm');
        const inputs = form.querySelectorAll('input, select');
        let delay = 1000;
        
        const fieldMap = {
            'city': userData.city || 'Ahmedabad',
            'district': userData.district || userData.city || 'Ahmedabad',
            'zone': userData.zone || 'Central Zone',
            'serviceNumber': userData.service_number || 'SN' + Math.floor(Math.random() * 100000000),
            'tNo': userData.t_no || 'T' + Math.floor(Math.random() * 10000),
            'consumerNumber': userData.consumer_number || 'CN' + Math.floor(Math.random() * 100000000),
            'bpNumber': userData.bp_number || 'BP' + Math.floor(Math.random() * 100000000),
            'connectionNumber': userData.connection_number || 'CON' + Math.floor(Math.random() * 100000000),
            'connectionId': userData.connection_id || 'CID' + Math.floor(Math.random() * 1000000),
            'surveyNumber': userData.survey_number || '123/A',
            'propertyId': userData.property_id || 'PROP' + Math.floor(Math.random() * 1000000),
            'applicantName': userData.applicant_name || 'Demo User',
            'mobile': userData.mobile || '9876543210',
            'email': userData.email || 'demo@example.com',
            'address': userData.address || 'Demo Address, Gujarat',
            'village': userData.village || 'Demo Village',
            'taluka': userData.taluka || 'Demo Taluka',
            'ward': userData.ward || 'Ward 1'
        };
        
        inputs.forEach((input, index) => {
            setTimeout(() => {
                const fieldName = input.name || input.id;
                const value = fieldMap[fieldName] || '';
                
                rpaStatus.textContent = '🤖 Filling ' + fieldName + '...';
                input.classList.add('rpa-highlight');
                
                if (input.tagName === 'SELECT') {
                    // For select, find matching option
                    for (let opt of input.options) {
                        if (opt.value && (opt.value.toLowerCase().includes(value.toLowerCase()) || 
                            opt.text.toLowerCase().includes(value.toLowerCase()))) {
                            input.value = opt.value;
                            break;
                        }
                    }
                    if (!input.value && input.options.length > 1) {
                        input.value = input.options[1].value;
                    }
                } else {
                    // For text inputs, simulate typing
                    typeText(input, value);
                }
                
                setTimeout(() => input.classList.remove('rpa-highlight'), 800);
            }, delay);
            delay += 1000;
        });
        
        // Submit after all fields
        setTimeout(() => {
            rpaStatus.textContent = '🤖 Submitting form...';
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.add('rpa-highlight');
            setTimeout(() => form.submit(), 1000);
        }, delay + 500);
    }

    function typeText(element, text) {
        element.value = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.value += text[i];
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
    </script>
    '''

@router.get("/{supplier_id}", response_class=HTMLResponse)
def get_demo_site(supplier_id: str):
    template = SUPPLIER_TEMPLATES.get(supplier_id, 'electricity')
    
    if template == 'electricity':
        return get_electricity_form(supplier_id)
    elif template == 'gas':
        return get_gas_form(supplier_id)
    elif template == 'water':
        return get_water_form(supplier_id)
    else:
        return get_property_form(supplier_id)

def get_electricity_form(supplier_id):
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Electricity - Name Change</title>
        <style>
            body {{ font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; 
                   background: linear-gradient(135deg, #1e3c72, #2a5298); min-height: 100vh; }}
            .container {{ background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }}
            .header {{ text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #1e3c72; }}
            .logo {{ color: #1e3c72; font-size: 28px; font-weight: bold; margin-bottom: 10px; }}
            .fg {{ margin-bottom: 20px; }}
            label {{ display: block; margin-bottom: 8px; font-weight: bold; color: #333; }}
            input, select {{ width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                           font-size: 16px; box-sizing: border-box; }}
            .btn {{ background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 15px 30px; 
                   border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; 
                   width: 100%; margin-top: 20px; }}
            .req {{ color: red; }}
            .rpa-highlight {{ border: 3px solid #0f0 !important; box-shadow: 0 0 15px rgba(0,255,0,0.6) !important; 
                            animation: pulse 0.5s infinite; }}
            @keyframes pulse {{ 0%, 100% {{ box-shadow: 0 0 10px rgba(0,255,0,0.5); }} 
                              50% {{ box-shadow: 0 0 20px rgba(0,255,0,0.8); }} }}
            .rpa-status {{ position: fixed; top: 20px; right: 20px; background: #007bff; color: white; 
                         padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 1000; display: none; 
                         box-shadow: 0 4px 15px rgba(0,0,0,0.3); }}
        </style>
    </head>
    <body>
        <div class="rpa-status" id="rpaStatus">🤖 RPA Bot filling...</div>
        <div class="container">
            <div class="header">
                <div class="logo">⚡ ELECTRICITY SUPPLIER</div>
                <div style="font-size:12px;color:#888;">Name Change Application</div>
            </div>
            <form action="/demo-govt/{supplier_id}/submit" method="POST" id="applicationForm">
                <div class="fg">
                    <label>City <span class="req">*</span></label>
                    <select name="city" id="city" required>
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Rajkot">Rajkot</option>
                    </select>
                </div>
                <div class="fg">
                    <label>Consumer Number <span class="req">*</span></label>
                    <input type="text" name="consumerNumber" id="consumerNumber" required>
                </div>
                <div class="fg">
                    <label>Applicant Name <span class="req">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" required>
                </div>
                <div class="fg">
                    <label>Mobile <span class="req">*</span></label>
                    <input type="tel" name="mobile" id="mobile" required>
                </div>
                <div class="fg">
                    <label>Email</label>
                    <input type="email" name="email" id="email">
                </div>
                <div class="fg">
                    <label>Address</label>
                    <input type="text" name="address" id="address">
                </div>
                <button type="submit" class="btn" id="submitBtn">🚀 Submit Application</button>
            </form>
        </div>
        {get_rpa_script()}
    </body>
    </html>
    '''

def get_gas_form(supplier_id):
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Gas - Name Change</title>
        <style>
            body {{ font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; 
                   background: linear-gradient(135deg, #d32f2f, #f44336); min-height: 100vh; }}
            .container {{ background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }}
            .header {{ text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #d32f2f; }}
            .logo {{ color: #d32f2f; font-size: 28px; font-weight: bold; margin-bottom: 10px; }}
            .fg {{ margin-bottom: 20px; }}
            label {{ display: block; margin-bottom: 8px; font-weight: bold; color: #333; }}
            input, select {{ width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                           font-size: 16px; box-sizing: border-box; }}
            .btn {{ background: linear-gradient(135deg, #d32f2f, #f44336); color: white; padding: 15px 30px; 
                   border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; 
                   width: 100%; margin-top: 20px; }}
            .req {{ color: red; }}
            .rpa-highlight {{ border: 3px solid #0f0 !important; box-shadow: 0 0 15px rgba(0,255,0,0.6) !important; 
                            animation: pulse 0.5s infinite; }}
            @keyframes pulse {{ 0%, 100% {{ box-shadow: 0 0 10px rgba(0,255,0,0.5); }} 
                              50% {{ box-shadow: 0 0 20px rgba(0,255,0,0.8); }} }}
            .rpa-status {{ position: fixed; top: 20px; right: 20px; background: #007bff; color: white; 
                         padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 1000; display: none; 
                         box-shadow: 0 4px 15px rgba(0,0,0,0.3); }}
        </style>
    </head>
    <body>
        <div class="rpa-status" id="rpaStatus">🤖 RPA Bot filling...</div>
        <div class="container">
            <div class="header">
                <div class="logo">🔥 GAS SUPPLIER</div>
                <div style="font-size:12px;color:#888;">Name Change Application</div>
            </div>
            <form action="/demo-govt/{supplier_id}/submit" method="POST" id="applicationForm">
                <div class="fg">
                    <label>City <span class="req">*</span></label>
                    <select name="city" id="city" required>
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                    </select>
                </div>
                <div class="fg">
                    <label>Consumer Number <span class="req">*</span></label>
                    <input type="text" name="consumerNumber" id="consumerNumber" required>
                </div>
                <div class="fg">
                    <label>BP Number</label>
                    <input type="text" name="bpNumber" id="bpNumber">
                </div>
                <div class="fg">
                    <label>Applicant Name <span class="req">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" required>
                </div>
                <div class="fg">
                    <label>Mobile <span class="req">*</span></label>
                    <input type="tel" name="mobile" id="mobile" required>
                </div>
                <div class="fg">
                    <label>Email</label>
                    <input type="email" name="email" id="email">
                </div>
                <button type="submit" class="btn" id="submitBtn">🚀 Submit Application</button>
            </form>
        </div>
        {get_rpa_script()}
    </body>
    </html>
    '''

def get_water_form(supplier_id):
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Water - Name Change</title>
        <style>
            body {{ font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; 
                   background: linear-gradient(135deg, #0277bd, #03a9f4); min-height: 100vh; }}
            .container {{ background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }}
            .header {{ text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0277bd; }}
            .logo {{ color: #0277bd; font-size: 28px; font-weight: bold; margin-bottom: 10px; }}
            .fg {{ margin-bottom: 20px; }}
            label {{ display: block; margin-bottom: 8px; font-weight: bold; color: #333; }}
            input, select {{ width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                           font-size: 16px; box-sizing: border-box; }}
            .btn {{ background: linear-gradient(135deg, #0277bd, #03a9f4); color: white; padding: 15px 30px; 
                   border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; 
                   width: 100%; margin-top: 20px; }}
            .req {{ color: red; }}
            .rpa-highlight {{ border: 3px solid #0f0 !important; box-shadow: 0 0 15px rgba(0,255,0,0.6) !important; 
                            animation: pulse 0.5s infinite; }}
            @keyframes pulse {{ 0%, 100% {{ box-shadow: 0 0 10px rgba(0,255,0,0.5); }} 
                              50% {{ box-shadow: 0 0 20px rgba(0,255,0,0.8); }} }}
            .rpa-status {{ position: fixed; top: 20px; right: 20px; background: #007bff; color: white; 
                         padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 1000; display: none; 
                         box-shadow: 0 4px 15px rgba(0,0,0,0.3); }}
        </style>
    </head>
    <body>
        <div class="rpa-status" id="rpaStatus">🤖 RPA Bot filling...</div>
        <div class="container">
            <div class="header">
                <div class="logo">💧 WATER SUPPLY</div>
                <div style="font-size:12px;color:#888;">Name Change Application</div>
            </div>
            <form action="/demo-govt/{supplier_id}/submit" method="POST" id="applicationForm">
                <div class="fg">
                    <label>Zone/Ward <span class="req">*</span></label>
                    <select name="zone" id="zone" required>
                        <option value="">Select Zone</option>
                        <option value="East Zone">East Zone</option>
                        <option value="West Zone">West Zone</option>
                        <option value="North Zone">North Zone</option>
                        <option value="South Zone">South Zone</option>
                        <option value="Central Zone">Central Zone</option>
                    </select>
                </div>
                <div class="fg">
                    <label>Connection ID <span class="req">*</span></label>
                    <input type="text" name="connectionId" id="connectionId" required>
                </div>
                <div class="fg">
                    <label>Applicant Name <span class="req">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" required>
                </div>
                <div class="fg">
                    <label>Mobile <span class="req">*</span></label>
                    <input type="tel" name="mobile" id="mobile" required>
                </div>
                <div class="fg">
                    <label>Email</label>
                    <input type="email" name="email" id="email">
                </div>
                <button type="submit" class="btn" id="submitBtn">🚀 Submit Application</button>
            </form>
        </div>
        {get_rpa_script()}
    </body>
    </html>
    '''

def get_property_form(supplier_id):
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Property - Name Change</title>
        <style>
            body {{ font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; 
                   background: linear-gradient(135deg, #2e7d32, #4caf50); min-height: 100vh; }}
            .container {{ background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }}
            .header {{ text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2e7d32; }}
            .logo {{ color: #2e7d32; font-size: 28px; font-weight: bold; margin-bottom: 10px; }}
            .fg {{ margin-bottom: 20px; }}
            label {{ display: block; margin-bottom: 8px; font-weight: bold; color: #333; }}
            input, select {{ width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                           font-size: 16px; box-sizing: border-box; }}
            .btn {{ background: linear-gradient(135deg, #2e7d32, #4caf50); color: white; padding: 15px 30px; 
                   border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; 
                   width: 100%; margin-top: 20px; }}
            .req {{ color: red; }}
            .rpa-highlight {{ border: 3px solid #0f0 !important; box-shadow: 0 0 15px rgba(0,255,0,0.6) !important; 
                            animation: pulse 0.5s infinite; }}
            @keyframes pulse {{ 0%, 100% {{ box-shadow: 0 0 10px rgba(0,255,0,0.5); }} 
                              50% {{ box-shadow: 0 0 20px rgba(0,255,0,0.8); }} }}
            .rpa-status {{ position: fixed; top: 20px; right: 20px; background: #007bff; color: white; 
                         padding: 12px 20px; border-radius: 8px; font-size: 14px; z-index: 1000; display: none; 
                         box-shadow: 0 4px 15px rgba(0,0,0,0.3); }}
        </style>
    </head>
    <body>
        <div class="rpa-status" id="rpaStatus">🤖 RPA Bot filling...</div>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 PROPERTY SERVICES</div>
                <div style="font-size:12px;color:#888;">Name Transfer / Mutation</div>
            </div>
            <form action="/demo-govt/{supplier_id}/submit" method="POST" id="applicationForm">
                <div class="fg">
                    <label>District <span class="req">*</span></label>
                    <select name="district" id="district" required>
                        <option value="">Select District</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Rajkot">Rajkot</option>
                    </select>
                </div>
                <div class="fg">
                    <label>Taluka</label>
                    <input type="text" name="taluka" id="taluka">
                </div>
                <div class="fg">
                    <label>Village</label>
                    <input type="text" name="village" id="village">
                </div>
                <div class="fg">
                    <label>Survey Number <span class="req">*</span></label>
                    <input type="text" name="surveyNumber" id="surveyNumber" required>
                </div>
                <div class="fg">
                    <label>Applicant Name <span class="req">*</span></label>
                    <input type="text" name="applicantName" id="applicantName" required>
                </div>
                <div class="fg">
                    <label>Mobile <span class="req">*</span></label>
                    <input type="tel" name="mobile" id="mobile" required>
                </div>
                <button type="submit" class="btn" id="submitBtn">🚀 Submit Application</button>
            </form>
        </div>
        {get_rpa_script()}
    </body>
    </html>
    '''

@router.post("/{supplier_id}/submit")
def submit_demo_site(supplier_id: str):
    conf = f"APP{datetime.now().year}{random.randint(100000,999999)}"
    return HTMLResponse(f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Success</title>
        <style>
            body {{ font-family: Arial; max-width: 600px; margin: 50px auto; text-align: center; 
                   background: linear-gradient(135deg, #2e7d32, #4caf50); min-height: 100vh; padding: 20px; }}
            .box {{ background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }}
            .icon {{ font-size: 64px; margin-bottom: 20px; }}
            .conf {{ background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; }}
            .num {{ font-size: 24px; font-weight: bold; color: #155724; }}
        </style>
    </head>
    <body>
        <div class="box">
            <div class="icon">✅</div>
            <h1>Application Submitted!</h1>
            <div class="conf">
                <p><strong>Confirmation Number:</strong></p>
                <div class="num">{conf}</div>
            </div>
            <p>📧 SMS/Email will be sent shortly</p>
            <p>⏱️ Processing: 3-7 days</p>
        </div>
    </body>
    </html>
    ''')
