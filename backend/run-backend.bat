@echo off
echo 🚀 Starting FastAPI Backend Server...
echo ====================================

echo 📦 Installing dependencies...
pip install -r requirements.txt

echo 🗄️ Setting up database...
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine); print('✅ Database initialized')"

echo 🚀 Starting server on http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 🤖 Automation Test: http://localhost:8000/torrent-automation/test-connection
echo.
echo ⚠️ Keep this window open while developing
echo 📝 Press Ctrl+C to stop the server
echo.

uvicorn --app-dir backend app.main:app --host 0.0.0.0 --port 8000 --reload