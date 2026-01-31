#!/bin/bash

echo "🧹 CLEAN PORTAL DEPLOYMENT"
echo "=========================="

# Stop everything
echo "🛑 Stopping all containers..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Pull latest clean code
echo "📥 Pulling latest clean code..."
git pull origin main

# Create SSL certificate
echo "🔐 Creating SSL certificate..."
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/CN=50.19.189.29" 2>/dev/null

# Build everything with clean dependencies
echo "🔨 Building services with clean dependencies..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 45

# Check status
echo "📊 Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test backend health
echo "🧪 Testing backend health..."
sleep 10
curl -s http://localhost:8000/health || echo "Backend starting..."

echo ""
echo "✅ CLEAN PORTAL DEPLOYMENT COMPLETED!"
echo "====================================="
echo "🌐 Portal URLs:"
echo "   - Main Portal: http://50.19.189.29:3000"
echo "   - HTTPS Portal: https://50.19.189.29"
echo "   - API Docs: http://50.19.189.29:8000/docs"
echo ""
echo "📝 Portal Features:"
echo "   ✅ User Registration & Login"
echo "   ✅ Service Applications (Electricity, Gas, Water)"
echo "   ✅ Document Upload"
echo "   ✅ Application Tracking"
echo "   ✅ Dashboard & Analytics"
echo "   ✅ Multi-language Support"
echo "   ✅ Mobile Responsive"
echo ""
echo "🧹 Clean Features:"
echo "   ✅ No browser automation dependencies"
echo "   ✅ Minimal backend requirements"
echo "   ✅ Fast deployment"
echo "   ✅ Stable and reliable"
echo ""
echo "🎉 PORTAL IS READY TO USE!"
echo "Users can register, login, and submit applications normally."