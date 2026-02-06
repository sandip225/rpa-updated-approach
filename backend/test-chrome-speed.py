"""
Test Chrome opening speed
"""

import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_chrome_speed():
    """Test how fast Chrome opens"""
    
    logger.info("=" * 60)
    logger.info("🧪 Testing Chrome Opening Speed")
    logger.info("=" * 60)
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        from webdriver_manager.chrome import ChromeDriverManager
        
        # Test 1: Get driver (should be cached)
        logger.info("\n📍 Test 1: Getting ChromeDriver...")
        start = time.time()
        driver_path = ChromeDriverManager().install()
        driver_time = time.time() - start
        logger.info(f"✅ ChromeDriver ready in {driver_time:.2f} seconds")
        
        # Test 2: Open Chrome (visible)
        logger.info("\n📍 Test 2: Opening Chrome (visible)...")
        options = Options()
        options.add_argument("--window-size=800,600")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-images")
        
        start = time.time()
        service = Service(driver_path)
        driver = webdriver.Chrome(service=service, options=options)
        chrome_time = time.time() - start
        logger.info(f"✅ Chrome opened in {chrome_time:.2f} seconds")
        
        # Test 3: Load page
        logger.info("\n📍 Test 3: Loading test page...")
        start = time.time()
        driver.get("data:text/html,<html><body><h1>Speed Test</h1></body></html>")
        page_time = time.time() - start
        logger.info(f"✅ Page loaded in {page_time:.2f} seconds")
        
        # Total time
        total_time = driver_time + chrome_time + page_time
        
        logger.info("\n" + "=" * 60)
        logger.info("📊 RESULTS:")
        logger.info(f"   ChromeDriver: {driver_time:.2f}s")
        logger.info(f"   Chrome Open:  {chrome_time:.2f}s")
        logger.info(f"   Page Load:    {page_time:.2f}s")
        logger.info(f"   TOTAL:        {total_time:.2f}s")
        logger.info("=" * 60)
        
        if total_time < 5:
            logger.info("✅ EXCELLENT! Chrome is very fast!")
        elif total_time < 10:
            logger.info("✅ GOOD! Chrome speed is acceptable")
        else:
            logger.info("⚠️ SLOW! Consider running setup_chromedriver.py")
        
        logger.info("\n⏳ Keeping Chrome open for 5 seconds...")
        time.sleep(5)
        
        driver.quit()
        logger.info("✅ Test complete!")
        
    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_chrome_speed()
