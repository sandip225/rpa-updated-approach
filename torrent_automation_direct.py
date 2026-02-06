#!/usr/bin/env python3
"""
DIRECT TORRENT POWER AUTOMATION
Opens Chrome browser, fills form fields, and stays open for manual submission
Run this directly: python torrent_automation_direct.py
"""

import sys
import time

print("\n" + "="*80)
print("🎬 TORRENT POWER VISIBLE BROWSER AUTOMATION")
print("="*80 + "\n")

try:
    print("📍 Step 1: Importing Selenium...")
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import Select
    from webdriver_manager.chrome import ChromeDriverManager
    print("✅ Imports successful\n")
    
    # Test data - YOU CAN MODIFY THESE
    form_data = {
        "city": "Ahmedabad",
        "service_number": "3325256",
        "t_number": "T145678",
        "mobile": "9898974561",
        "email": "test@gmail.com"
    }
    
    print("📋 FORM DATA TO FILL:")
    for key, value in form_data.items():
        print(f"   {key.replace('_', ' ').title()}: {value}")
    print()
    
    # Setup Chrome options
    print("📍 Step 2: Setting up Chrome...")
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1280,720")
    # NO HEADLESS - BROWSER WILL BE VISIBLE
    chrome_options.add_argument("--start-maximized")
    print("✅ Chrome options configured\n")
    
    # Get ChromeDriver
    print("📍 Step 3: Getting ChromeDriver path...")
    driver_path = ChromeDriverManager().install()
    print(f"✅ ChromeDriver: {driver_path}\n")
    
    # Create WebDriver
    print("📍 Step 4: Opening Chrome browser...")
    print("🎬 >>> CHROME SHOULD OPEN NOW ON YOUR SCREEN <<<\n")
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    print("✅ Chrome opened successfully!\n")
    
    # Navigate to Torrent Power
    torrent_url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
    print(f"📍 Step 5: Navigating to {torrent_url}...")
    driver.get(torrent_url)
    print("⏳ Waiting for page to load (7 seconds)...")
    time.sleep(7)
    print("✅ Page loaded!\n")
    
    # Fill form fields
    print("📍 Step 6: Auto-filling form fields...\n")
    
    try:
        print("🎯 Filling: City")
        city_dropdown = driver.find_element(By.CSS_SELECTOR, "select[name*='city'], select[id*='city'], select")
        select = Select(city_dropdown)
        select.select_by_visible_text(form_data["city"])
        print(f"✅ City filled: {form_data['city']}")
        time.sleep(1)
    except Exception as e:
        print(f"⚠️  City not filled: {str(e)}")
    
    try:
        print("\n🎯 Filling: Service Number")
        service_input = driver.find_elements(By.CSS_SELECTOR, "input[type='text']")[0]
        service_input.clear()
        service_input.send_keys(form_data["service_number"])
        print(f"✅ Service Number filled: {form_data['service_number']}")
        time.sleep(1)
    except Exception as e:
        print(f"⚠️  Service Number not filled: {str(e)}")
    
    try:
        print("\n🎯 Filling: T Number (Transaction)")
        t_input = driver.find_elements(By.CSS_SELECTOR, "input[type='text']")[1]
        t_input.clear()
        t_input.send_keys(form_data["t_number"])
        print(f"✅ T Number filled: {form_data['t_number']}")
        time.sleep(1)
    except Exception as e:
        print(f"⚠️  T Number not filled: {str(e)}")
    
    try:
        print("\n🎯 Filling: Mobile Number")
        mobile_input = driver.find_elements(By.CSS_SELECTOR, "input[type='text']")[2]
        mobile_input.clear()
        mobile_input.send_keys(form_data["mobile"])
        print(f"✅ Mobile filled: {form_data['mobile']}")
        time.sleep(1)
    except Exception as e:
        print(f"⚠️  Mobile not filled: {str(e)}")
    
    try:
        print("\n🎯 Filling: Email")
        email_input = driver.find_elements(By.CSS_SELECTOR, "input[type='email'], input[type='text']")[-2]
        email_input.clear()
        email_input.send_keys(form_data["email"])
        print(f"✅ Email filled: {form_data['email']}")
        time.sleep(1)
    except Exception as e:
        print(f"⚠️  Email not filled: {str(e)}")
    
    print("\n" + "="*80)
    print("✅ AUTOMATION COMPLETE!")
    print("="*80)
    print("\n📝 NEXT STEPS:")
    print("   1. 👀 Review all filled fields in the browser")
    print("   2. 🔧 Correct any incorrect data if needed")
    print("   3. 🔤 Complete the CAPTCHA manually")
    print("   4. 📤 Click the SUBMIT button")
    print("   5. 💾 Save your application reference number")
    print("\n🎬 Browser will stay open. Close it when you're done.\n")
    
    # Keep browser open indefinitely
    print("⏸️  Browser is now under your control...")
    print("⏳ Press Ctrl+C in this terminal to close browser when done.\n")
    
    while True:
        time.sleep(1)
    
except KeyboardInterrupt:
    print("\n\n🛑 Closing browser...")
    try:
        driver.quit()
        print("✅ Browser closed")
    except:
        pass
    print("✅ Automation ended by user")
    sys.exit(0)

except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    print(f"\nFull traceback:")
    print(traceback.format_exc())
    sys.exit(1)
