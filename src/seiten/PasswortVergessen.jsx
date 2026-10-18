// ============================================
// SYNORA - Passwort vergessen
// ============================================
// DIE WICHTIGSTE ENTSCHEIDUNG AUF DIESER SEITE
//
// Die Antwort ist IMMER dieselbe - egal ob es zu der Adresse ein
// Konto gibt oder nicht:
//
//   "Wenn es zu dieser Adresse ein Konto gibt, ist der Link
//    unterwegs."
//
// Stuende dort "Diese Adresse kennen wir nicht", koennte jeder
// durchprobieren, wer bei SYNORA ein Konto hat. Daraus werden
// Adresslisten, und mit Adresslisten wird gehandelt.
//
// Das gilt auch bei einem Fehler vom Server: Wir zeigen die
// Erfolgsmeldung trotzdem. Ein Nutzer, der keine Mail bekommt,
// versucht es nochmal. Ein Angreifer, der aus der Fehlermeldung
// lesen kann, welche Adressen existieren, hoert nicht mehr auf.
// ============================================

import { useState } from 'react';
import KontoGeruest, { Meldung } from '../bausteine/KontoGeruest';
import Feld from '../bausteine/Feld';
import { useSprache } from '../texte/Sprache';
import { anfrage } from '../api';
import { PFADE } from '../pfade';
import './PasswortVergessen.css';

export default function PasswortVergessen() {
  const { t } = useSprache();
  const [email, setEmail] = useState('');
  const [gesendet, setGesendet] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [bremse, setBremse] = useState('');

  async function absenden(e) {
    e.preventDefault();
    if (laeuft) return;

    setBremse('');
    setLaeuft(true);

    const r = await anfrage(PFADE.passwortVergessen, {
      methode: 'POST',
      koerper: { email: email.trim() },
      mitToken: false
    });

    setLaeuft(false);

    // 429 ist die einzige Ausnahme: Der Nutzer soll erfahren,
    // dass er nur warten muss. Das verraet nichts darueber, ob
    // die Adresse existiert.
    if (!r.ok && r.status === 429) {
      setBremse(r.fehler);
      return;
    }

    // Alles andere - Erfolg, Fehler, Adresse unbekannt - fuehrt
    // zur selben Anzeige. Siehe Kommentar oben.
    setGesendet(true);
  }

  const hinweise = (
    <ul className="pv-hinweise">
      {t('passwortVergessen.hinweise').map((h) => (
        <li key={h.titel}>
          <strong>{h.titel}</strong>
          <span>{h.text}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <KontoGeruest
      titelTeil1={t('passwortVergessen.titelTeil1')}
      titelHervor={t('passwortVergessen.titelHervor')}
      untertitel={t('passwortVergessen.untertitel')}
      links={hinweise}
    >
      <div className="pv-schloss" aria-hidden="true">🔒</div>

      {gesendet ? (
        <>
          <Meldung art="erfolg" text={t('passwortVergessen.gesendet')} />
          <a href="/anmelden" className="kg-knopf pv-knopf-link">
            ← {t('passwortVergessen.zurueck')}
          </a>
        </>
      ) : (
        <>
          <Meldung art="fehler" text={bremse} />

          <form onSubmit={absenden} noValidate>
            <Feld
              art="email"
              beschriftung={t('passwortVergessen.email')}
              wert={email}
              setWert={setEmail}
              platzhalter="max@beispiel.ch"
              symbol="✉"
              autoComplete="email"
              pflicht
            />

            <button type="submit" className="kg-knopf" disabled={laeuft || !email}>
              {laeuft ? t('allgemein.laedt') : t('passwortVergessen.knopf')}
            </button>
          </form>

          <p className="kg-unten">
            <a href="/anmelden">← {t('passwortVergessen.zurueck')}</a>
          </p>
        </>
      )}
    </KontoGeruest>
  );
}
