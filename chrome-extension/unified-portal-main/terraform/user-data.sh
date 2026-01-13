#!/bin/bash
# User Data Script for EC2 Instance
# This script runs automatically when the instance is launched

set -e

# Update system
apt-get update
apt-get upgrade -y

# Install dependencies
apt-get install -y \
    python3.11 \
    python3.11-venv \
    python3-pip \
    nodejs \
    npm \
    nginx \
    git \
    curl \
    wget

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Create application directory
mkdir -p /home/ubuntu/unified-portal
chown -R ubuntu:ubuntu /home/ubuntu/unified-portal

# Create .env file with WhatsApp credentials
cat > /home/ubuntu/unified-portal/.env << 'EOF'
# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_ACCOUNT_ID=${whatsapp_business_account_id}
WHATSAPP_PHONE_NUMBER_ID=${whatsapp_phone_number_id}
WHATSAPP_API_TOKEN=${whatsapp_api_token}
WHATSAPP_VERIFY_TOKEN=${whatsapp_verify_token}

# Database
DATABASE_URL=sqlite:///./unified_portal.db

# JWT Secret
SECRET_KEY=production-secret-key-change-this
EOF

chown ubuntu:ubuntu /home/ubuntu/unified-portal/.env
chmod 600 /home/ubuntu/unified-portal/.env

# Create a marker file to indicate user-data has run
touch /home/ubuntu/user-data-complete
chown ubuntu:ubuntu /home/ubuntu/user-data-complete

echo "User data script completed successfully" > /var/log/user-data.log
