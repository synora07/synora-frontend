// ============================================
// SYNORA - Feedback
// ============================================
// Aus deinen Notizen: "SYNORA soll aus Fehlern lernen. Wenn ein
// Kunde eine falsche Empfehlung meldet, soll SYNORA das
// anerkennen und den Fehler bei anderen Kunden nicht
// wiederholen."
//
// Diese Seite ist der Anfang davon: der Weg hinein. Was mit den
// Meldungen passiert, entscheidest du im Dashboard.
// ============================================

import { useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import { Meldung } from '../bausteine/KontoGeruest';
import { useSprache } from '../texte/Sprache';
import { anfrage } from '../api';
import { PFADE } from '../pfade';
import './Formularseite.css';

export default function Feedback() {
  const { t } = useSprache();
  const [art, setArt] = useState('falschesProdukt');
  const [nachricht, setNachricht] = useState('');
  const [fehler, setFehler] = useState('');
  const [fertig, setFertig] = useState(false);
  const [laeuft, setLaeuft] = useState(false);

  const arten = t('feedback.art');

  async function absenden(e) {
    e.preventDefault();
    if (laeuft || !nachricht.trim()) return;

    setFehler('');
    setLaeuft(true);

    const r = await anfrage(PFADE.feedback, {
      methode: 'POST',
      koerper: {
        art,
        nachricht: nachricht.trim(),
        // Hilft beim Nachvollziehen, ohne jemanden zu
        // identifizieren.
        seite: typeof window !== 'undefined' ? window.location.pathname : ''
      }
    });

    setLaeuft(false);
    if (!r.ok) { setFehler(r.fehler); return; }
    setFertig(true);
  }

  return (
    <>
      <Kopfzeile />
      <main className="fs-seite">
        <h1>{t('feedback.titel')}</h1>
        <p className="fs-unter">{t('feedback.untertitel')}</p>

        <div className="fs-karte">
          {fertig ? (
            <Meldung art="erfolg" text={t('feedback.gesendet')} />
          ) : (
            <>
              <Meldung art="fehler" text={fehler} />
              <form onSubmit={absenden}>
                <fieldset className="fs-wahl">
                  <legend>{t('feedback.titel')}</legend>
                  {Object.entries(arten).map(([schluessel, text]) => (
                    <label key={schluessel} className={art === schluessel ? 'fs-wahl-an' : ''}>
                      <input type="radio" name="art" value={schluessel}
                             checked={art === schluessel}
                             onChange={() => setArt(schluessel)} />
                      {text}
                    </label>
                  ))}
                </fieldset>

                <label className="fs-label" htmlFor="fb-text">{t('feedback.nachricht')}</label>
                <textarea id="fb-text" className="fs-textfeld" rows={6}
                          value={nachricht} onChange={(e) => setNachricht(e.target.value)}
                          maxLength={2000} />
                <p className="fs-zaehler">{nachricht.length} / 2000</p>

                <button type="submit" className="fs-knopf" disabled={laeuft || !nachricht.trim()}>
                  {laeuft ? t('allgemein.laedt') : t('feedback.knopf')}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Fusszeile />
    </>
  );
}
