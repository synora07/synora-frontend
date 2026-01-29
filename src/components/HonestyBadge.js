import React, { useState } from 'react';
import './HonestyBadge.css';

const HonestyBadge = ({ isSponsored, sponsorName, showFull }) => {
  const [isExpanded, setIsExpanded] = useState(showFull || false);

  return (
    <div className={`honesty-badge ${isSponsored ? 'sponsored' : ''}`}>
      <div 
        className="badge-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="badge-icon">⚖️</span>
        <span className="badge-title">SYNORA EHRLICHKEITS-VERSPRECHEN</span>
        <span className={`badge-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
      </div>

      {isExpanded && (
        <div className="badge-content">
          {isSponsored && (
            <div className="sponsored-alert">
              <span>💰</span>
              <div>
                <strong>TRANSPARENZ:</strong>
                <span>
                  {sponsorName 
                    ? `Wir erhalten eine Provision von ${sponsorName}. Aber unser Urteil bleibt 100% ehrlich!`
                    : "Wir erhalten eine Provision für diesen Link. Aber unser Urteil bleibt 100% ehrlich!"
                  }
                </span>
              </div>
            </div>
          )}

          <ul className="promise-list">
            <li>
              <span className="check">✅</span>
              <span>Wir zeigen Vorteile <strong>UND</strong> Nachteile</span>
            </li>
            <li>
              <span className="check">✅</span>
              <span>Wir verstecken nichts</span>
            </li>
            <li>
              <span className="check">✅</span>
              <span>Wir sind <strong>FÜR DICH</strong>, nicht für Shops</span>
            </li>
            <li>
              <span className="check">✅</span>
              <span>Wir sagen wenn etwas schlecht ist</span>
            </li>
            <li>
              <span className="check">✅</span>
              <span>Wenn wir Geld bekommen, <strong>sagen wir es!</strong></span>
            </li>
          </ul>

          <div className="promise-footer">
            <strong>Unser Ziel:</strong> Dein Vertrauen verdienen - durch Ehrlichkeit!
          </div>
        </div>
      )}
    </div>
  );
};

export default HonestyBadge;
