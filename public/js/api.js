// ============================================
// SYNORA - API Service
// Kommunikation mit Backend (localhost:5000)
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

const api = {

  // USER REGISTRATION
  async register(userData) {
    try {
      console.log('📤 Sending registration request...');
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          password: userData.password,
          birthdate: userData.birthdate,
          terms: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      console.log('✅ Registration successful:', data);
      return data;

    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  // USER LOGIN
  async login(email, password) {
    try {
      console.log('📤 Sending login request...');
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Token speichern
      if (data.token) {
        localStorage.setItem('synora_token', data.token);
        localStorage.setItem('synora_user', JSON.stringify(data.user || { email }));
        localStorage.setItem('isLoggedIn', 'true');
        console.log('✅ Token saved to localStorage');
      }

      console.log('✅ Login successful');
      return data;

    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // LOGOUT
  logout() {
    localStorage.removeItem('synora_token');
    localStorage.removeItem('synora_user');
    localStorage.removeItem('isLoggedIn');
    console.log('✅ Logged out');
    window.location.href = 'index.html';
  },

  // CHECK IF LOGGED IN
  isLoggedIn() {
    const token = localStorage.getItem('synora_token');
    return !!token;
  },

  // GET CURRENT USER
  getCurrentUser() {
    const userStr = localStorage.getItem('synora_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // GET AUTH TOKEN
  getToken() {
    return localStorage.getItem('synora_token');
  },

  // FORGOT PASSWORD
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;

    } catch (error) {
      console.error('❌ Forgot password error:', error);
      throw error;
    }
  }

};

// Global verfügbar machen
window.api = api;
console.log('✅ SYNORA API loaded');