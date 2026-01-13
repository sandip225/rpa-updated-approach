"""
Base RPA class for all automation scripts
"""
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
import logging
import time

logger = logging.getLogger(__name__)

class BaseRPA:
    def __init__(self, headless=True):
        self.driver = None
        self.wait = None
        self.headless = headless
        
    def setup_driver(self):
        """Initialize Chrome driver"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        
    def disable_submit_button(self):
        """Disable all submit buttons on page"""
        try:
            submit_buttons = self.driver.find_elements("xpath", "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'submit')]")
            for button in submit_buttons:
                self.driver.execute_script("arguments[0].disabled = true;", button)
                self.driver.execute_script("arguments[0].style.opacity = '0.5';", button)
            logger.info(f"Disabled {len(submit_buttons)} submit buttons")
            return True
        except Exception as e:
            logger.warning(f"Could not disable submit buttons: {e}")
            return False
    
    def take_screenshot(self, filename):
        """Take screenshot of current page"""
        try:
            self.driver.save_screenshot(filename)
            logger.info(f"Screenshot saved: {filename}")
            return filename
        except Exception as e:
            logger.error(f"Could not take screenshot: {e}")
            return None
    
    def close_driver(self):
        """Close browser"""
        if self.driver:
            self.driver.quit()
            logger.info("Browser closed")
