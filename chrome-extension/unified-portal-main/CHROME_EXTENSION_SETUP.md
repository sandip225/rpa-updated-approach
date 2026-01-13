# Chrome Extension Setup for DGVCL Auto-Fill

## Problem
DGVCL portal pe mobile number aur dropdown automatically fill nahi ho raha.

## Solution
Chrome Extension install karein jo automatically fields fill karega.

## Installation Steps (EC2 se files download karein)

### Method 1: Direct Download from GitHub

1. **Download Extension Files:**
   ```bash
   # Local machine pe
   git clone https://github.com/Vaidehip0407/unified-portal.git
   cd unified-portal/chrome-extension
   ```

2. **Install in Chrome:**
   - Chrome browser kholen
   - Address bar mein type karein: `chrome://extensions/`
   - Top-right corner mein **Developer mode** ON karein
   - **Load unpacked** button pe click karein
   - `chrome-extension` folder select karein
   - Extension install ho jayega!

### Method 2: EC2 se Download

1. **EC2 se files download:**
   ```bash
   # EC2 pe
   cd unified-portal
   zip -r chrome-extension.zip chrome-extension/
   
   # Local machine pe download using SCP
   scp -i gov-portal.pem ubuntu@your-ec2-ip:~/unified-portal/chrome-extension.zip .
   unzip chrome-extension.zip
   ```

2. **Install in Chrome** (same as Method 1)

## Verification

Extension install hone ke baad:

1. ✅ Extension icon (puzzle piece) mein "Gujarat Services Auto-Fill" dikhega
2. ✅ DGVCL portal pe floating ⚡ button dikhega
3. ✅ Right-click menu mein "Auto-Fill Form" option dikhega

## How It Works

```
User submits form → Data saved in localStorage
                  ↓
DGVCL portal opens → Extension detects data
                  ↓
Waits 1.5 seconds → Auto-fills fields:
                    - Mobile Number
                    - DGVCL Dropdown
                  ↓
Shows success notification
```

## Testing

1. **Submit form on your portal:**
   - Go to: `http://your-ec2-ip:3000/services/electricity`
   - Select DGVCL
   - Fill mobile: 9999999999
   - Click Submit

2. **DGVCL portal opens:**
   - URL: `https://portal.guvnl.in/login.php`
   - Wait 1.5 seconds
   - Mobile field should auto-fill
   - Dropdown should select DGVCL

3. **Manual trigger (if auto-fill doesn't work):**
   - Click floating ⚡ button
   - Or click extension icon → "Auto-Fill Current Page"

## Troubleshooting

### Extension not showing?
```
chrome://extensions/ → Check if "Gujarat Services Auto-Fill" is enabled
```

### Fields not auto-filling?
1. **Check Console:**
   ```
   F12 → Console → Look for:
   "Filling form with data: {...}"
   "Auto-filled 2 fields for GUVNL Portal"
   ```

2. **Check localStorage:**
   ```javascript
   // In DGVCL portal console
   localStorage.getItem('dgvcl_autofill_data')
   ```

3. **Reload Extension:**
   ```
   chrome://extensions/ → Click reload icon on extension
   ```

### Data expired?
- Data valid for only 5 minutes
- Submit form again from your portal

### CORS Error?
- Extension should work (has permissions)
- If not, check manifest.json has `https://portal.guvnl.in/*`

## Alternative: Bookmarklet (No Extension Needed)

Agar extension install nahi kar sakte, to yeh bookmarklet use karein:

1. **Create Bookmark:**
   - Right-click bookmark bar → Add page
   - Name: "DGVCL Auto-Fill"
   - URL: (paste code below)

```javascript
javascript:(function(){var data=localStorage.getItem('dgvcl_autofill_data');if(!data){alert('No data found. Submit form first!');return;}data=JSON.parse(data);if(Date.now()-data.timestamp>300000){alert('Data expired. Submit form again!');return;}var mobile=document.querySelector('input[type="tel"],input[placeholder*="Mobile"]');if(mobile){mobile.value=data.mobile;mobile.dispatchEvent(new Event('input',{bubbles:true}));}var discom=document.querySelector('select');if(discom){for(var i=0;i<discom.options.length;i++){if(discom.options[i].text.includes('DGVCL')){discom.selectedIndex=i;discom.dispatchEvent(new Event('change',{bubbles:true}));break;}}alert('Auto-filled mobile and DGVCL!');}})();
```

2. **Usage:**
   - Submit form on your portal
   - DGVCL portal opens
   - Click "DGVCL Auto-Fill" bookmark
   - Fields will auto-fill!

## Files Modified

- `chrome-extension/content.js` - Auto-fill logic
- `chrome-extension/manifest.json` - Permissions
- `frontend/src/pages/NameChangeForm.jsx` - Data storage

## Support

Agar koi issue ho:
1. Extension console check karein (F12 → Console)
2. Extension reload karein
3. Form dobara submit karein
4. Bookmarklet try karein (no installation needed)

---

**Recommended:** Chrome Extension install karein for best experience!
