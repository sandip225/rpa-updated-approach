"""
Test API automation speed directly
"""

import requests
import time
import json

print("=" * 60)
print("🧪 Testing Automation API Speed")
print("=" * 60)

url = "http://localhost:8000/api/torrent-automation/start-automation"

data = {
    "city": "Ahmedabad",
    "service_number": "TEST123",
    "t_number": "T123456",
    "mobile": "9876543210",
    "email": "test@example.com",
    "options": {
        "auto_close": True,
        "close_delay": 5
    }
}

print(f"\n📤 Sending request to: {url}")
print(f"📋 Data: {json.dumps(data, indent=2)}")
print("\n⏱️ Starting timer...")

start = time.time()

try:
    response = requests.post(url, json=data, timeout=120)
    elapsed = time.time() - start
    
    print(f"\n✅ Response received in {elapsed:.2f} seconds")
    print(f"📊 Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n📝 Result:")
        print(f"   Success: {result.get('success')}")
        print(f"   Message: {result.get('message')}")
        print(f"   Fields Filled: {result.get('fields_filled')}/{result.get('total_fields')}")
        print(f"   Success Rate: {result.get('success_rate')}")
    else:
        print(f"\n❌ Error: {response.text}")
    
    print("\n" + "=" * 60)
    print(f"⏱️ TOTAL TIME: {elapsed:.2f} seconds")
    print("=" * 60)
    
except requests.exceptions.Timeout:
    elapsed = time.time() - start
    print(f"\n❌ Request timed out after {elapsed:.2f} seconds")
    print("⚠️ Backend might be stuck or ChromeDriver is downloading")
    
except Exception as e:
    elapsed = time.time() - start
    print(f"\n❌ Error after {elapsed:.2f} seconds: {e}")

print("\n✅ Test complete!")
