// Content script - runs on supported websites
console.log('Gujarat Services Auto-Fill Extension Loaded');

// Field mappings for different websites
const SITE_MAPPINGS = {
  'portal.guvnl.in': {
    name: 'GUVNL Portal (DGVCL/PGVCL/UGVCL/MGVCL)',
    fields: {
      // Mobile number field
      mobile: [
        'input[placeholder*="Mobile"]',
        'input[placeholder*="mobile"]',
        'input[type="tel"]',
        'input[name*="mobile"]',
        'input[id*="mobile"]',
        'input.form-control[type="text"]'
      ],
      // Discom dropdown
      discom: [
        'select[name*="discom"]',
        'select[name*="Discom"]',
        'select[id*="discom"]',
        'select.form-control',
        'select'
      ]
    }
  },
  'connect.torrentpower.com': {
    name: 'Torrent Power',
    fields: {
      // City dropdown - look for select with Ahmedabad option
      city: ['select.form-control', 'select.form-select', 'select[class*="city"]', 'select:has(option[value*="Ahmedabad"])'],
      // Service Number field
      service_number: [
        'input[placeholder*="Service Number"]',
        'input[placeholder*="service number"]', 
        'input[placeholder*="Service"]',
        'input.form-control[type="text"]:nth-of-type(1)',
        'input[name*="service"]',
        'input[id*="service"]'
      ],
      // T No field
      t_no: [
        'input[placeholder*="T No"]',
        'input[placeholder*="T-No"]',
        'input[placeholder*="TNo"]',
        'input[name*="tno"]',
        'input[name*="t_no"]',
        'input[id*="tno"]'
      ],
      // Mobile Number field
      mobile: [
        'input[placeholder*="Mobile"]',
        'input[placeholder*="mobile"]',
        'input[type="tel"]',
        'input[name*="mobile"]',
        'input[id*="mobile"]',
        'input[placeholder*="Phone"]'
      ],
      // Email field
      email: [
        'input[placeholder*="Email"]',
        'input[placeholder*="email"]',
        'input[type="email"]',
        'input[name*="email"]',
        'input[id*="email"]'
      ]
    }
  },
  'www.adanigas.com': {
    name: 'Adani Gas',
    fields: {
      consumer_number: ['[name="consumerNumber"]', '#consumerNumber', 'input[placeholder*="Consumer"]'],
      bp_number: ['[name="bpNumber"]', '#bpNumber'],
      mobile: ['[name="mobile"]', '#mobile', 'input[type="tel"]'],
      email: ['[name="email"]', '#email', 'input[type="email"]'],
      full_name: ['[name="name"]', '#name', 'input[placeholder*="Name"]']
    }
  },
  'www.gujaratgas.com': {
    name: 'Gujarat Gas',
    fields: {
      consumer_number: ['[name="consumerNo"]', '#consumerNo', 'input[placeholder*="Consumer"]'],
      mobile: ['[name="mobile"]', '#mobile', 'input[type="tel"]'],
      email: ['[name="email"]', '#email', 'input[type="email"]']
    }
  },
  'ahmedabadcity.gov.in': {
    name: 'AMC',
    fields: {
      connection_id: ['[name="connectionId"]', '#connectionId'],
      mobile: ['[name="mobile"]', '#mobile', 'input[type="tel"]'],
      email: ['[name="email"]', '#email', 'input[type="email"]'],
      full_name: ['[name="name"]', '#name'],
      address: ['[name="address"]', '#address', 'textarea[name="address"]']
    }
  },
  'anyror.gujarat.gov.in': {
    name: 'AnyRoR Gujarat',
    fields: {
      district: ['#district', 'select[name="district"]'],
      taluka: ['#taluka', 'select[name="taluka"]'],
      village: ['#village', 'select[name="village"]'],
      survey_number: ['[name="surveyNo"]', '#surveyNo', 'input[placeholder*="Survey"]']
    }
  }
};

// Get current site mapping
function getCurrentSiteMapping() {
  const hostname = window.location.hostname;
  return SITE_MAPPINGS[hostname] || null;
}

// Find element by multiple selectors
function findElement(selectors) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

// Fill a single field
function fillField(element, value) {
  if (!element || !value) return false;
  
  // Handle select elements
  if (element.tagName === 'SELECT') {
    const options = Array.from(element.options);
    const option = options.find(opt => 
      opt.value.toLowerCase() === value.toLowerCase() ||
      opt.text.toLowerCase() === value.toLowerCase()
    );
    if (option) {
      element.value = option.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }
  
  // Handle input/textarea
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

// Fill form with user data
async function fillForm() {
  const siteMapping = getCurrentSiteMapping();
  if (!siteMapping) {
    console.log('Site not supported');
    return { success: false, message: 'Site not supported' };
  }
  
  // Get stored data from extension storage
  const data = await chrome.storage.local.get(['userData', 'autofillData']);
  
  // Also check localStorage for DGVCL data from our portal
  let dgvclData = null;
  try {
    const storedData = localStorage.getItem('dgvcl_autofill_data');
    if (storedData) {
      dgvclData = JSON.parse(storedData);
      // Check if data is not too old (5 minutes)
      if (Date.now() - dgvclData.timestamp > 5 * 60 * 1000) {
        localStorage.removeItem('dgvcl_autofill_data');
        dgvclData = null;
      }
    }
  } catch (e) {
    console.log('No DGVCL data in localStorage');
  }
  
  if (!data.userData && !dgvclData) {
    console.log('No user data found');
    return { success: false, message: 'Please login to extension first or submit form from portal' };
  }
  
  const userData = data.userData || {};
  const autofillData = data.autofillData || {};
  
  // Merge all data sources
  const allData = {
    ...userData,
    full_name: userData.full_name,
    // Use DGVCL data if available
    mobile: dgvclData?.mobile || userData.mobile,
    consumer_number: dgvclData?.consumer_number || autofillData.electricity_accounts?.[0]?.consumer_number || '',
    // Electricity data
    service_number: autofillData.electricity_accounts?.[0]?.service_number || '',
    t_no: autofillData.electricity_accounts?.[0]?.t_no || '',
    // Gas data
    bp_number: autofillData.gas_accounts?.[0]?.bp_number || '',
    // Water data
    connection_id: autofillData.water_accounts?.[0]?.connection_id || '',
    // Property data
    survey_number: autofillData.property_accounts?.[0]?.survey_number || '',
    property_id: autofillData.property_accounts?.[0]?.property_id || '',
    // Discom selection
    discom: dgvclData?.provider || 'DGVCL'
  };
  
  console.log('Filling form with data:', allData);
  
  let filledCount = 0;
  
  // Fill each field
  for (const [fieldName, selectors] of Object.entries(siteMapping.fields)) {
    const element = findElement(selectors);
    const value = allData[fieldName];
    
    if (element && value) {
      const filled = fillField(element, value);
      if (filled) {
        filledCount++;
        // Highlight filled field
        element.style.backgroundColor = '#e8f5e9';
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 2000);
      }
    }
  }
  
  // Show notification
  showNotification(`Filled ${filledCount} fields on ${siteMapping.name}`);
  
  return { success: filledCount > 0, filledCount };
}

// Show notification on page
function showNotification(message) {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    ">
      ✓ ${message}
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillForm().then(result => {
      sendResponse(result);
    });
    return true; // Keep channel open for async response
  }
});

// Auto-detect forms and show fill button
function addAutoFillButton() {
  const siteMapping = getCurrentSiteMapping();
  if (!siteMapping) return;
  
  // Check if we have stored data
  chrome.storage.local.get(['userData'], (data) => {
    if (!data.userData) return;
    
    // Create floating button
    const button = document.createElement('div');
    button.innerHTML = `
      <button id="gujAutoFillBtn" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        <span style="font-size: 18px;">⚡</span>
        Auto-Fill Form
      </button>
    `;
    document.body.appendChild(button);
    
    const btn = document.getElementById('gujAutoFillBtn');
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });
    btn.addEventListener('click', () => {
      fillForm();
    });
  });
}

// Auto-fill on page load if data is available
function autoFillOnLoad() {
  // Check if we're on DGVCL portal and have data
  if (window.location.hostname === 'portal.guvnl.in') {
    console.log('🔍 Extension: Checking for stored data...');
    
    // Method 1: Check URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const mobile = urlParams.get('mobile');
    const discom = urlParams.get('discom');
    
    if (mobile && discom) {
      console.log('📦 Extension: Found data in URL params:', { mobile, discom });
      
      setTimeout(() => {
        fillFormWithData({ mobile, provider: discom });
      }, 1500);
      return;
    }
    
    // Method 2: Check URL hash
    if (window.location.hash.includes('autofill=')) {
      try {
        const hashData = window.location.hash.split('autofill=')[1];
        const decoded = atob(hashData);
        const data = JSON.parse(decoded);
        console.log('📦 Extension: Found data in URL hash:', data);
        
        setTimeout(() => {
          fillFormWithData(data);
        }, 1500);
        return;
      } catch (e) {
        console.error('❌ Extension: Error parsing URL hash:', e);
      }
    }
    
    // Method 3: Check localStorage (fallback)
    try {
      const storedData = localStorage.getItem('dgvcl_autofill_data');
      console.log('📦 Extension: Checking localStorage:', storedData);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log('📋 Extension: Parsed data:', data);
        
        // Check if data is fresh (less than 5 minutes old)
        if (Date.now() - data.timestamp < 5 * 60 * 1000) {
          console.log('✅ Extension: Data is fresh, auto-filling...');
          setTimeout(() => {
            fillFormWithData(data);
          }, 1500);
        } else {
          console.warn('⚠️ Extension: Data expired (older than 5 minutes)');
          localStorage.removeItem('dgvcl_autofill_data');
        }
      } else {
        console.log('ℹ️ Extension: No stored data found');
      }
    } catch (e) {
      console.error('❌ Extension: Error in auto-fill:', e);
    }
  }
}

// Helper function to fill form with data
function fillFormWithData(data) {
  console.log('🚀 Extension: Starting auto-fill with data:', data);
  
  // Fill mobile number
  const mobileSelectors = [
    'input[id="mobile"]',
    'input[name="mobile"]',
    'input[placeholder*="Mobile"]',
    'input[type="text"]'
  ];
  
  for (const selector of mobileSelectors) {
    const field = document.querySelector(selector);
    if (field) {
      field.value = data.mobile;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('✅ Extension: Filled mobile number:', data.mobile);
      
      // Highlight field
      field.style.backgroundColor = '#e8f5e9';
      setTimeout(() => {
        field.style.backgroundColor = '';
      }, 2000);
      break;
    }
  }
  
  // Fill DISCOM dropdown
  const discomSelectors = [
    'select[id="discom"]',
    'select[name="discom"]',
    'select.form-control'
  ];
  
  for (const selector of discomSelectors) {
    const dropdown = document.querySelector(selector);
    if (dropdown) {
      const options = Array.from(dropdown.options);
      const option = options.find(opt => 
        opt.text.includes(data.provider) || opt.value.includes(data.provider)
      );
      if (option) {
        dropdown.value = option.value;
        dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Extension: Selected DISCOM:', data.provider);
        
        // Highlight field
        dropdown.style.backgroundColor = '#e8f5e9';
        setTimeout(() => {
          dropdown.style.backgroundColor = '';
        }, 2000);
      }
      break;
    }
  }
  
  showNotification(`Auto-filled mobile & ${data.provider}!`);
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addAutoFillButton();
    autoFillOnLoad();
  });
} else {
  addAutoFillButton();
  autoFillOnLoad();
}
