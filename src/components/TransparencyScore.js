import React, { useState } from 'react';
import './TransparencyScore.css';

const TransparencyScore = ({ 
  totalScore,
  maxScore,
  breakdown,
  whyNotPerfect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const score = totalScore || 0;
  const max = maxScore || 100;
  const items = breakdown || [];
  const imperfections = whyNotPerfect || [];

  const getScoreClass = (percent) => {
    if (percent >= 85) return 'excellent';
    if (percent >= 70) return 'good';
    if (percent >= 50) return 'okay';
    return 'low';
  };

  const scorePercent = (score / max) * 100;
  const scoreClass = getScoreClass(scorePercent);

  return (
    <div className="transparency-score">
      <div 
        className={`score-display ${scoreClass}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="score-main">
          <span className="score-label">SYNORA Score</span>
          <span className="score-value">{score}/{max}</span>
        </div>
        <div className="score-hint">
          <span>🔍</span>
          <span>Klick für Details - Wir verstecken nichts!</span>
          <span className={`score-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="score-details">
          <h4 className="details-title">
            📊 SO BERECHNEN WIR DEN SCORE
          </h4>
          
          <p className="details-intro">
            100% transparent - Du siehst genau warum:
          </p>

          <div className="breakdown-table">
            <div className="breakdown-header">
              <span>Kategorie</span>
              <span>Punkte</span>
              <span>Warum?</span>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="breakdown-row">
                <span>{item.name}</span>
                <span className={getScoreClass((item.score / item.max) * 100)}>
                  {item.score}/{item.max}
                </span>
                <span className="reason">{item.reason}</span>
              </div>
            ))}

            <div className="breakdown-total">
              <span><strong>GESAMT</strong></span>
              <span className={scoreClass}><strong>{score}/{max}</strong></span>
              <span></span>
            </div>
          </div>

          {imperfections.length > 0 && (
            <div className="not-perfect">
              <h5>⚠️ WARUM NICHT 100/100?</h5>
              <p>Wir sagen dir ehrlich was nicht perfekt ist:</p>
              <ul>
                {imperfections.map((reason, i) => <li key={i}>{reason}</li>)}
              </ul>
            </div>
          )}

          <div className="honesty-badge">
            <span>⚖️</span>
            <div>
              <strong>WIR VERSTECKEN NICHTS!</strong>
              <span>Kein Shop kann uns bezahlen um besser dazustehen.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparencyScore;
