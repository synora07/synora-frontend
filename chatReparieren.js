// ============================================
// SYNORA - Chat.jsx reparieren
// ============================================
// GEFUNDEN am 30.10.2026 beim Gesamttest:
//
//   "playstation" eingegeben -> SYNORA fragt "Damit ich nicht
//   raten muss: Wofuer brauchst du es?". Antwort "spielen" ->
//   DIESELBE Frage noch einmal. Endlos. Nie ein Ergebnis.
//
// Drei Fehler, alle in src/seiten/Chat.jsx:
//
//   1. Der Verlauf wurde nie mitgeschickt. Das Backend liest
//      ihn aus req.body.conversationHistory (chatController.js
//      Zeile 671). Hier stand nur { message: text }. Ohne das
//      Feld ist der Verlauf im Backend leer - und damit
//      schalten sich zwei Schutzmechanismen in rueckfrage.js
//      still ab: schonGefragt() und zusammenfuehren().
//
//   2. Die Markierung istRueckfrage wurde nicht gespeichert.
//
//   3. Die Antwortknoepfe fehlten: Das Backend schickt
//      "modelOptions", gelesen wurde "options"/"optionen".
//
// ============================================
// WIE DAS SKRIPT ARBEITET
// ============================================
//   - Erst eine Sicherung, dann die Aenderung
//   - ALLES ODER NICHTS: Passt auch nur eine der sechs Stellen
//     nicht genau einmal, wird NICHTS geaendert
//   - Zeilenenden bleiben, wie sie waren (Windows: CRLF)
//   - Zum Schluss eine Gegenprobe: alt weg, neu da
//
// Aufruf im Ordner synora-frontend-main:
//   node chatReparieren.js
// ============================================

'use strict';

const fs = require('fs');
const path = require('path');

const ZIEL = path.join('src', 'seiten', 'Chat.jsx');

// ============================================
// DIE SECHS AENDERUNGEN
// ============================================
// alt  - muss GENAU EINMAL in der Datei stehen
// neu  - was stattdessen hinkommt
// was  - fuer die Ausgabe

const AENDERUNGEN = [
  {
    was: '1/6  Hinweis im Kopf der Datei',
    alt:
`// "3 kostenlosen Suchen" auf der alten Startseite.
// ============================================`,
    neu:
`// "3 kostenlosen Suchen" auf der alten Startseite.
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
// ============================================`
  },

  {
    was: '2/6  Obergrenze fuer den Verlauf',
    alt:
`const BUDGET_MAX = 3000;
const BUDGET_SCHRITT = 50;`,
    neu:
`const BUDGET_MAX = 3000;
const BUDGET_SCHRITT = 50;

// Wie viele Nachrichten hoechstens mitgeschickt werden. Das
// Backend braucht nur die letzten beiden, um eine Antwort auf
// eine Rueckfrage zu erkennen. 20 ist grosszuegig und haelt den
// Umfang der Anfrage auch nach einer langen Unterhaltung klein.
const VERLAUF_MAX = 20;`
  },

  {
    was: '3/6  Funktion verlaufFuerBackend()',
    alt:
`  async function senden(e, textRoh) {`,
    neu:
`  // ---------- Der Verlauf fuer das Backend ----------
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

  async function senden(e, textRoh) {`
  },

  {
    was: '4/6  Verlauf vor dem Absenden festhalten',
    alt:
`    setNachrichten((n) => [...n, { wer: 'nutzer', text }]);
    setEingabe('');
    setLaeuft(true);`,
    neu:
`    // Vor setNachrichten holen: danach waere es derselbe Wert,
    // aber so ist unmissverstaendlich, dass die aktuelle
    // Nachricht nicht im Verlauf steckt.
    const verlauf = verlaufFuerBackend();

    setNachrichten((n) => [...n, { wer: 'nutzer', text }]);
    setEingabe('');
    setLaeuft(true);`
  },

  {
    was: '5/6  conversationHistory mitschicken',
    alt:
`      koerper: { message: text }`,
    neu:
`      koerper: {
        message: text,
        // Ohne dieses Feld fragt SYNORA endlos dieselbe Frage.
        // Siehe den Abschnitt oben im Kopf der Datei.
        conversationHistory: verlauf
      }`
  },

  {
    was: '6/6  Rueckfrage auswerten (Knoepfe + Markierung)',
    alt:
`    const d = r.daten || {};
    setNachrichten((n) => [...n, {
      wer: 'synora',
      text: d.response || d.message || d.antwort || '',
      produkte: Array.isArray(d.products) ? d.products : (Array.isArray(d.produkte) ? d.produkte : []),
      optionen: Array.isArray(d.options) ? d.options : (Array.isArray(d.optionen) ? d.optionen : [])
    }]);`,
    neu:
`    const d = r.daten || {};

    // ---------- Rueckfrage auswerten ----------
    // Bei einer Rueckfrage schickt das Backend:
    //   fragen        Liste {frage, optionen, mehrfach}  (neue Form)
    //   modelOptions  nur die Optionen der ersten Frage  (alte Form)
    //   istRueckfrage die Markierung
    //
    // Gezeigt wird hier EINE Frage. Schickt das Backend mehrere,
    // ist d.response nur eine Einleitung ("drei kurze Fragen:") -
    // und eine Einleitung ohne Frage darunter waere sinnlos.
    // Darum steht dann der Text der ersten Frage in der Blase.
    const fragen = Array.isArray(d.fragen) ? d.fragen : [];
    const ersteFrage = fragen.length > 0 ? fragen[0] : null;

    const antwortText =
      fragen.length > 1 && ersteFrage && ersteFrage.frage
        ? ersteFrage.frage
        : (d.response || d.message || d.antwort || '');

    // Vier moegliche Namen, weil Backend und Frontend hier
    // auseinandergelaufen sind. Der erste Treffer gewinnt.
    let optionen = [];
    if (ersteFrage && Array.isArray(ersteFrage.optionen)) optionen = ersteFrage.optionen;
    else if (Array.isArray(d.modelOptions)) optionen = d.modelOptions;
    else if (Array.isArray(d.options)) optionen = d.options;
    else if (Array.isArray(d.optionen)) optionen = d.optionen;

    setNachrichten((n) => [...n, {
      wer: 'synora',
      text: antwortText,
      // Muss mit in den Verlauf, sonst weiss das Backend beim
      // naechsten Mal nicht, dass es schon gefragt hat.
      istRueckfrage: !!d.istRueckfrage,
      produkte: Array.isArray(d.products) ? d.products : (Array.isArray(d.produkte) ? d.produkte : []),
      optionen
    }]);`
  }
];

// Nach der Aenderung muss das hier in der Datei stehen
const MUSS_DA_SEIN = [
  'conversationHistory: verlauf',
  'function verlaufFuerBackend()',
  'd.modelOptions',
  'istRueckfrage: !!d.istRueckfrage'
];

// ... und das hier nicht mehr
const MUSS_WEG = [
  'koerper: { message: text }'
];

// ============================================

function zeitstempel() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}-${z(d.getHours())}-${z(d.getMinutes())}`;
}

function zaehlen(heuhaufen, nadel) {
  let n = 0;
  let i = heuhaufen.indexOf(nadel);
  while (i !== -1) {
    n++;
    i = heuhaufen.indexOf(nadel, i + nadel.length);
  }
  return n;
}

function main() {
  console.log('');
  console.log('SYNORA - Chat.jsx reparieren');
  console.log('============================');
  console.log('');

  if (!fs.existsSync(ZIEL)) {
    console.log(`ABBRUCH: ${ZIEL} nicht gefunden.`);
    console.log('Bist du im Ordner synora-frontend-main?');
    process.exit(1);
  }

  const roh = fs.readFileSync(ZIEL, 'utf8');
  const hatCRLF = roh.includes('\r\n');
  let txt = roh.replace(/\r\n/g, '\n');

  console.log(`Datei:        ${ZIEL}`);
  console.log(`Groesse:      ${roh.length} Zeichen`);
  console.log(`Zeilenenden:  ${hatCRLF ? 'CRLF (Windows)' : 'LF'}`);
  console.log('');

  // ---------- Schon repariert? ----------
  if (txt.includes('conversationHistory: verlauf')) {
    console.log('Die Datei ist bereits repariert - conversationHistory steht drin.');
    console.log('Es wird nichts geaendert.');
    process.exit(0);
  }

  // ---------- ERST PRUEFEN, DANN AENDERN ----------
  console.log('Pruefung der sechs Stellen:');
  let allesOk = true;

  for (const a of AENDERUNGEN) {
    const n = zaehlen(txt, a.alt);
    if (n === 1) {
      console.log(`  OK      ${a.was}`);
    } else {
      console.log(`  FEHLER  ${a.was}  (${n} mal gefunden, erwartet: 1)`);
      allesOk = false;
    }
  }

  console.log('');

  if (!allesOk) {
    console.log('ABBRUCH. Es wurde NICHTS geaendert.');
    console.log('');
    console.log('Die Datei weicht vom erwarteten Stand ab. Schick die');
    console.log('Ausgabe weiter, dann wird das Skript angepasst.');
    process.exit(1);
  }

  // ---------- Sicherung ----------
  const sicherung = `${ZIEL}.sicherung-${zeitstempel()}`;
  fs.copyFileSync(ZIEL, sicherung);
  console.log(`Sicherung:    ${sicherung}`);

  // ---------- Aendern ----------
  for (const a of AENDERUNGEN) {
    txt = txt.replace(a.alt, a.neu);
  }

  if (hatCRLF) txt = txt.replace(/\n/g, '\r\n');
  fs.writeFileSync(ZIEL, txt, 'utf8');

  // ---------- Gegenprobe ----------
  const neu = fs.readFileSync(ZIEL, 'utf8');
  console.log('');
  console.log('Gegenprobe:');

  let probeOk = true;
  for (const s of MUSS_DA_SEIN) {
    const da = neu.includes(s);
    console.log(`  ${da ? 'OK     ' : 'FEHLT  '} ${s}`);
    if (!da) probeOk = false;
  }
  for (const s of MUSS_WEG) {
    const weg = !neu.includes(s);
    console.log(`  ${weg ? 'OK     ' : 'NOCH DA'} ${s}  (musste verschwinden)`);
    if (!weg) probeOk = false;
  }

  // Klammern grob zaehlen - faellt auf, wenn etwas zerschnitten wurde
  const auf = zaehlen(neu, '{');
  const zu = zaehlen(neu, '}');
  console.log(`  ${auf === zu ? 'OK     ' : 'ACHTUNG'} geschweifte Klammern: ${auf} auf, ${zu} zu`);
  if (auf !== zu) probeOk = false;

  console.log('');
  if (probeOk) {
    console.log('FERTIG. Die Datei ist repariert.');
    console.log('');
    console.log('Naechster Schritt: npm start, dann "playstation" eingeben.');
    console.log('Es muessen Knoepfe erscheinen. Eine Antwort darf NICHT');
    console.log('dieselbe Frage noch einmal ausloesen.');
  } else {
    console.log('ACHTUNG: Die Gegenprobe ist nicht sauber.');
    console.log(`Die alte Fassung liegt hier: ${sicherung}`);
    console.log('Schick die Ausgabe weiter, bevor du weitermachst.');
    process.exit(1);
  }
  console.log('');
}

main();
