# 🚀 Quick Start - Fast Automation

## ✅ Setup Complete!
ChromeDriver is cached and ready. Browser will open in ~3 seconds.

---

## Start Backend
```cmd
cd India-Portal\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## Test Automation
```cmd
curl -X POST http://localhost:8000/api/torrent-automation/start-automation ^
  -H "Content-Type: application/json" ^
  -d "{\"city\":\"Ahmedabad\",\"service_number\":\"9358241\",\"t_number\":\"TN123456\",\"mobile\":\"9876543216\",\"email\":\"admin@gmail.com\"}"
```

---

## Expected Timeline
1. **0.003s** - ChromeDriver loads ⚡
2. **3.2s** - Chrome opens 🌐
3. **2s** - Navigate to site 🔗
4. **5-10s** - Fill form 📝
5. **30s** - Auto-close delay ⏱️

**Total: ~40-45 seconds**

---

## Options

### Quick test (10s delay):
```json
{"options": {"auto_close": true, "close_delay": 10}}
```

### Normal (30s delay):
```json
{"options": {"auto_close": true, "close_delay": 30}}
```

### With CAPTCHA (60s delay):
```json
{"options": {"auto_close": true, "close_delay": 60}}
```

### Manual close:
```json
{"options": {"auto_close": false}}
```

---

## Test Speed
```cmd
python test-fast-driver.py
```

Should show:
```
ChromeDriver: 0.003s ⚡ (INSTANT!)
Chrome Open:  3.24s
TOTAL:        3.30s
```

---

## Troubleshooting

### Slow?
```cmd
python setup_chromedriver.py
```

### Test?
```cmd
python test-fast-driver.py
```

### Backend logs?
Check terminal for:
```
✅ ChromeDriver ready (instant!)
✅ Chrome opened in 3.24 seconds!
```

---

## 🎉 Done!
Browser ab 3 seconds mein open hoga!
