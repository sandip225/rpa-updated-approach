# VNC Server Setup for Visible RPA Browser

## 🎯 Goal
Show RPA bot browser to user in real-time via web browser (noVNC)

---

## 📦 Installation on EC2

### Step 1: Install VNC Server & Desktop Environment

```bash
# SSH into EC2
ssh -i gov-portal.pem ubuntu@98.93.30.22

# Update system
sudo apt-get update

# Install Xfce desktop (lightweight)
sudo apt-get install -y xfce4 xfce4-goodies

# Install VNC server
sudo apt-get install -y tightvncserver

# Install noVNC (web-based VNC client)
sudo apt-get install -y novnc websockify

# Install x11vnc (better for automation)
sudo apt-get install -y x11vnc
```

### Step 2: Setup Virtual Display

```bash
# Install Xvfb (virtual framebuffer)
sudo apt-get install -y xvfb

# Start virtual display
export DISPLAY=:99
Xvfb :99 -screen 0 1920x1080x24 &

# Start window manager
DISPLAY=:99 xfce4-session &
```

### Step 3: Start VNC Server

```bash
# Start x11vnc on virtual display
x11vnc -display :99 -forever -shared -rfbport 5900 &

# Start noVNC websocket proxy
websockify --web=/usr/share/novnc/ 6080 localhost:5900 &
```

### Step 4: Configure Firewall

```bash
# Allow VNC port in EC2 Security Group
# Add inbound rule: Port 6080, Source: 0.0.0.0/0
```

---

## 🚀 Access VNC from Browser

**URL:** `http://98.93.30.22:6080/vnc.html`

**Connect:**
1. Open URL in browser
2. Click "Connect"
3. You'll see desktop!

---

## 🔧 Integration with RPA Bot

### Update RPA Script to Use VNC Display

```python
# In dgvcl_name_change_final.py
def setup_browser(self):
    options = Options()
    
    # Use VNC display instead of headless
    if os.environ.get('DISPLAY'):
        # Running on VNC display
        options.add_argument('--display=' + os.environ.get('DISPLAY'))
    else:
        # Fallback to headless
        options.add_argument('--headless')
    
    # ... rest of setup
```

### Set DISPLAY environment in Docker

```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - DISPLAY=:99
```

---

## 🎬 User Experience

### Flow:
1. User submits form on portal
2. Backend triggers RPA bot
3. **User gets VNC link:** `http://98.93.30.22:6080/vnc.html`
4. User opens link in new tab
5. **User sees live browser filling form!**
6. User watches bot work
7. User completes captcha/OTP when bot pauses

---

## 🔒 Security

### Password Protection

```bash
# Set VNC password
x11vnc -storepasswd yourpassword ~/.vnc/passwd

# Start with password
x11vnc -display :99 -rfbauth ~/.vnc/passwd -forever -shared &
```

### SSL/TLS

```bash
# Use nginx reverse proxy with SSL
# Already have nginx running!
```

---

## 📊 Performance

**Pros:**
- ✅ User sees exactly what bot is doing
- ✅ Transparent process
- ✅ Easy debugging
- ✅ Professional experience

**Cons:**
- ⚠️ Requires VNC setup (one-time)
- ⚠️ Uses more server resources
- ⚠️ Network bandwidth for video

---

## 🚀 Quick Setup Script

```bash
#!/bin/bash
# vnc-setup.sh

# Install packages
sudo apt-get update
sudo apt-get install -y xfce4 x11vnc xvfb novnc websockify

# Start services
export DISPLAY=:99
Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
sleep 2
DISPLAY=:99 xfce4-session > /dev/null 2>&1 &
sleep 2
x11vnc -display :99 -forever -shared -rfbport 5900 > /dev/null 2>&1 &
sleep 1
websockify --web=/usr/share/novnc/ 6080 localhost:5900 > /dev/null 2>&1 &

echo "✅ VNC Server started!"
echo "🌐 Access at: http://98.93.30.22:6080/vnc.html"
```

---

## 🎯 Alternative: Docker VNC Container

**Easier option:**

```yaml
# docker-compose.yml
services:
  vnc:
    image: dorowu/ubuntu-desktop-lxde-vnc
    ports:
      - "6080:80"
      - "5900:5900"
    environment:
      - VNC_PASSWORD=yourpassword
```

```bash
docker-compose up -d vnc
```

**Access:** `http://98.93.30.22:6080`

---

## 📝 Implementation Steps

1. ✅ Install VNC server (30 mins)
2. ✅ Update RPA script to use VNC display
3. ✅ Add VNC link to frontend response
4. ✅ Test end-to-end

**Total setup time: 1 hour**

---

## 🎬 Final User Experience

1. User submits form
2. Success screen shows:
   - ✅ Tracking ID
   - ✅ **"Watch Bot Live"** button → Opens VNC
   - ✅ "Open Portal" button → Opens DGVCL
3. User watches bot fill form in real-time
4. User completes captcha/OTP
5. Done!

**This is the BEST solution!** 🚀
