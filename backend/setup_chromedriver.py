"""
Quick setup script to pre-download ChromeDriver
Run this once to speed up first automation run
"""

import sys

print("=" * 60)
print("🚀 ChromeDriver Setup")
print("=" * 60)
print()

try:
    print("📦 Checking webdriver-manager...")
    from webdriver_manager.chrome import ChromeDriverManager
    print("✅ webdriver-manager is installed")
    print()
    
    print("⬇️ Downloading ChromeDriver (this may take 10-30 seconds)...")
    driver_path = ChromeDriverManager().install()
    print(f"✅ ChromeDriver downloaded successfully!")
    print(f"📍 Location: {driver_path}")
    print()
    
    print("🧪 Testing ChromeDriver...")
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=options)
    driver.get("data:text/html,<html><body><h1>Test</h1></body></html>")
    driver.quit()
    
    print("✅ ChromeDriver test passed!")
    print()
    print("=" * 60)
    print("✅ SETUP COMPLETE!")
    print("=" * 60)
    print()
    print("Next automation runs will be MUCH FASTER!")
    print("ChromeDriver is now cached and ready to use.")
    print()
    
except ImportError as e:
    print("❌ Missing dependencies!")
    print()
    print("Please install required packages:")
    print("  pip install selenium webdriver-manager")
    print()
    sys.exit(1)
    
except Exception as e:
    print(f"❌ Setup failed: {e}")
    print()
    import traceback
    traceback.print_exc()
    sys.exit(1)
