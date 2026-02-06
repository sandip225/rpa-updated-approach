#!/usr/bin/env python3
"""
Test Script for VISIBLE Torrent Power Automation
Shows browser during entire automation process - you can watch fields being filled!
"""

import sys
import os
import json

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.torrent_power_automation import TorrentPowerAutomation

def main():
    print("\n" + "=" * 70)
    print("🎬 TORRENT POWER VISIBLE AUTOMATION TEST")
    print("=" * 70)
    print()
    print("✅ This will:")
    print("   1. Open Chrome browser (VISIBLE on your screen)")
    print("   2. Navigate to Torrent Power official website")
    print("   3. Automatically fill in form fields with test data")
    print("   4. Show each field being filled in real-time")
    print("   5. Keep browser open for you to review")
    print()
    
    # Test data
    test_data = {
        "city": "Ahmedabad",
        "service_number": "3358225",
        "t_number": "T123456",
        "mobile": "9876543210",
        "email": "test@example.com"
    }
    
    print(f"📋 TEST DATA:")
    print(f"   City: {test_data['city']}")
    print(f"   Service Number: {test_data['service_number']}")
    print(f"   T Number: {test_data['t_number']}")
    print(f"   Mobile: {test_data['mobile']}")
    print(f"   Email: {test_data['email']}")
    print()
    
    print("🚀 Starting automation...")
    print("-" * 70)
    print()
    
    # Initialize automation
    automation = TorrentPowerAutomation()
    
    # Run the workflow
    result = automation.execute_complete_workflow(test_data)
    
    # Print results
    print()
    print("-" * 70)
    print()
    print(f"🎉 RESULT: {result.get('success', False)}")
    print()
    print(f"📊 Summary:")
    print(f"   Fields Filled: {result.get('fields_filled', 0)}/{result.get('total_fields', 0)}")
    print(f"   Success Rate: {result.get('success_rate', '0%')}")
    print(f"   Message: {result.get('message', '')}")
    print()
    
    if result.get('screenshots'):
        print("📸 Screenshots Saved:")
        for screenshot in result.get('screenshots', []):
            print(f"   - {screenshot}")
        print()
    
    print("✅ Next Steps:")
    for step in result.get('next_steps', []):
        print(f"   {step}")
    print()
    
    print("=" * 70)
    print("🎬 Browser window remains open for your review & manual submission")
    print("=" * 70)
    print()
    
    # Return the result
    return result

if __name__ == "__main__":
    main()
