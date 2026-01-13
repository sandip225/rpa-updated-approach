"""
DGVCL Portal Explorer - SAFE MODE
This script ONLY explores the portal structure
Does NOT fill any data or submit anything
Just opens portal and waits for manual exploration
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class DGVCLExplorer:
    """
    Safe explorer to understand DGVCL portal structure
    NO DATA FILLING - ONLY OBSERVATION
    """
    
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_browser(self):
        """Setup Chrome browser"""
        options = Options()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-blink-features=AutomationControlled')
        
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 20)
        
        print("✅ Browser opened")
        
    def explore_portal(self):
        """Open DGVCL portal and wait for manual exploration"""
        print("\n🌐 Opening DGVCL Portal...")
        self.driver.get("https://portal.guvnl.in/login.php")
        
        print("\n" + "="*60)
        print("🔍 PORTAL EXPLORATION MODE")
        print("="*60)
        print("\n📋 Instructions:")
        print("1. ✅ Portal is now open")
        print("2. 👀 Manually explore the portal")
        print("3. 🔐 Try logging in with your credentials")
        print("4. 📄 Navigate to Name Change page")
        print("5. 🔍 Inspect form fields (right-click → Inspect)")
        print("6. 📝 Note down field names/IDs")
        print("\n⚠️  DO NOT SUBMIT ANY FORMS")
        print("="*60)
        
        # Keep browser open for exploration
        input("\n⏸️  Press ENTER when done exploring...")
        
    def run(self):
        """Main execution"""
        try:
            print("\n🚀 DGVCL Portal Explorer - SAFE MODE")
            print("⚠️  This will ONLY open the portal")
            print("✅ No data will be filled or submitted\n")
            
            self.setup_browser()
            self.explore_portal()
            
            print("\n✅ Exploration completed")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            
        finally:
            if self.driver:
                print("\n👋 Closing browser...")
                self.driver.quit()


if __name__ == "__main__":
    print("\n⚠️  SAFE EXPLORATION MODE")
    print("✅ Will only open portal for manual exploration")
    
    confirm = input("\n❓ Continue? (yes/no): ")
    
    if confirm.lower() == 'yes':
        explorer = DGVCLExplorer()
        explorer.run()
    else:
        print("❌ Cancelled")
