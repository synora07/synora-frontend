// ============================================
// SYNORA - Kopfzeile
// ============================================
// WAS AUS DER VORLAGE FEHLT UND WARUM
//
// Dort stehen "Shop" und "Deals (Neu)". Beides gibt es bei
// SYNORA nicht: SYNORA verkauft nichts und hat keine Deals.
// Ein Menuepunkt, der ins Leere fuehrt, kostet mehr Vertrauen
// als ein Menue mit vier statt sechs Eintraegen - besonders bei
// einer Seite, deren ganzes Versprechen Ehrlichkeit ist.
//
// Dafuer ist "Preisalarme" dazugekommen. Das gibt es wirklich,
// seit dem 04.10.2026, und es ist die Funktion, die Premium
// verkauft.
// ============================================

import { useEffect, useState } from 'react';
import Logo from './Logo';
import { useSprache } from '../texte/Sprache';
import { istAngemeldet, tokenSetzen } from '../api';
import './Kopfzeile.css';

export default function Kopfzeile({ aktiv = '' }) {
  const { t, sprache, spracheSetzen, verfuegbar } = useSprache();
  const [offen, setOffen] = useState(false);
  const [angemeldet, setAngemeldet] = useState(istAngemeldet());
  const [gescrollt, setGescrollt] = useState(false);

  // Die Kopfzeile bekommt beim Scrollen einen dunkleren Grund,
  // sonst verschwindet weisse Schrift ueber hellen Bildteilen.
  useEffect(() => {
    const beim = () => setGescrollt(window.scrollY > 12);
    beim();
    window.addEventListener('scroll', beim, { passive: true });
    return () => window.removeEventListener('scroll', beim);
  }, []);

  // Menue schliessen, wenn jemand Escape drueckt. Ohne das
  // bleibt es offen und man kommt mit der Tastatur nicht mehr
  // heraus.
  useEffect(() => {
    if (!offen) return;
    const beiTaste = (e) => { if (e.key === 'Escape') setOffen(false); };
    window.addEventListener('keydown', beiTaste);
    return () => window.removeEventListener('keydown', beiTaste);
  }, [offen]);

  // Solange das Menue offen ist, soll die Seite dahinter nicht
  // mitscrollen.
  useEffect(() => {
    if (!offen) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = vorher; };
  }, [offen]);

  const punkte = [
    { schluessel: 'assistent',  pfad: '/chat',        text: t('menue.assistent') },
    { schluessel: 'preisalarme', pfad: '/preisalarme', text: t('menue.preisalarme') },
    { schluessel: 'premium',    pfad: '/premium',     text: t('menue.premium') },
    { schluessel: 'ueberUns',   pfad: '/ueber-uns',   text: t('menue.ueberUns') }
  ];

  function abmelden() {
    tokenSetzen(null);
    setAngemeldet(false);
    window.location.href = '/';
  }

  return (
    <header className={`sy-kopf ${gescrollt ? 'sy-kopf-gescrollt' : ''}`}>
      <div className="sy-kopf-innen">

        <a href="/" className="sy-kopf-logo" aria-label="SYNORA Startseite">
          <Logo art="voll" groesse={38} />
        </a>

        {/* ---------- Menue ---------- */}
        <nav className="sy-kopf-menue" aria-label="Hauptmenü">
          {punkte.map((p) => (
            <a
              key={p.schluessel}
              href={p.pfad}
              className={aktiv === p.schluessel ? 'sy-kopf-aktiv' : ''}
              aria-current={aktiv === p.schluessel ? 'page' : undefined}
            >
              {p.text}
            </a>
          ))}
        </nav>

        {/* ---------- Rechts ---------- */}
        <div className="sy-kopf-rechts">

          {/* Sprache. Bei zwei Sprachen ist ein Umschalter
              ehrlicher als ein Klappmenue mit zwei Eintraegen. */}
          <div className="sy-sprache" role="group" aria-label="Sprache">
            {verfuegbar.map((s) => (
              <button
                key={s.kuerzel}
                onClick={() => spracheSetzen(s.kuerzel)}
                className={sprache === s.kuerzel ? 'sy-sprache-an' : ''}
                aria-pressed={sprache === s.kuerzel}
                title={s.name}
              >
                {s.kurz}
              </button>
            ))}
          </div>

          {angemeldet ? (
            <>
              {/* Hier stand ein Knopf "Preisalarme", der auf /konto
                  zeigte. Diese Seite gibt es nicht - wer angemeldet
                  war und daraufklickte, landete auf der Fehlerseite.
                  Gefunden am 07.10.2026 beim Durchsehen der
                  Chat-Seite.

                  Er ist ersatzlos weg: "Preisalarme" steht schon
                  links im Menue, und eine Kontoseite gibt es noch
                  nicht. Ein zweiter Knopf mit demselben Text waere
                  auch ohne den kaputten Link verwirrend. */}
              <button onClick={abmelden} className="sy-kopf-knopf-leer">
                {t('allgemein.abmelden')}
              </button>
            </>
          ) : (
            <>
              <a href="/anmelden" className="sy-kopf-knopf-leer">{t('allgemein.anmelden')}</a>
              <a href="/registrieren" className="sy-kopf-knopf-voll">
                {t('allgemein.kostenlosStarten')}
              </a>
            </>
          )}

          {/* ---------- Handy-Menue ---------- */}
          <button
            className="sy-kopf-burger"
            onClick={() => setOffen(!offen)}
            aria-label={offen ? 'Menü schliessen' : 'Menü öffnen'}
            aria-expanded={offen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ---------- Ausgeklapptes Menue ---------- */}
      {offen && (
        <div className="sy-kopf-klapp">
          <nav aria-label="Menü">
            {punkte.map((p) => (
              <a key={p.schluessel} href={p.pfad} onClick={() => setOffen(false)}>
                {p.text}
              </a>
            ))}
          </nav>
          {/* ============================================
              SPRACHE AUCH HIER
              ============================================
              In der Kopfzeile wird der Umschalter unter 430px
              ausgeblendet, damit die Zeile nicht bricht. Ohne
              diesen Block kaeme jemand auf einem schmalen Handy
              nie auf Englisch - die Sprache waere auf dem
              haeufigsten Geraet nicht erreichbar. */}
          <div className="sy-sprache sy-sprache-klapp" role="group" aria-label="Sprache">
            {verfuegbar.map((s) => (
              <button
                key={s.kuerzel}
                onClick={() => { spracheSetzen(s.kuerzel); setOffen(false); }}
                className={sprache === s.kuerzel ? 'sy-sprache-an' : ''}
                aria-pressed={sprache === s.kuerzel}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="sy-kopf-klapp-unten">
            {angemeldet ? (
              <button onClick={abmelden} className="sy-kopf-knopf-leer">
                {t('allgemein.abmelden')}
              </button>
            ) : (
              <>
                <a href="/anmelden" className="sy-kopf-knopf-leer">{t('allgemein.anmelden')}</a>
                <a href="/registrieren" className="sy-kopf-knopf-voll">
                  {t('allgemein.kostenlosStarten')}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
