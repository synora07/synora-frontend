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
//
// ============================================
// DIE RUECKFRAGE-SCHLEIFE - GEFUNDEN am 30.10.2026
// ============================================
// Beim Gesamttest: "playstation" eingegeben -> SYNORA fragt
// "Damit ich nicht raten muss: Wofuer brauchst du es?".
// Antwort "spielen" -> DIESELBE Frage noch einmal. Endlos.
// Es kam nie ein Ergebnis.
//
// Drei Fehler, alle in dieser Datei:
//
//   1. Der Verlauf wurde nie mitgeschickt.
//      Das Backend liest ihn aus req.body.conversationHistory
//      (chatController.js, Zeile 671). Hier stand nur
//      { message: text }. Kam das Feld nicht mit, war der
//      Verlauf im Backend ein leeres Array - ohne Fehler, ohne
//      Warnung. Damit schalteten sich zwei Schutzmechanismen
//      in rueckfrage.js still ab:
//
//        schonGefragt()     hoechstens EINE Frage pro Gespraech
//        zusammenfuehren()  "playstation" + "spielen" verbinden
//
//      Beide brauchen den Verlauf. Ohne ihn sah das Backend bei
//      jeder Nachricht ein brandneues Gespraech.
//
//   2. Die Markierung istRueckfrage wurde nicht gespeichert.
//      Das Backend markiert seine eigene Rueckfrage in der
//      Antwort (chatController.js, Zeile 753). Ohne diese
//      Markierung im Verlauf erkennt das Backend zwar seine
//      festen Fragen am Text wieder - die vom Modell erzeugten
//      Fragen aus rueckfrageSchlau.js aber nicht.
//
//   3. Die Antwortknoepfe fehlten.
//      Das Backend schickt die Optionen als "modelOptions"
//      (alte Form) und "fragen" (neue Form). Hier wurde
//      d.options und d.optionen gelesen - beides gibt es
//      nicht. Darum erschienen nie Knoepfe, und man musste
//      von Hand tippen. Genau dadurch wurde Fehler 1 erst
//      sichtbar.
//
// Die drei haengen zusammen: ohne Knoepfe tippt man, beim
// Tippen braucht es den Verlauf, und der Verlauf braucht die
// Markierung.
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

// Wie viele Nachrichten hoechstens mitgeschickt werden. Das
// Backend braucht nur die letzten beiden, um eine Antwort auf
// eine Rueckfrage zu erkennen. 20 ist grosszuegig und haelt den
// Umfang der Anfrage auch nach einer langen Unterhaltung klein.
const VERLAUF_MAX = 20;

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

// Kurzes Datum fuer die Seitenleiste: "08.11.". Mehr passt dort nicht
// hin, und das Jahr interessiert bei den letzten zwanzig Suchen nicht.
function datumKurz(wert) {
  try {
    return new Date(wert).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' });
  } catch (_) {
    return '';
  }
}

// ============================================
// Aus einer Serverantwort eine Nachricht fuer die Anzeige bauen.
// ============================================
// Wird an ZWEI Stellen gebraucht: bei einer frischen Antwort und beim
// Wiederoeffnen eines gespeicherten Gespraechs. Darum steht sie hier
// und nicht in senden() - ein alter Chat soll genauso aussehen wie
// ein neuer.
function nachrichtAusAntwort(d) {
  const daten = d || {};

  // Bei einer Rueckfrage schickt das Backend:
  //   fragen        Liste {frage, optionen, mehrfach}  (neue Form)
  //   modelOptions  nur die Optionen der ersten Frage  (alte Form)
  //   istRueckfrage die Markierung
  const fragen = Array.isArray(daten.fragen) ? daten.fragen : [];
  const ersteFrage = fragen.length > 0 ? fragen[0] : null;

  // Bei mehreren Fragen ist daten.response nur eine Einleitung
  // ("drei kurze Fragen:"). Eine Einleitung ohne Frage darunter waere
  // sinnlos, darum steht dann die erste Frage in der Blase.
  const text =
    fragen.length > 1 && ersteFrage && ersteFrage.frage
      ? ersteFrage.frage
      : (daten.response || daten.message || daten.antwort || '');

  // Vier moegliche Namen, weil Backend und Frontend hier
  // auseinandergelaufen sind. Der erste Treffer gewinnt.
  let optionen = [];
  if (ersteFrage && Array.isArray(ersteFrage.optionen)) optionen = ersteFrage.optionen;
  else if (Array.isArray(daten.modelOptions)) optionen = daten.modelOptions;
  else if (Array.isArray(daten.options)) optionen = daten.options;
  else if (Array.isArray(daten.optionen)) optionen = daten.optionen;

  return {
    wer: 'synora',
    text,
    istRueckfrage: !!daten.istRueckfrage,
    produkte: Array.isArray(daten.products)
      ? daten.products
      : (Array.isArray(daten.produkte) ? daten.produkte : []),
    optionen
  };
}

// ---------- Was gerade passiert (angebaut 09.11.2026) ----------
// Eine Suche dauert gemessen 19 bis 27 Sekunden. Bisher stand die
// ganze Zeit derselbe Satz da. Jetzt wechselt er entlang der
// Schritte, die der Server wirklich geht.
//
// Die Zeiten sind an den gemessenen Ablauf angelehnt. Kommt die
// Antwort frueher, werden die spaeteren Saetze nie gezeigt.
const SCHRITT_ZEITEN = [0, 1500, 5000, 10000, 16000];

// Faellt die Liste aus - alte Uebersetzung, anderer Sprachstand -
// bleibt der alte Satz stehen. Lieber der alte Text als gar keiner.
function ladeText(t, schritt) {
  const liste = t('chat.schritte');
  if (Array.isArray(liste) && liste.length) {
    return liste[Math.min(schritt, liste.length - 1)];
  }
  return t('chat.denkt');
}

export default function Chat() {
  const { t } = useSprache();
  const [nachrichten, setNachrichten] = useState([]);
  const [eingabe, setEingabe] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const [schritt, setSchritt] = useState(0);     // welcher Satz gerade steht
  const [stand, setStand] = useState(null);      // wie viele Suchen noch offen
  const [limitVoll, setLimitVoll] = useState(false);
  const [premiumZahl, setPremiumZahl] = useState(null);
  const [gespraeche, setGespraeche] = useState([]);  // Liste in der Seitenleiste
  const [chatId, setChatId] = useState(null);        // das laufende Gespraech
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

  // ---------- Gespraechsliste laden ----------
  // Nur fuer Angemeldete: ohne Konto gibt es nichts zu zeigen, und die
  // Anfrage waere eine 401. Faellt sie aus, bleibt die Liste leer und
  // es steht der Hinweis da - nie eine Fehlermeldung.
  useEffect(() => {
    if (!angemeldet) return undefined;
    let weg = false;
    (async () => {
      const r = await anfrage(PFADE.chatVerlauf);
      if (weg || !r.ok) return;
      const liste = r.daten && r.daten.history;
      setGespraeche(Array.isArray(liste) ? liste : []);
    })();
    return () => { weg = true; };
  }, [angemeldet]);

  /** Nach dem Senden: die Liste neu holen, damit das neue Gespraech
   *  oben auftaucht und der Titel stimmt. */
  async function gespraecheNachladen() {
    if (!angemeldet) return;
    const r = await anfrage(PFADE.chatVerlauf);
    if (!r.ok) return;
    const liste = r.daten && r.daten.history;
    if (Array.isArray(liste)) setGespraeche(liste);
  }

  /** Ein gespeichertes Gespraech wieder aufmachen.
   *
   *  Kostet nichts: Es wird nicht neu gesucht, sondern das gezeigt,
   *  was damals gespeichert wurde. */
  async function gespraechOeffnen(id) {
    if (laeuft) return;
    const r = await anfrage(`${PFADE.chatVerlauf}/${id}`);
    if (!r.ok || !r.daten) return;

    const gespeichert = Array.isArray(r.daten.nachrichten) ? r.daten.nachrichten : [];
    setNachrichten(
      gespeichert.map((n) =>
        n.wer === 'nutzer'
          ? { wer: 'nutzer', text: n.text || '' }
          : nachrichtAusAntwort(n.daten || { response: n.text })
      )
    );
    setChatId(id);
    setEingabe('');
    setLimitVoll(false);
  }

  // ---------- Ladetext weiterschalten (angebaut 09.11.2026) ----------
  // WICHTIG: hier stehen NIE Zahlen und NIE Ergebnisse. Was angezeigt
  // wird, ist der bekannte Ablauf - suchen, vergleichen, abwaegen,
  // pruefen. Eine erfundene Zwischenmeldung wie "14 Angebote
  // gefunden" waere genau das, was dem Modell am 09.11. abgewoehnt
  // wurde, nur an anderer Stelle.
  useEffect(() => {
    if (!laeuft) {
      setSchritt(0);
      return undefined;
    }
    const uhren = SCHRITT_ZEITEN.map((ms, i) => setTimeout(() => setSchritt(i), ms));
    return () => uhren.forEach(clearTimeout);
  }, [laeuft]);

  // Nach jeder neuen Nachricht nach unten rollen.
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, laeuft]);

  function frageMitBudget(text) {
    if (!budget || hatSchonBudget(text)) return text;
    return `${text} unter ${budget} CHF`;
  }

  // ---------- Der Verlauf fuer das Backend ----------
  // Das Backend kennt eine andere Form als die Anzeige hier:
  // role/content statt wer/text. Fehlermeldungen, der
  // Limit-Hinweis und der "ohne Konto"-Hinweis gehoeren nicht
  // dazu - das sind Hinweise der Oberflaeche, keine Saetze aus
  // der Unterhaltung.
  //
  // WICHTIG: Die aktuelle Nachricht steht hier noch NICHT drin.
  // setNachrichten() weiter unten wirkt erst beim naechsten
  // Durchlauf, und das Backend bekommt den aktuellen Text
  // ohnehin getrennt als "message".
  function verlaufFuerBackend() {
    return nachrichten
      .filter((n) => n.text && !n.fehler && !n.limit && !n.ohneKonto)
      .map((n) => ({
        role: n.wer === 'nutzer' ? 'user' : 'assistant',
        content: n.text,
        istRueckfrage: !!n.istRueckfrage
      }))
      .slice(-VERLAUF_MAX);
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

    // Vor setNachrichten holen: danach waere es derselbe Wert,
    // aber so ist unmissverstaendlich, dass die aktuelle
    // Nachricht nicht im Verlauf steckt.
    const verlauf = verlaufFuerBackend();

    setNachrichten((n) => [...n, { wer: 'nutzer', text }]);
    setEingabe('');
    setLaeuft(true);

    const r = await anfrage(PFADE.chat, {
      methode: 'POST',
      koerper: {
        message: text,
        // Ohne dieses Feld fragt SYNORA endlos dieselbe Frage.
        conversationHistory: verlauf,
        // Die Nummer des Gespraechs. Beim ersten Mal null - dann legt
        // der Server eines an und schickt die Nummer zurueck.
        chatId
      }
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

    // Der Server hat das Gespraech angelegt oder fortgesetzt und
    // schickt die Nummer mit. Ab jetzt landet alles im selben Chat.
    if (d.chatId) setChatId(d.chatId);

    setNachrichten((n) => [...n, nachrichtAusAntwort(d)]);

    gespraecheNachladen();

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
    // Ohne das landen die naechsten Nachrichten im alten Gespraech.
    setChatId(null);
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
            {/* Kein "BALD" mehr: der Verlauf steht seit dem 08.11.2026
                weiter unten in dieser Leiste. */}
            <span className="ch-nav-aus">
              <span className="ch-symbol" aria-hidden="true">🕘</span>
              {t('chat.verlauf')}
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
            {/* Seit dem 08.11.2026 liefert /api/chat/history echte
                Daten aus dem Suchprotokoll. Ist noch nichts da -
                neues Konto, oder abgemeldet - bleibt der Hinweis. */}
            {gespraeche.length === 0 ? (
              <p className="ch-leer">{t('chat.verlaufLeer')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {gespraeche.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      title={v.titel}
                      onClick={() => gespraechOeffnen(v.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 9px',
                        color: 'inherit',
                        font: 'inherit',
                        opacity: 0.85,
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.titel}
                      </span>
                      <span style={{ opacity: 0.6, flexShrink: 0 }}>{datumKurz(v.zeit)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
                  <span className="ch-laedt-text">{ladeText(t, schritt)}</span>
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