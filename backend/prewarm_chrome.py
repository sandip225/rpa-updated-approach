"""
Pre-warm Chrome on startup to make first automation faster
Run this in background when backend starts
"""

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def prewarm_chrome():
    """Pre-initialize Chrome to make first automation instant"""
    try:
        logger.info("🔥 Pre-warming Chrome for faster automation...")
        
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        from webdriver_manager.chrome import ChromeDriverManager
        
        # Get driver path (uses cache)
        driver_path = ChromeDriverManager().install()
        logger.info(f"✅ ChromeDriver cached at: {driver_path}")
        
        # Quick test with headless mode
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        
        service = Service(driver_path)
        driver = webdriver.Chrome(service=service, options=options)
        driver.get("data:text/html,<html><body>Prewarmed</body></html>")
        driver.quit()
        
        logger.info("✅ Chrome pre-warmed! First automation will be instant.")
        return True
        
    except Exception as e:
        logger.warning(f"⚠️ Pre-warm failed (not critical): {e}")
        return False

if __name__ == "__main__":
    prewarm_chrome()
