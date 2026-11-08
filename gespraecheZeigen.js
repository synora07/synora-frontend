// ============================================
// SYNORA - Gespraeche in der Seitenleiste (Teil 2)
// ============================================
// Das Backend speichert seit heute ganze Gespraeche und liefert sie
// unter /api/chat/history und /api/chat/history/:id.
//
// Hier wird das Frontend angeschlossen:
//
//   - Jede Nachricht traegt die Nummer des Gespraechs mit. Der Server
//     schickt sie in der Antwort zurueck, sie geht beim naechsten Mal
//     wieder hin. "Neuer Chat" setzt sie zurueck.
//   - Die Seitenleiste zeigt Gespraeche, nicht einzelne Suchen.
//   - Ein Klick oeffnet das ganze Gespraech - Fragen, Antworten,
//     Produktkarten.
//
// ============================================
// DER KERN: EINE FUNKTION FUER BEIDE WEGE
// ============================================
// nachrichtAusAntwort() baut aus einer Serverantwort die Nachricht
// fuer die Anzeige. Sie wird an ZWEI Stellen benutzt:
//
//   1. bei einer frischen Antwort
//   2. beim Wiederoeffnen eines gespeicherten Gespraechs
//
// Dadurch sieht ein alter Chat genauso aus wie ein neuer. Haette man
// zwei getrennte Wege, wuerden sie mit der Zeit auseinanderlaufen -
// und niemand merkt es, bis ein Nutzer ein altes Gespraech oeffnet.
//
// ============================================
// EINE UMBENENNUNG, DIE SEIN MUSS
// ============================================
// Bisher hiess die Liste in der Seitenleiste "verlauf". Innerhalb von
// senden() heisst aber auch die Gespraechs-Historie fuers Backend so:
//
//   const verlauf = verlaufFuerBackend();
//
// Zwei verschiedene Dinge, ein Name. Das funktioniert zwar, ist aber
// eine Falle fuer spaeter. Die Seitenleiste heisst jetzt "gespraeche".
//
// Aufruf im Ordner synora-frontend-main:
//   node gespraecheZeigen.js
// ============================================

'use strict';

const fs = require('fs');
const path = require('path');

const ZIEL = path.join('src', 'seiten', 'Chat.jsx');

const AENDERUNGEN = [
  {
    was: '1/5  Funktion nachrichtAusAntwort()',
    alt: `export default function Chat() {`,
    neu:
`// ============================================
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

export default function Chat() {`
  },

  {
    was: '2/5  Zustand: Gespraechsliste und laufende Nummer',
    alt: `  const [verlauf, setVerlauf] = useState([]);    // letzte Suchen aus dem Konto`,
    neu:
`  const [gespraeche, setGespraeche] = useState([]);  // Liste in der Seitenleiste
  const [chatId, setChatId] = useState(null);        // das laufende Gespraech`
  },

  {
    was: '3/5  Gespraechsliste laden und oeffnen',
    alt:
`  // ---------- Verlauf laden ----------
  // Nur fuer Angemeldete: ohne Konto gibt es nichts zu zeigen, und die
  // Anfrage waere eine 401. Faellt sie aus, bleibt der Verlauf leer und
  // es steht wieder der Hinweis da - nie eine Fehlermeldung.
  useEffect(() => {
    if (!angemeldet) return undefined;
    let weg = false;
    (async () => {
      const r = await anfrage(PFADE.chatVerlauf);
      if (weg || !r.ok) return;
      const liste = r.daten && r.daten.history;
      setVerlauf(Array.isArray(liste) ? liste : []);
    })();
    return () => { weg = true; };
  }, [angemeldet]);`,
    neu:
`  // ---------- Gespraechsliste laden ----------
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
    const r = await anfrage(\`\${PFADE.chatVerlauf}/\${id}\`);
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
  }`
  },

  {
    was: '4/5  Senden: Nummer mitschicken und zurueckschreiben',
    vonBis: ['    const r = await anfrage(PFADE.chat, {', '    if (d.limit || d.stand) setStand(d.limit || d.stand);'],
    neu:
`    const r = await anfrage(PFADE.chat, {
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

    if (d.limit || d.stand) setStand(d.limit || d.stand);`
  },

  {
    was: '5/5  Seitenleiste: Gespraeche statt Suchen',
    alt:
`            {verlauf.length === 0 ? (
              <p className="ch-leer">{t('chat.verlaufLeer')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {verlauf.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      title={v.frage}
                      onClick={() => { setEingabe(v.frage); eingabeRef.current?.focus(); }}`,
    neu:
`            {gespraeche.length === 0 ? (
              <p className="ch-leer">{t('chat.verlaufLeer')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {gespraeche.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      title={v.titel}
                      onClick={() => gespraechOeffnen(v.id)}`
  },

  {
    was: '5b/5 Seitenleiste: Titel statt Frage',
    alt:
`                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.frage}
                      </span>`,
    neu:
`                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.titel}
                      </span>`
  },

  {
    was: '5c/5 Neuer Chat setzt die Nummer zurueck',
    alt:
`  function neuerChat() {
    setNachrichten([]);
    setEingabe('');
    setLimitVoll(false);
    eingabeRef.current?.focus();
  }`,
    neu:
`  function neuerChat() {
    setNachrichten([]);
    setEingabe('');
    setLimitVoll(false);
    // Ohne das landen die naechsten Nachrichten im alten Gespraech.
    setChatId(null);
    eingabeRef.current?.focus();
  }`
  }
];

const MUSS_DA_SEIN = [
  'function nachrichtAusAntwort(d)',
  'const [gespraeche, setGespraeche] = useState([]);',
  'const [chatId, setChatId] = useState(null);',
  'async function gespraechOeffnen(id)',
  'gespraecheNachladen();',
  'onClick={() => gespraechOeffnen(v.id)}',
  'if (d.chatId) setChatId(d.chatId);',
  'setChatId(null);'
];

const MUSS_WEG = ['setVerlauf(', 'verlauf.map((v)'];

// ============================================

function zeitstempel() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}-${z(d.getHours())}-${z(d.getMinutes())}`;
}

function zaehlen(h, n) {
  let z = 0;
  let i = h.indexOf(n);
  while (i !== -1) { z++; i = h.indexOf(n, i + n.length); }
  return z;
}

/** Spanne zwischen zwei Markierungen finden, beide eingeschlossen. */
function spanne(txt, von, bis) {
  const a = txt.indexOf(von);
  if (a === -1) return null;
  const b = txt.indexOf(bis, a);
  if (b === -1) return null;
  return { von: a, bis: b + bis.length };
}

function main() {
  console.log('');
  console.log('SYNORA - Gespraeche in der Seitenleiste');
  console.log('=======================================');
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

  if (txt.includes('function nachrichtAusAntwort')) {
    console.log('Bereits angeschlossen. Es wird nichts geaendert.');
    process.exit(0);
  }

  console.log('Pruefung:');
  let ok = true;
  for (const a of AENDERUNGEN) {
    if (a.vonBis) {
      const s = spanne(txt, a.vonBis[0], a.vonBis[1]);
      if (s) console.log(`  OK      ${a.was}`);
      else { console.log(`  FEHLER  ${a.was}  (Bereich nicht gefunden)`); ok = false; }
    } else {
      const n = zaehlen(txt, a.alt);
      if (n === 1) console.log(`  OK      ${a.was}`);
      else { console.log(`  FEHLER  ${a.was}  (${n} mal gefunden, erwartet: 1)`); ok = false; }
    }
  }
  console.log('');

  if (!ok) {
    console.log('ABBRUCH. Es wurde NICHTS geaendert.');
    process.exit(1);
  }

  const sicherung = `${ZIEL}.sicherung-${zeitstempel()}`;
  fs.copyFileSync(ZIEL, sicherung);
  console.log(`Sicherung:    ${sicherung}`);

  for (const a of AENDERUNGEN) {
    if (a.vonBis) {
      const s = spanne(txt, a.vonBis[0], a.vonBis[1]);
      txt = txt.slice(0, s.von) + a.neu + txt.slice(s.bis);
    } else {
      txt = txt.replace(a.alt, a.neu);
    }
  }

  if (hatCRLF) txt = txt.replace(/\n/g, '\r\n');
  fs.writeFileSync(ZIEL, txt, 'utf8');

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
    console.log(`  ${weg ? 'OK     ' : 'NOCH DA'} ${s} ist ersetzt`);
    if (!weg) probeOk = false;
  }

  const auf = zaehlen(neu, '{');
  const zu = zaehlen(neu, '}');
  console.log(`  ${auf === zu ? 'OK     ' : 'ACHTUNG'} geschweifte Klammern: ${auf} auf, ${zu} zu`);
  if (auf !== zu) probeOk = false;

  console.log('');
  if (probeOk) {
    console.log('FERTIG. Die Seitenleiste zeigt jetzt ganze Gespraeche.');
    console.log('');
    console.log('Naechster Schritt:  npm run build');
  } else {
    console.log('ACHTUNG: Die Gegenprobe ist nicht sauber.');
    console.log(`Die alte Fassung liegt hier: ${sicherung}`);
    process.exit(1);
  }
  console.log('');
}

main();
