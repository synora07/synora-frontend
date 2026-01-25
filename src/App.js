import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

// ============================================
// SESSION ID Generator
// ============================================
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('synora_session');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('synora_session', sessionId);
  }
  return sessionId;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [guestInfo, setGuestInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(getSessionId());

  // ============================================
  // 📊 ANALYTICS FUNCTIONS
  // ============================================
  const API_URL = 'https://api.synora.li/api/analytics';

  const trackEvent = useCallback(async (eventType, data = {}) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          eventType,
          sessionId: sessionId.current,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          pageUrl: window.location.href,
          ...data
        })
      });
    } catch (e) { /* silent fail */ }
  }, []);

  const trackSearch = useCallback(async (query, category, resultsCount, products) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          query,
          category,
          resultsCount,
          products: products?.slice(0, 3).map(p => ({
            name: p.name,
            price: p.price,
            shop: p.shopName || p.source,
            score: p.score
          }))
        })
      });
    } catch (e) { /* silent */ }
  }, []);

  const trackProductClick = useCallback(async (product, position) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/product-click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          product,
          position
        })
      });
    } catch (e) { /* silent */ }
  }, []);

  const trackShopClick = useCallback(async (shopName, shopUrl, product) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/shop-click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          shopName,
          shopUrl,
          product
        })
      });
    } catch (e) { /* silent */ }
  }, []);

  // ============================================
  // 🧠 LEARNING FUNCTIONS
  // ============================================
  const PREFS_URL = 'https://api.synora.li/api/preferences';

  const learnFromSearch = useCallback(async (query, category, budget) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${PREFS_URL}/learn/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query, category, budget })
      });
    } catch (e) { /* silent */ }
  }, []);

  const learnFromProduct = useCallback(async (name, category, price, brand) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${PREFS_URL}/learn/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, category, price, brand })
      });
    } catch (e) { /* silent */ }
  }, []);

  const learnFromShop = useCallback(async (shopName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${PREFS_URL}/learn/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ shopName })
      });
    } catch (e) { /* silent */ }
  }, []);

  // ============================================
  // AUTH CHECK
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (window.location.pathname.includes('landing')) {
      setAuthChecked(true);
      return;
    }
    
    if (!token) {
      setUser(null);
      setGuestInfo({
        isGuest: true,
        searchesUsed: 0,
        searchesRemaining: 3,
        searchesLimit: 3
      });
      trackEvent('guest_session_start', { referrer: document.referrer });
      setAuthChecked(true);
      return;
    }
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        setGuestInfo(null);
        trackEvent('login');
      } catch (e) {
        console.error('User data parse error:', e);
      }
    }
    
    trackEvent('session_start', { referrer: document.referrer });
    setAuthChecked(true);
  }, [trackEvent]);

  const handleLogout = () => {
    trackEvent('logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('https://www.synora.li/landing.html');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================
  // SEND MESSAGE
  // ============================================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const newHistory = [...conversationHistory, userMessage];
    setConversationHistory(newHistory);
    const searchQuery = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://api.synora.li/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ message: searchQuery, conversationHistory: newHistory })
      });

      const data = await response.json();
      
      if (response.status === 403 && data.error === 'registration_required') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🔒 Du hast deine 3 kostenlosen Suchen aufgebraucht. Registriere dich jetzt für unbegrenzten Zugang!'
        }]);
        
        setTimeout(() => {
          window.location.href = 'https://www.synora.li/landing.html#register';
        }, 2000);
        
        setLoading(false);
        return;
      }

      if (data.guestInfo) {
        setGuestInfo(data.guestInfo);
      }
      
      let productsWithReasons = data.products || [];
      if (data.productReasons && Array.isArray(data.productReasons)) {
        productsWithReasons = productsWithReasons.map((product, idx) => {
          const reasonData = data.productReasons.find(r => r.index === idx);
          return reasonData?.reasons ? { ...product, whyItFits: reasonData.reasons } : product;
        });
      }
      
      if (productsWithReasons.length > 0) {
        trackSearch(searchQuery, data.category || 'all', productsWithReasons.length, productsWithReasons);
        learnFromSearch(searchQuery, data.category || 'all', data.budget);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        products: productsWithReasons,
        modelOptions: data.modelOptions || [],
        questionType: data.questionType
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage]);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOptionClick = (option) => {
    setInput(option);
    setTimeout(sendMessage, 100);
  };

  const handleProductCardClick = (product, index) => {
    trackProductClick(product, index + 1);
    const price = parseFloat(product.price?.toString().replace(/[^\d.,]/g, '')) || 0;
    learnFromProduct(product.name, product.category, price, product.brand);
  };

  const handleShopLinkClick = (product) => {
    const shopName = product.shopName || product.source || 'Unknown';
    trackShopClick(shopName, product.shopUrl || product.link, { name: product.name, price: product.price });
    learnFromShop(shopName);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-okay';
    return 'score-low';
  };

  const getWhyItFits = (product) => {
    return product.whyItFits?.length > 0 
      ? product.whyItFits 
      : ['Passt zu deiner Nutzung', 'Im Budget', 'Gutes Preis-Leistungs-Verhältnis'];
  };

  if (!authChecked) {
    return (
      <div className="app loading-screen">
        <div className="loading-logo">
          <img src="/img/synora-logo.png" alt="SYNORA" />
          <div className="loading-glow"></div>
        </div>
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="app-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="header glass-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-glow"></div>
            <img src="/img/synora-logo.png" alt="SYNORA" className="logo-image" />
            <h1>SYNORA</h1>
          </div>
          <div className="user-section">
            {user ? (
              <>
                <span className="user-name">👤 {user.name || user.email}</span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <a href="https://www.synora.li/landing.html" className="btn-login">
                Anmelden
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Guest Banner */}
      {guestInfo && guestInfo.isGuest && (
        <div className={`guest-banner glass-card ${guestInfo.searchesRemaining <= 1 ? 'warning' : ''}`}>
          <span className="guest-banner-text">
            {guestInfo.searchesRemaining > 0 
              ? `🎁 Noch ${guestInfo.searchesRemaining} kostenlose ${guestInfo.searchesRemaining === 1 ? 'Suche' : 'Suchen'}`
              : '⚠️ Kostenlose Suchen aufgebraucht'
            }
          </span>
          <a href="https://www.synora.li/landing.html" className="btn-primary btn-small">
            Kostenlos registrieren →
          </a>
        </div>
      )}

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-wrapper glass-card">
          <div className="messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-logo">
                  <div className="welcome-logo-glow"></div>
                  <img src="/img/synora-logo.png" alt="SYNORA" />
                </div>
                <h2>Hallo{user ? ` ${user.name || ''}` : ''}! Ich bin <span className="highlight">SYNORA</span></h2>
                <p>Ich helfe dir, das perfekte Produkt zu finden.</p>
                <p className="hint">Sag mir einfach was du suchst, z.B. "Ich brauche einen Laptop für Gaming"</p>
                {guestInfo && guestInfo.isGuest && (
                  <p className="guest-hint">
                    💡 Du hast <strong>3 kostenlose Suchen</strong>. 
                    <a href="https://www.synora.li/landing.html"> Registriere dich</a> für unbegrenzten Zugang!
                  </p>
                )}
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content glass-message">
                  <div className="message-header">
                    {msg.role === 'user' ? (
                      <span className="message-sender user-sender">Du</span>
                    ) : (
                      <span className="message-sender ai-sender">
                        <img src="/img/synora-logo.png" alt="" className="sender-icon" />
                        SYNORA
                      </span>
                    )}
                  </div>
                  
                  <div className="message-text">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} style={{margin: line.trim() === '' ? '8px 0' : '4px 0'}}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>

                  {msg.modelOptions?.length > 0 && (
                    <div className="model-options">
                      {msg.modelOptions.map((option, idx) => (
                        <button key={idx} className="option-button glass-button" onClick={() => handleOptionClick(option)}>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.products?.length > 0 && (
                    <div className="products">
                      <h3 className="products-title">🏆 Top-3 Empfehlungen</h3>
                      <div className="products-grid">
                        {msg.products.map((product, idx) => (
                          <div 
                            key={idx} 
                            className="product-card glass-product"
                            onClick={() => handleProductCardClick(product, idx)}
                          >
                            <div className="product-rank">#{idx + 1}</div>
                            <div className="product-image-container">
                              {(product.imageUrl || product.image) ? (
                                <img src={product.imageUrl || product.image} alt={product.name} className="product-image" onError={(e) => e.target.style.display = 'none'} />
                              ) : (
                                <div className="product-image-placeholder">📦</div>
                              )}
                            </div>
                            <div className="product-info">
                              <h4 className="product-name">{product.name}</h4>
                              <div className={`synora-score ${getScoreColor(product.score || 85)}`}>
                                <span className="score-label">SYNORA Score</span>
                                <span className="score-value">{product.score || 85}/100</span>
                              </div>
                              <div className="product-price">
                                <span className="price-current">{product.price}</span>
                                {product.oldPrice && <span className="price-old">{product.oldPrice}</span>}
                              </div>
                              <a 
                                href={product.shopUrl || product.link || `https://www.google.ch/search?tbm=shop&q=${encodeURIComponent(product.name)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="product-shop-link"
                                onClick={(e) => { e.stopPropagation(); handleShopLinkClick(product); }}
                              >
                                🛒 {product.shopName || product.source || 'Zum Shop'} →
                              </a>
                              <div className="why-it-fits">
                                <span className="why-label">✓ Passt zu dir:</span>
                                <ul className="why-list">
                                  {getWhyItFits(product).slice(0, 2).map((reason, i) => (
                                    <li key={i}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-content glass-message loading-message">
                  <div className="message-header">
                    <span className="message-sender ai-sender">
                      <img src="/img/synora-logo.png" alt="" className="sender-icon" />
                      SYNORA
                    </span>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p className="typing-text">Suche nach den besten Produkten...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="input-container glass-card">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Was suchst du? (z.B. 'Laptop für Studenten unter 1000 CHF')"
            rows="1"
            disabled={loading}
            className="chat-input"
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="btn-send"
          >
            {loading ? (
              <span className="send-loading"></span>
            ) : (
              <span>➤</span>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>SYNORA • KI-gestützte Produktempfehlungen</p>
      </footer>
    </div>
  );
}

export default App;
