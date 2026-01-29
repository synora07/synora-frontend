import React, { useState } from 'react';
import './ProblemHelper.css';

const ProblemHelper = ({ productName, shopName, onProblemSelect }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const product = productName || 'Produkt';
  const shop = shopName || 'Shop';

  const problems = [
    { id: 'damaged', icon: '📦', label: 'Kaputt angekommen' },
    { id: 'late', icon: '⏰', label: 'Zu spät geliefert' },
    { id: 'wrong', icon: '❌', label: 'Falsches Produkt' },
    { id: 'different', icon: '🤥', label: 'Anders als beschrieben' },
    { id: 'other', icon: '💬', label: 'Anderes Problem' }
  ];

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setShowHelp(true);
    
    if (onProblemSelect) {
      onProblemSelect(problem);
    }
  };

  return (
    <div className="problem-helper">
      <div className="helper-header">
        <span className="helper-icon">😔</span>
        <span className="helper-title">Das tut mir leid!</span>
      </div>

      <div className="helper-content">
        <p className="helper-intro">
          <strong>SYNORA steht auf DEINER Seite!</strong><br/>
          Ich helfe dir das Problem zu lösen.
        </p>

        {!showHelp && (
          <>
            <p className="problem-question">Was war das Problem?</p>
            
            <div className="problem-buttons">
              {problems.map((problem) => (
                <button
                  key={problem.id}
                  className={`problem-btn ${selectedProblem?.id === problem.id ? 'selected' : ''}`}
                  onClick={() => handleProblemSelect(problem)}
                >
                  <span className="problem-icon">{problem.icon}</span>
                  <span className="problem-label">{problem.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {showHelp && selectedProblem && (
          <div className="help-section">
            <h4 className="help-title">
              So kann ich dir helfen:
            </h4>
            
            <div className="help-options">
              <div className="help-option">
                <span className="option-icon">✍️</span>
                <div className="option-content">
                  <strong>Beschwerde-Text schreiben</strong>
                  <span>Ich schreibe einen professionellen Text für dich</span>
                </div>
              </div>
              
              <div className="help-option">
                <span className="option-icon">⚖️</span>
                <div className="option-content">
                  <strong>Deine Rechte erklären</strong>
                  <span>Was du verlangen kannst (Schweizer Recht)</span>
                </div>
              </div>
              
              <div className="help-option">
                <span className="option-icon">📞</span>
                <div className="option-content">
                  <strong>Kontakt zum Shop</strong>
                  <span>Ich finde die richtige Kontakt-Adresse</span>
                </div>
              </div>
              
              <div className="help-option">
                <span className="option-icon">🔄</span>
                <div className="option-content">
                  <strong>Alternative finden</strong>
                  <span>Ein anderes Produkt das besser passt</span>
                </div>
              </div>
            </div>

            <button 
              className="back-btn"
              onClick={() => setShowHelp(false)}
            >
              ← Zurück zur Auswahl
            </button>
          </div>
        )}

        <div className="support-note">
          <span>💪</span>
          <span>Du bist NICHT allein! SYNORA hilft dir.</span>
        </div>
      </div>
    </div>
  );
};

export default ProblemHelper;
