"""
DGVCL Name Change - SAFE MODE (NO AUTO-SUBMIT)
This script ONLY fills the form, NEVER submits
User must manually verify and submit
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import sys

# ⚠️ SAFETY CONFIGURATION
SAFETY_MODE = True  # NEVER change this to False
AUTO_SUBMIT_DISABLED = True  # NEVER click submit button
MANUAL_VERIFICATION_REQUIRED = True

class DGVCLNameChangeSafe:
    """
    SAFE MODE: Only fills form, never submits
    User must manually verify and submit
    """
    
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_browser(self):
        """Setup Chrome browser with visible window"""
        options = Options()
        # Keep browser visible for user verification
        # options.add_argument('--headless')  # DISABLED - User needs to see
        options.add_argument('--start-maximized')
        options.add_argument('--disable-blink-features=AutomationControlled')
        
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 20)
        
        print("✅ Browser opened - You can see the process")
        
    def navigate_to_portal(self):
        """Navigate to DGVCL portal"""
        print("\n🌐 Opening DGVCL Portal...")
        self.driver.get("https://portal.guvnl.in/login.php")
        time.sleep(3)
        print("✅ Portal loaded")
        
    def login(self, consumer_number, mobile_or_email):
        """
        Login to DGVCL portal
        Note: Actual login credentials needed
        """
        print("\n🔐 Attempting login...")
        
        try:
            # Find login fields
            consumer_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "consumer_no"))
            )
            consumer_field.clear()
            consumer_field.send_keys(consumer_number)
            print(f"✅ Entered Consumer Number: {consumer_number}")
            
            # Mobile/Email field
            mobile_field = self.driver.find_element(By.ID, "mobile_email")
            mobile_field.clear()
            mobile_field.send_keys(mobile_or_email)
            print(f"✅ Entered Mobile/Email: {mobile_or_email}")
            
            # Click login button
            login_btn = self.driver.find_element(By.ID, "login_btn")
            login_btn.click()
            
            time.sleep(5)
            print("✅ Login attempted - Please verify OTP if required")
            
            # Wait for user to complete OTP
            input("\n⏸️  Press ENTER after completing OTP verification...")
            
        except Exception as e:
            print(f"⚠️  Login error: {e}")
            print("💡 You may need to login manually")
            input("⏸️  Press ENTER after manual login...")
    
    def navigate_to_name_change(self):
        """Navigate to Name Change service page"""
        print("\n📄 Navigating to Name Change page...")
        
        try:
            # Look for "Name Change" or "Consumer Services" link
            # This depends on actual portal structure
            time.sleep(3)
            
            # Try to find name change link
            name_change_link = self.driver.find_element(
                By.XPATH, 
                "//a[contains(text(), 'Name Change') or contains(text(), 'Consumer Details')]"
            )
            name_change_link.click()
            
            time.sleep(3)
            print("✅ Name Change page loaded")
            
        except Exception as e:
            print(f"⚠️  Navigation error: {e}")
            print("💡 Please navigate to Name Change page manually")
            input("⏸️  Press ENTER when on Name Change page...")
    
    def fill_form_data(self, data):
        """
        Fill form with provided data
        ⚠️ DOES NOT SUBMIT - Only fills fields
        """
        print("\n📝 Filling form data...")
        print("⚠️  SAFETY MODE: Will NOT submit automatically")
        
        try:
            # Consumer Number
            if 'consumer_number' in data:
                try:
                    field = self.driver.find_element(By.NAME, "consumer_no")
                    field.clear()
                    field.send_keys(data['consumer_number'])
                    print(f"✅ Consumer Number: {data['consumer_number']}")
                except:
                    print("⚠️  Consumer Number field not found")
            
            # Old Name
            if 'old_name' in data:
                try:
                    field = self.driver.find_element(By.NAME, "old_name")
                    field.clear()
                    field.send_keys(data['old_name'])
                    print(f"✅ Old Name: {data['old_name']}")
                except:
                    print("⚠️  Old Name field not found")
            
            # New Name
            if 'new_name' in data:
                try:
                    field = self.driver.find_element(By.NAME, "new_name")
                    field.clear()
                    field.send_keys(data['new_name'])
                    print(f"✅ New Name: {data['new_name']}")
                except:
                    print("⚠️  New Name field not found")
            
            # Mobile Number
            if 'mobile' in data:
                try:
                    field = self.driver.find_element(By.NAME, "mobile")
                    field.clear()
                    field.send_keys(data['mobile'])
                    print(f"✅ Mobile: {data['mobile']}")
                except:
                    print("⚠️  Mobile field not found")
            
            # Email
            if 'email' in data:
                try:
                    field = self.driver.find_element(By.NAME, "email")
                    field.clear()
                    field.send_keys(data['email'])
                    print(f"✅ Email: {data['email']}")
                except:
                    print("⚠️  Email field not found")
            
            # Address
            if 'address' in data:
                try:
                    field = self.driver.find_element(By.NAME, "address")
                    field.clear()
                    field.send_keys(data['address'])
                    print(f"✅ Address: {data['address']}")
                except:
                    print("⚠️  Address field not found")
            
            time.sleep(2)
            print("\n✅ Form data filled successfully!")
            
        except Exception as e:
            print(f"⚠️  Error filling form: {e}")
    
    def show_verification_message(self):
        """Show message to user for manual verification"""
        print("\n" + "="*60)
        print("🎯 FORM FILLED - MANUAL VERIFICATION REQUIRED")
        print("="*60)
        print("\n⚠️  IMPORTANT:")
        print("1. ✅ All data has been filled in the form")
        print("2. 👀 Please VERIFY all information carefully")
        print("3. 📝 Make any corrections if needed")
        print("4. ✋ DO NOT close this window")
        print("5. 🖱️  Click SUBMIT button MANUALLY when ready")
        print("\n💡 The browser will stay open for 10 minutes")
        print("="*60)
        
        # Keep browser open for 10 minutes
        print("\n⏳ Waiting for manual verification...")
        for i in range(600, 0, -30):
            print(f"⏱️  Browser will close in {i} seconds...")
            time.sleep(30)
    
    def run(self, data):
        """
        Main execution flow
        ⚠️ SAFE MODE: Never auto-submits
        """
        try:
            print("\n" + "="*60)
            print("🚀 DGVCL NAME CHANGE - SAFE MODE")
            print("="*60)
            print("⚠️  SAFETY ENABLED: Will NOT auto-submit")
            print("✅ User must manually verify and submit")
            print("="*60)
            
            # Setup
            self.setup_browser()
            
            # Navigate
            self.navigate_to_portal()
            
            # Login
            if 'consumer_number' in data and 'mobile' in data:
                self.login(data['consumer_number'], data['mobile'])
            
            # Navigate to name change
            self.navigate_to_name_change()
            
            # Fill form (NO SUBMIT)
            self.fill_form_data(data)
            
            # Show verification message
            self.show_verification_message()
            
            print("\n✅ Process completed safely")
            print("🔒 No data was submitted automatically")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("💡 Browser will stay open for manual completion")
            time.sleep(300)  # 5 minutes
            
        finally:
            if self.driver:
                print("\n👋 Closing browser...")
                self.driver.quit()


# Example usage (TEST DATA ONLY)
if __name__ == "__main__":
    # ⚠️ TEST DATA - Replace with actual data
    test_data = {
        'consumer_number': 'YOUR_CONSUMER_NUMBER',
        'old_name': 'PANCHAL MAHIRVIKUMAR GANPATBHAI',
        'new_name': 'NEW NAME HERE',
        'mobile': '9999999999',
        'email': 'test@example.com',
        'address': '67-1, MOGRA, KALOL'
    }
    
    print("\n⚠️  WARNING: This is SAFE MODE")
    print("✅ Form will be filled but NOT submitted")
    print("👤 You must manually verify and submit")
    
    confirm = input("\n❓ Continue? (yes/no): ")
    
    if confirm.lower() == 'yes':
        bot = DGVCLNameChangeSafe()
        bot.run(test_data)
    else:
        print("❌ Cancelled")
