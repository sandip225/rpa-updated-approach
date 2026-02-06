"""
Torrent Power RPA Service using Selenium WebDriver
Real browser automation for form filling
"""

import time
import os
import stat
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TorrentPowerRPA:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Setup Chrome WebDriver with proper options for EC2"""
        try:
            chrome_options = Options()
            
            # Check if running in Docker/EC2 environment (cross-platform)
            import platform
            is_docker = os.path.exists('/.dockerenv')
            try:
                node_name = platform.uname().nodename or platform.node()
            except Exception:
                node_name = ''
            is_ec2 = os.path.exists('/opt/aws') or ('ec2' in node_name.lower())

            logger.info(f"🔍 Environment detection - Docker: {is_docker}, EC2: {is_ec2}")
            
            if is_docker or is_ec2:
                # Docker/EC2 specific options
                chrome_options.add_argument("--headless=new")  # Use new headless mode
                chrome_options.add_argument("--no-sandbox")
                chrome_options.add_argument("--disable-dev-shm-usage")
                chrome_options.add_argument("--disable-gpu")
                chrome_options.add_argument("--disable-software-rasterizer")
                chrome_options.add_argument("--disable-background-timer-throttling")
                chrome_options.add_argument("--disable-backgrounding-occluded-windows")
                chrome_options.add_argument("--disable-renderer-backgrounding")
                chrome_options.add_argument("--disable-features=TranslateUI")
                chrome_options.add_argument("--disable-ipc-flooding-protection")
                chrome_options.add_argument("--memory-pressure-off")
                chrome_options.add_argument("--max_old_space_size=4096")
                
                # Set display for X11 forwarding (if available)
                if 'DISPLAY' not in os.environ:
                    os.environ['DISPLAY'] = ':99'
                
                logger.info("🐳 Using Docker/EC2 optimized Chrome options")
            else:
                # Local development - visible browser
                chrome_options.add_argument("--start-maximized")
                logger.info("💻 Using local development Chrome options (visible browser)")
            
            # Common options for all environments
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-extensions")
            chrome_options.add_argument("--disable-plugins")
            chrome_options.add_argument("--disable-notifications")
            chrome_options.add_argument("--disable-popup-blocking")
            chrome_options.add_argument("--disable-translate")
            chrome_options.add_argument("--disable-logging")
            chrome_options.add_argument("--disable-login-animations")
            chrome_options.add_argument("--disable-motion-blur")
            chrome_options.add_argument("--no-first-run")
            chrome_options.add_argument("--no-default-browser-check")
            chrome_options.add_argument("--ignore-certificate-errors")
            chrome_options.add_argument("--ignore-ssl-errors")
            chrome_options.add_argument("--ignore-certificate-errors-spki-list")
            chrome_options.add_argument("--ignore-certificate-errors-ssl-errors")
            
            # User agent to avoid detection
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Set Chrome binary path for Docker
            if is_docker:
                chrome_options.binary_location = "/usr/bin/google-chrome"
            
            # Try multiple ChromeDriver approaches in order of preference
            driver_initialized = False
            
            # Method 1: Use system-installed ChromeDriver (from Dockerfile)
            try:
                logger.info("🔧 Trying system ChromeDriver from /usr/bin/chromedriver...")
                service = Service('/usr/bin/chromedriver')
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
                logger.info("✅ Chrome driver initialized with system ChromeDriver")
                driver_initialized = True
            except Exception as e:
                logger.error(f"❌ System ChromeDriver failed: {e}")
            
            # Method 2: Try webdriver-manager (with path fix)
            if not driver_initialized:
                try:
                    logger.info("🔧 Trying webdriver-manager...")
                    from webdriver_manager.chrome import ChromeDriverManager
                    
                    # Use webdriver-manager to handle driver installation
                    driver_path = ChromeDriverManager().install()
                    logger.info(f"🔍 ChromeDriver path from webdriver-manager: {driver_path}")
                    
                    # Fix common webdriver-manager path issue
                    if 'THIRD_PARTY_NOTICES' in driver_path or not driver_path.endswith('chromedriver'):
                        # Extract the correct directory and find the actual chromedriver binary
                        driver_dir = os.path.dirname(driver_path)
                        
                        # Look for the actual chromedriver binary
                        possible_paths = [
                            os.path.join(driver_dir, 'chromedriver'),
                            os.path.join(driver_dir, 'chromedriver-linux64', 'chromedriver'),
                            os.path.join(os.path.dirname(driver_dir), 'chromedriver'),
                        ]
                        
                        for possible_path in possible_paths:
                            if os.path.exists(possible_path):
                                driver_path = possible_path
                                logger.info(f"🔧 Fixed ChromeDriver path: {driver_path}")
                                break
                        else:
                            # Search for any chromedriver file in the directory tree
                            for root, dirs, files in os.walk(os.path.dirname(driver_dir)):
                                for file in files:
                                    if file == 'chromedriver':
                                        driver_path = os.path.join(root, file)
                                        logger.info(f"🔧 Found ChromeDriver binary: {driver_path}")
                                        break
                                if driver_path != ChromeDriverManager().install():
                                    break
                    
                    # Make sure the driver is executable
                    if os.path.exists(driver_path):
                        os.chmod(driver_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
                        
                        service = Service(driver_path)
                        self.driver = webdriver.Chrome(service=service, options=chrome_options)
                        logger.info("✅ Chrome driver initialized with webdriver-manager")
                        driver_initialized = True
                    else:
                        logger.error(f"❌ ChromeDriver path does not exist: {driver_path}")
                        
                except ImportError:
                    logger.error("❌ webdriver-manager not available")
                except Exception as e:
                    logger.error(f"❌ webdriver-manager Chrome driver failed: {e}")
            
            # Method 3: Try system PATH (no explicit service)
            if not driver_initialized:
                try:
                    logger.info("🔧 Trying Chrome from system PATH...")
                    self.driver = webdriver.Chrome(options=chrome_options)
                    logger.info("✅ Chrome driver initialized from system PATH")
                    driver_initialized = True
                except Exception as e:
                    logger.error(f"❌ System PATH Chrome driver failed: {e}")
            
            # If all methods failed
            if not driver_initialized:
                raise Exception("All ChromeDriver initialization methods failed")
            
            # Set timeouts
            self.driver.implicitly_wait(10)
            self.driver.set_page_load_timeout(30)
            self.wait = WebDriverWait(self.driver, 20)
            
            # Test driver
            logger.info("🧪 Testing Chrome driver...")
            self.driver.get("data:text/html,<html><body><h1>Driver Test</h1></body></html>")
            logger.info("✅ Chrome driver test successful")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Driver setup failed: {e}")
            logger.error(f"❌ Error details: {type(e).__name__}: {str(e)}")
            
            # Try to provide helpful error messages
            if "chrome not reachable" in str(e).lower():
                logger.error("💡 Suggestion: Chrome binary might not be installed or accessible")
            elif "chromedriver" in str(e).lower():
                logger.error("💡 Suggestion: ChromeDriver might not be installed or in PATH")
            elif "permission denied" in str(e).lower():
                logger.error("💡 Suggestion: Permission issues with Chrome or ChromeDriver")
            
            return False
    
    def navigate_to_torrent_power(self):
        """Navigate to Torrent Power name change form"""
        try:
            url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
            logger.info(f"🌐 Navigating to: {url}")
            
            self.driver.get(url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
            logger.info("✅ Page loaded successfully")
            
            # Take screenshot for debugging
            self.driver.save_screenshot("torrent_page_loaded.png")
            logger.info("📸 Screenshot saved: torrent_page_loaded.png")
            
            return True
            
        except TimeoutException:
            logger.error("❌ Page load timeout")
            return False
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}")
            return False
    
    def fill_form(self, form_data):
        """Fill the Torrent Power form with provided data"""
        try:
            logger.info("🚀 Starting form filling...")
            filled_fields = []
            
            # 1. Fill City Dropdown
            try:
                logger.info("🔍 Looking for city dropdown...")
                city_select = self.wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
                
                select = Select(city_select)
                city = form_data.get('city', 'Ahmedabad')
                
                # Try to select by visible text or value
                options = select.options
                for option in options:
                    if city.lower() in option.text.lower() or city.lower() in option.get_attribute('value').lower():
                        select.select_by_value(option.get_attribute('value'))
                        filled_fields.append(f"✅ City: {option.text}")
                        logger.info(f"✅ City selected: {option.text}")
                        
                        # Highlight the field
                        self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", city_select)
                        break
                
                time.sleep(1)  # Wait for any dynamic updates
                
            except Exception as e:
                logger.error(f"❌ City dropdown error: {e}")
                filled_fields.append("❌ City dropdown not found")
            
            # 2. Fill Service Number
            try:
                logger.info("🔍 Looking for service number field...")
                service_selectors = [
                    "input[placeholder*='Service Number']",
                    "input[placeholder*='Service']",
                    "input[name*='service']",
                    "input[id*='service']"
                ]
                
                service_input = None
                for selector in service_selectors:
                    try:
                        service_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to first text input
                if not service_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if text_inputs:
                        service_input = text_inputs[0]
                
                if service_input and form_data.get('service_number'):
                    service_input.clear()
                    service_input.send_keys(form_data['service_number'])
                    filled_fields.append(f"✅ Service Number: {form_data['service_number']}")
                    logger.info(f"✅ Service Number filled: {form_data['service_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", service_input)
                else:
                    filled_fields.append("❌ Service Number field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Service Number error: {e}")
                filled_fields.append("❌ Service Number error")
            
            # 3. Fill T Number
            try:
                logger.info("🔍 Looking for T Number field...")
                t_selectors = [
                    "input[placeholder*='T No']",
                    "input[placeholder*='T-No']",
                    "input[placeholder*='TNo']",
                    "input[name*='tno']",
                    "input[id*='tno']"
                ]
                
                t_input = None
                for selector in t_selectors:
                    try:
                        t_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to second text input
                if not t_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 1:
                        t_input = text_inputs[1]
                
                if t_input and form_data.get('t_number'):
                    t_input.clear()
                    t_input.send_keys(form_data['t_number'])
                    filled_fields.append(f"✅ T Number: {form_data['t_number']}")
                    logger.info(f"✅ T Number filled: {form_data['t_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", t_input)
                else:
                    filled_fields.append("❌ T Number field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ T Number error: {e}")
                filled_fields.append("❌ T Number error")
            
            # 4. Fill Mobile Number
            try:
                logger.info("🔍 Looking for mobile number field...")
                mobile_selectors = [
                    "input[type='tel']",
                    "input[placeholder*='Mobile']",
                    "input[placeholder*='mobile']",
                    "input[name*='mobile']",
                    "input[id*='mobile']"
                ]
                
                mobile_input = None
                for selector in mobile_selectors:
                    try:
                        mobile_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to third text input
                if not mobile_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 2:
                        mobile_input = text_inputs[2]
                
                if mobile_input and form_data.get('mobile'):
                    mobile_input.clear()
                    mobile_input.send_keys(form_data['mobile'])
                    filled_fields.append(f"✅ Mobile: {form_data['mobile']}")
                    logger.info(f"✅ Mobile filled: {form_data['mobile']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", mobile_input)
                else:
                    filled_fields.append("❌ Mobile field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Mobile error: {e}")
                filled_fields.append("❌ Mobile error")
            
            # 5. Fill Email
            try:
                logger.info("🔍 Looking for email field...")
                email_selectors = [
                    "input[type='email']",
                    "input[placeholder*='Email']",
                    "input[placeholder*='email']",
                    "input[name*='email']",
                    "input[id*='email']"
                ]
                
                email_input = None
                for selector in email_selectors:
                    try:
                        email_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to fourth text input
                if not email_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 3:
                        email_input = text_inputs[3]
                
                if email_input and form_data.get('email'):
                    email_input.clear()
                    email_input.send_keys(form_data['email'])
                    filled_fields.append(f"✅ Email: {form_data['email']}")
                    logger.info(f"✅ Email filled: {form_data['email']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", email_input)
                else:
                    filled_fields.append("❌ Email field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Email error: {e}")
                filled_fields.append("❌ Email error")
            
            # Take final screenshot
            self.driver.save_screenshot("torrent_form_filled.png")
            logger.info("📸 Final screenshot saved: torrent_form_filled.png")
            
            # Show success notification on the page
            success_count = len([f for f in filled_fields if f.startswith('✅')])
            
            notification_script = f"""
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 20px 30px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 16px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
                    <strong>🤖 RPA Auto-fill Completed!</strong><br>
                    Fields filled: {success_count}/5<br>
                    <small style="font-size: 14px; margin-top: 10px; display: block;">
                        RPA successfully filled the form fields.<br>
                        Please review and submit the form.
                    </small>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {{
                if (notification.parentNode) {{
                    notification.parentNode.removeChild(notification);
                }}
            }}, 10000);
            """
            
            self.driver.execute_script(notification_script)
            
            logger.info(f"📊 Form filling completed: {success_count}/5 fields filled")
            
            return {
                "success": success_count > 0,
                "filled_fields": filled_fields,
                "total_filled": success_count,
                "total_fields": 5,
                "screenshots": ["torrent_page_loaded.png", "torrent_form_filled.png"]
            }
            
        except Exception as e:
            logger.error(f"❌ Form filling failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "filled_fields": ["❌ Form filling failed"],
                "total_filled": 0,
                "total_fields": 5
            }
    
    def keep_browser_open(self, duration=300):
        """Keep browser open for user interaction"""
        try:
            logger.info(f"🕐 Keeping browser open for {duration} seconds for user interaction...")
            logger.info("👤 User can now review the form and submit manually")
            
            # Show a message to user
            message_script = """
            alert('🎉 RPA Auto-fill Completed!\\n\\nThe form has been filled automatically.\\n\\nPlease review the data and click Submit to complete your application.\\n\\nThe browser will stay open for your convenience.');
            """
            self.driver.execute_script(message_script)
            
            # Keep browser open
            time.sleep(duration)
            
        except Exception as e:
            logger.error(f"❌ Error keeping browser open: {e}")
    
    def close_driver(self):
        """Close the browser driver"""
        try:
            if self.driver:
                self.driver.quit()
                logger.info("✅ Browser closed")
        except Exception as e:
            logger.error(f"❌ Error closing browser: {e}")
    
    def run_automation(self, form_data, keep_open=True, visible_mode=False):
        """Run the complete RPA automation"""
        try:
            logger.info("🚀 Starting Torrent Power RPA Automation...")
            logger.info(f"🔍 Mode: {'Visible' if visible_mode else 'Headless'}")
            
            # Setup driver
            if not self.setup_driver():
                return {"success": False, "error": "Failed to setup browser driver"}
            
            # Navigate to website
            if not self.navigate_to_torrent_power():
                return {"success": False, "error": "Failed to navigate to Torrent Power website"}
            
            # Fill form (pass options)
            result = self.fill_form(form_data, options=options)

            if result["success"] and keep_open:
                keep_time = options.get('keep_open', 300) if options else 300
                # Keep browser open for user interaction
                self.keep_browser_open(keep_time)  # configurable
            
            return result
            
        except Exception as e:
            logger.error(f"❌ RPA automation failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            if not keep_open:
                self.close_driver()

    def run_visible_automation(self, form_data, options=None):
        """Run automation with visible browser for debugging"""
        try:
            logger.info("🚀 Starting VISIBLE Torrent Power RPA Automation...")
            
            # Temporarily modify Chrome options for visible mode
            original_setup = self.setup_driver
            
            def visible_setup():
                chrome_options = Options()
                # Visible browser options
                chrome_options.add_argument("--start-maximized")
                chrome_options.add_argument("--disable-notifications")
                chrome_options.add_argument("--disable-popup-blocking")
                chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                
                try:
                    from webdriver_manager.chrome import ChromeDriverManager
                    service = Service(ChromeDriverManager().install())
                    self.driver = webdriver.Chrome(service=service, options=chrome_options)
                    logger.info("✅ Visible Chrome driver initialized")
                except ImportError:
                    self.driver = webdriver.Chrome(options=chrome_options)
                    logger.info("✅ Visible Chrome driver initialized (system PATH)")
                
                self.driver.implicitly_wait(10)
                self.driver.set_page_load_timeout(30)
                self.wait = WebDriverWait(self.driver, 20)
                return True
            
            # Use visible setup
            self.setup_driver = visible_setup
            
            # Setup driver
            if not self.setup_driver():
                return {"success": False, "error": "Failed to setup visible browser driver"}
            
            # Navigate to website
            if not self.navigate_to_torrent_power():
                return {"success": False, "error": "Failed to navigate to Torrent Power website"}
            
            # Fill form with slower pace for visibility
            result = self.fill_form_visible(form_data, options=options)
            
            # Keep browser open longer for debugging
            keep_time = options.get('keep_open', 600) if options else 600
            logger.info(f"🕐 Keeping visible browser open for {keep_time} seconds for debugging...")
            time.sleep(keep_time)  # configurable
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Visible RPA automation failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            self.close_driver()
    
    def fill_form_visible(self, form_data):
        """Fill form with visible feedback and slower pace"""
        try:
            logger.info("🚀 Starting VISIBLE form filling...")
            filled_fields = []
            
            # Add a banner to show automation is running
            banner_script = """
            const banner = document.createElement('div');
            banner.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(90deg, #007bff, #28a745); color: white; padding: 15px; text-align: center; font-family: Arial, sans-serif; font-size: 18px; z-index: 999999; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                    🤖 <strong>RPA AUTOMATION RUNNING</strong> - Watch the form being filled automatically!
                </div>
            `;
            document.body.appendChild(banner);
            
            // Add margin to body to account for banner
            document.body.style.marginTop = '60px';
            """
            self.driver.execute_script(banner_script)
            time.sleep(2)  # Let user see the banner

            # Options for interactive visible run
            interactive = options.get('interactive', False) if options else False
            pause_between = options.get('pause_between', 1) if options else 1

            # Create interactive control (Next / Auto) if interactive mode requested
            if interactive:
                control_js = """
                if (!window.__rpa_control_created) {
                    const ctrl = document.createElement('div');
                    ctrl.id = '__rpa_control__';
                    ctrl.style.position = 'fixed';
                    ctrl.style.top = '70px';
                    ctrl.style.right = '20px';
                    ctrl.style.zIndex = 999999;
                    ctrl.innerHTML = `<div style="background:#fff;padding:10px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:Arial,sans-serif;"><button id='__rpa_next__' style='padding:6px 10px;margin-right:6px;'>Next</button><button id='__rpa_auto__' style='padding:6px 10px;'>Auto</button></div>`;
                    document.body.appendChild(ctrl);
                    window.__rpa_control_created = true;
                    window.__rpa_next_clicked = false;
                    window.__rpa_auto = false;
                    document.getElementById('__rpa_next__').addEventListener('click', () => { window.__rpa_next_clicked = true; });
                    document.getElementById('__rpa_auto__').addEventListener('click', () => { window.__rpa_auto = true; });
                }
                """
                try:
                    self.driver.execute_script(control_js)
                except Exception:
                    logger.debug('Could not create interactive control in page')

            # Helper: waits for interactive click or auto mode
            def wait_for_next():
                if not interactive:
                    return
                logger.info('⏸️ Waiting for user to click Next (interactive mode) or Auto to be enabled...')
                start = time.time()
                while True:
                    try:
                        auto = self.driver.execute_script('return window.__rpa_auto === true')
                        if auto:
                            logger.info('▶️ Auto mode enabled by user; continuing')
                            return
                        clicked = self.driver.execute_script('return window.__rpa_next_clicked === true')
                        if clicked:
                            # reset for next step
                            self.driver.execute_script('window.__rpa_next_clicked = false')
                            return
                    except Exception:
                        pass
                    time.sleep(0.2)
                    if time.time() - start > 600:
                        logger.info('⏳ Interactive wait timed out; continuing')
                        return
            
            # 1. Fill City Dropdown (with visual feedback)
            try:
                logger.info("🔍 [VISIBLE] Looking for city dropdown...")
                
                # Highlight what we're looking for
                highlight_script = """
                const selects = document.querySelectorAll('select');
                selects.forEach(select => {
                    select.style.border = '3px solid #ffc107';
                    select.style.backgroundColor = '#fff3cd';
                });
                """
                self.driver.execute_script(highlight_script)
                time.sleep(1)
                
                city_select = self.wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
                
                select = Select(city_select)
                city = form_data.get('city', 'Ahmedabad')
                
                # Show what we're selecting
                self.driver.execute_script(f"""
                    const notification = document.createElement('div');
                    notification.innerHTML = `
                        <div style="position: fixed; top: 80px; right: 20px; background: #17a2b8; color: white; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif; z-index: 999998;">
                            🔍 Selecting City: {city}
                        </div>
                    `;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                """)
                
                # Try to select by visible text or value
                options = select.options
                for option in options:
                    if city.lower() in option.text.lower() or city.lower() in option.get_attribute('value').lower():
                        value = option.get_attribute('value')
                        # Use JS to set value and dispatch change event for reliability
                        self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change', {bubbles:true}));", city_select, value)
                        filled_fields.append(f"✅ City: {option.text}")
                        logger.info(f"✅ [VISIBLE] City selected: {option.text}")

                        # Highlight success
                        self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", city_select)
                        break

                # interactive and pause
                wait_for_next()
                time.sleep(pause_between)  # Slower pace for visibility
                
            except Exception as e:
                logger.error(f"❌ [VISIBLE] City dropdown error: {e}")
                filled_fields.append("❌ City dropdown not found")
            
            # 2. Fill Service Number (visible)
            try:
                logger.info("🔍 [VISIBLE] Looking for service number input...")
                service_input = None
                try:
                    service_input = self.wait.until(EC.presence_of_element_located((By.ID, "serviceno")))
                except Exception:
                    pass
                if not service_input:
                    selectors = [
                        "input[placeholder*='Service Number']",
                        "input[placeholder*='Service']",
                        "input[name*='service']",
                        "input[id*='service']"
                    ]
                    for sel in selectors:
                        try:
                            service_input = self.driver.find_element(By.CSS_SELECTOR, sel)
                            break
                        except Exception:
                            continue
                if service_input and form_data.get('service_number'):
                    # Use JS to set value and dispatch events for robustness
                    self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", service_input, form_data['service_number'])
                    filled_fields.append(f"✅ Service Number: {form_data['service_number']}")
                    logger.info(f"✅ [VISIBLE] Service Number filled: {form_data['service_number']}")
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", service_input)
                else:
                    filled_fields.append("❌ Service Number field not found")
                # interactive and pause
                wait_for_next()
                time.sleep(pause_between)
            except Exception as e:
                logger.error(f"❌ [VISIBLE] Service Number error: {e}")
                filled_fields.append("❌ Service Number error")
            
            # 3. Fill T Number (visible)
            try:
                logger.info("🔍 [VISIBLE] Looking for T Number input...")
                t_input = None
                try:
                    t_input = self.wait.until(EC.presence_of_element_located((By.ID, "tno")))
                except Exception:
                    pass
                if not t_input:
                    selectors = ["input[placeholder*='T No']", "input[name*='tno']", "input[id*='tno']"]
                    for sel in selectors:
                        try:
                            t_input = self.driver.find_element(By.CSS_SELECTOR, sel)
                            break
                        except Exception:
                            continue
                if t_input and form_data.get('t_number'):
                    self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", t_input, form_data['t_number'])
                    filled_fields.append(f"✅ T Number: {form_data['t_number']}")
                    logger.info(f"✅ [VISIBLE] T Number filled: {form_data['t_number']}")
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", t_input)
                else:
                    filled_fields.append("❌ T Number field not found")
                wait_for_next()
                time.sleep(pause_between)
            except Exception as e:
                logger.error(f"❌ [VISIBLE] T Number error: {e}")
                filled_fields.append("❌ T Number error")
            
            # 4. Fill Mobile Number (visible)
            try:
                logger.info("🔍 [VISIBLE] Looking for mobile number input...")
                mobile_input = None
                try:
                    mobile_input = self.wait.until(EC.presence_of_element_located((By.ID, "mobileno")))
                except Exception:
                    pass
                if not mobile_input:
                    selectors = [
                        "input[type='tel']",
                        "input[placeholder*='Mobile']",
                        "input[name*='mobile']",
                        "input[id*='mobile']"
                    ]
                    for sel in selectors:
                        try:
                            mobile_input = self.driver.find_element(By.CSS_SELECTOR, sel)
                            break
                        except Exception:
                            continue
                if mobile_input and form_data.get('mobile'):
                    self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", mobile_input, form_data['mobile'])
                    filled_fields.append(f"✅ Mobile: {form_data['mobile']}")
                    logger.info(f"✅ [VISIBLE] Mobile filled: {form_data['mobile']}")
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", mobile_input)
                else:
                    filled_fields.append("❌ Mobile field not found")
                wait_for_next()
                time.sleep(pause_between)
            except Exception as e:
                logger.error(f"❌ [VISIBLE] Mobile error: {e}")
                filled_fields.append("❌ Mobile error")
            
            # 5. Fill Email (visible)
            try:
                logger.info("🔍 [VISIBLE] Looking for email input...")
                email_input = None
                try:
                    email_input = self.wait.until(EC.presence_of_element_located((By.ID, "email")))
                except Exception:
                    pass
                if not email_input:
                    selectors = ["input[type='email']", "input[placeholder*='Email']", "input[name*='email']", "input[id*='email']"]
                    for sel in selectors:
                        try:
                            email_input = self.driver.find_element(By.CSS_SELECTOR, sel)
                            break
                        except Exception:
                            continue
                if email_input and form_data.get('email'):
                    self.driver.execute_script("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", email_input, form_data['email'])
                    filled_fields.append(f"✅ Email: {form_data['email']}")
                    logger.info(f"✅ [VISIBLE] Email filled: {form_data['email']}")
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", email_input)
                else:
                    filled_fields.append("❌ Email field not found")
                wait_for_next()
                time.sleep(pause_between)
            except Exception as e:
                logger.error(f"❌ [VISIBLE] Email error: {e}")
                filled_fields.append("❌ Email error")
            
            # Take final screenshot
            self.driver.save_screenshot("torrent_form_filled_visible.png")
            logger.info("📸 Visible mode screenshot saved")
            
            # Show completion notification
            success_count = len([f for f in filled_fields if f.startswith('✅')])
            
            completion_script = f"""
            const completion = document.createElement('div');
            completion.innerHTML = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #28a745; color: white; padding: 30px; border-radius: 15px; font-family: Arial, sans-serif; font-size: 20px; z-index: 999999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; min-width: 400px;">
                    <h2 style="margin: 0 0 15px 0;">🎉 RPA AUTOMATION COMPLETED!</h2>
                    <p style="margin: 10px 0; font-size: 18px;">Fields Successfully Filled: {success_count}/5</p>
                    <p style="margin: 10px 0; font-size: 16px;">Please review the form and submit when ready.</p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">Browser will remain open for your convenience.</p>
                </div>
            `;
            document.body.appendChild(completion);
            """
            
            self.driver.execute_script(completion_script)
            
            return {
                "success": success_count > 0,
                "filled_fields": filled_fields,
                "total_filled": success_count,
                "total_fields": 5,
                "screenshots": ["torrent_form_filled_visible.png"],
                "mode": "visible"
            }
            
        except Exception as e:
            logger.error(f"❌ [VISIBLE] Form filling failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "filled_fields": ["❌ Visible form filling failed"],
                "total_filled": 0,
                "total_fields": 5,
                "mode": "visible"
            }


# Test function
def test_rpa():
    """Test the RPA automation"""
    test_data = {
        "city": "Ahmedabad",
        "service_number": "TEST123456",
        "t_number": "T123456789",
        "mobile": "9876543210",
        "email": "test@example.com"
    }
    
    rpa = TorrentPowerRPA()
    result = rpa.run_automation(test_data, keep_open=True)
    
    print("🔍 RPA Test Results:")
    print(f"Success: {result.get('success')}")
    print(f"Fields filled: {result.get('total_filled', 0)}/5")
    
    if result.get('filled_fields'):
        print("Field Results:")
        for field in result['filled_fields']:
            print(f"  {field}")
    
    return result


if __name__ == "__main__":
    test_rpa()