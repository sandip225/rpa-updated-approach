#!/bin/bash

echo "🚀 Setting up Unified Portal on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Git
echo "📥 Installing Git..."
sudo apt-get install -y git curl

# Install Node.js (for frontend build if needed)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
echo "📥 Cloning repository..."
if [ -d "unified-portal" ]; then
    echo "🔄 Repository exists, updating..."
    cd unified-portal
    git pull origin main
else
    git clone https://github.com/Vaidehip0407/unified-portal.git
    cd unified-portal
fi

# Set up environment
echo "⚙️ Setting up environment..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Environment file created"
fi

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Start services with Docker
echo "🚀 Starting services..."
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
echo "📊 Service Status:"
sudo docker-compose -f docker-compose.prod.yml ps

# Test services
echo "🧪 Testing services..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend not responding"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend not responding"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Access URLs:"
echo "🌐 Frontend: http://$PUBLIC_IP:3000"
echo "🔧 Backend API: http://$PUBLIC_IP:8000"
echo "📚 API Docs: http://$PUBLIC_IP:8000/docs"
echo "🤖 RPA: Ready for Torrent Power automation"
echo ""
echo "🔧 Management Commands:"
echo "📊 Check status: sudo docker-compose -f docker-compose.prod.yml ps"
echo "📋 View logs: sudo docker-compose -f docker-compose.prod.yml logs"
echo "🔄 Restart: sudo docker-compose -f docker-compose.prod.yml restart"
echo "🛑 Stop: sudo docker-compose -f docker-compose.prod.yml down"
echo ""
echo "✅ Setup completed successfully!"