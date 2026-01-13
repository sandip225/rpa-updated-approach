# AWS EC2 Deployment Guide - Complete Setup

## 📋 Prerequisites:

- ✅ AWS EC2 instance (you have this)
- ✅ SSH key (gov-portal.pem)
- ✅ Domain name (optional but recommended)
- ✅ Security group with ports: 22, 80, 443, 8000, 3000

---

## 🚀 Deployment Steps:

### **Step 1: Connect to EC2**

```powershell
# From your local machine
ssh -i "gov-portal.pem" ubuntu@YOUR_EC2_IP
```

Replace `YOUR_EC2_IP` with your actual EC2 public IP.

---

### **Step 2: Install Dependencies on EC2**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install nginx
sudo apt install nginx -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Install git
sudo apt install git -y
```

---

### **Step 3: Upload Code to EC2**

**Option A: Using Git (Recommended)**
```bash
# On EC2
cd /home/ubuntu
git clone YOUR_GITHUB_REPO_URL unified-portal
cd unified-portal
```

**Option B: Using SCP (From your local machine)**
```powershell
# From F:\DevOps\Gov
scp -i "gov-portal.pem" -r unified-portal ubuntu@YOUR_EC2_IP:/home/ubuntu/
```

---

### **Step 4: Setup Backend**

```bash
# On EC2
cd /home/ubuntu/unified-portal/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
nano .env
```

**Paste this in .env:**
```env
# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_ACCOUNT_ID=900768459069553
WHATSAPP_PHONE_NUMBER_ID=983643148159140
WHATSAPP_API_TOKEN=EAAMKbrZCZCgcoBQQlhwOj1s0YlEIc951NhframZCRe0inZAvVjlMxrtRsW5yqI4zVB7mChGAgTzoUjMtFvFQnTc1NeEPEd5gJbqqmg0GaCuq6JSGV85kf5A1QmJeES6kcwTBGCOIh0wxaZBw1AqBXrmdZAZBfjemZBiuyeWZA5FlpBRZCiCRANEQ39EjTjVWJGnihNicC7f1A5XJUTZA7oDVnKYM8jcdbat6mTfbqaSVwpATzNPTwAW4mb8keTilixYFmSTIO5xPFooFZCmwHcJ2BC03UT8QA
WHATSAPP_VERIFY_TOKEN=my_secure_token_2024

# Database
DATABASE_URL=sqlite:///./unified_portal.db

# JWT Secret (change this!)
SECRET_KEY=your-production-secret-key-change-this-to-random-string
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

### **Step 5: Setup Frontend**

```bash
# On EC2
cd /home/ubuntu/unified-portal/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

---

### **Step 6: Create Systemd Service for Backend**

```bash
# Create service file
sudo nano /etc/systemd/system/unified-portal-backend.service
```

**Paste this:**
```ini
[Unit]
Description=Unified Portal Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/unified-portal/backend
Environment="PATH=/home/ubuntu/unified-portal/backend/venv/bin"
ExecStart=/home/ubuntu/unified-portal/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save and enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable unified-portal-backend
sudo systemctl start unified-portal-backend
sudo systemctl status unified-portal-backend
```

---

### **Step 7: Configure Nginx**

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/unified-portal
```

**Paste this (replace YOUR_DOMAIN with your actual domain):**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    # Frontend
    location / {
        root /home/ubuntu/unified-portal/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Demo government endpoints
    location /demo-govt {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**If you DON'T have a domain, use IP address:**
```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;
    
    # Same configuration as above...
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/unified-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### **Step 8: Setup SSL (If you have a domain)**

```bash
# Get SSL certificate
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

Certbot will automatically update nginx config with SSL!

---

### **Step 9: Configure Security Group**

**In AWS Console:**
1. Go to EC2 > Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 8000, Source: 0.0.0.0/0 (for direct API access)

---

### **Step 10: Update WhatsApp Webhook**

**Go to Meta Dashboard:**
1. WhatsApp > Configuration
2. Edit Webhook
3. Update Callback URL:
   - **With domain:** `https://YOUR_DOMAIN/api/whatsapp/webhook`
   - **Without domain:** `http://YOUR_EC2_IP/api/whatsapp/webhook`
4. Verify Token: `my_secure_token_2024`
5. Click "Verify and Save"
6. Subscribe to "messages"

---

### **Step 11: Test Everything**

```bash
# Check backend status
curl http://localhost:8000/api/whatsapp/status

# Check from outside
curl http://YOUR_EC2_IP/api/whatsapp/status

# Or with domain
curl https://YOUR_DOMAIN/api/whatsapp/status
```

**Test WhatsApp:**
1. Send message to: `+1 555 181 3853`
2. Type: `Hello`
3. Bot should respond!

---

## 🔧 Useful Commands:

### **Check Backend Logs:**
```bash
sudo journalctl -u unified-portal-backend -f
```

### **Restart Backend:**
```bash
sudo systemctl restart unified-portal-backend
```

### **Check Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Restart Nginx:**
```bash
sudo systemctl restart nginx
```

### **Update Code:**
```bash
cd /home/ubuntu/unified-portal
git pull
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart unified-portal-backend
cd ../frontend
npm install
npm run build
```

---

## 📊 Architecture:

```
Internet
    ↓
AWS EC2 (Your Server)
    ↓
Nginx (Port 80/443)
    ├── Frontend (/) → /home/ubuntu/unified-portal/frontend/dist
    └── Backend (/api) → localhost:8000
            ↓
        Uvicorn (Python)
            ↓
        FastAPI Backend
            ↓
        SQLite Database
```

---

## 🌐 URLs After Deployment:

**With Domain:**
- Frontend: `https://YOUR_DOMAIN`
- Backend API: `https://YOUR_DOMAIN/api`
- WhatsApp Status: `https://YOUR_DOMAIN/api/whatsapp/status`
- Guided Flow: `https://YOUR_DOMAIN/guided-flow`

**Without Domain (IP only):**
- Frontend: `http://YOUR_EC2_IP`
- Backend API: `http://YOUR_EC2_IP/api`
- WhatsApp Status: `http://YOUR_EC2_IP/api/whatsapp/status`
- Guided Flow: `http://YOUR_EC2_IP/guided-flow`

---

## 🔒 Security Checklist:

- [ ] Change SECRET_KEY in .env to random string
- [ ] Setup SSL certificate (if using domain)
- [ ] Configure firewall (ufw)
- [ ] Regular backups of database
- [ ] Monitor logs regularly
- [ ] Keep system updated

---

## 🐛 Troubleshooting:

### **Backend not starting:**
```bash
sudo journalctl -u unified-portal-backend -n 50
```

### **Nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### **WhatsApp webhook not working:**
```bash
# Check if backend is receiving requests
sudo journalctl -u unified-portal-backend -f

# Test webhook manually
curl -X POST http://localhost:8000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"field":"messages","value":{"messages":[{"from":"1234567890","id":"test123","type":"text","text":{"body":"hello"}}]}}]}]}'
```

---

## 📝 Quick Deployment Script:

I'll create an automated deployment script for you!

---

**Ready to deploy? Let me know your EC2 IP address and whether you have a domain name!**
