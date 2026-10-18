// ============================================
// SYNORA - Anmelden
// ============================================
// WAS AUS DER VORLAGE FEHLT
//
// "Mit Google anmelden" und "Mit Apple anmelden". Dein Backend
// kann das nicht - dort gibt es nur E-Mail und Passwort. Apple
// verlangt ausserdem ein Entwicklerkonto fuer 99 Dollar im Jahr.
//
// Entschieden am 04.10.2026: erst nach dem Start, ohne Zeitdruck.
// Die Knoepfe stehen hier bewusst NICHT als "kommt bald" - bei
// einem Anmeldeformular will man eines: sich anmelden. Zwei tote
// Knoepfe daneben helfen niemandem.
// ============================================

import { useState } from 'react';
import KontoGeruest, { Vorteile, Meldung } from '../bausteine/KontoGeruest';
import Feld from '../bausteine/Feld';
import Logo from '../bausteine/Logo';
import { useSprache } from '../texte/Sprache';
import { anfrage, tokenSetzen } from '../api';
import { PFADE, anmeldeDaten } from '../pfade';

export default function Anmelden() {
  const { t } = useSprache();
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [bleiben, setBleiben] = useState(true);
  const [fehler, setFehler] = useState('');
  const [laeuft, setLaeuft] = useState(false);

  async function absenden(e) {
    e.preventDefault();
    if (laeuft) return;

    setFehler('');
    setLaeuft(true);

    const r = await anfrage(PFADE.anmelden, {
      methode: 'POST',
      koerper: anmeldeDaten(email.trim(), passwort),
      mitToken: false
    });

    setLaeuft(false);

    if (!r.ok) {
      // ============================================
      // NICHT VERRATEN, WAS FALSCH WAR
      // ============================================
      // "Diese E-Mail gibt es nicht" sagt jedem, der es
      // ausprobiert, welche Adressen ein Konto bei SYNORA
      // haben. Damit kann man gezielt Passwoerter raten - und
      // Adresslisten verkaufen.
      //
      // Eine Ausnahme: Wenn der Server selbst bremst (429),
      // soll der Nutzer wissen, dass er nur warten muss.
      setFehler(r.status === 429 ? r.fehler : t('anmelden.fehlerAllgemein'));
      return;
    }

    const token = r.daten && (r.daten.token || r.daten.accessToken || r.daten.jwt);
    if (!token) {
      setFehler(t('anmelden.fehlerAllgemein'));
      return;
    }

    // Das Haekchen entscheidet, wo der Token liegt:
    // dauerhaft (localStorage) oder nur fuer diese Sitzung
    // (sessionStorage, weg beim Schliessen des Tabs).
    tokenSetzen(token, bleiben);
    window.location.href = '/chat';
  }

  return (
    <KontoGeruest
      obenKlein={t('anmelden.obenKlein')}
      titelTeil1={t('anmelden.titelTeil1')}
      titelHervor={t('anmelden.titelHervor')}
      untertitel={t('anmelden.untertitel')}
      links={<Vorteile eintraege={t('anmelden.vorteile')} />}
    >
      <div className="kg-karte-kopf">
        <Logo art="voll" groesse={34} />
        <h2>{t('anmelden.kartenTitel')}</h2>
        <p>{t('anmelden.kartenText')}</p>
      </div>

      <Meldung art="fehler" text={fehler} />

      <form onSubmit={absenden} noValidate>
        <Feld
          art="email"
          beschriftung={t('anmelden.email')}
          wert={email}
          setWert={setEmail}
          platzhalter="max@beispiel.ch"
          symbol="✉"
          autoComplete="email"
          pflicht
        />

        <Feld
          art="passwort"
          beschriftung={t('anmelden.passwort')}
          wert={passwort}
          setWert={setPasswort}
          platzhalter="••••••••"
          symbol="🔒"
          autoComplete="current-password"
          pflicht
        />

        <div className="kg-zeile">
          <label className="kg-haken">
            <input
              type="checkbox"
              checked={bleiben}
              onChange={(e) => setBleiben(e.target.checked)}
            />
            {t('anmelden.angemeldetBleiben')}
          </label>

          <a href="/passwort-vergessen" className="kg-link">
            {t('anmelden.passwortVergessen')}
          </a>
        </div>

        <button type="submit" className="kg-knopf" disabled={laeuft || !email || !passwort}>
          {laeuft ? t('allgemein.laedt') : t('anmelden.knopf')}
        </button>
      </form>

      <p className="kg-unten">
        {t('anmelden.nochKeinKonto')}{' '}
        <a href="/registrieren">{t('anmelden.jetztRegistrieren')}</a>
      </p>
    </KontoGeruest>
  );
}
