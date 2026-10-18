// ============================================
// SYNORA - Kauf melden
// ============================================
// Deine Aktion: Die ersten 1000 Nutzer, die ueber SYNORA fuer
// mehr als CHF 300 kaufen, bekommen ein Jahr Premium geschenkt.
//
// DAS PROBLEM, DAS DIESE SEITE LOEST
//
// SYNORA weiss nicht, ob jemand gekauft hat. Die Rueckmeldung
// vom Affiliate-Programm kommt Wochen spaeter - und eine
// Zulassung gibt es noch gar nicht.
//
// Also meldet der Nutzer den Kauf selbst, und du prueefst von
// Hand. Entschieden am 04.10.2026.
//
// DASS VON HAND GEPRUEFT WIRD, STEHT AUF DER SEITE
// Wer das weiss, wartet geduldiger - und ueberlegt sich
// zweimal, ob er falsche Angaben macht.
// ============================================

import { useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import Feld from '../bausteine/Feld';
import { Meldung } from '../bausteine/KontoGeruest';
import { useSprache } from '../texte/Sprache';
import { anfrage, istAngemeldet } from '../api';
import { PFADE } from '../pfade';
import './Formularseite.css';

const MINDESTBETRAG = 300;

export default function KaufMelden() {
  const { t } = useSprache();
  const [shop, setShop] = useState('');
  const [betrag, setBetrag] = useState('');
  const [nummer, setNummer] = useState('');
  const [datum, setDatum] = useState('');
  const [fehler, setFehler] = useState('');
  const [fertig, setFertig] = useState(false);
  const [laeuft, setLaeuft] = useState(false);

  async function absenden(e) {
    e.preventDefault();
    if (laeuft) return;

    if (!istAngemeldet()) { window.location.href = '/anmelden'; return; }

    setFehler('');
    setLaeuft(true);

    const r = await anfrage(PFADE.kaufMelden, {
      methode: 'POST',
      koerper: {
        shop: shop.trim(),
        betrag: Number(String(betrag).replace(",", ".")),
        bestellnummer: nummer.trim(),
        datum
      }
    });

    setLaeuft(false);
    if (!r.ok) { setFehler(r.fehler); return; }
    setFertig(true);
  }

  // Heute als spaetestes Datum: Ein Kauf in der Zukunft ist
  // keiner.
  const heute = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Kopfzeile />
      <main className="fs-seite">
        <h1>{t('kaufMelden.titel')}</h1>
        <p className="fs-unter">{t('kaufMelden.untertitel', { betrag: MINDESTBETRAG })}</p>

        <div className="fs-karte">
          {fertig ? (
            <>
              <Meldung art="erfolg" text={t('kaufMelden.gesendet')} />
              <a href="/chat" className="fs-knopf fs-knopf-link">{t('menue.assistent')} &rarr;</a>
            </>
          ) : (
            <>
              <Meldung art="fehler" text={fehler} />
              <form onSubmit={absenden} noValidate>
                <Feld beschriftung={t('kaufMelden.shop')} wert={shop} setWert={setShop}
                      platzhalter="digitec.ch" symbol="&#127978;" pflicht />

                <Feld art="number" beschriftung={t('kaufMelden.betrag')} wert={betrag} setWert={setBetrag}
                      platzhalter="349.90" symbol="CHF" min="0" step="0.05" pflicht />

                <Feld beschriftung={t('kaufMelden.bestellnummer')} wert={nummer} setWert={setNummer}
                      platzhalter="123456789" symbol="#"
                      hinweis={t('kaufMelden.bestellnummerHinweis')} pflicht />

                <Feld art="date" beschriftung={t('kaufMelden.datum')} wert={datum} setWert={setDatum}
                      symbol="&#128197;" max={heute} pflicht />

                <button type="submit" className="fs-knopf"
                        disabled={laeuft || !shop || !betrag || !nummer || !datum}>
                  {laeuft ? t('allgemein.laedt') : t('kaufMelden.knopf')}
                </button>
              </form>

              <p className="fs-hinweis">{t('kaufMelden.hinweis')}</p>
            </>
          )}
        </div>
      </main>
      <Fusszeile />
    </>
  );
}
