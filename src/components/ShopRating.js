import React, { useState } from 'react';
import './ShopRating.css';

const ShopRating = ({
  shopName,
  shopUrl,
  rating,
  reviewCount,
  isVerified,
  isSwiss,
  goodPoints,
  badPoints,
  deliveryTime,
  returnPolicy,
  isSponsored,
  sponsorNote
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const name = shopName || 'Shop';
  const url = shopUrl || '#';
  const stars = rating || 0;
  const reviews = reviewCount || 0;
  const pros = goodPoints || [];
  const cons = badPoints || [];

  return (
    <div className="shop-rating">
      <div 
        className="shop-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="shop-main">
          <span className="shop-icon">🏪</span>
          <span className="shop-name">{name}</span>
          {isVerified && <span className="badge verified">✓ Verifiziert</span>}
          {isSwiss && <span className="badge swiss">🇨🇭 Schweiz</span>}
        </div>
        <div className="shop-quick">
          <span className="shop-stars">⭐ {stars}/5</span>
          <span className="shop-reviews">({reviews})</span>
          <span className={`shop-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="shop-details">
          {isSponsored && (
            <div className="sponsored-warning">
              <span>💰</span>
              <div>
                <strong>TRANSPARENZ-HINWEIS:</strong>
                <span>{sponsorNote || "Wir erhalten eine Provision wenn du hier kaufst. Aber unser Urteil ist trotzdem ehrlich!"}</span>
              </div>
            </div>
          )}

          {pros.length > 0 && (
            <div className="shop-section good">
              <h5>✅ Was GUT ist:</h5>
              <ul>
                {pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {cons.length > 0 && (
            <div className="shop-section bad">
              <h5>⚠️ Was NICHT so gut ist (wir sagen es!):</h5>
              <ul>
                {cons.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          <div className="shop-info">
            {deliveryTime && (
              <div className="info-item">
                <span>📦</span>
                <span>{deliveryTime}</span>
              </div>
            )}
            {returnPolicy && (
              <div className="info-item">
                <span>↩️</span>
                <span>{returnPolicy}</span>
              </div>
            )}
          </div>

          <a href={url} target="_blank" rel="noopener noreferrer" className="shop-link">
            Zum Shop →
          </a>

          <div className="neutral-note">
            <span>⚖️</span>
            <span>SYNORA ist NEUTRAL. Wir sind nicht FÜR oder GEGEN diesen Shop.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopRating;
