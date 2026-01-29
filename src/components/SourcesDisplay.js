import React, { useState } from 'react';
import './SourcesDisplay.css';

const SourcesDisplay = ({ sources, limitations }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sourceList = sources || [];
  const limitationList = limitations || [];

  if (sourceList.length === 0) {
    return null;
  }

  return (
    <div className="sources-display">
      <div 
        className="sources-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="sources-title">
          <span className="sources-icon">📚</span>
          <span>WOHER KOMMEN UNSERE INFOS?</span>
        </div>
        <span className={`sources-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
      </div>

      {isExpanded && (
        <div className="sources-content">
          <p className="sources-intro">
            100% transparent - alle unsere Quellen:
          </p>

          <div className="sources-table">
            <div className="table-header">
              <span>Information</span>
              <span>Quelle</span>
              <span>Aktualisiert</span>
            </div>

            {sourceList.map((source, index) => (
              <div key={index} className="table-row">
                <span className="info-type">{source.type}</span>
                <span className="info-source">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.source} →
                    </a>
                  ) : (
                    source.source
                  )}
                </span>
                <span className="info-updated">{source.updated}</span>
              </div>
            ))}
          </div>

          {limitationList.length > 0 && (
            <div className="limitations">
              <h5>⚠️ WAS WIR NICHT WISSEN:</h5>
              <ul>
                {limitationList.map((limit, index) => (
                  <li key={index}>{limit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="transparency-note">
            <span>⚖️</span>
            <div>
              <strong>100% TRANSPARENT</strong>
              <span>Du kannst alle Quellen selbst prüfen. Wir verstecken nichts!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesDisplay;
