# 🚀 Quick Deployment Guide

## EC2 Instance Details
- **Host**: `ec2-3-88-187-173.compute-1.amazonaws.com`
- **User**: `ubuntu`
- **Key**: `unified.pem`
- **SSH**: `ssh -i "unified.pem" ubuntu@ec2-3-88-187-173.compute-1.amazonaws.com`

## 🎯 Option 1: Automated Deployment (Recommended)

### From Your Local Machine:
```bash
# Run the deployment script
./deploy-to-new-ec2.bat
```

## 🎯 Option 2: Manual Setup on EC2

### 1. Connect to EC2:
```bash
ssh -i "unified.pem" ubuntu@ec2-3-88-187-173.compute-1.amazonaws.com
```

### 2. Run Setup Script:
```bash
# Download and run setup script
curl -sSL https://raw.githubusercontent.com/Vaidehip0407/unified-portal/main/ec2-setup.sh | bash
```

### 3. Or Manual Commands:
```bash
# Update system
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io docker-compose git curl
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Clone repository
git clone https://github.com/Vaidehip0407/unified-portal.git
cd unified-portal

# Setup environment
cp backend/.env.example backend/.env

# Start services
sudo docker-compose -f docker-compose.prod.yml up -d --build
``