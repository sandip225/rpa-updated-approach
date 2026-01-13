#!/bin/bash
# Test RPA Setup in Docker Container

echo "🧪 Testing RPA Setup in Docker Container..."
echo "============================================"

# Test 1: Check if Chrome is installed
echo ""
echo "1️⃣ Testing Chrome installation..."
docker-compose exec backend google-chrome --version || docker-compose exec backend chromium --version

# Test 2: Check if ChromeDriver is installed
echo ""
echo "2️⃣ Testing ChromeDriver installation..."
docker-compose exec backend chromedriver --version

# Test 3: Check if Selenium is installed
echo ""
echo "3️⃣ Testing Selenium installation..."
docker-compose exec backend python -c "import selenium; print(f'✅ Selenium {selenium.__version__} installed')"

# Test 4: Check if RPA script exists
echo ""
echo "4️⃣ Testing RPA script location..."
docker-compose exec backend ls -la /app/rpa-automation/dgvcl_name_change_final.py

# Test 5: Test RPA API endpoint
echo ""
echo "5️⃣ Testing RPA API endpoint..."
curl -X POST http://localhost:8000/api/rpa/dgvcl/auto-fill \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "consumer_number": "1234567890",
    "discom": "DGVCL"
  }'

echo ""
echo ""
echo "============================================"
echo "✅ Test Complete!"
echo "============================================"
