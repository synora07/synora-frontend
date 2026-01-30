// ============================================
// SYNORA - SMART SUGGESTION
// Feature 11: KI schlägt Alternativen vor
// Wenn Produkt nicht gefunden, zeigt ähnliche!
// ============================================

import React, { useState } from 'react';
import './SmartSuggestion.css';

const SmartSuggestion = ({
  searchedProduct,
  wasFound,
  alternatives,
  aiExplanation
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const searched = searchedProduct || 'Produkt';
  const found = wasFound || false;
  const alts = alternatives || [];
  const explanation = aiExplanation || '';

  // Wenn gefunden, zeige nichts
  if (found) {
    return null;
  }

  return (
    <div className="smart-suggestion">
      {/* Header - Nicht gefunden */}
      <div className="suggestion-header">
        <div className="header-icon">🔍</div>
        <div className="header-content">
          <h3 className="header-title">Nicht genau gefunden</h3>
          <p className="header-subtitle">
            Ich konnte "<strong>{searched}</strong>" nicht finden.
          </p>
        </div>
      </div>

      {/* KI Erklärung */}
      <div className="ai-explanation">
        <div className="ai-avatar">🤖</div>
        <div className="ai-bubble">
          <p className="ai-intro">
            <strong>Aber ich habe ähnliche Produkte gefunden!</strong>
          </p>
          {explanation && (
            <p className="ai-text">{explanation}</p>
          )}
          <p className="ai-honest">
            Ich zeige dir ehrlich die Vorteile UND Nachteile jeder Alternative.
          </p>
        </div>
      </div>

      {/* Alternativen Liste */}
      {alts.length > 0 && (
        <div className="alternatives-section">
          <h4 className="section-title">
            <span>💡</span>
            <span>Ähnliche Alternativen ({alts.length})</span>
          </h4>

          <div className="alternatives-list">
            {alts.map((alt, index) => (
              <div key={index} className="alternative-card">
                {/* Header */}
                <div className="alt-header">
                  <span className="alt-rank">#{index + 1}</span>
                  <div className="alt-info">
                    <h5 className="alt-name">{alt.name}</h5>
                    {alt.price && (
                      <span className="alt-price">{alt.price}</span>
                    )}
                  </div>
                  {alt.matchPercent && (
                    <span className="match-badge">{alt.matchPercent}% ähnlich</span>
                  )}
                </div>

                {/* Warum ähnlich */}
                {alt.whySimilar && (
                  <div className="why-similar">
                    <span className="similar-icon">🔗</span>
                    <span className="similar-text">{alt.whySimilar}</span>
                  </div>
                )}

                {/* Unterschiede */}
                {alt.differences && alt.differences.length > 0 && (
                  <div className="differences">
                    <span className="diff-label">Unterschiede:</span>
                    <ul>
                      {alt.differences.map((diff, i) => (
                        <li key={i}>{diff}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* VORTEILE */}
                {alt.advantages && alt.advantages.length > 0 && (
                  <div className="alt-section good">
                    <span className="section-label">👍 Vorteile:</span>
                    <ul>
                      {alt.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NACHTEILE */}
                {alt.disadvantages && alt.disadvantages.length > 0 && (
                  <div className="alt-section bad">
                    <span className="section-label">⚠️ Nachteile (ehrlich!):</span>
                    <ul>
                      {alt.disadvantages.map((dis, i) => (
                        <li key={i}>{dis}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* KI Fazit */}
                {alt.aiFazit && (
                  <div className="ai-fazit">
                    <span>🤖</span>
                    <span>{alt.aiFazit}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keine Alternativen */}
      {alts.length === 0 && (
        <div className="no-alternatives">
          <span>😔</span>
          <div>
            <strong>Leider keine ähnlichen Produkte gefunden.</strong>
            <p>Versuche es mit anderen Suchbegriffen.</p>
          </div>
        </div>
      )}

      {/* Lern-Hinweis */}
      <div className="learning-note">
        <span>🧠</span>
        <div>
          <strong>SYNORA lernt!</strong>
          <span>Deine Suche hilft mir, besser zu werden.</span>
        </div>
      </div>

      {/* Ehrlichkeits-Hinweis */}
      <div className="honesty-note">
        <span>⚖️</span>
        <span>SYNORA zeigt IMMER ehrlich Vorteile UND Nachteile!</span>
      </div>
    </div>
  );
};

export default SmartSuggestion;
