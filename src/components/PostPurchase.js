import React, { useState } from 'react';
import './PostPurchase.css';

const PostPurchase = ({ productName, shopName, purchaseDate, onFeedback }) => {
  const [feedback, setFeedback] = useState(null);
  const [showThanks, setShowThanks] = useState(false);

  const product = productName || 'Produkt';
  const shop = shopName || 'Shop';
  const date = purchaseDate || '';

  const handleFeedback = (type) => {
    setFeedback(type);
    
    if (onFeedback) {
      onFeedback(type);
    }
    
    if (type !== 'bad') {
      setShowThanks(true);
    }
  };

  if (showThanks && feedback !== 'bad') {
    return (
      <div className="post-purchase thanks">
        <span className="thanks-icon">🙏</span>
        <div className="thanks-content">
          <strong>Danke für dein Feedback!</strong>
          <span>Das hilft uns, bessere Empfehlungen für alle zu machen.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="post-purchase">
      <div className="purchase-header">
        <span className="purchase-icon">👋</span>
        <span className="purchase-title">Willkommen zurück!</span>
      </div>

      <div className="purchase-content">
        <p className="purchase-question">
          Wie war deine letzte Bestellung?
        </p>
        
        <div className="purchase-product">
          <span className="product-name">{product}</span>
          <span className="product-shop">von {shop}</span>
          {date && <span className="product-date">({date})</span>}
        </div>

        <p className="feedback-note">
          Sei <strong>EHRLICH</strong> - das hilft anderen Usern!
        </p>

        <div className="feedback-buttons">
          <button 
            className={`feedback-btn good ${feedback === 'good' ? 'selected' : ''}`}
            onClick={() => handleFeedback('good')}
          >
            <span>👍</span>
            <span>Super</span>
          </button>
          <button 
            className={`feedback-btn okay ${feedback === 'okay' ? 'selected' : ''}`}
            onClick={() => handleFeedback('okay')}
          >
            <span>😐</span>
            <span>Okay</span>
          </button>
          <button 
            className={`feedback-btn bad ${feedback === 'bad' ? 'selected' : ''}`}
            onClick={() => handleFeedback('bad')}
          >
            <span>👎</span>
            <span>Schlecht</span>
          </button>
        </div>

        <div className="privacy-note">
          <span>🔒</span>
          <span>Dein Feedback ist anonym und hilft anderen bei ihren Entscheidungen.</span>
        </div>
      </div>
    </div>
  );
};

export default PostPurchase;
