#!/bin/bash
# VNC Server Setup Script for Ubuntu EC2
# This allows users to see RPA bot browser in real-time

echo "🚀 Starting VNC Server Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y

# Install desktop environment (lightweight)
echo "🖥️ Installing Xfce desktop..."
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    xfce4 \
    xfce4-goodies \
    xfce4-terminal

# Install VNC and related tools
echo "📺 Installing VNC server..."
sudo apt-get install -y \
    x11vnc \
    xvfb \
    novnc \
    websockify \
    net-tools

# Create VNC password
echo "🔒 Setting up VNC password..."
mkdir -p ~/.vnc
x11vnc -storepasswd dgvcl2024 ~/.vnc/passwd

# Create startup script
echo "📝 Creating startup script..."
cat > ~/start-vnc.sh << 'EOF'
#!/bin/bash
# Start VNC Server

# Kill existing processes
pkill -9 Xvfb
pkill -9 x11vnc
pkill -9 websockify
pkill -9 xfce4-session

# Wait
sleep 2

# Start virtual display
export DISPLAY=:99
Xvfb :99 -screen 0 1920x1080x24 > /tmp/xvfb.log 2>&1 &
echo "✅ Virtual display started on :99"

# Wait for Xvfb
sleep 3

# Start window manager
DISPLAY=:99 xfce4-session > /tmp/xfce.log 2>&1 &
echo "✅ Desktop environment started"

# Wait for desktop
sleep 3

# Start VNC server
x11vnc -display :99 -forever -shared -rfbauth ~/.vnc/passwd -rfbport 5900 > /tmp/x11vnc.log 2>&1 &
echo "✅ VNC server started on port 5900"

# Wait for VNC
sleep 2

# Start noVNC (web interface)
websockify --web=/usr/share/novnc/ 6080 localhost:5900 > /tmp/novnc.log 2>&1 &
echo "✅ noVNC web interface started on port 6080"

echo ""
echo "🎉 VNC Server is ready!"
echo "🌐 Access at: http://$(curl -s ifconfig.me):6080/vnc.html"
echo "🔑 Password: dgvcl2024"
echo ""
EOF

chmod +x ~/start-vnc.sh

# Create systemd service for auto-start
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/vnc-server.service > /dev/null << EOF
[Unit]
Description=VNC Server for RPA Bot
After=network.target

[Service]
Type=forking
User=ubuntu
ExecStart=/home/ubuntu/start-vnc.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable vnc-server
sudo systemctl start vnc-server

# Update docker-compose to use VNC display
echo "🐳 Updating Docker configuration..."
cd ~/unified-portal

# Add DISPLAY environment to backend
if ! grep -q "DISPLAY=:99" docker-compose.yml; then
    sed -i '/backend:/a\    environment:\n      - DISPLAY=:99' docker-compose.yml
fi

# Restart backend
docker-compose restart backend

echo ""
echo "✅ VNC Server Setup Complete!"
echo ""
echo "📊 Status:"
echo "  - Virtual Display: :99"
echo "  - VNC Port: 5900"
echo "  - Web Interface: 6080"
echo ""
echo "🌐 Access VNC:"
echo "  URL: http://$(curl -s ifconfig.me):6080/vnc.html"
echo "  Password: dgvcl2024"
echo ""
echo "⚠️ Important:"
echo "  1. Add port 6080 to EC2 Security Group"
echo "  2. Test VNC access in browser"
echo "  3. RPA bot will now show in VNC!"
echo ""
echo "🔧 Commands:"
echo "  Start VNC:  ~/start-vnc.sh"
echo "  Stop VNC:   sudo systemctl stop vnc-server"
echo "  Logs:       tail -f /tmp/novnc.log"
echo ""
