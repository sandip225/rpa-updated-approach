// Portal API URL - Change this to your deployed URL
const API_URL = 'http://localhost:8000/api';

// DOM Elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const fillBtn = document.getElementById('fillBtn');
const errorMsg = document.getElementById('errorMsg');

// Check if user is logged in
async function checkAuth() {
  const data = await chrome.storage.local.get(['token', 'userData']);
  
  if (data.token && data.userData) {
    showUserInfo(data.userData);
  } else {
    showLoginForm();
  }
}

// Show login form
function showLoginForm() {
  loginForm.classList.add('show');
  userInfo.classList.remove('show');
  statusDot.classList.remove('connected');
  statusText.textContent = 'Not Connected';
}

// Show user info
function showUserInfo(userData) {
  loginForm.classList.remove('show');
  userInfo.classList.add('show');
  statusDot.classList.add('connected');
  statusText.textContent = 'Connected';
  
  document.getElementById('userName').textContent = userData.full_name || 'User';
  document.getElementById('userEmail').textContent = userData.email || '';
  document.getElementById('userMobile').textContent = userData.mobile || '-';
  document.getElementById('userCity').textContent = userData.city || '-';
  document.getElementById('userAadhaar').textContent = userData.aadhaar_number 
    ? '****' + userData.aadhaar_number.slice(-4) 
    : '-';
}

// Login
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    errorMsg.textContent = 'Please enter email and password';
    return;
  }
  
  loginBtn.textContent = 'Connecting...';
  loginBtn.disabled = true;
  errorMsg.textContent = '';
  
  try {
    // Login to get token
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: formData
    });
    
    if (!loginRes.ok) {
      throw new Error('Invalid email or password');
    }
    
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    // Get user data
    const userRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!userRes.ok) {
      throw new Error('Failed to get user data');
    }
    
    const userData = await userRes.json();
    
    // Get autofill data
    const autofillRes = await fetch(`${API_URL}/users/autofill-data`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    let autofillData = {};
    if (autofillRes.ok) {
      autofillData = await autofillRes.json();
    }
    
    // Store in chrome storage
    await chrome.storage.local.set({
      token: token,
      userData: userData,
      autofillData: autofillData
    });
    
    showUserInfo(userData);
    
  } catch (error) {
    errorMsg.textContent = error.message;
  } finally {
    loginBtn.textContent = 'Connect to Portal';
    loginBtn.disabled = false;
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove(['token', 'userData', 'autofillData']);
  showLoginForm();
});

// Fill current page
fillBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'fillForm' }, (response) => {
    if (response && response.success) {
      fillBtn.textContent = '✓ Filled!';
      setTimeout(() => {
        fillBtn.textContent = 'Auto-Fill Current Page';
      }, 2000);
    } else {
      fillBtn.textContent = 'No form found';
      setTimeout(() => {
        fillBtn.textContent = 'Auto-Fill Current Page';
      }, 2000);
    }
  });
});

// Initialize
checkAuth();
