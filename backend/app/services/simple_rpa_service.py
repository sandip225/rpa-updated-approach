"""
Simple RPA Service - Minimal working version
"""

import time
import os
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleTorrentRPA:
    def __init__(self):
        self.driver = None
        
    def setup_driver(self, headless=None, binary_path=None):
        """Robust Chrome setup with cross-platform handling and webdriver-manager fallback

        headless: bool|None -> if None, use env HEADLESS (default=1). If False, browser will be visible.
        binary_path: optional explicit chrome binary path
        """
        try:
            logger.info("🚀 Setting up Chrome driver...")

            # Basic Chrome options
            options = Options()
            if headless is None:
                headless = os.getenv("HEADLESS", "1") in ("1", "true", "True")

            if headless:
                try:
                    options.add_argument("--headless=new")
                except Exception:
                    options.add_argument("--headless")
            else:
                logger.info("🔎 Running with visible browser (headless=False)")

            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")

            # Detect Chrome binary if possible (useful on Windows)
            try:
                import shutil
                if binary_path and os.path.exists(binary_path):
                    options.binary_location = binary_path
                    logger.info(f"🔧 Using explicit Chrome binary: {binary_path}")
                else:
                    # Common Windows locations
                    possible = [
                        r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                        r"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
                        "/usr/bin/google-chrome",
                        "/usr/bin/google-chrome-stable",
                        "/usr/bin/chromium-browser",
                        shutil.which("google-chrome") or "",
                        shutil.which("chrome") or ""
                    ]
                    for p in possible:
                        if p and os.path.exists(p):
                            options.binary_location = p
                            logger.info(f"🔧 Found Chrome binary: {p}")
                            break
            except Exception:
                logger.debug("No explicit Chrome binary detected; relying on system defaults")

            # Try system chromedriver first (Linux default path)
            driver_path = None
            if os.path.exists("/usr/bin/chromedriver"):
                driver_path = "/usr/bin/chromedriver"

            # On Windows, check PATH for chromedriver.exe
            if not driver_path and os.name == 'nt':
                import shutil
                driver_path = shutil.which("chromedriver") or shutil.which("chromedriver.exe")

            # If not found, use webdriver-manager to download the matching driver
            if not driver_path:
                try:
                    from webdriver_manager.chrome import ChromeDriverManager
                    logger.info("🔍 chromedriver not on PATH, downloading using webdriver-manager...")
                    driver_path = ChromeDriverManager().install()
                except Exception as e:
                    logger.warning(f"webdriver-manager failed: {e}")
                    driver_path = None

            # Finally, let Selenium Manager try if driver_path is still None (Selenium >= 4.10)
            if driver_path:
                service = Service(driver_path)
                self.driver = webdriver.Chrome(service=service, options=options)
            else:
                # Use Selenium Manager to resolve driver automatically
                logger.info("🔧 Trying Selenium Manager to resolve Chrome driver automatically")
                self.driver = webdriver.Chrome(options=options)

            logger.info("✅ Chrome driver setup successful")
            return True

        except Exception as e:
            logger.exception("❌ Chrome setup failed")
            return False
    
    def run_automation(self, form_data, options=None):
        """Run simple automation. Accepts optional `options` dict:
           - headless: bool
           - keep_open: bool (if True, keeps browser open after run)
           - pause_after: seconds to wait before closing when visible
           - binary_path: explicit chrome binary location
        """
        keep_open = False
        pause_after = 5
        headless = None
        binary_path = None

        if options:
            headless = options.get("headless", None)
            keep_open = options.get("keep_open", False)
            pause_after = options.get("pause_after", pause_after)
            binary_path = options.get("binary_path", None)

        try:
            logger.info("🤖 Starting simple RPA automation...")

            # Setup driver
            if not self.setup_driver(headless=headless, binary_path=binary_path):
                return {"success": False, "error": "Chrome setup failed"}

            # Determine target URL (allow override via form_data)
            target_url = form_data.get("portal_url") if form_data and isinstance(form_data, dict) else None
            if not target_url:
                target_url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"

            # Navigate to target
            logger.info(f"🌐 Navigating to {target_url} ...")
            self.driver.get(target_url)
            time.sleep(2)

            # Save a quick screenshot for debugging
            screenshot_path = None
            try:
                screenshot_path = os.path.join(os.getcwd(), f"rpa_screenshot_{int(time.time())}.png")
                self.driver.save_screenshot(screenshot_path)
                logger.info(f"📸 Screenshot saved: {screenshot_path}")
            except Exception as e:
                logger.warning(f"Could not save screenshot: {e}")

            # If visible, pause so you can see the actions
            if not (headless if headless is not None else os.getenv("HEADLESS", "1") in ("1", "true", "True")):
                logger.info(f"👀 Visible mode: pausing for {pause_after} seconds for demo")
                time.sleep(pause_after)

            # Simulate form interaction placeholder (actual field selectors are implemented elsewhere)
            logger.info("✅ RPA navigation step completed (form filling is implemented in full automation)")

            return {
                "success": True,
                "message": "RPA automation working",
                "filled_fields": ["✅ Chrome driver working", "✅ Navigation working"],
                "total_filled": 2,
                "total_fields": 2,
                "screenshot": screenshot_path
            }

        except Exception as e:
            logger.exception(f"❌ RPA failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            if self.driver and not keep_open:
                try:
                    self.driver.quit()
                except Exception:
                    pass