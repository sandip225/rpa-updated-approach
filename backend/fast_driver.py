"""
Ultra-fast ChromeDriver loader with aggressive caching
Bypasses slow version checks
"""

import os
import logging
from selenium.webdriver.chrome.service import Service

logger = logging.getLogger(__name__)

# Cache the driver path globally
_CACHED_DRIVER_PATH = None

def get_fast_chromedriver_path():
    """Get ChromeDriver path with aggressive caching - INSTANT after first call"""
    global _CACHED_DRIVER_PATH
    
    # Return cached path immediately
    if _CACHED_DRIVER_PATH and os.path.exists(_CACHED_DRIVER_PATH):
        logger.info(f"⚡ Using cached driver (instant): {_CACHED_DRIVER_PATH}")
        return _CACHED_DRIVER_PATH
    
    try:
        # Try to find existing cached driver without version check
        cache_dir = os.path.join(os.path.expanduser("~"), ".wdm", "drivers", "chromedriver")
        
        if os.path.exists(cache_dir):
            # Find the most recent chromedriver
            for root, dirs, files in os.walk(cache_dir):
                for file in files:
                    if file == "chromedriver.exe" or file == "chromedriver":
                        driver_path = os.path.join(root, file)
                        _CACHED_DRIVER_PATH = driver_path
                        logger.info(f"✅ Found cached driver: {driver_path}")
                        return driver_path
        
        # Fallback to webdriver-manager (slow first time only)
        logger.info("⏳ No cache found, downloading driver (one-time)...")
        from webdriver_manager.chrome import ChromeDriverManager
        
        # Disable version check for speed
        os.environ['WDM_LOG_LEVEL'] = '0'
        os.environ['WDM_PRINT_FIRST_LINE'] = 'False'
        
        driver_path = ChromeDriverManager().install()
        _CACHED_DRIVER_PATH = driver_path
        logger.info(f"✅ Driver downloaded: {driver_path}")
        return driver_path
        
    except Exception as e:
        logger.error(f"❌ Failed to get driver: {e}")
        return None

def get_fast_chrome_service():
    """Get Chrome service with cached driver - INSTANT"""
    driver_path = get_fast_chromedriver_path()
    if driver_path:
        return Service(driver_path)
    else:
        logger.warning("⚠️ Using default service (no explicit path)")
        return Service()
