#!/bin/bash
# Quick Deploy Script for RPA Auto-Fill Fix

echo "🚀 Deploying RPA Auto-Fill Fix..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pull latest code
echo ""
echo "${YELLOW}📥 Step 1: Pulling latest code...${NC}"
git pull origin main
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Code pulled successfully${NC}"
else
    echo "${RED}❌ Failed to pull code${NC}"
    exit 1
fi

# Step 2: Stop containers
echo ""
echo "${YELLOW}🛑 Step 2: Stopping containers...${NC}"
docker-compose down
echo "${GREEN}✅ Containers stopped${NC}"

# Step 3: Rebuild backend with Chrome
echo ""
echo "${YELLOW}🔨 Step 3: Rebuilding backend (this may take 5-10 minutes)...${NC}"
docker-compose build --no-cache backend
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Backend rebuilt successfully${NC}"
else
    echo "${RED}❌ Failed to rebuild backend${NC}"
    exit 1
fi

# Step 4: Start containers
echo ""
echo "${YELLOW}🚀 Step 4: Starting containers...${NC}"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Containers started${NC}"
else
    echo "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# Step 5: Wait for services to be ready
echo ""
echo "${YELLOW}⏳ Step 5: Waiting for services to be ready (30 seconds)...${NC}"
sleep 30

# Step 6: Run tests
echo ""
echo "${YELLOW}🧪 Step 6: Running tests...${NC}"
echo ""

# Test Chrome
echo "Testing Chrome..."
docker-compose exec -T backend chromium --version
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Chrome installed${NC}"
else
    echo "${RED}❌ Chrome not found${NC}"
fi

# Test ChromeDriver
echo ""
echo "Testing ChromeDriver..."
docker-compose exec -T backend chromedriver --version
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ ChromeDriver installed${NC}"
else
    echo "${RED}❌ ChromeDriver not found${NC}"
fi

# Test Selenium
echo ""
echo "Testing Selenium..."
docker-compose exec -T backend python -c "import selenium; print('Selenium', selenium.__version__)"
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Selenium installed${NC}"
else
    echo "${RED}❌ Selenium not found${NC}"
fi

# Test RPA script
echo ""
echo "Testing RPA script..."
docker-compose exec -T backend ls /app/rpa-automation/dgvcl_name_change_final.py
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ RPA script found${NC}"
else
    echo "${RED}❌ RPA script not found${NC}"
fi

# Test API endpoint
echo ""
echo "Testing API endpoint..."
response=$(curl -s -X POST http://localhost:8000/api/rpa/dgvcl/auto-fill \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "consumer_number": "1234567890",
    "discom": "DGVCL"
  }')

if [[ $response == *"success"* ]]; then
    echo "${GREEN}✅ API endpoint working${NC}"
    echo "Response: $response"
else
    echo "${RED}❌ API endpoint failed${NC}"
    echo "Response: $response"
fi

# Final status
echo ""
echo "=================================="
echo "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "📝 Next Steps:"
echo "1. Open: http://98.93.30.22:3000/services/electricity"
echo "2. Fill form with mobile & consumer number"
echo "3. Click 'Submit & Open DGVCL Portal'"
echo "4. Check if mobile & DGVCL auto-fill!"
echo ""
echo "📊 Check logs:"
echo "  docker-compose logs -f backend"
echo ""
echo "🔍 View screenshots:"
echo "  docker-compose exec backend ls -la /tmp/dgvcl_screenshots/"
echo ""
