@echo off
echo 🚀 Deploying to New EC2 Instance...

REM New EC2 instance details
set EC2_HOST=ec2-3-88-187-173.compute-1.amazonaws.com
set EC2_USER=ubuntu
set KEY_FILE=unified.pem

echo 📥 Cloning repository on EC2...
ssh -i %KEY_FILE% %EC2_USER%@%EC2_HOST% "
    # Update system
    sudo apt-get update
    
    # Install Docker if not installed
    if ! command -v docker &> /dev/null; then
        echo '🐳 Installing Docker...'
        sudo apt-get install -y docker.io docker-compose
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker ubuntu
    fi
    
    # Install Git if not installed
    if ! command -v git &> /dev/null; then
        echo '📦 Installing Git...'
        sudo apt-get install -y git
    fi
    
    # Clone repository
    if [ -d 'unified-portal' ]; then
        echo '🔄 Updating existing repository...'
        cd unified-portal
        git pull origin main
    else
        echo '📥 Cloning repository...'
        git clone https://github.com/Vaidehip0407/unified-portal.git
        cd unified-portal
    fi
    
    # Set up environment
    echo '⚙️ Setting up environment...'
    cp backend/.env.example backend/.env
    
    # Build and start services
    echo '🚀 Starting services...'
    sudo docker-compose -f docker-compose.prod.yml down
    sudo docker-compose -f docker-compose.prod.yml up -d --build
    
    # Check service status
    echo '📊 Service Status:'
    sudo docker-compose -f docker-compose.prod.yml ps
    
    echo '✅ Deployment completed!'
    echo '🌐 Frontend: http://%EC2_HOST%:3000'
    echo '🔧 Backend: http://%EC2_HOST%:8000'
"

echo 🧪 Testing services...
timeout 10 curl -f http://%EC2_HOST%:8000/health && echo "✅ Backend is running" || echo "❌ Backend not responding"
timeout 10 curl -f http://%EC2_HOST%:3000 && echo "✅ Frontend is running" || echo "❌ Frontend not responding"

echo 🎉 Deployment completed!
echo.
echo 📋 Access URLs:
echo 🌐 Frontend: http://%EC2_HOST%:3000
echo 🔧 Backend API: http://%EC2_HOST%:8000
echo 📚 API Docs: http://%EC2_HOST%:8000/docs
echo 🤖 RPA: Ready for Torrent Power automation
echo.
echo 🔑 SSH Access: ssh -i %KEY_FILE% %EC2_USER%@%EC2_HOST%

pause