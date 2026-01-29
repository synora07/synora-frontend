import React, { useState } from 'react';
import './WhyNotCard.css';

const WhyNotCard = ({ alternatives }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const alts = alternatives || [];
  
  if (alts.length === 0) {
    return null;
  }

  return (
    <div className="why-not-card">
      <div 
        className="why-not-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="why-not-title">
          <span className="why-not-icon">❌</span>
          <span>WARUM NICHT DIE ANDEREN?</span>
          <span className="alt-count">({alts.length})</span>
        </div>
        <span className={`why-not-arrow ${isExpanded ? 'open' : ''}`}>▶</span>
      </div>

      {isExpanded && (
        <div className="why-not-content">
          <p className="why-not-intro">
            Wir haben auch andere geprüft. <strong>Ehrlich</strong> warum sie für DICH nicht passen:
          </p>

          {alts.map((alt, index) => (
            <div key={index} className="alt-item">
              <h4 className="alt-name">{alt.name}</h4>
              
              {alt.goodPoints && alt.goodPoints.length > 0 && (
                <div className="alt-section good">
                  <span className="alt-label">✓ Was GUT ist:</span>
                  <ul>
                    {alt.goodPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {alt.problems && alt.problems.length > 0 && (
                <div className="alt-section bad">
                  <span className="alt-label">✗ Problem:</span>
                  <ul>
                    {alt.problems.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {alt.notForYou && (
                <div className="not-for-you">
                  <span>→</span>
                  <span><strong>Passt nicht für DICH:</strong> {alt.notForYou}</span>
                </div>
              )}
            </div>
          ))}

          <div className="honesty-note">
            <span>⚖️</span>
            <span>SYNORA zeigt auch das Gute an Alternativen. Wir sind fair!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyNotCard;
