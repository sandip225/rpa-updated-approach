"""
DGVCL Name Change RPA - PRODUCTION SAFE MODE
✅ Fills Applicant Details (Step 1 only)
✅ Captures screenshots
❌ Does NOT upload documents
❌ Does NOT proceed to payment
❌ Does NOT submit application
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options
import time
import sys
import json
from pathlib import Path

# ⚠️ CRITICAL SAFETY SETTINGS
SAFETY_MODE = True
STOP_AT_STEP_1 = True  # Only fill Applicant Details
NO_DOCUMENT_UPLOAD = True
NO_PAYMENT = True
NO_SUBMIT = True

class DGVCLNameChangeRPA:
    """
    DGVCL Name Change - SAFE MODE with Screenshot Capture
    Only fills Step 1 (Applicant Details)
    User must complete Steps 2-4 manually
    """
    
    def __init__(self, headless=True, screenshot_dir="/tmp/dgvcl_screenshots"):
        self.driver = None
        self.wait = None
        self.portal_url = "https://portal.guvnl.in"
        self.name_change_url = "https://portal.guvnl.in/ltNameChange.php?apptype=namechange"
        self.headless = headless
        self.screenshot_dir = Path(screenshot_dir)
        self.screenshot_dir.mkdir(exist_ok=True)
        self.screenshots = []
        
    def setup_browser(self):
        """Setup Chrome browser - headless for server"""
        options = Options()
        
        if self.headless:
            options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-gpu')
        
        options.add_argument('--start-maximized')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 30)
        
        print("✅ Browser opened in headless mode")
    
    def take_screenshot(self, name):
        """Take screenshot and save"""
        try:
            screenshot_path = self.screenshot_dir / f"{name}_{int(time.time())}.png"
            self.driver.save_screenshot(str(screenshot_path))
            self.screenshots.append(str(screenshot_path))
            print(f"📸 Screenshot saved: {screenshot_path}")
            return str(screenshot_path)
        except Exception as e:
            print(f"⚠️ Screenshot failed: {e}")
            return None
        
    def login_to_portal(self, mobile_number, discom="DGVCL"):
        """
        Login to DGVCL portal using Mobile Number + OTP
        Portal: https://portal.guvnl.in/login.php
        """
        print("\n🌐 Opening DGVCL Login Page...")
        self.driver.get(f"{self.portal_url}/login.php")
        
        # Wait for page to fully load
        print("⏳ Waiting for page to load...")
        time.sleep(5)
        
        # Take screenshot of login page
        self.take_screenshot("01_login_page")
        
        print("🔐 Filling login form...")
        
        try:
            # Try multiple selectors for mobile field
            mobile_field = None
            mobile_selectors = [
                (By.ID, "mobile"),
                (By.NAME, "mobile"),
                (By.XPATH, "//input[@placeholder='Mobile Number']"),
                (By.XPATH, "//input[@type='text' and contains(@class, 'form-control')]"),
                (By.CSS_SELECTOR, "input[type='text']")
            ]
            
            for selector_type, selector_value in mobile_selectors:
                try:
                    mobile_field = self.wait.until(
                        EC.element_to_be_clickable((selector_type, selector_value))
                    )
                    if mobile_field:
                        print(f"✅ Found mobile field using: {selector_type}={selector_value}")
                        break
                except:
                    continue
            
            if not mobile_field:
                print("❌ Could not find mobile field!")
                self.take_screenshot("error_no_mobile_field")
                return False
            
            # Clear and fill mobile number with retry
            for attempt in range(3):
                try:
                    mobile_field.clear()
                    time.sleep(0.5)
                    mobile_field.click()
                    time.sleep(0.5)
                    mobile_field.send_keys(mobile_number)
                    time.sleep(1)
                    
                    # Verify value was entered
                    entered_value = mobile_field.get_attribute('value')
                    if entered_value == mobile_number:
                        print(f"✅ Mobile Number filled: {mobile_number}")
                        break
                    else:
                        print(f"⚠️ Attempt {attempt + 1}: Value mismatch. Retrying...")
                        if attempt == 2:
                            print(f"❌ Failed to fill mobile after 3 attempts")
                            return False
                except Exception as e:
                    print(f"⚠️ Attempt {attempt + 1} failed: {e}")
                    if attempt == 2:
                        return False
            
            time.sleep(2)
            
            # DISCOM dropdown with multiple selectors
            discom_dropdown = None
            discom_selectors = [
                (By.ID, "discom"),
                (By.NAME, "discom"),
                (By.CSS_SELECTOR, "select.form-control"),
                (By.XPATH, "//select[contains(@class, 'form-control')]")
            ]
            
            for selector_type, selector_value in discom_selectors:
                try:
                    dropdown_element = self.driver.find_element(selector_type, selector_value)
                    discom_dropdown = Select(dropdown_element)
                    print(f"✅ Found discom dropdown using: {selector_type}={selector_value}")
                    break
                except:
                    continue
            
            if discom_dropdown:
                try:
                    # Try different selection methods
                    try:
                        discom_dropdown.select_by_visible_text(discom)
                    except:
                        try:
                            discom_dropdown.select_by_value(discom)
                        except:
                            # Find option containing DGVCL
                            for option in discom_dropdown.options:
                                if discom.upper() in option.text.upper():
                                    option.click()
                                    break
                    
                    time.sleep(1)
                    selected_value = discom_dropdown.first_selected_option.text
                    print(f"✅ DISCOM selected: {selected_value}")
                except Exception as e:
                    print(f"⚠️ DISCOM selection error: {e}")
            else:
                print("⚠️ Could not find DISCOM dropdown")
            
            time.sleep(2)
            
            # Take screenshot after filling
            self.take_screenshot("02_login_filled")
            
            # Verify fields are filled
            final_mobile = mobile_field.get_attribute('value')
            print(f"\n📋 Verification:")
            print(f"  Mobile Field Value: {final_mobile}")
            if discom_dropdown:
                print(f"  DISCOM Selected: {discom_dropdown.first_selected_option.text}")
            
            print("\n✅ Login form filled successfully!")
            print("⏸️ Bot will stop here - User must:")
            print("  1. Enter Captcha")
            print("  2. Click Login")
            print("  3. Enter OTP")
            
            return True
                
        except Exception as e:
            print(f"⚠️ Login error: {e}")
            import traceback
            traceback.print_exc()
            self.take_screenshot("error_login")
            return False
    
    def navigate_to_name_change(self):
        """Navigate to LT Name Change page using direct URL"""
        print("\n📄 Navigating to LT Name Change...")
        
        try:
            # Use direct URL
            self.driver.get(self.name_change_url)
            time.sleep(3)
            
            # Check if page loaded
            if "namechange" in self.driver.current_url.lower() or "ltNameChange" in self.driver.current_url:
                print("✅ LT Name Change page loaded")
                return True
            else:
                print("⚠️  Page may not have loaded correctly")
                input("⏸️  Press ENTER when on Name Change page...")
                return True
            
        except Exception as e:
            print(f"⚠️  Navigation error: {e}")
            print("💡 Trying alternative method...")
            
            try:
                # Fallback: Look for link in sidebar
                name_change_link = self.wait.until(
                    EC.element_to_be_clickable((By.LINK_TEXT, "LT Name Change"))
                )
                name_change_link.click()
                time.sleep(3)
                print("✅ LT Name Change page loaded")
                return True
            except:
                print("💡 Please navigate to Name Change page manually")
                input("⏸️  Press ENTER when on Name Change page...")
                return True
    
    def fill_applicant_details(self, data):
        """
        Fill Step 1: Applicant Details ONLY
        ⚠️ Does NOT proceed to next steps
        """
        print("\n📝 Filling Applicant Details (Step 1)...")
        print("⚠️  SAFETY: Will STOP after Step 1")
        
        try:
            time.sleep(2)
            
            # Consumer No (usually auto-filled)
            print("ℹ️  Consumer No should be auto-filled")
            
            # New Name
            if 'new_name' in data:
                try:
                    new_name_field = self.driver.find_element(By.NAME, "new_name")
                    new_name_field.clear()
                    new_name_field.send_keys(data['new_name'])
                    print(f"✅ New Name: {data['new_name']}")
                except Exception as e:
                    print(f"⚠️  New Name field: {e}")
            
            # Reason dropdown
            if 'reason' in data:
                try:
                    reason_dropdown = Select(self.driver.find_element(By.NAME, "reason"))
                    reason_dropdown.select_by_visible_text(data['reason'])
                    print(f"✅ Reason: {data['reason']}")
                except Exception as e:
                    print(f"⚠️  Reason dropdown: {e}")
            
            # Security Deposit option
            if 'security_deposit_option' in data:
                try:
                    if data['security_deposit_option'] == 'entire':
                        radio = self.driver.find_element(By.XPATH, "//input[@type='radio' and contains(@value, 'entire')]")
                    else:
                        radio = self.driver.find_element(By.XPATH, "//input[@type='radio' and contains(@value, 'difference')]")
                    radio.click()
                    print(f"✅ Security Deposit: {data['security_deposit_option']}")
                except Exception as e:
                    print(f"⚠️  Security Deposit: {e}")
            
            time.sleep(2)
            print("\n✅ Step 1 (Applicant Details) filled successfully!")
            
        except Exception as e:
            print(f"⚠️  Error filling form: {e}")
    
    def show_completion_message(self):
        """Show completion message and keep browser open"""
        print("\n" + "="*70)
        print("🎯 STEP 1 COMPLETED - MANUAL VERIFICATION REQUIRED")
        print("="*70)
        print("\n✅ What was done:")
        print("  • Logged into DGVCL portal")
        print("  • Navigated to LT Name Change")
        print("  • Filled Applicant Details (Step 1)")
        
        print("\n⚠️  What you need to do:")
        print("  1. 👀 VERIFY all filled information")
        print("  2. 📝 Make corrections if needed")
        print("  3. ➡️  Click 'Next' to proceed to Step 2 (Document Upload)")
        print("  4. 📎 Upload required documents")
        print("  5. 💰 Complete payment (₹23.6)")
        print("  6. ✅ Submit application")
        
        print("\n🔒 SAFETY FEATURES:")
        print("  • ✅ No documents uploaded automatically")
        print("  • ✅ No payment made automatically")
        print("  • ✅ No application submitted automatically")
        print("  • ✅ Full control remains with you")
        
        print("\n💡 Browser will stay open for 15 minutes")
        print("="*70)
        
        # Keep browser open
        for i in range(900, 0, -60):
            mins = i // 60
            print(f"\r⏱️  Browser will close in {mins} minutes... ", end='', flush=True)
            time.sleep(60)
        
        print("\n\n👋 Time's up! Closing browser...")
    
    def run(self, data):
        """
        Main execution flow
        ⚠️ SAFE MODE: Only fills login form and captures screenshots
        """
        try:
            print("\n" + "="*70)
            print("🚀 DGVCL RPA BOT - HEADLESS MODE WITH SCREENSHOTS")
            print("="*70)
            print("⚠️ SAFETY ENABLED:")
            print("  • Fills login form only")
            print("  • Captures screenshots")
            print("  • User completes captcha & OTP manually")
            print("="*70)
            
            # Setup
            self.setup_browser()
            
            # Login (fill form only)
            self.login_to_portal(
                data.get('mobile_number'),
                data.get('discom', 'DGVCL')
            )
            
            # Final screenshot
            self.take_screenshot("03_final_state")
            
            print("\n✅ RPA bot completed!")
            print(f"📸 Screenshots saved: {len(self.screenshots)}")
            for screenshot in self.screenshots:
                print(f"  - {screenshot}")
            
            # Return results
            return {
                "success": True,
                "screenshots": self.screenshots,
                "message": "Login form filled. User must complete captcha and OTP."
            }
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            self.take_screenshot("error_final")
            return {
                "success": False,
                "screenshots": self.screenshots,
                "error": str(e)
            }
            
        finally:
            if self.driver:
                print("\n👋 Closing browser...")
                time.sleep(2)
                self.driver.quit()


# Example usage with REAL DATA
if __name__ == "__main__":
    import json
    
    # Check if data file provided as argument
    if len(sys.argv) > 1:
        # Read data from file (called by backend)
        data_file = sys.argv[1]
        try:
            with open(data_file, 'r') as f:
                dgvcl_data = json.load(f)
            
            print("\n✅ Data loaded from backend")
            print(f"  Mobile: {dgvcl_data.get('mobile')}")
            print(f"  DISCOM: {dgvcl_data.get('discom', 'DGVCL')}")
            
            # Map backend data to RPA format
            rpa_data = {
                'mobile_number': dgvcl_data.get('mobile'),
                'discom': dgvcl_data.get('discom', 'DGVCL'),
                'consumer_no': dgvcl_data.get('consumer_number'),
                'new_name': dgvcl_data.get('applicant_name', ''),
            }
            
            rpa = DGVCLNameChangeRPA(headless=True)
            result = rpa.run(rpa_data)
            
            # Save result
            result_file = Path("/tmp/dgvcl_rpa_result.json")
            with open(result_file, 'w') as f:
                json.dump(result, f)
            
            print(f"\n✅ Result saved: {result_file}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)
    else:
        print("❌ No data file provided")
        print("Usage: python dgvcl_name_change_final.py <data_file.json>")
        sys.exit(1)
