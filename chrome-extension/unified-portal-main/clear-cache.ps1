# Clear all caches and rebuild
Write-Host "Stopping containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "Clearing frontend build..." -ForegroundColor Yellow
Remove-Item -Recurse -Force frontend/dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/node_modules/.vite -ErrorAction SilentlyContinue

Write-Host "Rebuilding frontend..." -ForegroundColor Green
docker-compose build --no-cache frontend

Write-Host "Starting services..." -ForegroundColor Green
docker-compose up -d

Write-Host ""
Write-Host "Cache cleared and services restarted!" -ForegroundColor Green
Write-Host ""
Write-Host "Now in your browser:" -ForegroundColor Cyan
Write-Host "1. Press Ctrl+Shift+Delete" -ForegroundColor White
Write-Host "2. Clear 'Cached images and files'" -ForegroundColor White
Write-Host "3. Go to Application tab" -ForegroundColor White
Write-Host "4. Click 'Clear site data'" -ForegroundColor White
Write-Host "5. Hard refresh with Ctrl+Shift+R" -ForegroundColor White
