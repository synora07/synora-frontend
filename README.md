# 🛒 SYNORA Frontend

> **AI-Powered Shopping Assistant - React Frontend**

Moderne React-App mit Dark Theme, Analytics und User Learning.

---

## 📁 Ordnerstruktur

```
synora-frontend/
├── public/
│   ├── index.html
│   ├── landing.html         # Landing Page (Login/Register)
│   └── js/
│       └── auth.js          # Auth Helper
├── src/
│   ├── App.js               # Haupt-App mit Analytics & Learning
│   ├── App.css              # Dark Theme Styling
│   ├── index.js             # Entry Point
│   └── useAnalytics.js      # Analytics Hook (optional)
└── package.json
```

---

## ✨ Features

| Feature | Beschreibung |
|---------|--------------|
| 🎨 **Dark Theme** | Modernes GitHub-ähnliches Design |
| 🔐 **Authentication** | Login, Register, Logout |
| 💬 **AI Chat** | Claude-powered Produktsuche |
| 📊 **Analytics** | Automatisches Tracking |
| 🧠 **Learning** | Lernt User-Präferenzen |
| 📱 **Responsive** | Desktop & Mobile |

---

## 🖥️ Screenshots

### Landing Page
- Hero Section mit "Try SYNORA"
- Login/Register Modals
- Feature Übersicht
- Dark Theme

### Chat App
- User Header mit Logout
- AI Chat Interface
- Produkt-Karten mit SYNORA Score
- "Warum diese?" / "Warum nicht?" Boxen

---

## 🚀 Installation

### 1. Repository klonen
```bash
git clone https://github.com/your-repo/synora-frontend.git
cd synora-frontend
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Development Server starten
```bash
npm start
```

App öffnet sich: `http://localhost:3000`

---

## 🔧 Configuration

### Backend URL ändern

In `src/App.js`:
```javascript
const API_URL = 'http://localhost:5000/api/analytics';
const PREFS_URL = 'http://localhost:5000/api/preferences';
```

Für Production:
```javascript
const API_URL = 'https://your-backend.com/api/analytics';
const PREFS_URL = 'https://your-backend.com/api/preferences';
```

---

## 📊 Analytics Tracking

Die App trackt automatisch:

| Event | Wann |
|-------|------|
| `session_start` | App geöffnet |
| `login` | User eingeloggt |
| `logout` | User ausgeloggt |
| `search` | Produktsuche |
| `product_click` | Produkt angeklickt |
| `shop_click` | Shop-Link geklickt |

### Browser Console
```
📊 Search tracked: laptop gaming
📊 Product click: MacBook Pro
📊 Shop click: digitec.ch
🧠 Learned from search: laptop gaming
🧠 Learned from product: MacBook Pro
🧠 Learned from shop: digitec.ch
```

---

## 🧠 User Learning

Die App lernt automatisch:

| Was | Wie |
|-----|-----|
| Lieblings-Kategorie | Aus Suchen |
| Budget | Aus Preisen |
| Top-Shops | Aus Klicks |
| Keywords | Aus Suchbegriffen |

### Profil abrufen (Console):
```javascript
fetch('http://localhost:5000/api/preferences/profile', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(console.log)
```

---

## 🔐 Authentication Flow

```
1. User öffnet localhost:3000
         ↓
   Kein Token? → Landing Page
         ↓
2. User klickt "Login"
         ↓
3. Gibt Email + Passwort ein
         ↓
4. Backend validiert → Token
         ↓
5. Redirect zum Chat ✅
```

### LocalStorage Keys
```javascript
localStorage.getItem('token')  // JWT Token
localStorage.getItem('user')   // User Daten (JSON)
```

---

## 🎨 Styling

### Farben (Dark Theme)
```css
--background: #0a0a0a;
--surface: #1a1a1a;
--primary: #2E8B57;      /* SYNORA Green */
--text: #e8e8e8;
--text-muted: #a8a8a8;
```

### SYNORA Score Farben
```css
.score-excellent { color: #00ff00; }  /* 90-100 */
.score-good { color: #7fff00; }       /* 75-89 */
.score-okay { color: #ffff00; }       /* 60-74 */
.score-low { color: #ff6600; }        /* <60 */
```

---

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-scripts": "5.x"
}
```

Keine zusätzlichen Dependencies nötig!

---

## 🧪 Available Scripts

### `npm start`
Development Server auf `http://localhost:3000`

### `npm run build`
Production Build in `/build` Ordner

### `npm test`
Tests ausführen

---

## 🚀 Production Build

### 1. Build erstellen
```bash
npm run build
```

### 2. Build testen
```bash
npx serve -s build
```

### 3. Deployen

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 📱 Responsive Design

| Breakpoint | Gerät |
|------------|-------|
| < 768px | Mobile |
| 768px - 1024px | Tablet |
| > 1024px | Desktop |

---

## 🔧 Troubleshooting

### "Redirect Loop"
```javascript
// Console:
localStorage.clear()
// Dann Seite neu laden
```

### "Token invalid"
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
// Neu einloggen
```

### Analytics nicht trackend?
- Backend läuft? (`localhost:5000`)
- Token vorhanden? (`localStorage.getItem('token')`)
- Console Errors prüfen

---

## 📄 Lizenz

MIT License - SYNORA © 2025

---

**SYNORA** - AI-Powered Shopping Assistant 🛒