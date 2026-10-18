// ============================================
// SYNORA - Registrieren
// ============================================
// WAS AUS DER VORLAGE FEHLT: DAS GEBURTSDATUM
//
// In deiner Vorlage wird eines abgefragt. Hier nicht, aus zwei
// Gruenden:
//
// 1. SYNORA braucht es fuer nichts. Nach Schweizer DSG und der
//    DSGVO gilt Datensparsamkeit - erhoben wird, was fuer den
//    Zweck noetig ist. Ein Geburtsdatum ist fuer eine
//    Produktempfehlung nicht noetig.
//
// 2. Jedes zusaetzliche Pflichtfeld kostet Anmeldungen. Bei
//    einem Produkt, das noch niemand kennt, ist das der
//    teuerste Platz fuer eine Angabe, die man nicht braucht.
//
// Brauchst du es spaeter doch (etwa fuer eine Altersfreigabe),
// ist es ein Feld mehr - aber dann mit einem Grund.
// ============================================

import { useState, useEffect } from 'react';
import KontoGeruest, { Vorteile, Meldung } from '../bausteine/KontoGeruest';
import Feld from '../bausteine/Feld';
import { useSprache } from '../texte/Sprache';
import { anfrage, tokenSetzen, einstellungenHolen } from '../api';
import { PFADE, registrierDaten } from '../pfade';
import './Registrieren.css';

// ============================================
// Wie stark ist das Passwort?
// ============================================
// Bewusst einfach: Laenge zaehlt am meisten, danach Vielfalt.
// Keine Regel wie "mindestens ein Sonderzeichen" - solche Regeln
// fuehren zu "Passwort1!" und machen Passwoerter schlechter,
// nicht besser. Das sagt auch das NIST seit Jahren.
function staerkeVon(p) {
  if (!p || p.length < 8) return 0;
  let punkte = 1;
  if (p.length >= 12) punkte++;
  if (p.length >= 16) punkte++;
  const arten = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) => r.test(p)).length;
  if (arten >= 3) punkte++;
  return Math.min(punkte, 4);
}

export default function Registrieren() {
  const { t } = useSprache();
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [passwort2, setPasswort2] = useState('');
  const [geburtsdatum, setGeburtsdatum] = useState('');
  const [bedingungen, setBedingungen] = useState(false);
  const [fehler, setFehler] = useState('');
  const [feldFehler, setFeldFehler] = useState({});
  const [laeuft, setLaeuft] = useState(false);
  const [gratisZahl, setGratisZahl] = useState(null);

  // Die Zahl in "5 Suchen im Monat" kommt aus dem Backend.
  useEffect(() => {
    let weg = false;
    (async () => {
      const r = await einstellungenHolen();
      if (weg || !r.ok) return;
      const g = r.daten?.stufen?.find((s) => s.schluessel === 'gratis');
      if (g && !g.suchen.unbegrenzt) setGratisZahl(g.suchen.anzahl);
    })();
    return () => { weg = true; };
  }, []);

  const staerke = staerkeVon(passwort);
  const staerkeTexte = t('registrieren.staerke');

  async function absenden(e) {
    e.preventDefault();
    if (laeuft) return;

    setFehler('');
    setFeldFehler({});

    if (passwort !== passwort2) {
      setFeldFehler({ passwort2: t('registrieren.fehlerPasswoerter') });
      return;
    }
    if (!bedingungen) {
      setFehler(t('registrieren.fehlerBedingungen'));
      return;
    }

    setLaeuft(true);
    const r = await anfrage(PFADE.registrieren, {
      methode: 'POST',
      koerper: registrierDaten({ vorname: vorname.trim(), nachname: nachname.trim(), email: email.trim(), passwort, geburtsdatum }),
      mitToken: false
    });
    setLaeuft(false);

    if (!r.ok) {
      // Hier darf der Grund gezeigt werden: Das Backend sagt
      // etwa "Passwort zu kurz" oder "Adresse schon vergeben",
      // und beides muss der Nutzer wissen, um weiterzukommen.
      setFehler(r.fehler || t('registrieren.fehlerAllgemein'));
      return;
    }

    // Manche Backends melden sich gleich mit an und schicken
    // einen Token, andere nicht. Beides ist in Ordnung.
    const token = r.daten && (r.daten.token || r.daten.accessToken || r.daten.jwt);
    if (token) {
      tokenSetzen(token, true);
      window.location.href = '/chat';
    } else {
      window.location.href = '/anmelden';
    }
  }

  // Die erste Vorteilszeile traegt die Zahl aus dem Backend.
  // Fehlt sie noch, bleibt die Zeile weg statt mit einer
  // geratenen Zahl dazustehen.
  const vorteile = t('registrieren.vorteile')
    .map((v, i) => (i === 0
      ? (gratisZahl === null ? null : { ...v, titel: t('registrieren.vorteile')[0].titel.replace('{zahl}', gratisZahl) })
      : v))
    .filter(Boolean);

  return (
    <KontoGeruest
      kartenBreit
      titelTeil1={t('registrieren.titelTeil1')}
      titelHervor={t('registrieren.titelHervor')}
      untertitel={t('registrieren.untertitel')}
      links={<Vorteile eintraege={vorteile} />}
    >
      <div className="kg-karte-kopf" style={{ textAlign: 'left' }}>
        <h2 style={{ marginTop: 0 }}>{t('registrieren.kartenTitel')}</h2>
        <p>{t('registrieren.kartenText')}</p>
      </div>

      <Meldung art="fehler" text={fehler} />

      <form onSubmit={absenden} noValidate>
        <div className="kg-paar">
          <Feld
            beschriftung={t('registrieren.vorname')}
            wert={vorname}
            setWert={setVorname}
            platzhalter="Max"
            symbol="👤"
            autoComplete="given-name"
          />
          <Feld
            beschriftung={t('registrieren.nachname')}
            wert={nachname}
            setWert={setNachname}
            platzhalter="Muster"
            symbol="👤"
            autoComplete="family-name"
          />
        </div>

        {/* ============================================
            GEBURTSDATUM - WIEDER DRIN
            ============================================
            Ich hatte dieses Feld zuerst weggelassen: Nach
            Schweizer DSG und DSGVO gilt Datensparsamkeit, und
            fuer eine Produktempfehlung braucht es kein
            Geburtsdatum. Jedes Pflichtfeld kostet ausserdem
            Anmeldungen.

            Dann habe ich dein public/js/auth.js gelesen. Dein
            Backend erwartet birthdate bei der Registrierung.
            Das Argument bleibt richtig - aber zwei Wochen vor
            Code-Freeze am Backend zu schrauben ist das groessere
            Risiko.

            Willst du es spaeter weglassen, ist es hier ein Block
            und im Backend eine Pruefung weniger. */}
        <Feld
          art="date"
          beschriftung={t('registrieren.geburtsdatum')}
          wert={geburtsdatum}
          setWert={setGeburtsdatum}
          symbol="📅"
          autoComplete="bday"
          max={new Date().toISOString().slice(0, 10)}
          pflicht
        />

        <Feld
          art="email"
          beschriftung={t('registrieren.email')}
          wert={email}
          setWert={setEmail}
          platzhalter="max@beispiel.ch"
          symbol="✉"
          autoComplete="email"
          pflicht
        />

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

        {/* Balken nur zeigen, wenn schon getippt wurde - sonst
            steht beim Oeffnen der Seite "Zu kurz" da, was wie
            ein Vorwurf wirkt, bevor man angefangen hat. */}
        {passwort.length > 0 && (
          <div className="rg-staerke">
            <div className="rg-staerke-balken" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={i < staerke ? `rg-an rg-stufe-${staerke}` : ''} />
              ))}
            </div>
            <span className="rg-staerke-text">
              {t('registrieren.passwortStaerke')}: <strong>{staerkeTexte[staerke]}</strong>
            </span>
          </div>
        )}

        <Feld
          art="passwort"
          beschriftung={t('registrieren.passwortWiederholen')}
          wert={passwort2}
          setWert={setPasswort2}
          platzhalter={t('registrieren.passwortWiederholenHinweis')}
          symbol="🔒"
          autoComplete="new-password"
          fehler={feldFehler.passwort2 || ''}
          pflicht
        />

        <label className="kg-haken" style={{ marginBottom: 18 }}>
          <input
            type="checkbox"
            checked={bedingungen}
            onChange={(e) => setBedingungen(e.target.checked)}
          />
          <span>
            {t('registrieren.bedingungenTeil1')}{' '}
            <a href="/nutzungsbedingungen" target="_blank" rel="noreferrer">
              {t('registrieren.nutzungsbedingungen')}
            </a>{' '}
            {t('registrieren.bedingungenUnd')}{' '}
            <a href="/datenschutz" target="_blank" rel="noreferrer">
              {t('registrieren.datenschutz')}
            </a>.
          </span>
        </label>

        <button
          type="submit"
          className="kg-knopf"
          disabled={laeuft || !email || !geburtsdatum || passwort.length < 8 || !passwort2}
        >
          {laeuft ? t('allgemein.laedt') : t('registrieren.knopf')}
        </button>
      </form>

      <p className="kg-unten">
        {t('registrieren.schonKonto')}{' '}
        <a href="/anmelden">{t('registrieren.jetztAnmelden')}</a>
      </p>
    </KontoGeruest>
  );
}
