#!/bin/bash

echo "🚀 LOCALHOST DEVELOPMENT - Torrent Power Automation"
echo "=================================================="

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

# Build and start for localhost
echo "🔨 Building services for localhost..."
docker compose up --build -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Check status
echo "📊 Container status:"
docker compose ps

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:8000/health && echo "✅ Backend ready!" || echo "⚠️ Backend starting..."

# Test automation service
echo "🤖 Testing automation service..."
curl -s http://localhost:8000/torrent-automation/test-connection | grep -q "success" && echo "✅ Automation ready!" || echo "⚠️ Automation loading..."

echo ""
echo "🎉 LOCALHOST DEVELOPMENT READY!"
echo "==============================="
echo "🌐 Local URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Automation Test: http://localhost:8000/torrent-automation/test-connection"
echo ""
echo "🤖 TORRENT POWER AUTOMATION:"
echo "1. Open: http://localhost:3000"
echo "2. Register/Login"
echo "3. Go to: Services → Electricity → Name Change"
echo "4. Select: Torrent Power"
echo "5. Fill form and click 'Start AI Auto-fill'"
echo "6. 🎉 Watch automation work!"
echo ""
echo "🔧 Development Commands:"
echo "   - View logs: docker compose logs -f"
echo "   - Restart: docker compose restart"
echo "   - Stop: docker compose down"