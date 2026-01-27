#!/bin/bash

echo "🚀 Simple deployment start..."

# Go to project directory
cd /home/ubuntu/unified-portal || { echo "❌ Project directory not found"; exit 1; }

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop everything
echo "🛑 Stopping services..."
sudo docker-compose down --remove-orphans 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true
sudo fuser -k 80/tcp 2>/dev/null || true

# Clean Docker
echo "🧹 Cleaning Docker..."
sudo docker system prune -f

# Start containers
echo "🐳 Starting containers..."
sudo docker-compose up --build -d

# Wait and check
echo "⏳ Waiting 30 seconds..."
sleep 30

echo "📊 Container status:"
sudo docker-compose ps

echo "🔍 Testing health:"
curl -f http://localhost:8000/health && echo "✅ Backend OK" || echo "❌ Backend failed"
curl -f http://localhost/health && echo "✅ Proxy OK" || echo "❌ Proxy failed"

echo "🌐 Access at: http://54.235.42.222"