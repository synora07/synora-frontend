import React, { useState } from 'react';
import './WhyThisCard.css';

const WhyThisCard = ({ 
  advantages,
  disadvantages,
  conclusion,
  matchReason
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const pros = advantages || [];
  const cons = disadvantages || [];

  return (
    <div className="why-this-card">
      <div 
        className="why-this-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="why-this-title">
          <span className="why-this-icon">✅</span>
          <span>WARUM DIESE?</span>
        </div>
        <span className={`why-this-arrow ${isExpanded ? 'open' : ''}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="why-this-content">
          {pros.length > 0 && (
            <div className="why-section advantages">
              <h4 className="section-title">
                <span className="section-icon">👍</span>
                VORTEILE
              </h4>
              <ul className="why-list">
                {pros.map((item, index) => (
                  <li key={index} className="why-item good">
                    <span className="item-bullet">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cons.length > 0 && (
            <div className="why-section disadvantages">
              <h4 className="section-title warning">
                <span className="section-icon">⚠️</span>
                NACHTEILE (wir sagen es ehrlich!)
              </h4>
              <ul className="why-list">
                {cons.map((item, index) => (
                  <li key={index} className="why-item bad">
                    <span className="item-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(conclusion || matchReason) && (
            <div className="why-section conclusion">
              <h4 className="section-title blue">
                <span className="section-icon">💡</span>
                UNSER FAZIT
              </h4>
              {matchReason && (
                <p className="match-text">
                  <strong>Passt zu DIR weil:</strong> {matchReason}
                </p>
              )}
              {conclusion && (
                <p className="conclusion-text">{conclusion}</p>
              )}
            </div>
          )}

          <div className="honesty-note">
            <span>⚖️</span>
            <span>SYNORA zeigt IMMER Vor- UND Nachteile. Wir verstecken nichts!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyThisCard;
