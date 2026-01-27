#!/bin/bash

echo "🔍 Diagnosing EC2 deployment issues..."

# Check if we're on EC2
echo "=== System Info ==="
whoami
pwd
uname -a

# Check network connectivity
echo "=== Network Check ==="
curl -I google.com || echo "❌ No internet connection"

# Check if Docker is installed and running
echo "=== Docker Status ==="
docker --version || echo "❌ Docker not installed"
sudo systemctl status docker --no-pager || echo "❌ Docker service not running"

# Check current processes using ports
echo "=== Port Usage ==="
sudo netstat -tlnp | grep :80 || echo "Port 80 free"
sudo netstat -tlnp | grep :8000 || echo "Port 8000 free"
sudo netstat -tlnp | grep :3003 || echo "Port 3003 free"

# Check if containers exist
echo "=== Docker Containers ==="
sudo docker ps -a

# Check Docker Compose
echo "=== Docker Compose Status ==="
sudo docker-compose ps

# Check if project files exist
echo "=== Project Files ==="
ls -la
ls -la backend/ || echo "❌ Backend folder missing"
ls -la frontend/ || echo "❌ Frontend folder missing"
ls -la docker-compose.yml || echo "❌ Docker compose file missing"

# Check git status
echo "=== Git Status ==="
git status

# Try to pull latest changes
echo "=== Pulling Latest Changes ==="
git pull origin main

# Stop everything and clean up
echo "=== Cleanup ==="
sudo docker-compose down --remove-orphans
sudo docker system prune -f

# Kill any processes on ports
sudo fuser -k 80/tcp 2>/dev/null || true
sudo fuser -k 8000/tcp 2>/dev/null || true
sudo fuser -k 3003/tcp 2>/dev/null || true

# Stop nginx if running
sudo systemctl stop nginx 2>/dev/null || true

# Build and start containers
echo "=== Building Containers ==="
sudo docker-compose build --no-cache

echo "=== Starting Containers ==="
sudo docker-compose up -d

# Wait for startup
echo "=== Waiting for startup ==="
sleep 30

# Check container logs
echo "=== Container Logs ==="
echo "--- Backend Logs ---"
sudo docker-compose logs backend | tail -20

echo "--- Frontend Logs ---"
sudo docker-compose logs frontend | tail -20

echo "--- Nginx Logs ---"
sudo docker-compose logs nginx | tail -20

# Test endpoints
echo "=== Testing Endpoints ==="
echo "Testing backend health..."
curl -f http://localhost:8000/health || echo "❌ Backend health check failed"

echo "Testing frontend..."
curl -f http://localhost:3003 || echo "❌ Frontend check failed"

echo "Testing nginx proxy..."
curl -f http://localhost/health || echo "❌ Nginx proxy failed"

# Check final status
echo "=== Final Status ==="
sudo docker-compose ps

# Check if ports are now in use
echo "=== Final Port Check ==="
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :3003

echo "✅ Diagnosis complete!"
echo "🌐 Try accessing: http://54.235.42.222"