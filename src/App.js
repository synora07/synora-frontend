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
  const messagesEndRef = useRef(null);
  const sessionId = useRef(getSessionId());

  // ============================================
  // 📊 ANALYTICS FUNCTIONS - PRODUCTION
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
      console.log('📊 Search tracked:', query);
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
      console.log('📊 Product click:', product.name);
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
      console.log('📊 Shop click:', shopName);
    } catch (e) { /* silent */ }
  }, []);

  // ============================================
  // 🧠 LEARNING FUNCTIONS - PRODUCTION
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
      console.log('🧠 Learned from search:', query);
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
      console.log('🧠 Learned from product:', name);
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
      console.log('🧠 Learned from shop:', shopName);
    } catch (e) { /* silent */ }
  }, []);

  // ============================================
  // AUTH CHECK + SESSION START
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Wenn auf Landing Page → nichts tun
    if (window.location.pathname.includes('landing')) {
      setAuthChecked(true);
      return;
    }
    
    // Kein Token → zur Landing Page
    if (!token) {
      window.location.replace('/landing.html');
      return;
    }
    
    // Token vorhanden → Chat zeigen
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        trackEvent('login');
      } catch (e) {}
    }
    
    trackEvent('session_start', { referrer: document.referrer });
    setAuthChecked(true);
    
  }, [trackEvent]);

  // Logout
  const handleLogout = () => {
    trackEvent('logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/landing.html');
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message - PRODUCTION
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
      const response = await fetch('https://api.synora.li/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: searchQuery, conversationHistory: newHistory })
      });

      const data = await response.json();
      
      let productsWithReasons = data.products || [];
      if (data.productReasons && Array.isArray(data.productReasons)) {
        productsWithReasons = productsWithReasons.map((product, idx) => {
          const reasonData = data.productReasons.find(r => r.index === idx);
          return reasonData?.reasons ? { ...product, whyItFits: reasonData.reasons } : product;
        });
      }
      
      // 📊 TRACK SEARCH
      if (productsWithReasons.length > 0) {
        trackSearch(searchQuery, data.category || 'all', productsWithReasons.length, productsWithReasons);
        // 🧠 LEARN FROM SEARCH
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

  // 📊 CLICK HANDLERS + 🧠 LEARNING
  const handleProductCardClick = (product, index) => {
    trackProductClick(product, index + 1);
    // 🧠 Learn from this click
    const price = parseFloat(product.price?.toString().replace(/[^\d.,]/g, '')) || 0;
    learnFromProduct(product.name, product.category, price, product.brand);
  };

  const handleShopLinkClick = (product) => {
    const shopName = product.shopName || product.source || 'Unknown';
    trackShopClick(shopName, product.shopUrl || product.link, { name: product.name, price: product.price });
    // 🧠 Learn from this shop click
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

  const renderFormattedResponse = (content) => {
    if (!content) return null;
    
    const sections = { checked: null, recommendation: null, whyThese: [], whyNot: [] };
    
    const checkedMatch = content.match(/🔍?\s*Geprüft:?\s*([^\n]+)/i);
    if (checkedMatch) sections.checked = checkedMatch[1].trim();
    
    const recMatch = content.match(/Kurz gesagt:?\s*([^\.]+\.)/i);
    if (recMatch) sections.recommendation = recMatch[1].trim();
    
    const whyTheseMatch = content.match(/Warum diese Auswahl\??\s*([\s\S]*?)(?=Warum nicht|$)/i);
    if (whyTheseMatch) {
      const points = whyTheseMatch[1].match(/[•\-\*]\s*([^\n•\-\*]+)/g);
      if (points) sections.whyThese = points.map(p => p.replace(/^[•\-\*]\s*/, '').trim());
    }
    
    const whyNotMatch = content.match(/Warum nicht[^?]*\??\s*([\s\S]*?)$/i);
    if (whyNotMatch) {
      const points = whyNotMatch[1].match(/[•\-\*]\s*([^\n•\-\*]+)/g);
      if (points) sections.whyNot = points.map(p => p.replace(/^[•\-\*]\s*/, '').trim());
    }
    
    if (!sections.checked && !sections.recommendation && !sections.whyThese.length) {
      return <p>{content}</p>;
    }
    
    return (
      <div className="response-boxes">
        {sections.checked && (
          <div className="info-box checked-box">
            <div className="box-icon">🔍</div>
            <div className="box-content">
              <span className="box-label">GEPRÜFT</span>
              <span className="box-text">{sections.checked}</span>
            </div>
          </div>
        )}
        {sections.recommendation && (
          <div className="info-box recommendation-box">
            <div className="box-icon">💡</div>
            <div className="box-content">
              <span className="box-label">MEINE EMPFEHLUNG</span>
              <span className="box-text">{sections.recommendation}</span>
            </div>
          </div>
        )}
        {(sections.whyThese.length > 0 || sections.whyNot.length > 0) && (
          <div className="comparison-boxes">
            {sections.whyThese.length > 0 && (
              <div className="info-box why-box">
                <span className="box-label">✅ Warum diese?</span>
                <ul className="box-list">{sections.whyThese.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            )}
            {sections.whyNot.length > 0 && (
              <div className="info-box why-not-box">
                <span className="box-label">❌ Warum nicht?</span>
                <ul className="box-list">{sections.whyNot.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!authChecked) {
    return <div className="app" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <p>Laden...</p>
    </div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🛍️</span>
            <h1>SYNORA</h1>
          </div>
          <div className="user-section">
            {user && (
              <>
                <span className="user-name">👤 {user.name || user.email}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
        <p className="tagline">Dein KI-Shopping Assistent</p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>👋 Hallo{user ? ` ${user.name || ''}` : ''}! Ich bin SYNORA.</h2>
              <p>Ich helfe dir, das perfekte Produkt zu finden.</p>
              <p className="hint">Sag mir einfach was du suchst, z.B. "Ich brauche einen Laptop für Gaming"</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">
                <strong>{msg.role === 'user' ? 'Du' : 'SYNORA'}:</strong>
                
                {msg.role === 'assistant' && msg.products?.length > 0 ? (
                  <div className="synora-response-boxes">{renderFormattedResponse(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}

                {msg.modelOptions?.length > 0 && (
                  <div className="model-options">
                    {msg.modelOptions.map((option, idx) => (
                      <button key={idx} className="option-button" onClick={() => handleOptionClick(option)}>{option}</button>
                    ))}
                  </div>
                )}

                {msg.products?.length > 0 && (
                  <div className="products">
                    <h3>🏆 Top-3 Empfehlungen:</h3>
                    {msg.products.map((product, idx) => (
                      <div 
                        key={idx} 
                        className="product-card"
                        onClick={() => handleProductCardClick(product, idx)}
                      >
                        <div className="product-image-container">
                          {(product.imageUrl || product.image) ? (
                            <img src={product.imageUrl || product.image} alt={product.name} className="product-image" onError={(e) => e.target.style.display = 'none'} />
                          ) : (
                            <div className="product-image-placeholder">📦</div>
                          )}
                        </div>
                        <div className="product-info">
                          <div className="product-header">
                            <h4>#{idx + 1} {product.name}</h4>
                            <span className={`synora-score ${getScoreColor(product.score || 85)}`}>SYNORA Score: {product.score || 85}/100</span>
                          </div>
                          <div className="product-price">
                            <span className="price-current">{product.price}</span>
                            {product.oldPrice && <span className="price-old">{product.oldPrice}</span>}
                            {product.discount && <span className="price-discount">-{product.discount}%</span>}
                          </div>
                          <p className="product-shop">
                            🛒 Shop: 
                            <a 
                              href={product.shopUrl || product.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => { e.stopPropagation(); handleShopLinkClick(product); }}
                            >
                              {product.shopName || product.source || 'Shop'}
                            </a>
                          </p>
                          <div className="why-it-fits">
                            <span className="why-label">Passt zu dir, weil:</span>
                            <ul className="why-list">{getWhyItFits(product).slice(0, 3).map((reason, i) => <li key={i}>{reason}</li>)}</ul>
                          </div>
                          {product.badges && (
                            <div className="product-badges">
                              {product.badges.map((badge, i) => <span key={i} className={`badge ${badge.toLowerCase()}`}>{badge}</span>)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-content">
                <strong>SYNORA:</strong>
                <p className="typing">Suche nach den besten Produkten für dich...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Frag mich nach Produkten... (z.B. 'Laptop für Studenten')"
            rows="2"
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? '⏳' : '➤'} Senden
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>SYNORA - KI-gestützte Produktempfehlungen | Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
