// ============================================
// SYNORA - TRUST MESSAGES
// Feature 12: Die 7 Vertrauens-Versprechen
// Basiert auf den 7 wichtigsten Dingen für Vertrauen
// ============================================

import React, { useState } from 'react';
import './TrustMessages.css';

const TrustMessages = ({ showFull, variant }) => {
  const [isExpanded, setIsExpanded] = useState(showFull || false);

  // Die 7 Vertrauens-Versprechen
  const promises = [
    {
      icon: "💬",
      title: "Ich bin ehrlich",
      text: "Auch wenn es weh tut. Ich sage dir die Wahrheit.",
      example: "\"Das ist nicht die beste Wahl für dich\""
    },
    {
      icon: "🔍",
      title: "Ich bin transparent",
      text: "Du siehst genau wie ich zu meiner Empfehlung komme.",
      example: "Quellen, Preisvergleiche, Bewertungen - alles offen"
    },
    {
      icon: "📊",
      title: "Ich zeige Beweise",
      text: "Nicht nur reden - ich zeige dir Fakten und Vergleiche.",
      example: "3 KIs haben abgestimmt, echte Daten, keine Fake-Bewertungen"
    },
    {
      icon: "⚖️",
      title: "Ich bin konsistent",
      text: "Immer die gleiche Logik, gleiche Werte, gleiche Qualität.",
      example: "Heute, morgen, immer - du kannst dich auf mich verlassen"
    },
    {
      icon: "❤️",
      title: "Ich bin FÜR DICH",
      text: "Nicht für Shops, nicht für Geld - für DICH.",
      example: "Ich empfehle das Passende, nicht das Teuerste"
    },
    {
      icon: "🙋",
      title: "Ich gebe Fehler zu",
      text: "Wenn ich falsch liege, sage ich es dir.",
      example: "\"Das weiss ich nicht\" oder \"Hier lag ich falsch\""
    },
    {
      icon: "🤝",
      title: "Ich baue Vertrauen über Zeit",
      text: "Keine leeren Versprechen. Echte Erfahrungen zählen.",
      example: "Frag mich nach deinem Kauf - war ich hilfreich?"
    }
  ];

  // Mini Version
  if (variant === 'mini') {
    return (
      <div className="trust-mini">
        <span className="trust-mini-icon">🤝</span>
        <span className="trust-mini-text">Ehrlicher Berater, kein Verkäufer</span>
      </div>
    );
  }

  // Header Version
  if (variant === 'header') {
    return (
      <div className="trust-header-bar">
        <span>✅ Ehrlich</span>
        <span>✅ Transparent</span>
        <span>✅ Für DICH</span>
      </div>
    );
  }

  // Volle Version
  return (
    <div className="trust-messages">
      {/* Header */}
      <div
        className="trust-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="trust-title">
          <span className="trust-icon">🤝</span>
          <span>SYNORA VERSPRECHEN</span>
        </div>
        <span className={`trust-arrow ${isExpanded ? 'open' : ''}`}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Intro */}
      <div className="trust-intro">
        <p>Ich bin dein <strong>ehrlicher Berater</strong>, nicht ein Verkäufer.</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="trust-content">
          {/* Die 7 Versprechen */}
          <div className="promises-list">
            {promises.map((promise, index) => (
              <div key={index} className="promise-card">
                <div className="promise-header">
                  <span className="promise-icon">{promise.icon}</span>
                  <span className="promise-title">{promise.title}</span>
                </div>
                <p className="promise-text">{promise.text}</p>
                <p className="promise-example">
                  <span className="example-label">Beispiel:</span> {promise.example}
                </p>
              </div>
            ))}
          </div>

          {/* Was SYNORA NICHT ist */}
          <div className="trust-not">
            <h4>❌ SYNORA ist NIEMALS:</h4>
            <ul>
              <li>Eine Verkaufsmaschine</li>
              <li>Manipulierend</li>
              <li>Mit versteckten Interessen</li>
            </ul>
          </div>

          {/* Was SYNORA IST */}
          <div className="trust-is">
            <h4>✅ SYNORA ist IMMER:</h4>
            <ul>
              <li>Ehrlicher Berater</li>
              <li>Transparenter Helfer</li>
              <li>Neutraler Entscheider</li>
              <li>Auf DEINER Seite</li>
            </ul>
          </div>

          {/* Zitat */}
          <div className="trust-quote">
            <span className="quote-icon">💬</span>
            <p>„Vertrauen entsteht nicht durch Worte, sondern durch wiederholte gute Erfahrungen."</p>
          </div>

          {/* Feedback */}
          <div className="trust-feedback">
            <span>📝</span>
            <div>
              <strong>War ich hilfreich?</strong>
              <p>Sag mir ehrlich wenn etwas nicht passt - ich lerne davon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustMessages;
