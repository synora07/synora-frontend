// ============================================
// SYNORA - der KI-Assistent
// ============================================
// Nach deiner Vorlage: drei Spalten. Leiste links, Unterhaltung
// in der Mitte, Infospalte rechts.
//
// ============================================
// WAS AUS DER VORLAGE WEGGEFALLEN IST - UND WARUM
// ============================================
// Du hast gesagt: "aussehen wie die Vorlage, aber unnoetige
// Sachen weg". Unnoetig heisst hier: alles, wofuer es im
// Backend nichts gibt. Ich habe jeden Punkt der Vorlage einzeln
// gegen die echten Endpunkte geprueft, nicht aus dem Kopf.
//
//   Vorlage                   Backend                 hier
//   ------------------------  ----------------------  --------------
//   Neuer Chat                nur im Browser noetig   DA
//   Chat-Verlauf              /history gibt [] zurueck  GRAU, "bald"
//   Gespeicherte Produkte     gibt es nicht           WEG
//   Vergleiche                gibt es nicht           WEG
//   Einstellungen             gibt es nicht           WEG
//   Letzte Chats (Liste)      /history gibt [] zurueck  leerer Hinweis
//   SYNORA Pro (Kachel)       /premium gibt es        DA
//   Alle 12 Ergebnisse        Backend liefert nur 3   WEG
//   "Vergleichen" am Produkt  gibt es nicht           WEG
//   Bild hochladen            gibt es nicht           WEG
//   Sprache (Mikrofon)        gibt es nicht           WEG
//   Produktvergleich rechts   gibt es nicht           WEG
//   Filter: Kategorie,        Backend nimmt nur       WEG
//     Verwendungszweck,       einen Text entgegen
//     Groesse, Akkulaufzeit
//   Filter: Preisbereich      wird WIRKLICH gelesen   DA
//   Shop-Logos                fremde Marken           nur Namen
//   Lieferzeit/Verfuegbarkeit steht nicht je Produkt  WEG
//   SYNORA Score (Erklaerung) score kommt mit         DA
//
// ============================================
// WARUM DER PREISBEREICH BLEIBEN DARF
// ============================================
// Weil er als einziger Filter echt ist. Im Backend steht in
// chatController.js die Funktion extrahiereBudget() - sie liest
// Formulierungen wie "unter 1000 CHF", "bis 500" oder "max. 200"
// direkt aus dem Fragetext und filtert danach wirklich.
//
// Der Regler hier schickt also keinen heimlichen Parameter mit,
// den niemand auswertet. Er TIPPT FUER DICH: Aus dem Regler wird
// "unter 1000 CHF" am Ende deiner Frage, sichtbar im Eingabefeld.
//
// Genau das steht auch auf der Seite. Ein Regler, der etwas
// anderes tut als er verspricht, waere dasselbe Problem wie die
// "3 kostenlosen Suchen" auf der alten Startseite.
// ============================================

import { useEffect, useRef, useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Logo from '../bausteine/Logo';
import { useSprache } from '../texte/Sprache';
import { anfrage, istAngemeldet, einstellungenHolen } from '../api';
import { PFADE } from '../pfade';
import Produktkarte from '../bausteine/Produktkarte';
import './Chat.css';

// Der Regler geht bis hierher. Darueber heisst es "ohne Grenze" -
// eine Obergrenze von 50'000 waere dasselbe wie keine, wuerde
// aber so tun, als waere sie eine.
const BUDGET_MAX = 3000;
const BUDGET_SCHRITT = 50;

// Steht in der Frage schon ein Budget, haengt der Regler keines
// an. Sonst stuende da "Laptop unter 800 CHF unter 1000 CHF".
// Die Muster sind an extrahiereBudget() im Backend angelehnt.
function hatSchonBudget(text) {
  const s = String(text || '').toLowerCase();
  return (
    /(bis|unter|max(imal)?\.?|höchstens|hoechstens|nicht mehr als|budget)\s*(chf|fr\.?|franken)?\s*[\d'’.,]+/.test(s) ||
    /[\d'’.,]+\s*(chf|fr\.?|franken|stutz|\.-)/.test(s)
  );
}

export default function Chat() {
  const { t } = useSprache();
  const [nachrichten, setNachrichten] = useState([]);
  const [eingabe, setEingabe] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const [stand, setStand] = useState(null);      // wie viele Suchen noch offen
  const [limitVoll, setLimitVoll] = useState(false);
  const [premiumZahl, setPremiumZahl] = useState(null);
  const [budget, setBudget] = useState(0);       // 0 = ohne Grenze
  const endeRef = useRef(null);
  const eingabeRef = useRef(null);

  const angemeldet = istAngemeldet();

  // Der hoechste Score der letzten Antwort - fuer die Erklaerung
  // rechts. Ohne Ergebnis steht dort kein Beispielwert.
  const letzterScore = (() => {
    for (let i = nachrichten.length - 1; i >= 0; i--) {
      const p = nachrichten[i].produkte;
      if (p && p.length) {
        const s = p.map((x) => x.score).filter((x) => typeof x === 'number');
        if (s.length) return Math.max(...s);
      }
    }
    return null;
  })();

  // ---------- Frage aus der Adresse uebernehmen ----------
  // Die Startseite schickt ihre Suche als ?frage=... hierher,
  // damit der Nutzer sie nicht zweimal tippt.
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('frage');
      if (p) {
        setEingabe(p);
        window.history.replaceState({}, '', '/chat');
      }
    } catch (_) { /* egal */ }
  }, []);

  useEffect(() => {
    let weg = false;
    (async () => {
      const r = await einstellungenHolen();
      if (weg || !r.ok) return;
      const p = r.daten?.stufen?.find((s) => s.schluessel === 'premium');
      if (p) setPremiumZahl(p.suchen.unbegrenzt ? '∞' : p.suchen.anzahl);
    })();
    return () => { weg = true; };
  }, []);

  // Nach jeder neuen Nachricht nach unten rollen.
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, laeuft]);

  function frageMitBudget(text) {
    if (!budget || hatSchonBudget(text)) return text;
    return `${text} unter ${budget} CHF`;
  }

  async function senden(e, textRoh) {
    e?.preventDefault();
    const text = frageMitBudget((textRoh ?? eingabe).trim());
    if (!text || laeuft) return;

    if (!angemeldet) {
      setNachrichten((n) => [...n, { wer: 'nutzer', text }, { wer: 'synora', text: t('chat.ohneKonto'), ohneKonto: true }]);
      setEingabe('');
      return;
    }

    setNachrichten((n) => [...n, { wer: 'nutzer', text }]);
    setEingabe('');
    setLaeuft(true);

    const r = await anfrage(PFADE.chat, {
      methode: 'POST',
      koerper: { message: text }
    });

    setLaeuft(false);

    if (!r.ok) {
      // 429 vom Suchlimit: Das ist kein Fehler, sondern der
      // Moment, in dem Premium einen Sinn bekommt. Aus deinem
      // Premium-Dokument: "Nicht bestrafen, sondern nach vorn
      // zeigen."
      if (r.status === 429) {
        setLimitVoll(true);
        setNachrichten((n) => [...n, {
          wer: 'synora',
          text: t('chat.limitErreicht', { genutzt: stand?.limit ?? '' }),
          limit: true
        }]);
        return;
      }
      setNachrichten((n) => [...n, { wer: 'synora', text: r.fehler, fehler: true }]);
      return;
    }

    const d = r.daten || {};
    setNachrichten((n) => [...n, {
      wer: 'synora',
      text: d.response || d.message || d.antwort || '',
      produkte: Array.isArray(d.products) ? d.products : (Array.isArray(d.produkte) ? d.produkte : []),
      optionen: Array.isArray(d.options) ? d.options : (Array.isArray(d.optionen) ? d.optionen : [])
    }]);

    if (d.limit || d.stand) setStand(d.limit || d.stand);
  }

  // Enter sendet, Shift+Enter macht eine neue Zeile.
  function beiTaste(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      senden();
    }
  }

  function neuerChat() {
    setNachrichten([]);
    setEingabe('');
    setLimitVoll(false);
    eingabeRef.current?.focus();
  }

  return (
    <>
      <Kopfzeile aktiv="assistent" />

      <div className="ch-raum">

        {/* ================= LEISTE LINKS ================= */}
        <aside className="ch-leiste" aria-label={t('menue.assistent')}>
          <button onClick={neuerChat} className="ch-neu">
            <span aria-hidden="true">✚</span> {t('chat.neuerChat')}
          </button>

          <nav className="ch-nav">
            {/* Steht da, ist aber nicht anklickbar. Ein Menuepunkt,
                der sich anklicken laesst und dann nichts tut, ist
                schlimmer als einer, der ehrlich sagt, dass er noch
                nicht fertig ist. */}
            <span className="ch-nav-aus" title={t('chat.nochNicht')}>
              <span className="ch-symbol" aria-hidden="true">🕘</span>
              {t('chat.verlauf')}
              <span className="ch-bald">{t('allgemein.bald')}</span>
            </span>

            <a href="/preisalarme" className="ch-nav-punkt">
              <span className="ch-symbol" aria-hidden="true">🔔</span>
              {t('menue.preisalarme')}
            </a>

            <a href="/premium" className="ch-nav-punkt">
              <span className="ch-symbol" aria-hidden="true">★</span>
              {t('menue.premium')}
            </a>
          </nav>

          <div className="ch-abschnitt">
            <h2>{t('chat.letzteChats')}</h2>
            {/* /api/chat/history gibt heute immer eine leere Liste
                zurueck (steht als TODO im Backend). Darum hier
                nicht eine erfundene Liste, sondern der Hinweis. */}
            <p className="ch-leer">{t('chat.verlaufLeer')}</p>
          </div>

          {/* ============================================
              RECHTSLINKS - MUESSEN AUF JEDE SEITE
              ============================================
              GEFUNDEN am 08.10.2026 beim Gesamttest: Diese Seite
              hatte als einzige keine Fusszeile, also auch keine
              Links auf Impressum und Datenschutz. Die muessen von
              jeder Seite aus erreichbar sein.

              Die volle Fusszeile passt hier nicht - der Chat ist
              auf Fensterhoehe gebaut, darunter ist kein Platz.
              Darum diese schmale Zeile unten in der Leiste. */}
          <nav className="ch-recht" aria-label={t('fuss.rechtliches')}>
            <a href="/impressum">{t('fuss.impressum')}</a>
            <a href="/datenschutz">{t('fuss.datenschutz')}</a>
            <a href="/nutzungsbedingungen">{t('fuss.nutzungsbedingungen')}</a>
          </nav>

          {/* Premium-Hinweis. Aus deinem Dokument: hoechstens einer
              pro Sitzung und NIE vor dem ersten Ergebnis. Darum
              erscheint er erst, wenn schon gesucht wurde. */}
          {nachrichten.length > 0 && premiumZahl !== null && (
            <a href="/premium" className="ch-premium">
              <strong>SYNORA Premium</strong>
              <span>{t('start.kacheln.premium.titel', { zahl: premiumZahl })}</span>
            </a>
          )}
        </aside>

        {/* ================= UNTERHALTUNG ================= */}
        <main className="ch-mitte">
          <div className="ch-lauf">

            {nachrichten.length === 0 && (
              <section className="ch-willkommen">
                <div className="ch-will-kopf">
                  <Logo art="zeichen" groesse={52} />
                  <div>
                    <h1>{t('chat.begruessung')}</h1>
                    <p>{t('chat.begruessungText')}</p>
                  </div>
                </div>

                <div className="ch-merkmale">
                  {t('chat.merkmale').map((m) => (
                    <div key={m.titel}>
                      <strong>{m.titel}</strong>
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {nachrichten.map((n, i) => (
              <article key={i} className={`ch-nachricht ch-${n.wer}`}>
                {n.wer === 'synora' && (
                  <span className="ch-absender">
                    <Logo art="zeichen" groesse={20} leuchten={false} /> SYNORA
                  </span>
                )}

                <div className={`ch-blase ${n.fehler ? 'ch-blase-fehler' : ''} ${n.limit ? 'ch-blase-limit' : ''}`}>
                  {n.text && <p className="ch-text">{n.text}</p>}

                  {n.limit && (
                    <a href="/premium" className="ch-limit-knopf">{t('chat.limitKnopf')} →</a>
                  )}
                  {n.ohneKonto && (
                    <a href="/registrieren" className="ch-limit-knopf">{t('allgemein.kostenlosStarten')} →</a>
                  )}

                  {n.optionen?.length > 0 && (
                    <div className="ch-optionen">
                      {n.optionen.map((o) => (
                        <button key={o} onClick={() => senden(null, o)}>{o}</button>
                      ))}
                    </div>
                  )}
                </div>

                {n.produkte?.length > 0 && (
                  <div className="ch-produkte">
                    <h2 className="ch-produkte-titel">{t('chat.empfehlungenTitel')}</h2>
                    <div className="ch-produkte-raster">
                      {n.produkte.map((p, k) => (
                        <Produktkarte key={p.id || k} produkt={p} rang={k + 1} schmal />
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}

            {laeuft && (
              <article className="ch-nachricht ch-synora">
                <span className="ch-absender">
                  <Logo art="zeichen" groesse={20} leuchten={false} /> SYNORA
                </span>
                <div className="ch-blase ch-blase-laedt">
                  <span className="ch-punkte"><i /><i /><i /></span>
                  <span className="ch-laedt-text">{t('chat.denkt')}</span>
                </div>
              </article>
            )}

            <div ref={endeRef} />
          </div>

          {/* ================= EINGABE ================= */}
          <div className="ch-unten">
            <form className="ch-eingabe" onSubmit={senden}>
              <textarea
                ref={eingabeRef}
                value={eingabe}
                onChange={(e) => setEingabe(e.target.value)}
                onKeyDown={beiTaste}
                placeholder={t('chat.eingabe')}
                rows={1}
                aria-label={t('chat.eingabe')}
                disabled={limitVoll}
              />
              <div className="ch-eingabe-knoepfe">
                <button type="button" onClick={neuerChat} className="ch-knopf-leer">
                  {t('chat.neuerChat')}
                </button>
                <button type="submit" disabled={!eingabe.trim() || laeuft || limitVoll}>
                  {t('chat.senden')}
                </button>
              </div>
            </form>

            {/* Wie in der Vorlage: die Beispiele unter dem Feld. */}
            {nachrichten.length === 0 && (
              <div className="ch-beispiele">
                <span className="ch-beispiele-titel">{t('chat.zumBeispiel')}</span>
                {t('start.beispiele').map((b) => (
                  <button key={b} onClick={() => { setEingabe(b); eingabeRef.current?.focus(); }}>
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ================= INFOSPALTE RECHTS ================= */}
        <aside className="ch-info" aria-label={t('chat.infoSpalte')}>

          {/* ---------- Preisbereich ----------
              Der einzige Filter aus der Vorlage, der wirklich
              etwas bewirkt. Was er tut, steht darunter. */}
          <section className="ch-karte">
            <h2>{t('chat.budgetTitel')}</h2>

            <div className="ch-budget-wert">
              {budget ? `${t('chat.budgetBis')} CHF ${budget}` : t('chat.budgetOhne')}
            </div>

            <input
              type="range"
              min="0"
              max={BUDGET_MAX}
              step={BUDGET_SCHRITT}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label={t('chat.budgetTitel')}
            />

            <div className="ch-budget-enden">
              <span>{t('chat.budgetOhne')}</span>
              <span>CHF {BUDGET_MAX}+</span>
            </div>

            <p className="ch-klein">
              {budget
                ? t('chat.budgetAktiv', { zahl: budget })
                : t('chat.budgetHinweis')}
            </p>
          </section>

          {/* ---------- Schweizer Shops ----------
              Nur die Namen, keine fremden Logos: Die gehoeren
              digitec, Galaxus und Interdiscount, nicht uns. */}
          <section className="ch-karte">
            <h2>{t('chat.shopsTitel')}</h2>
            <p className="ch-klein">{t('chat.shopsText')}</p>
            <ul className="ch-shops">
              {t('chat.shopsListe').map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>

          {/* ---------- SYNORA Score ---------- */}
          <section className="ch-karte">
            <h2>{t('chat.scoreTitel')}</h2>
            {letzterScore !== null && (
              <div className="ch-score">
                <strong>{letzterScore}</strong><span>/100</span>
              </div>
            )}
            <p className="ch-klein">{t('chat.scoreText')}</p>
          </section>
        </aside>
      </div>
    </>
  );
}