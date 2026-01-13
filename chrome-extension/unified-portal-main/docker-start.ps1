# Unified Services Portal - Docker Quick Start Script
# Run this script to start the application with Docker

Write-Host "🚀 Unified Services Portal - Docker Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
Write-Host "Checking Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file" -ForegroundColor Green
        Write-Host "⚠️  Please update .env with your configuration before proceeding" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            exit 0
        }
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build images
Write-Host ""
Write-Host "Building Docker images..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Start services
Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend:  http://localhost:3003" -ForegroundColor White
Write-Host "  🔧 Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "  📚 API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "  🔄 Nginx:     http://localhost:80" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:        docker-compose logs -f" -ForegroundColor White
Write-Host "  Stop services:    docker-compose down" -ForegroundColor White
Write-Host "  Restart:          docker-compose restart" -ForegroundColor White
Write-Host "  Check status:     docker-compose ps" -ForegroundColor White
Write-Host ""

# Wait a few seconds and check health
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Checking service health..." -ForegroundColor Yellow

try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend health check failed (may still be starting)" -ForegroundColor Yellow
}

try {
    $frontendHealth = Invoke-WebRequest -Uri "http://localhost:3003" -UseBasicParsing -TimeoutSec 5
    if ($frontendHealth.StatusCode -eq 200) {
        Write-Host "✅ Frontend is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend health check failed (may still be starting)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment complete! Open http://localhost:3003 in your browser" -ForegroundColor Green
Write-Host ""

# Ask if user wants to view logs
$viewLogs = Read-Host "View live logs? (y/n)"
if ($viewLogs -eq "y") {
    docker-compose logs -f
}
