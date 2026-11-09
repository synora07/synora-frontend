// ============================================
// SYNORA - Zeigen, was gerade passiert
// ============================================
// GEMESSEN am 08.11.2026: eine Suche dauert 19.1 und 27.0 Sekunden.
// Die ganze Zeit stand derselbe Satz da:
//
//   de.js:327   denkt: 'SYNORA sucht …'
//   en.js:251   denkt: 'SYNORA is searching …'
//
// Neunzehn Sekunden vor einem Satz, der sich nicht bewegt, fuehlen
// sich an wie ein Haenger. Neunzehn Sekunden, in denen man sieht,
// dass gearbeitet wird, fuehlen sich an wie Arbeit.
//
// ============================================
// WAS DAS HIER IST - UND WAS NICHT
// ============================================
// Das Pflichtenheft verlangt: erste Zeichen der ANTWORT unter 2
// Sekunden. DAS ERFUELLT DIESER EINBAU NICHT. Ein Satz, den das
// Frontend selbst anzeigt, ist keine Antwort - er ist ein besserer
// Ladebalken.
//
// Die echte Loesung sind Zwischenstaende vom Server (Server-Sent
// Events): "14 Angebote gefunden, 8 davon aus der Schweiz". Das sind
// drei Abende und beruehrt Backend wie Frontend.
//
// Dieser Einbau ist der billige, ehrliche Teil davon. Er kostet eine
// halbe Stunde und macht den spaeteren Umbau leichter, weil die
// Anzeige dann schon mehrstufig ist.
//
// HAKEN NICHT BEIM PFLICHTENHEFT SETZEN. Punkt 5 von Woche 2 bleibt
// offen.
//
// ============================================
// NIE ZAHLEN, NIE ERGEBNISSE
// ============================================
// Was hier angezeigt wird, ist der ABLAUF - und der ist bekannt und
// fest: suchen, vergleichen, abwaegen, pruefen. Das sind wahre
// Aussagen ueber das, was der Server in dem Moment tut.
//
// Was NICHT dort stehen darf: jede Zahl und jedes Ergebnis.
// "14 Angebote gefunden" weiss nur der Server. Eine erfundene
// Zwischenmeldung waere genau das, was wir dem Modell heute Mittag
// abgewoehnt haben - nur an anderer Stelle.
//
// ============================================
// DIE ZEITEN
// ============================================
//      0 ms  Ich schaue mir deine Frage an
//   1500 ms  Ich suche in Schweizer Shops
//   5000 ms  Vergleiche die Angebote
//  10000 ms  Waege Vor- und Nachteile ab
//  16000 ms  Pruefe jede Aussage auf Belege
//
// Gewaehlt entlang der gemessenen 19 bis 27 Sekunden. Kommt die
// Antwort frueher, werden die spaeteren Saetze einfach nie gezeigt.
// Eine Rueckfrage kommt in 0.0 s zurueck - da sieht man nur den
// ersten Satz aufblitzen.
//
// ============================================
// PRUEFUNG
// ============================================
// de.js und en.js werden mit node --check geprueft. Chat.jsx NICHT -
// das ist JSX, node versteht es nicht. Die einzige verlaessliche
// Pruefung dafuer ist:
//
//   npm run build
//
// Das Skript sagt es am Ende noch einmal. Schlaegt der Bau fehl,
// liegt die Sicherung daneben.
//
// ============================================
// Aufruf im Ordner synora-frontend-main:
//   node ladetextSchritte.js
// ============================================

'use strict';

const fs = require('fs');
const path = require('path');

const CHAT = path.join('src', 'seiten', 'Chat.jsx');
const DE = path.join('src', 'texte', 'de.js');
const EN = path.join('src', 'texte', 'en.js');
const MARKE = 'SCHRITT_ZEITEN';

const AENDERUNGEN = [
  // ------------------------------------------------------------
  {
    datei: CHAT,
    was: '1/6  Zeiten und Hilfsfunktion',
    alt: `export default function Chat() {`,
    neu:
`// ---------- Was gerade passiert (angebaut 09.11.2026) ----------
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

export default function Chat() {`
  },

  // ------------------------------------------------------------
  {
    datei: CHAT,
    was: '2/6  Zustand fuer den Schritt',
    alt: `  const [laeuft, setLaeuft] = useState(false);`,
    neu:
`  const [laeuft, setLaeuft] = useState(false);
  const [schritt, setSchritt] = useState(0);     // welcher Satz gerade steht`
  },

  // ------------------------------------------------------------
  {
    datei: CHAT,
    was: '3/6  Die Uhr, die weiterschaltet',
    alt:
`  // Nach jeder neuen Nachricht nach unten rollen.
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, laeuft]);`,
    neu:
`  // ---------- Ladetext weiterschalten (angebaut 09.11.2026) ----------
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
  }, [nachrichten, laeuft]);`
  },

  // ------------------------------------------------------------
  {
    datei: CHAT,
    was: '4/6  Den Satz anzeigen',
    alt: `                  <span className="ch-laedt-text">{t('chat.denkt')}</span>`,
    neu: `                  <span className="ch-laedt-text">{ladeText(t, schritt)}</span>`
  },

  // ------------------------------------------------------------
  {
    datei: DE,
    was: '5/6  Deutsche Saetze',
    alt: `denkt: 'SYNORA sucht …',`,
    neu:
`denkt: 'SYNORA sucht …',

    // Angebaut 09.11.2026. Wechselt waehrend der Suche entlang der
    // Schritte, die der Server wirklich geht. NIE Zahlen, NIE
    // Ergebnisse - die weiss nur der Server.
    schritte: [
      'Ich schaue mir deine Frage an …',
      'Ich suche in Schweizer Shops …',
      'Vergleiche die Angebote …',
      'Wäge Vor- und Nachteile ab …',
      'Prüfe jede Aussage auf Belege …'
    ],`
  },

  // ------------------------------------------------------------
  {
    datei: EN,
    was: '6/6  Englische Saetze',
    alt: `denkt: 'SYNORA is searching …',`,
    neu:
`denkt: 'SYNORA is searching …',

    // Added 09.11.2026. Follows the steps the server really takes.
    // Never numbers, never results - only the server knows those.
    schritte: [
      'Looking at your question …',
      'Searching Swiss shops …',
      'Comparing the offers …',
      'Weighing pros and cons …',
      'Checking every claim for evidence …'
    ],`
  }
];

const MUSS_DA_SEIN = [
  [CHAT, 'const SCHRITT_ZEITEN = [0, 1500, 5000, 10000, 16000];'],
  [CHAT, 'function ladeText(t, schritt)'],
  [CHAT, 'const [schritt, setSchritt] = useState(0);'],
  [CHAT, 'uhren.forEach(clearTimeout)'],
  [CHAT, '{ladeText(t, schritt)}'],
  [DE, "'Ich suche in Schweizer Shops …'"],
  [EN, "'Searching Swiss shops …'"]
];

const MUSS_WEG = [
  [CHAT, "{t('chat.denkt')}</span>"]
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
  while (i !== -1) { n++; i = heuhaufen.indexOf(nadel, i + nadel.length); }
  return n;
}

function main() {
  console.log('');
  console.log('SYNORA - Zeigen, was gerade passiert');
  console.log('=====================================');
  console.log('');

  const dateien = [CHAT, DE, EN];

  for (const d of dateien) {
    if (!fs.existsSync(d)) {
      console.log(`ABBRUCH: ${d} nicht gefunden.`);
      console.log('Bist du im Ordner synora-frontend-main?');
      process.exit(1);
    }
  }

  const stand = new Map();
  for (const d of dateien) {
    const roh = fs.readFileSync(d, 'utf8');
    stand.set(d, { roh, hatCRLF: roh.includes('\r\n'), txt: roh.replace(/\r\n/g, '\n') });
    console.log(`${d.padEnd(26)} ${roh.length} Zeichen, ${roh.includes('\r\n') ? 'CRLF' : 'LF'}`);
  }
  console.log('');

  if (stand.get(CHAT).txt.includes(MARKE)) {
    console.log('Bereits eingebaut. Es wird nichts geaendert.');
    process.exit(0);
  }

  console.log('Pruefung:');
  let allesOk = true;
  for (const a of AENDERUNGEN) {
    const n = zaehlen(stand.get(a.datei).txt, a.alt);
    if (n === 1) {
      console.log(`  OK      ${a.was}`);
    } else {
      console.log(`  FEHLER  ${a.was}  (${n} mal gefunden, erwartet: 1)`);
      allesOk = false;
    }
  }
  console.log('');

  if (!allesOk) {
    console.log('ABBRUCH. Es wurde NICHTS geaendert, in keiner der drei Dateien.');
    console.log('Schick die Ausgabe weiter, dann wird das Skript angepasst.');
    process.exit(1);
  }

  const sicherungen = new Map();
  for (const d of dateien) {
    const s = `${d}.sicherung-${zeitstempel()}`;
    fs.copyFileSync(d, s);
    sicherungen.set(d, s);
    console.log(`Sicherung:  ${s}`);
  }

  for (const d of dateien) {
    let txt = stand.get(d).txt;
    for (const a of AENDERUNGEN) if (a.datei === d) txt = txt.replace(a.alt, a.neu);
    if (stand.get(d).hatCRLF) txt = txt.replace(/\n/g, '\r\n');
    fs.writeFileSync(d, txt, 'utf8');
  }

  function zurueckspielen(grund) {
    for (const d of dateien) fs.copyFileSync(sicherungen.get(d), d);
    console.log('');
    console.log(`ABBRUCH: ${grund}`);
    console.log('ALLE DREI Dateien sind zurueckgespielt.');
    process.exit(1);
  }

  console.log('');
  console.log('Gegenprobe:');
  let ok = true;
  for (const [d, s] of MUSS_DA_SEIN) {
    const da = fs.readFileSync(d, 'utf8').includes(s);
    console.log(`  ${da ? 'OK     ' : 'FEHLT  '} ${s.length > 48 ? s.slice(0, 47) + '…' : s}`);
    if (!da) ok = false;
  }
  for (const [d, s] of MUSS_WEG) {
    const weg = !fs.readFileSync(d, 'utf8').includes(s);
    console.log(`  ${weg ? 'OK     ' : 'NOCH DA'} weg: ${s}`);
    if (!weg) ok = false;
  }
  if (!ok) zurueckspielen('die Gegenprobe ist nicht sauber.');

  // de.js und en.js sind einfaches JavaScript - die kann node pruefen.
  // Chat.jsx NICHT: das ist JSX, und node versteht es nicht.
  const { execFileSync } = require('child_process');
  for (const d of [DE, EN]) {
    let gut = false;
    let fehler = '';
    try {
      execFileSync(process.execPath, ['--check', path.resolve(d)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      gut = true;
    } catch (e) {
      fehler = (e.stderr ? String(e.stderr) : '') || e.message;
    }
    console.log(`  ${gut ? 'OK     ' : 'FEHLER '} ${path.basename(d)} ist syntaktisch in Ordnung`);
    if (!gut) {
      console.log('');
      console.log(fehler);
      zurueckspielen(`${path.basename(d)} hat einen Schreibfehler.`);
    }
  }

  // Sind beide Listen gleich lang? Sonst sieht eine Sprache weniger.
  try {
    const zaehleSchritte = (datei) => {
      const t = fs.readFileSync(datei, 'utf8');
      const i = t.indexOf('schritte: [');
      if (i === -1) return -1;
      const j = t.indexOf(']', i);
      return (t.slice(i, j).match(/…'/g) || []).length;
    };
    const nDe = zaehleSchritte(DE);
    const nEn = zaehleSchritte(EN);
    const gleich = nDe === nEn && nDe === SCHRITT_ANZAHL();
    console.log(`  ${gleich ? 'OK     ' : 'ACHTUNG'} Saetze: deutsch ${nDe}, englisch ${nEn}, Zeiten ${SCHRITT_ANZAHL()}`);
    if (!gleich) zurueckspielen('die Listen sind unterschiedlich lang.');
  } catch (e) {
    console.log('  (Zaehlung nicht moeglich: ' + e.message + ')');
  }

  console.log('');
  console.log('FERTIG. Waehrend einer Suche steht jetzt der Reihe nach:');
  console.log('');
  console.log('   0.0 s   Ich schaue mir deine Frage an …');
  console.log('   1.5 s   Ich suche in Schweizer Shops …');
  console.log('   5.0 s   Vergleiche die Angebote …');
  console.log('  10.0 s   Wäge Vor- und Nachteile ab …');
  console.log('  16.0 s   Prüfe jede Aussage auf Belege …');
  console.log('');
  console.log('WICHTIG - jetzt bauen. Chat.jsx ist JSX, node kann es nicht');
  console.log('pruefen. Die einzige verlaessliche Pruefung ist:');
  console.log('');
  console.log('  npm run build');
  console.log('');
  console.log('Schlaegt der Bau fehl, liegt die Sicherung daneben.');
  console.log('');
  console.log('Und zur Erinnerung: das Pflichtenheft verlangt die ersten');
  console.log('Zeichen der ANTWORT unter 2 Sekunden. Das ist damit NICHT');
  console.log('erfuellt - Punkt 5 von Woche 2 bleibt offen.');
  console.log('');
}

function SCHRITT_ANZAHL() {
  return 5;
}

main();
