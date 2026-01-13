#!/usr/bin/env python3
"""
Test registration locally
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    payload = {
        "email": "testuser@example.com",
        "mobile": "9876543210",
        "password": "TestPassword123",
        "full_name": "Test User",
        "city": "Ahmedabad"
    }
    
    print("Testing registration with payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Registration successful!")
            return response.json()
        else:
            print(f"\n❌ Registration failed!")
            return None
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None

def test_login(email, password):
    """Test user login"""
    payload = {
        "username": email,
        "password": password
    }
    
    print("\n\nTesting login with payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Login successful!")
            return response.json()
        else:
            print(f"\n❌ Login failed!")
            return None
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None

if __name__ == "__main__":
    print("=" * 60)
    print("LOCAL REGISTRATION TEST")
    print("=" * 60)
    
    # Test registration
    user = test_register()
    
    # Test login if registration was successful
    if user:
        test_login("testuser@example.com", "TestPassword123")
