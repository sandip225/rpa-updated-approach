"""
Test the fast driver implementation
"""

import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_fast_driver():
    """Test fast driver speed"""
    
    logger.info("=" * 60)
    logger.info("⚡ Testing FAST ChromeDriver")
    logger.info("=" * 60)
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from fast_driver import get_fast_chrome_service
        
        # Test 1: Get driver (should be INSTANT)
        logger.info("\n📍 Test 1: Getting ChromeDriver (cached)...")
        start = time.time()
        service = get_fast_chrome_service()
        driver_time = time.time() - start
        logger.info(f"✅ ChromeDriver ready in {driver_time:.3f} seconds")
        
        # Test 2: Open Chrome
        logger.info("\n📍 Test 2: Opening Chrome...")
        options = Options()
        options.add_argument("--window-size=800,600")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-images")
        
        start = time.time()
        driver = webdriver.Chrome(service=service, options=options)
        chrome_time = time.time() - start
        logger.info(f"✅ Chrome opened in {chrome_time:.2f} seconds")
        
        # Test 3: Load page
        logger.info("\n📍 Test 3: Loading page...")
        start = time.time()
        driver.get("data:text/html,<html><body><h1>Fast!</h1></body></html>")
        page_time = time.time() - start
        logger.info(f"✅ Page loaded in {page_time:.3f} seconds")
        
        total_time = driver_time + chrome_time + page_time
        
        logger.info("\n" + "=" * 60)
        logger.info("📊 FAST DRIVER RESULTS:")
        logger.info(f"   ChromeDriver: {driver_time:.3f}s ⚡")
        logger.info(f"   Chrome Open:  {chrome_time:.2f}s")
        logger.info(f"   Page Load:    {page_time:.3f}s")
        logger.info(f"   TOTAL:        {total_time:.2f}s")
        logger.info("=" * 60)
        
        if driver_time < 0.1:
            logger.info("✅ INSTANT! ChromeDriver cache working perfectly!")
        elif driver_time < 1:
            logger.info("✅ FAST! ChromeDriver loaded quickly")
        else:
            logger.info("⚠️ First run - driver being cached")
        
        if total_time < 3:
            logger.info("🚀 EXCELLENT! Total time under 3 seconds!")
        elif total_time < 5:
            logger.info("✅ GOOD! Acceptable speed")
        else:
            logger.info("⚠️ Could be faster")
        
        logger.info("\n⏳ Keeping Chrome open for 3 seconds...")
        time.sleep(3)
        
        driver.quit()
        logger.info("✅ Test complete!")
        
        # Test again to show caching
        logger.info("\n" + "=" * 60)
        logger.info("🔄 Testing SECOND run (should be instant)...")
        logger.info("=" * 60)
        
        start = time.time()
        service2 = get_fast_chrome_service()
        driver_time2 = time.time() - start
        logger.info(f"✅ Second run: {driver_time2:.3f}s (cached!)")
        
        if driver_time2 < 0.01:
            logger.info("🎉 PERFECT! Instant cache hit!")
        
    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_fast_driver()
