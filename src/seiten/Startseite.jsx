// ============================================
// SYNORA - Startseite
// ============================================
// Design nach deiner Vorlage. Zwei Dinge sind anders, und beide
// mit Absicht:
//
// 1. DIE ZAHLEN KOMMEN AUS DEM BACKEND
//    In der Vorlage standen "3 kostenlose Suchen ohne Anmeldung"
//    und "Unbegrenzt mit Account". Dein Backend erlaubt null
//    ohne Konto und fuenf mit Konto. Zwei falsche Zahlen auf der
//    wichtigsten Seite der Firma.
//    Jetzt kommen sie aus GET /api/einstellungen - aus derselben
//    Stelle, die sie auch durchsetzt. Sie koennen nicht mehr
//    auseinanderlaufen.
//
// 2. RECHTS STEHT KEIN PRODUKTBILD, SONDERN EINE ECHTE KARTE
//    Die Vorlage zeigt dort eine Montage aus Geraeten. Schoen,
//    aber austauschbar - so sieht jeder Elektronikhaendler aus.
//    Hier steht stattdessen, was SYNORA von Google Shopping
//    unterscheidet: eine Produktkarte mit Haken UND Kreuzen.
//    Der Nachteil ist das Verkaufsargument, also gehoert er
//    nach vorn.
// ============================================

import { useEffect, useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import { useSprache } from '../texte/Sprache';
import { einstellungenHolen } from '../api';
import Erscheinen from '../bausteine/Erscheinen';
import './Startseite.css';

function Haken() {
  return <span className="st-haken" aria-hidden="true">✓</span>;
}
function Kreuz() {
  return <span className="st-kreuz" aria-hidden="true">✕</span>;
}

// Punktzahl des Beispiels. Eine Zahl braucht keine Uebersetzung,
// darum steht sie hier und nicht in den Sprachdateien.
const BEISPIEL_PUNKTE = 92;

export default function Startseite() {
  const { t } = useSprache();
  const [frage, setFrage] = useState('');
  const [zahlen, setZahlen] = useState(null);

  useEffect(() => {
    let weg = false;
    (async () => {
      const r = await einstellungenHolen();
      if (!weg && r.ok && r.daten) setZahlen(r.daten);
    })();
    return () => { weg = true; };
  }, []);

  function suchen(e) {
    e.preventDefault();
    const text = frage.trim();
    if (!text) return;
    // Die Suche selbst passiert im Chat. Die Frage wandert als
    // Parameter mit, damit der Nutzer sie nicht nochmal tippt.
    window.location.href = `/chat?frage=${encodeURIComponent(text)}`;
  }

  // ============================================
  // SOLANGE DIE ZAHLEN FEHLEN, STEHT DA KEINE
  // ============================================
  // Kein Ersatzwert, kein "ca. 5". Eine erfundene Zahl auf der
  // Startseite ist genau der Fehler, den diese Seite vermeiden
  // soll. Bis die Antwort da ist, bleibt die Kachel leer - das
  // dauert Millisekunden.
  const gratisStufe = zahlen?.stufen?.find((s) => s.schluessel === 'gratis');
  const premiumStufe = zahlen?.stufen?.find((s) => s.schluessel === 'premium');

  const kacheln = [
    gratisStufe && {
      schluessel: 'gratis',
      titel: t('start.kacheln.gratis.titel', { zahl: gratisStufe.suchen.anzahl }),
      text: t('start.kacheln.gratis.text')
    },
    premiumStufe && {
      schluessel: 'premium',
      titel: t('start.kacheln.premium.titel', {
        zahl: premiumStufe.suchen.unbegrenzt ? '∞' : premiumStufe.suchen.anzahl
      }),
      text: t('start.kacheln.premium.text', { preis: premiumStufe.preisMonat })
    },
    {
      schluessel: 'ehrlich',
      titel: t('start.kacheln.ehrlich.titel'),
      text: t('start.kacheln.ehrlich.text')
    }
  ].filter(Boolean);

  return (
    <>
      <Kopfzeile />

      <main className="st-seite">

        {/* ==========================================
            OBEN
            ========================================== */}
        <section className="st-oben">
          <div className="st-oben-text">
            <p className="st-ueberschrift">{t('start.ueberschriftOben')}</p>

            <h1 className="st-titel">
              {t('start.titelTeil1')}{' '}
              <span className="st-hervor">{t('start.titelHervor1')}</span>
              <br />
              {t('start.titelTeil2')}{' '}
              <span className="st-hervor">{t('start.titelHervor2')}</span>
            </h1>

            <p className="st-untertitel">{t('start.untertitel')}</p>

            {/* ---------- Suchfeld ---------- */}
            <form className="st-suche" onSubmit={suchen}>
              <span className="st-suche-stern" aria-hidden="true">✦</span>
              <input
                type="text"
                value={frage}
                onChange={(e) => setFrage(e.target.value)}
                placeholder={t('start.sucheBeispiel')}
                aria-label={t('start.sucheBeispiel')}
              />
              <button type="submit" aria-label={t('allgemein.weiter')}>→</button>
            </form>

            <div className="st-beispiele">
              {t('start.beispiele').map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => { window.location.href = `/chat?frage=${encodeURIComponent(b)}`; }}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="st-knoepfe">
              <a href="/registrieren" className="st-knopf-voll">
                {t('allgemein.kostenlosStarten')} →
              </a>
              <a href="/premium" className="st-knopf-leer">{t('menue.premium')}</a>
            </div>

            {/* ---------- Die drei Kacheln ---------- */}
            <div className="st-kacheln">
              {kacheln.map((k) => (
                <div key={k.schluessel} className="st-kachel">
                  <strong>{k.titel}</strong>
                  <span>{k.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ==========================================
              RECHTS: DIE PRODUKTKARTE
              ========================================== */}
          <div className="st-oben-bild" aria-hidden="false">
            <div className="st-karte">
              <div className="st-karte-kopf">
                <span className="st-karte-marke">SYNORA</span>
                <span className="st-karte-punkte">{BEISPIEL_PUNKTE}<small>/100</small></span>
              </div>

              <div className="st-karte-bild" aria-hidden="true">
                {/* Kein Produktfoto: Wir haetten keines, das wir
                    zeigen duerfen, und ein fremdes Markenbild auf
                    der Startseite waere ein Rechtsproblem. */}
                <svg viewBox="0 0 120 120" width="88" height="88" role="img" aria-label="">
                  <circle cx="38" cy="66" r="20" fill="none" stroke="currentColor" strokeWidth="7" />
                  <circle cx="82" cy="66" r="20" fill="none" stroke="currentColor" strokeWidth="7" />
                  <path d="M22 66 A38 38 0 0 1 98 66" fill="none" stroke="currentColor"
                        strokeWidth="7" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="st-karte-name">{t('start.beispiel.name')}</h3>
              <div className="st-karte-preis">
                {t('start.beispiel.preis')}
                <span className="st-karte-shop">
                  {t('start.beispiel.beiShop', { shop: t('start.beispiel.shop') })}
                </span>
              </div>

              <ul className="st-karte-liste">
                {t('start.beispiel.dafuer').map((d) => (
                  <li key={d}><Haken />{d}</li>
                ))}
                {t('start.beispiel.dagegen').map((d) => (
                  <li key={d} className="st-gegen"><Kreuz />{d}</li>
                ))}
              </ul>

              {/* Kennzeichnung. Ohne sie waere das hier eine
                  erfundene Empfehlung mit erfundenem Preis. */}
              <p className="st-karte-hinweis">{t('start.beispiel.hinweis')}</p>
            </div>
          </div>
        </section>

        {/* ==========================================
            DIE DREI VERSPRECHEN
            ========================================== */}
        <Erscheinen als="section" className="st-versprechen">
          {t('start.versprechen').map((v, i) => (
            <Erscheinen als="article" key={v.titel} verzoegerung={i * 90}>
              <h2>{v.titel}</h2>
              <p>{v.text}</p>
            </Erscheinen>
          ))}
        </Erscheinen>

        {/* ==========================================
            KATEGORIEN
            ========================================== */}
        <section className="st-kategorien">
          <Erscheinen>
            <p className="st-ueberschrift">{t('start.kategorienOben')}</p>
            <div className="st-kategorien-kopf">
              <h2>{t('start.kategorienTitel')}</h2>
            </div>
          </Erscheinen>

          <div className="st-kategorien-raster">
            {t('start.kategorien').map((k, i) => (
              <Erscheinen
                als="a"
                key={k.schluessel}
                verzoegerung={i * 60}
                href={`/chat?frage=${encodeURIComponent(k.name)}`}
                className="st-kategorie"
              >
                <div>
                  <strong>{k.name}</strong>
                  <span>{k.text}</span>
                </div>
                <span className="st-pfeil" aria-hidden="true">→</span>
              </Erscheinen>
            ))}
          </div>
        </section>
      </main>

      <Fusszeile />
    </>
  );
}
