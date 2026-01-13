# DGVCL Auto-Fill Complete Setup Guide 🚀

## Current Problem ❌
- RPA bot script not found in Docker container
- Number not auto-filling on DGVCL portal
- Chrome/ChromeDriver not installed in container

## Solution ✅

### Step 1: Rebuild Docker Container with Chrome

```bash
# SSH to EC2
ssh -i gov-portal.pem ubuntu@98.93.30.22

# Go to project directory
cd unified-portal

# Stop containers
docker-compose down

# Rebuild with new Dockerfile (includes Chrome)
docker-compose build --no-cache backend

# Start containers
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

### Step 2: Verify Installation

```bash
# Make test script executable
chmod +x test-rpa-setup.sh

# Run tests
./test-rpa-setup.sh
```

**Expected Output:**
```
✅ Google Chrome 120.x.x
✅ ChromeDriver 120.x.x
✅ Selenium 4.x.x installed
✅ RPA script found at /app/rpa-automation/dgvcl_name_change_final.py
✅ API endpoint responding
```

### Step 3: Test Auto-Fill

#### Option A: Test via API (Backend)

```bash
curl -X POST http://98.93.30.22:8000/api/rpa/dgvcl/auto-fill \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "consumer_number": "1234567890",
    "discom": "DGVCL"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "RPA bot started! Processing in background.",
  "portal_url": "https://portal.guvnl.in/login.php",
  "screenshots": []
}
```

#### Option B: Test via Frontend (User Flow)

1. Open: `http://98.93.30.22:3000/services/electricity`
2. Select: DGVCL
3. Fill mobile: 9999999999
4. Fill consumer number: 1234567890
5. Click: Submit & Open DGVCL Portal
6. **Result:** Bot should fill mobile & DGVCL dropdown automatically

---

## How It Works 🔄

```
User submits form
       ↓
Frontend calls: POST /api/rpa/dgvcl/auto-fill
       ↓
Backend triggers RPA bot (background)
       ↓
Bot opens Chrome in headless mode
       ↓
Bot navigates to: https://portal.guvnl.in/login.php
       ↓
Bot fills mobile number field
       ↓
Bot selects DGVCL from dropdown
       ↓
Bot takes screenshots
       ↓
User completes captcha & OTP manually
```

---

## Two Auto-Fill Options 🎯

### Option 1: RPA Bot (Recommended) ⭐

**Pros:**
- ✅ No user installation needed
- ✅ Works for all users
- ✅ Fully automatic
- ✅ Can handle complex flows

**Cons:**
- ⚠️ Runs on server (headless)
- ⚠️ User can't see browser
- ⚠️ Requires Chrome in Docker

**Setup:** Already done! Just rebuild Docker.

---

### Option 2: Chrome Extension (Alternative)

**Pros:**
- ✅ Runs in user's browser
- ✅ User can see what's happening
- ✅ No server resources needed

**Cons:**
- ❌ User must install extension
- ❌ Not everyone can install
- ❌ Technical knowledge needed

**Setup:**

1. **Download Extension:**
   ```bash
   # On your local machine
   git clone https://github.com/Vaidehip0407/unified-portal.git
   cd unified-portal/chrome-extension
   ```

2. **Install in Chrome:**
   - Open Chrome
   - Go to: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `chrome-extension` folder
   - Done!

3. **Test:**
   - Go to: `http://98.93.30.22:3000/services/electricity`
   - Fill form and submit
   - Portal opens automatically
   - Extension auto-fills mobile & DGVCL
   - ✅ Done!

---

## Troubleshooting 🔧

### Issue 1: RPA script not found

**Error:**
```
RPA script not found. Please ensure rpa-automation folder exists.
```

**Fix:**
```bash
# Check if folder exists
docker-compose exec backend ls -la /app/rpa-automation/

# If not found, rebuild
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

### Issue 2: Chrome not installed

**Error:**
```
selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH
```

**Fix:**
```bash
# Rebuild Docker with Chrome
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d

# Verify
docker-compose exec backend chromium --version
```

---

### Issue 3: Selenium not installed

**Error:**
```
ModuleNotFoundError: No module named 'selenium'
```

**Fix:**
```bash
# Add to backend/requirements.txt
echo "selenium==4.16.0" >> backend/requirements.txt

# Rebuild
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

### Issue 4: Number not filling on portal

**Possible Reasons:**

1. **CORS Issue:** Browser blocks cross-domain auto-fill
   - **Solution:** Use RPA bot (runs on server)

2. **Portal changed structure:** Field IDs/names changed
   - **Solution:** Update selectors in `dgvcl_name_change_final.py`

3. **Extension not installed:** Chrome extension not loaded
   - **Solution:** Install extension properly

4. **Data not stored:** localStorage cleared
   - **Solution:** Check if data is saved after form submit

---

## Which Option Should You Use? 🤔

### Use RPA Bot (Option 1) if:
- ✅ You want 100% automation
- ✅ Users don't want to install anything
- ✅ You have server resources
- ✅ You want professional solution

### Use Chrome Extension (Option 2) if:
- ✅ Users are tech-savvy
- ✅ Users want to see what's happening
- ✅ You want lightweight solution
- ✅ Server resources limited

### Use Both! (Recommended) 🎯
- RPA Bot as default (automatic)
- Chrome Extension as fallback (for users who want it)
- Manual copy-paste as last resort (current UI)

---

## Current Implementation Status

✅ **Completed:**
- RPA bot script (`dgvcl_name_change_final.py`)
- Backend API endpoint (`/api/rpa/dgvcl/auto-fill`)
- Chrome extension (manifest fixed)
- Frontend with copy buttons
- Docker configuration updated

⏳ **Pending:**
- Rebuild Docker container with Chrome
- Test RPA bot end-to-end
- Verify auto-fill works

---

## Next Steps (Do This Now!) 👇

```bash
# 1. SSH to EC2
ssh -i gov-portal.pem ubuntu@98.93.30.22

# 2. Go to project
cd unified-portal

# 3. Pull latest code
git pull origin main

# 4. Rebuild Docker
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d

# 5. Test
chmod +x test-rpa-setup.sh
./test-rpa-setup.sh

# 6. Test via browser
# Open: http://98.93.30.22:3000/services/electricity
# Fill form and submit
# Check if auto-fill works!
```

---

## Expected Result ✅

After setup:

1. **User opens portal:** `http://98.93.30.22:3000`
2. **User fills form:** Mobile, Consumer Number, etc.
3. **User clicks:** "Submit & Open DGVCL Portal"
4. **Backend triggers RPA bot** (automatic)
5. **Bot opens DGVCL portal** (headless)
6. **Bot fills mobile & DGVCL** (automatic)
7. **Bot takes screenshots** (saved in `/tmp/dgvcl_screenshots/`)
8. **User sees portal** with pre-filled data
9. **User completes:** Captcha, OTP, remaining steps
10. **Done!** ✅

---

**Status:** ✅ Code Ready, ⏳ Docker Rebuild Needed
**Last Updated:** January 13, 2026
**Next Action:** Rebuild Docker container on EC2
