# Unified Services Portal

A single portal to manage all utility services - Electricity, Gas, Water & Property with auto-fill functionality.

---

## 🐳 Quick Start with Docker (Local)

### Prerequisites
- Docker Desktop installed
- 2GB RAM minimum

### One-Command Deploy
```powershell
# Windows
.\docker-start.ps1

# Or manually
docker-compose up -d
```

**Access Application:**
- Frontend: http://localhost:3003
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🚀 Deploy to AWS EC2 with Docker + Nginx

### Step 1: Launch EC2 Instance
```bash
# Use AWS Console or CLI
# Instance Type: t2.medium or larger
# OS: Ubuntu 22.04 LTS
# Security Group: Open ports 22, 80, 443 ONLY
```

### Step 2: Connect to EC2
```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
```

### Step 3: Install Docker
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
```

### Step 4: Clone and Deploy
```bash
# Reconnect to EC2
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP

# Clone repository
git clone https://github.com/Vaidehip0407/unified-portal.git
cd unified-portal

# Create environment file
cp .env.example .env
nano .env  # Update SECRET_KEY and other configs

# Generate secret key
openssl rand -hex 32

# Start all services with Nginx
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f nginx
```

### Step 5: Access Application (Single Port!)
```
Application: http://YOUR_EC2_IP
API Docs: http://YOUR_EC2_IP/docs
Health Check: http://YOUR_EC2_IP/health
```

**Note:** Nginx routes everything through port 80:
- `/` → Frontend
- `/api/*` → Backend API
- `/docs` → API Documentation
- `/health` → Health Check

### Useful Commands
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update and restart
git pull
docker-compose up -d --build

# Backup database
docker-compose exec backend cp unified_portal.db /app/data/backup.db

# Check Nginx config
docker-compose exec nginx nginx -t
```

### Troubleshooting
```bash
# Check if services are running
docker-compose ps

# Check Nginx logs
docker-compose logs nginx

# Test backend directly
curl http://localhost:8000/health

# Test frontend directly
curl http://localhost:3003

# Restart Nginx only
docker-compose restart nginx
```

---

## Features

- ⚡ **Electricity** - Name change, new connection
- 🔥 **Gas** - Name change, new connection  
- 💧 **Water** - Name change, new connection
- 🏠 **Property** - Name transfer, mutation

### Key Features
- User registration & authentication
- Document upload with OCR extraction
- Auto-fill forms from stored data
- RPA integration for external websites
- Application tracking
- WhatsApp integration for guided flow

## Tech Stack

- **Backend**: Python FastAPI + SQLite
- **Frontend**: React + Vite + Tailwind CSS
- **Deployment**: Docker + Docker Compose
- **OCR**: Tesseract OCR
- **RPA**: Selenium for external form filling

## Project Structure

```
unified-portal/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── models.py    # Database models
│   │   └── main.py      # App entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── App.jsx     # Main app
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # Docker orchestration
└── README.md
```

## Development

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### With Docker
```bash
docker-compose up
```

## Environment Variables

Create `.env` file from `.env.example`:

```env
# Backend
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./unified_portal.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
VITE_API_URL=http://localhost:8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- GitHub Issues: https://github.com/Vaidehip0407/unified-portal/issues
- Email: support@example.com

---

**Built with ❤️ for Digital Gujarat Initiative**
