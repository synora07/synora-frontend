// ============================================
// SYNORA - Verlauf anzeigen (Noras Gedaechtnis, Teil 2)
// ============================================
// Teil 1 hat das Backend angeschlossen: /api/chat/history liefert jetzt
// die letzten Suchen aus dem Suchprotokoll.
//
// Hier wird die Seitenleiste angeschlossen. Bisher stand dort:
//
//   Chat-Verlauf  [BALD]
//   LETZTE CHATS
//   "Noch keine gespeicherten Unterhaltungen."
//
// Beides war ehrlich, solange das Backend nichts lieferte. Jetzt
// liefert es, also muss es weg.
//
// Was dazukommt:
//   - Der Verlauf wird beim Oeffnen geladen (nur wenn angemeldet)
//   - Die letzten Suchen stehen anklickbar in der Leiste
//   - Ein Klick setzt die Frage ins Eingabefeld - er sucht NICHT
//     von selbst. Eine Suche kostet SerpAPI-Kontingent, und niemand
//     soll es aus Versehen verbrauchen, nur weil er auf seinen
//     eigenen Verlauf tippt.
//   - Das Abzeichen "BALD" verschwindet
//
// Die Darstellung hat vorerst Stilangaben direkt im Code, damit keine
// zweite Datei angefasst werden muss. Das gehoert spaeter nach
// Chat.css - sichtbar falsch ist es nicht, nur unsauber.
//
// ============================================
// WIE DAS SKRIPT ARBEITET
// ============================================
//   - Erst eine Sicherung, dann die Aenderung
//   - ALLES ODER NICHTS: passt auch nur eine der fuenf Stellen nicht
//     genau einmal, wird NICHTS geaendert
//   - Zeilenenden bleiben, wie sie waren
//   - Zum Schluss eine Gegenprobe
//
// Aufruf im Ordner synora-frontend-main:
//   node verlaufZeigen.js
// ============================================

'use strict';

const fs = require('fs');
const path = require('path');

const ZIEL = path.join('src', 'seiten', 'Chat.jsx');

const AENDERUNGEN = [
  {
    was: '1/5  Hilfsfunktion fuer das Datum',
    alt:
`export default function Chat() {`,
    neu:
`// Kurzes Datum fuer die Seitenleiste: "08.11.". Mehr passt dort nicht
// hin, und das Jahr interessiert bei den letzten zwanzig Suchen nicht.
function datumKurz(wert) {
  try {
    return new Date(wert).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' });
  } catch (_) {
    return '';
  }
}

export default function Chat() {`
  },

  {
    was: '2/5  Zustand fuer den Verlauf',
    alt:
`  const [premiumZahl, setPremiumZahl] = useState(null);
  const [budget, setBudget] = useState(0);       // 0 = ohne Grenze`,
    neu:
`  const [premiumZahl, setPremiumZahl] = useState(null);
  const [verlauf, setVerlauf] = useState([]);    // letzte Suchen aus dem Konto
  const [budget, setBudget] = useState(0);       // 0 = ohne Grenze`
  },

  {
    was: '3/5  Verlauf beim Oeffnen laden',
    alt:
`  // Nach jeder neuen Nachricht nach unten rollen.
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, laeuft]);`,
    neu:
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
  }, [angemeldet]);

  // Nach jeder neuen Nachricht nach unten rollen.
  useEffect(() => {
    endeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [nachrichten, laeuft]);`
  },

  {
    was: '4/5  Abzeichen "BALD" entfernen',
    alt:
`            <span className="ch-nav-aus" title={t('chat.nochNicht')}>
              <span className="ch-symbol" aria-hidden="true">🕘</span>
              {t('chat.verlauf')}
              <span className="ch-bald">{t('allgemein.bald')}</span>
            </span>`,
    neu:
`            {/* Kein "BALD" mehr: der Verlauf steht seit dem 08.11.2026
                weiter unten in dieser Leiste. */}
            <span className="ch-nav-aus">
              <span className="ch-symbol" aria-hidden="true">🕘</span>
              {t('chat.verlauf')}
            </span>`
  },

  {
    was: '5/5  Die letzten Suchen anzeigen',
    alt:
`          <div className="ch-abschnitt">
            <h2>{t('chat.letzteChats')}</h2>
            {/* /api/chat/history gibt heute immer eine leere Liste
                zurueck (steht als TODO im Backend). Darum hier
                nicht eine erfundene Liste, sondern der Hinweis. */}
            <p className="ch-leer">{t('chat.verlaufLeer')}</p>
          </div>`,
    neu:
`          <div className="ch-abschnitt">
            <h2>{t('chat.letzteChats')}</h2>
            {/* Seit dem 08.11.2026 liefert /api/chat/history echte
                Daten aus dem Suchprotokoll. Ist noch nichts da -
                neues Konto, oder abgemeldet - bleibt der Hinweis. */}
            {verlauf.length === 0 ? (
              <p className="ch-leer">{t('chat.verlaufLeer')}</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {verlauf.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      title={v.frage}
                      onClick={() => { setEingabe(v.frage); eingabeRef.current?.focus(); }}
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
                        {v.frage}
                      </span>
                      <span style={{ opacity: 0.6, flexShrink: 0 }}>{datumKurz(v.zeit)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>`
  }
];

const MUSS_DA_SEIN = [
  'function datumKurz(wert)',
  'const [verlauf, setVerlauf] = useState([]);',
  'anfrage(PFADE.chatVerlauf)',
  'verlauf.map((v) =>'
];

const MUSS_WEG = [
  "<span className=\"ch-bald\">{t('allgemein.bald')}</span>"
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
  console.log('SYNORA - Verlauf in der Seitenleiste anzeigen');
  console.log('=============================================');
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

  if (txt.includes('const [verlauf, setVerlauf]')) {
    console.log('Die Datei ist bereits angeschlossen. Es wird nichts geaendert.');
    process.exit(0);
  }

  console.log('Pruefung der fuenf Stellen:');
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
    console.log('Schick die Ausgabe weiter, dann wird das Skript angepasst.');
    process.exit(1);
  }

  const sicherung = `${ZIEL}.sicherung-${zeitstempel()}`;
  fs.copyFileSync(ZIEL, sicherung);
  console.log(`Sicherung:    ${sicherung}`);

  for (const a of AENDERUNGEN) txt = txt.replace(a.alt, a.neu);

  if (hatCRLF) txt = txt.replace(/\n/g, '\r\n');
  fs.writeFileSync(ZIEL, txt, 'utf8');

  const neu = fs.readFileSync(ZIEL, 'utf8');
  console.log('');
  console.log('Gegenprobe:');

  let ok = true;
  for (const s of MUSS_DA_SEIN) {
    const da = neu.includes(s);
    console.log(`  ${da ? 'OK     ' : 'FEHLT  '} ${s}`);
    if (!da) ok = false;
  }
  for (const s of MUSS_WEG) {
    const weg = !neu.includes(s);
    console.log(`  ${weg ? 'OK     ' : 'NOCH DA'} das Abzeichen "BALD" ist verschwunden`);
    if (!weg) ok = false;
  }

  const auf = zaehlen(neu, '{');
  const zu = zaehlen(neu, '}');
  console.log(`  ${auf === zu ? 'OK     ' : 'ACHTUNG'} geschweifte Klammern: ${auf} auf, ${zu} zu`);
  if (auf !== zu) ok = false;

  console.log('');
  if (ok) {
    console.log('FERTIG. Die Seitenleiste zeigt jetzt den Verlauf.');
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
