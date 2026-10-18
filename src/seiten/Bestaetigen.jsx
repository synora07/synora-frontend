// ============================================
// SYNORA - E-Mail bestaetigen und Passwort zuruecksetzen
// ============================================
// GEFUNDEN am 05.10.2026 in deinem public/js/auth.js:
//
//   const verifyToken = urlParams.get('verify');
//   fetch(`https://api.synora.li/api/auth/verify/${verifyToken}`)
//
//   const resetToken  = urlParams.get('reset');
//
// Dein Backend verschickt nach der Registrierung eine Mail mit
// einem Link auf  synora.li/?verify=abc123  - und bei "Passwort
// vergessen" einen auf  synora.li/?reset=abc123
//
// In meinem Frontend passierte damit NICHTS. Wer sich ueber die
// neue Seite registriert haette, waere auf der Startseite
// gelandet und haette sein Konto nie freischalten koennen.
//
// Diese Datei schliesst beide Luecken. Sie wird von App.jsx
// aufgerufen, BEVOR ueber die normale Seite entschieden wird -
// der Token kann naemlich an JEDER Adresse haengen.
// ============================================

import { useEffect, useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import Feld from '../bausteine/Feld';
import { Meldung } from '../bausteine/KontoGeruest';
import { useSprache } from '../texte/Sprache';
import { anfrage } from '../api';
import { PFADE } from '../pfade';
import './Formularseite.css';

// ============================================
// Token aus der Adresse lesen
// ============================================
// Wird auch von App.jsx benutzt, um zu entscheiden, ob diese
// Seite ueberhaupt angezeigt werden muss.
export function tokenAusAdresse() {
  try {
    const p = new URLSearchParams(window.location.search);
    const bestaetigen = p.get('verify');
    const zuruecksetzen = p.get('reset');
    if (bestaetigen) return { art: 'bestaetigen', token: bestaetigen };
    if (zuruecksetzen) return { art: 'zuruecksetzen', token: zuruecksetzen };
  } catch (_) { /* kein window */ }
  return null;
}

// ============================================
// E-MAIL BESTAETIGEN
// ============================================
function EmailBestaetigen({ token }) {
  const { t } = useSprache();
  const [zustand, setZustand] = useState('laeuft');   // laeuft | ok | fehler
  const [grund, setGrund] = useState('');

  useEffect(() => {
    let weg = false;
    (async () => {
      // GET, nicht POST - der Token haengt am Pfad.
      // Abgeschrieben aus deinem auth.js, Zeile 18.
      const r = await anfrage(`${PFADE.bestaetigen}/${encodeURIComponent(token)}`, {
        mitToken: false
      });
      if (weg) return;

      if (r.ok) {
        setZustand('ok');
        // Die Adresse aufraeumen, damit ein Neuladen den Token
        // nicht noch einmal einloest.
        try { window.history.replaceState({}, '', '/'); } catch (_) { /* egal */ }
      } else {
        setZustand('fehler');
        setGrund(r.fehler || '');
      }
    })();
    return () => { weg = true; };
  }, [token]);

  return (
    <>
      <Kopfzeile />
      <main className="fs-seite fs-mitte">
        {zustand === 'laeuft' && (
          <>
            <p className="fs-gross">·</p>
            <h1>{t('bestaetigen.laeuft')}</h1>
            <p className="fs-unter">{t('bestaetigen.laeuftUnter')}</p>
          </>
        )}

        {zustand === 'ok' && (
          <>
            <p className="fs-gross">✓</p>
            <h1>{t('bestaetigen.okTitel')}</h1>
            <p className="fs-unter">{t('bestaetigen.okUnter')}</p>
            <div className="fs-knopfreihe">
              <a href="/anmelden" className="fs-knopf fs-knopf-link">{t('allgemein.anmelden')}</a>
            </div>
          </>
        )}

        {zustand === 'fehler' && (
          <>
            <h1>{t('bestaetigen.fehlerTitel')}</h1>
            {/* Haeufigster Grund: Der Link wurde schon einmal
                benutzt. Das ist kein Fehler des Nutzers, und er
                soll nicht raten muessen. */}
            <p className="fs-unter">{t('bestaetigen.fehlerUnter')}</p>
            {grund && <p className="fs-unter" style={{ fontSize: '0.85rem', opacity: 0.7 }}>{grund}</p>}
            <div className="fs-knopfreihe">
              <a href="/anmelden" className="fs-knopf fs-knopf-link">{t('allgemein.anmelden')}</a>
              <a href="/registrieren" className="fs-knopf-leer">{t('allgemein.registrieren')}</a>
            </div>
          </>
        )}
      </main>
      <Fusszeile />
    </>
  );
}

// ============================================
// NEUES PASSWORT SETZEN
// ============================================
function PasswortNeu({ token }) {
  const { t } = useSprache();
  const [passwort, setPasswort] = useState('');
  const [passwort2, setPasswort2] = useState('');
  const [fehler, setFehler] = useState('');
  const [feldFehler, setFeldFehler] = useState('');
  const [fertig, setFertig] = useState(false);
  const [laeuft, setLaeuft] = useState(false);

  async function absenden(e) {
    e.preventDefault();
    if (laeuft) return;

    setFehler('');
    setFeldFehler('');

    if (passwort !== passwort2) {
      setFeldFehler(t('registrieren.fehlerPasswoerter'));
      return;
    }
    if (passwort.length < 8) {
      setFeldFehler(t('registrieren.passwortHinweis'));
      return;
    }

    setLaeuft(true);

    // Mehrere Schreibweisen mitschicken: In deinem auth.js fehlt
    // die Funktion, die das Passwort wirklich setzt - dort steht
    // nur, dass ein Fenster geoeffnet wird. Welchen Feldnamen
    // dein Backend erwartet, konnte ich darum nicht nachlesen.
    //
    // Ein Feld zu viel wird ignoriert, ein fehlendes laesst den
    // Aufruf scheitern. Sobald du mir sagst, wie es heisst,
    // bleibt hier nur das richtige stehen.
    const r = await anfrage(PFADE.passwortNeu, {
      methode: 'POST',
      koerper: { token, password: passwort, newPassword: passwort, passwort },
      mitToken: false
    });

    setLaeuft(false);

    if (!r.ok) { setFehler(r.fehler); return; }

    setFertig(true);
    try { window.history.replaceState({}, '', '/'); } catch (_) { /* egal */ }
  }

  return (
    <>
      <Kopfzeile />
      <main className="fs-seite">
        <h1>{t('bestaetigen.neuTitel')}</h1>

        {fertig ? (
          <div className="fs-karte">
            <Meldung art="erfolg" text={t('bestaetigen.neuFertig')} />
            <a href="/anmelden" className="fs-knopf fs-knopf-link">{t('allgemein.anmelden')} →</a>
          </div>
        ) : (
          <>
            <p className="fs-unter">{t('bestaetigen.neuUnter')}</p>

            <div className="fs-karte">
              <Meldung art="fehler" text={fehler} />

              <form onSubmit={absenden} noValidate>
                <Feld
                  art="passwort"
                  beschriftung={t('registrieren.passwort')}
                  wert={passwort}
                  setWert={setPasswort}
                  platzhalter={t('registrieren.passwortHinweis')}
                  symbol="🔒"
                  autoComplete="new-password"
                  pflicht
                />

                <Feld
                  art="passwort"
                  beschriftung={t('registrieren.passwortWiederholen')}
                  wert={passwort2}
                  setWert={setPasswort2}
                  platzhalter={t('registrieren.passwortWiederholenHinweis')}
                  symbol="🔒"
                  autoComplete="new-password"
                  fehler={feldFehler}
                  pflicht
                />

                <button type="submit" className="fs-knopf"
                        disabled={laeuft || passwort.length < 8 || !passwort2}>
                  {laeuft ? t('allgemein.laedt') : t('allgemein.speichern')}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
      <Fusszeile />
    </>
  );
}

// ============================================
// Weiche
// ============================================
export default function Bestaetigen({ art, token }) {
  if (art === 'zuruecksetzen') return <PasswortNeu token={token} />;
  return <EmailBestaetigen token={token} />;
}
