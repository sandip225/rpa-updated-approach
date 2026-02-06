#!/usr/bin/env python3
"""
Simple Chrome Opening Test
This script tests if Chrome can be opened and controlled via Selenium
Run this to verify Chrome is working before running full automation
"""

import sys
import os

print("\n" + "="*80)
print("🧪 CHROME OPENING TEST")
print("="*80 + "\n")

try:
    print("📍 Step 1: Importing required libraries...")
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    import time
    print("✅ Imports successful\n")
    
    print("📍 Step 2: Setting up Chrome options...")
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1280,720")
    # NO HEADLESS - browser should be visible
    print("✅ Chrome options created\n")
    
    print("📍 Step 3: Getting ChromeDriver...")
    driver_path = ChromeDriverManager().install()
    print(f"✅ ChromeDriver installed/found at: {driver_path}\n")
    
    print("📍 Step 4: Creating WebDriver service...")
    service = Service(driver_path)
    print("✅ Service created\n")
    
    print("📍 Step 5: Starting Chrome WebDriver...")
    print("⏳ Chrome should open now on your screen...")
    driver = webdriver.Chrome(service=service, options=chrome_options)
    print("✅ WebDriver started successfully!\n")
    
    print("📍 Step 6: Navigating to Google...")
    driver.get("https://www.google.com")
    print("✅ Page loaded successfully!\n")
    
    print("="*80)
    print("SUCCESS! Chrome is working correctly!")
    print("="*80)
    print("Chrome window is now open showing Google homepage")
    print("⏳ Keeping open for 10 seconds...\n")
    time.sleep(10)
    
    print("📍 Step 7: Closing Chrome...")
    driver.quit()
    print("✅ Chrome closed successfully!\n")
    
    print("="*80)
    print("✅ ALL TESTS PASSED - Chrome automation works!")
    print("="*80)
    print("You can now use the full Torrent Power automation.\n")
    
except Exception as e:
    print("\n" + "="*80)
    print(f"❌ TEST FAILED: {str(e)}")
    print("="*80 + "\n")
    
    import traceback
    print("Full error details:")
    print(traceback.format_exc())
    print("\n" + "="*80)
    print("TROUBLESHOOTING:")
    print("="*80)
    print("1. Is Google Chrome installed?")
    print("   Check: C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    print("2. Is your internet connection active?")
    print("3. Are there any firewall/antivirus blocking Chrome?")
    print("4. Try installing webdriver-manager:")
    print("   pip install webdriver-manager")
    print("="*80 + "\n")
    sys.exit(1)
