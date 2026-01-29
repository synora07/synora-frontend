import React, { useState } from 'react';
import './VersionSelector.css';

const VersionSelector = ({ onVersionChange, currentVersion }) => {
  const [selectedVersion, setSelectedVersion] = useState(currentVersion || '2.0');
  const [isOpen, setIsOpen] = useState(false);

  const versions = [
    { 
      id: '1.0', 
      name: 'SYNORA 1.0', 
      description: 'Basis-Version',
      badge: null
    },
    { 
      id: '2.0', 
      name: 'SYNORA 2.0', 
      description: 'Volle Transparenz + Alle Features',
      badge: 'NEU'
    }
  ];

  const handleSelect = (version) => {
    setSelectedVersion(version.id);
    setIsOpen(false);
    if (onVersionChange) {
      onVersionChange(version.id);
    }
  };

  const currentVersionData = versions.find(v => v.id === selectedVersion);

  return (
    <div className="synora-version-selector">
      <div 
        className="version-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="version-label">Modell:</span>
        <span className="version-name">{currentVersionData?.name}</span>
        {currentVersionData?.badge && (
          <span className="version-badge">{currentVersionData.badge}</span>
        )}
        <span className={`version-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="version-dropdown">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`version-option ${selectedVersion === version.id ? 'selected' : ''}`}
              onClick={() => handleSelect(version)}
            >
              <div className="version-radio">
                {selectedVersion === version.id ? '●' : '○'}
              </div>
              <div className="version-info">
                <div className="version-header">
                  <span className="version-opt-name">{version.name}</span>
                  {version.badge && (
                    <span className="version-opt-badge">{version.badge}</span>
                  )}
                </div>
                <span className="version-desc">{version.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSelector;
