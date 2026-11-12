// ============================================
// SYNORA - Kiara Plus: Rechtstexte, Texte, Kaufknopf (Frontend)
// ============================================
// ZWEI LAEUFE:
//
//   1. Heute, ohne Zahlungslink:
//        node kaufStarten.js
//      Impressum (Uster), Datenschutz (Anthropic, OpenAI, Stripe),
//      AGB (Kiara Plus monatlich), alle Texte Premium -> Kiara Plus.
//      Der Kaufknopf bleibt aus.
//
//   2. Sobald der Stripe-Zahlungslink da ist:
//        node kaufStarten.js https://buy.stripe.com/...
//      Traegt nur noch den Link ein. Danach bei Railway
//      PREMIUM_VERKAUF=true - erst dann erscheint der Knopf.
//
// Was schon erledigt ist, wird beim zweiten Lauf uebersprungen.
//
// PRUEFUNG: am Ende laeuft "npm run build". Schlaegt der Bau fehl,
// werden ALLE Dateien zurueckgespielt.
//
// ============================================
// WAS SICH AENDERT UND WARUM
// ============================================
// Impressum      Adresse Kloten -> Uster (Umzug). Gerichtsstand Uster.
// Datenschutz    Jede Suchanfrage geht an Claude (Anthropic) und
//                ChatGPT (OpenAI) - beide fehlten in der Liste.
//                Perplexity stand dort mit "formuliert die Empfehlung",
//                das machen heute Claude und ChatGPT. Perplexity sucht
//                Erfahrungsberichte und bekannte Maengel.
//                Stripe kommt dazu, weil ab jetzt Geld fliesst.
// AGB            Kiara Plus monatlich, Freischaltung innert 12 Stunden.
// Texte DE/EN    "Premium" heisst jetzt "Kiara Plus".
// Kaufknopf      Darunter der Hinweis: dieselbe Mailadresse wie im Konto.
// ============================================

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ADRESSE = 'Brunnenstrasse 29A, 8610 Uster';
const ORT = 'Uster';

const link = (process.argv[2] || '').trim();
if (link && !/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link)) {
  console.log('');
  console.log('ABBRUCH: Das sieht nicht wie ein Stripe-Zahlungslink aus.');
  console.log('Erwartet: https://buy.stripe.com/... (ohne Leerzeichen, ohne Anhang)');
  console.log('Es wurde NICHTS geaendert.');
  process.exit(1);
}

const P = {
  premium: path.join('src', 'seiten', 'Premium.jsx'),
  recht: path.join('src', 'seiten', 'Rechtstext.jsx'),
  de: path.join('src', 'texte', 'de.js'),
  en: path.join('src', 'texte', 'en.js')
};

const NEUE_DIENSTLEISTER = [
  '{',
  "  firma: 'Anthropic, PBC',",
  "  land: 'USA',",
  "  zweck: 'Bewertet die Produkte und formuliert die Antwort (Claude)',",
  "  daten: 'Der Text deiner Anfrage und die gefundenen Angebote'",
  '},',
  '{',
  "  firma: 'OpenAI (ChatGPT-Schnittstelle)',",
  "  land: 'USA',",
  "  zweck: 'Bewertet die Produkte als zweite, unabh\u00e4ngige Meinung',",
  "  daten: 'Der Text deiner Anfrage und die gefundenen Angebote'",
  '},',
  '{',
  "  firma: 'Stripe Payments Europe, Limited',",
  "  land: 'Irland (Verarbeitung auch in den USA)',",
  "  zweck: 'Wickelt die Zahlung f\u00fcr Kiara Plus ab',",
  "  daten: 'Name, E-Mail-Adresse und Zahlungsdaten. SYNORA sieht keine Kartennummern.'",
  '},'
];

// art: 'text'      genau ein Vorkommen von alt -> neu
//      'regex'     genau ein Treffer von alt (RegExp) -> neu
//      'vorZeile'  Zeilen vor der Zeile davor einfuegen (Objekt-Klammer)
//      'nachZeile' Zeile(n) nach der Zeile einfuegen, die "zeile" enthaelt
// fertig: Text, an dem man erkennt, dass die Aenderung schon drin ist
const AENDERUNGEN = [
  // ---------- Impressum ----------
  { d: 'recht', was: 'Impressum Adresse', art: 'text',
    alt: "adresse: 'Flughafenstrasse 12, 8302 Kloten',", neu: `adresse: '${ADRESSE}',`, fertig: `adresse: '${ADRESSE}',` },
  { d: 'recht', was: 'Impressum Ort / Gerichtsstand', art: 'text',
    alt: "ort: 'Kloten',", neu: `ort: '${ORT}',`, fertig: `ort: '${ORT}',` },
  { d: 'recht', was: 'Zahlungsanbieter Stripe', art: 'text',
    alt: "zahlungsanbieter: ''", neu: "zahlungsanbieter: 'Stripe Payments Europe, Limited, Irland'",
    fertig: "zahlungsanbieter: 'Stripe Payments Europe, Limited, Irland'" },

  // ---------- Datenschutz ----------
  { d: 'recht', was: 'Perplexity: richtiger Zweck', art: 'text',
    alt: "zweck: 'Formuliert die Empfehlung und ordnet die Produkte',",
    neu: "zweck: 'Sucht Erfahrungsberichte und bekannte M\u00e4ngel zu Produkten',",
    fertig: "zweck: 'Sucht Erfahrungsberichte und bekannte M\u00e4ngel zu Produkten'," },
  { d: 'recht', was: 'Anthropic, OpenAI, Stripe in der Liste', art: 'vorZeile',
    zeile: "firma: 'Brevo (Sendinblue SAS)',", einfuegen: NEUE_DIENSTLEISTER, fertig: "firma: 'Anthropic, PBC'," },

  // ---------- AGB ----------
  { d: 'recht', was: 'AGB: Laufzeit monatlich', art: 'regex',
    alt: /Ein Premium-Abo l\u00e4uft ab dem Kauf f\u00fcr den gew\u00e4hlten Zeitraum [\u2013-] einen Monat oder\s+ein Jahr\. Es verl\u00e4ngert sich automatisch um denselben Zeitraum, solange du nicht\s+k\u00fcndigst\./,
    neu: 'Kiara Plus l\u00e4uft ab dem Kauf f\u00fcr einen Monat und verl\u00e4ngert sich automatisch um\n        einen weiteren Monat, solange du nicht k\u00fcndigst. Nach der Zahlung wird Kiara Plus\n        innert 12 Stunden f\u00fcr die E-Mail-Adresse deines SYNORA-Kontos freigeschaltet.',
    fertig: 'Kiara Plus l\u00e4uft ab dem Kauf f\u00fcr einen Monat' },
  { d: 'recht', was: 'AGB: nach der Kuendigung', art: 'regex',
    alt: /K\u00fcndigung bleibt Premium bis zum Ende des bezahlten Zeitraums aktiv, danach\s+wird dein Konto auf den Gratis-Tarif umgestellt\./,
    neu: 'K\u00fcndigung bleibt Kiara Plus bis zum Ende des bezahlten Monats aktiv, danach\n        wird dein Konto auf Kiara (gratis) umgestellt.',
    fertig: 'K\u00fcndigung bleibt Kiara Plus bis zum Ende' },
  { d: 'recht', was: 'AGB: Widerruf', art: 'text',
    alt: 'Du kannst ein Premium-Abo innerhalb von {WIDERRUF_TAGE} Tagen nach dem Kauf',
    neu: 'Du kannst Kiara Plus innerhalb von {WIDERRUF_TAGE} Tagen nach dem Kauf',
    fertig: 'Du kannst Kiara Plus innerhalb von {WIDERRUF_TAGE} Tagen' },
  { d: 'recht', was: 'AGB: nicht kaeuflich', art: 'text',
    alt: '<strong>Premium ist derzeit nicht k\u00e4uflich.</strong>',
    neu: '<strong>Kiara Plus ist derzeit nicht k\u00e4uflich.</strong>',
    fertig: '<strong>Kiara Plus ist derzeit nicht k\u00e4uflich.</strong>' },
  { d: 'recht', was: 'AGB: Preisseite (1)', art: 'text',
    alt: 'gelten die Preise, die dann auf der Premium-Seite stehen.',
    neu: 'gelten die Preise, die dann auf der Preisseite stehen.',
    fertig: 'gelten die Preise, die dann auf der Preisseite stehen.' },
  // Steht mehrfach in Rechtstext.jsx (gefunden 12.11.) - alle Stellen ersetzen
  { d: 'recht', was: 'AGB: Preisseite (alle Links)', art: 'textAlle',
    alt: '<a href="/premium">Premium-Seite</a>', neu: '<a href="/premium">Preisseite</a>',
    fertig: '<a href="/premium">Preisseite</a>' },

  // ---------- Texte Deutsch ----------
  { d: 'de', was: 'DE Menue', art: 'text', alt: "premium: 'Premium',", neu: "premium: 'Kiara Plus',", fertig: "premium: 'Kiara Plus'," },
  { d: 'de', was: 'DE Startseite Suchen', art: 'text', alt: "'{zahl} Suchen mit Premium'", neu: "'{zahl} Suchen mit Kiara Plus'", fertig: "'{zahl} Suchen mit Kiara Plus'" },
  { d: 'de', was: 'DE Preisalarm', art: 'text', alt: "'Preisalarm mit Premium'", neu: "'Preisalarm mit Kiara Plus'", fertig: "'Preisalarm mit Kiara Plus'" },
  { d: 'de', was: 'DE Limit-Hinweis', art: 'text', alt: 'Mit Premium suchst du weiter', neu: 'Mit Kiara Plus suchst du weiter', fertig: 'Mit Kiara Plus suchst du weiter' },
  { d: 'de', was: 'DE Limit-Knopf', art: 'text', alt: "limitKnopf: 'Premium ansehen',", neu: "limitKnopf: 'Kiara Plus ansehen',", fertig: "limitKnopf: 'Kiara Plus ansehen'," },
  { d: 'de', was: 'DE noch nicht kaufbar (Titel)', art: 'text',
    alt: "offenTitel: 'Premium kannst du gerade nicht kaufen',",
    neu: "offenTitel: 'Kiara Plus kannst du gerade noch nicht kaufen',",
    fertig: "offenTitel: 'Kiara Plus kannst du gerade noch nicht kaufen'," },
  { d: 'de', was: 'DE noch nicht kaufbar (Text)', art: 'regex',
    alt: /offenText: 'Das ist Absicht\.[^\n]*',/,
    neu: "offenText: 'Der Kauf wird gerade eingerichtet. Bis dahin suchst du mit Kiara gratis.',",
    fertig: "offenText: 'Der Kauf wird gerade eingerichtet." },
  { d: 'de', was: 'DE nur mit Abo', art: 'text', alt: "nurPremium: 'Preisalarme gibt es mit Premium.',", neu: "nurPremium: 'Preisalarme gibt es mit Kiara Plus.',", fertig: "nurPremium: 'Preisalarme gibt es mit Kiara Plus.'," },
  { d: 'de', was: 'DE Aktion', art: 'text', alt: 'ein Jahr Premium geschenkt', neu: 'ein Jahr Kiara Plus geschenkt', fertig: 'ein Jahr Kiara Plus geschenkt' },
  { d: 'de', was: 'DE Aktion bestaetigt', art: 'text', alt: 'schalten Premium frei', neu: 'schalten Kiara Plus frei', fertig: 'schalten Kiara Plus frei' },
  { d: 'de', was: 'DE Hinweis unter dem Kaufknopf', art: 'nachZeile', zeile: 'nochNichtKaeuflich:',
    einfuegen: ["kaufHinweis: 'Freischaltung innert 12 Stunden. Bitte bei Stripe dieselbe Mailadresse angeben wie bei deinem Konto.',"],
    fertig: 'kaufHinweis:' },

  // ---------- Texte Englisch ----------
  { d: 'en', was: 'EN Menue', art: 'text', alt: "premium: 'Premium',", neu: "premium: 'Kiara Plus',", fertig: "premium: 'Kiara Plus'," },
  { d: 'en', was: 'EN Startseite Suchen', art: 'text', alt: "'{zahl} searches with Premium'", neu: "'{zahl} searches with Kiara Plus'", fertig: "'{zahl} searches with Kiara Plus'" },
  { d: 'en', was: 'EN Preisalarm', art: 'text', alt: "'Price alerts with Premium'", neu: "'Price alerts with Kiara Plus'", fertig: "'Price alerts with Kiara Plus'" },
  { d: 'en', was: 'EN Limit-Hinweis', art: 'text', alt: 'With Premium you keep searching', neu: 'With Kiara Plus you keep searching', fertig: 'With Kiara Plus you keep searching' },
  { d: 'en', was: 'EN Limit-Knopf', art: 'text', alt: "limitKnopf: 'See Premium',", neu: "limitKnopf: 'See Kiara Plus',", fertig: "limitKnopf: 'See Kiara Plus'," },
  { d: 'en', was: 'EN noch nicht kaufbar (Titel)', art: 'text',
    alt: "offenTitel: 'You cannot buy Premium right now',",
    neu: "offenTitel: 'You cannot buy Kiara Plus just yet',",
    fertig: "offenTitel: 'You cannot buy Kiara Plus just yet'," },
  { d: 'en', was: 'EN noch nicht kaufbar (Text)', art: 'regex',
    alt: /offenText: 'That is on purpose\.[^\n]*',/,
    neu: "offenText: 'Checkout is being set up. Until then, Kiara is free.',",
    fertig: "offenText: 'Checkout is being set up." },
  { d: 'en', was: 'EN nur mit Abo', art: 'text', alt: "nurPremium: 'Price alerts come with Premium.',", neu: "nurPremium: 'Price alerts come with Kiara Plus.',", fertig: "nurPremium: 'Price alerts come with Kiara Plus.'," },
  { d: 'en', was: 'EN Aktion', art: 'text', alt: 'a year of Premium is on us', neu: 'a year of Kiara Plus is on us', fertig: 'a year of Kiara Plus is on us' },
  { d: 'en', was: 'EN Aktion bestaetigt', art: 'text', alt: 'unlock Premium once', neu: 'unlock Kiara Plus once', fertig: 'unlock Kiara Plus once' },
  { d: 'en', was: 'EN Hinweis unter dem Kaufknopf', art: 'nachZeile', zeile: 'nochNichtKaeuflich:',
    einfuegen: ["kaufHinweis: 'Unlocked within 12 hours. Please use the same email address at Stripe as for your account.',"],
    fertig: 'kaufHinweis:' },

  // ---------- Kaufknopf ----------
  { d: 'premium', was: 'Kaufknopf mit Hinweis', art: 'regex',
    alt: /<a className="btn-primary pr-knopf" href=\{`\$\{KAUF_PFAD\}\?stufe=\$\{s\.schluessel\}`\}>\s*\{t\('premium\.waehlen', \{ name: s\.name \}\)\}\s*<\/a>/,
    neu: [
      '<>',
      '                    <a className="btn-primary pr-knopf" href={KAUF_PFAD}>',
      "                      {t('premium.waehlen', { name: s.name })}",
      '                    </a>',
      "                    <div className=\"pr-hinweis-bald\">{t('premium.kaufHinweis')}</div>",
      '                  </>'
    ].join('\n'),
    fertig: "{t('premium.kaufHinweis')}" }
];

if (link) {
  // Ersetzt null ODER einen frueheren Link (z.B. erst Testlink, dann echter)
  AENDERUNGEN.push({ d: 'premium', was: 'Stripe-Zahlungslink', art: 'regex',
    alt: /const KAUF_PFAD = (?:null|'https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+');/,
    neu: `const KAUF_PFAD = '${link}';`, fertig: `const KAUF_PFAD = '${link}';` });
}

// ============================================

function zeitstempel() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}-${z(d.getHours())}-${z(d.getMinutes())}`;
}
function zaehlen(heu, nadel) {
  let n = 0; let i = heu.indexOf(nadel);
  while (i !== -1) { n++; i = heu.indexOf(nadel, i + nadel.length); }
  return n;
}
function treffer(t, a) {
  if (a.art === 'text') return zaehlen(t, a.alt);
  if (a.art === 'textAlle') return zaehlen(t, a.alt) >= 1 ? 1 : 0;
  if (a.art === 'regex') return (t.match(new RegExp(a.alt.source, 'g')) || []).length;
  return t.split('\n').filter((z) => z.includes(a.zeile)).length;
}

function main() {
  console.log('');
  console.log('SYNORA - Kiara Plus: Rechtstexte, Texte, Kaufknopf');
  console.log('==================================================');
  console.log('');
  console.log(`Impressum-Adresse:  ${ADRESSE}`);
  console.log(`Zahlungslink:       ${link || '(keiner - Kaufknopf bleibt aus)'}`);
  if (/\/test_/.test(link)) console.log('                    ACHTUNG: Testlink - damit fliesst KEIN echtes Geld.');
  console.log('');

  if (!fs.existsSync('package.json') || !fs.existsSync('src')) {
    console.log('ABBRUCH: Bitte im Ordner synora-frontend-main ausfuehren.');
    process.exit(1);
  }

  const roh = {}; const crlf = {}; const txt = {};
  for (const [k, p] of Object.entries(P)) {
    if (!fs.existsSync(p)) { console.log(`ABBRUCH: ${p} fehlt. Es wurde NICHTS geaendert.`); process.exit(1); }
    roh[k] = fs.readFileSync(p, 'utf8');
    crlf[k] = roh[k].includes('\r\n');
    txt[k] = roh[k].replace(/\r\n/g, '\n');
  }

  if (!link && /const KAUF_PFAD = '[^']+';/.test(txt.premium)) {
    console.log('Hinweis: Ein Zahlungslink ist schon eingetragen - er bleibt, wie er ist.');
    console.log('');
  }

  console.log('Pruefung:');
  let ok = true;
  const offen = [];
  for (const a of AENDERUNGEN) {
    const t = txt[a.d];
    if (t.includes(a.fertig) && !(a.art === 'textAlle' && t.includes(a.alt))) { console.log(`  schon da  ${a.was}`); continue; }
    const n = treffer(t, a);
    const gut = n === 1;
    if (!gut) ok = false; else offen.push(a);
    console.log(`  ${gut ? 'OK       ' : 'FEHLER   '} ${a.was}${gut ? '' : `  (${n} mal gefunden, erwartet: 1)`}`);
  }
  console.log('');
  if (!ok) { console.log('ABBRUCH. Es wurde NICHTS geaendert.'); process.exit(1); }
  if (offen.length === 0) { console.log('Alles schon eingebaut. Es wird nichts geaendert.'); process.exit(0); }

  for (const a of offen) {
    const t = txt[a.d];
    if (a.art === 'text') txt[a.d] = t.replace(a.alt, () => a.neu);
    else if (a.art === 'textAlle') txt[a.d] = t.split(a.alt).join(a.neu);
    else if (a.art === 'regex') txt[a.d] = t.replace(a.alt, () => a.neu);
    else {
      const zeilen = t.split('\n');
      const i = zeilen.findIndex((z) => z.includes(a.zeile));
      const einzug = zeilen[i].match(/^\s*/)[0];
      if (a.art === 'nachZeile') {
        zeilen.splice(i + 1, 0, ...a.einfuegen.map((z) => einzug + z));
      } else {
        // vor der oeffnenden Klammer des Objekts, in dem "zeile" steht
        let j = i - 1;
        while (j >= 0 && zeilen[j].trim() !== '{') j--;
        if (j < 0) { console.log(`ABBRUCH: Klammer vor "${a.zeile}" nicht gefunden. NICHTS geaendert.`); process.exit(1); }
        const e2 = zeilen[j].match(/^\s*/)[0];
        zeilen.splice(j, 0, ...a.einfuegen.map((z) => e2 + z));
      }
      txt[a.d] = zeilen.join('\n');
    }
  }

  const stempel = zeitstempel();
  const sich = {};
  for (const [k, p] of Object.entries(P)) { sich[k] = `${p}.sicherung-${stempel}`; fs.copyFileSync(p, sich[k]); }
  console.log('Sicherungen:');
  for (const s of Object.values(sich)) console.log('  ' + s);

  function zurueck(grund) {
    for (const [k, p] of Object.entries(P)) fs.copyFileSync(sich[k], p);
    console.log('');
    console.log(`ABBRUCH: ${grund}`);
    console.log('Alle 4 Dateien sind auf die alte Fassung zurueckgespielt.');
    process.exit(1);
  }

  for (const [k, p] of Object.entries(P)) fs.writeFileSync(p, crlf[k] ? txt[k].replace(/\n/g, '\r\n') : txt[k], 'utf8');

  // ---------- Gegenprobe ----------
  console.log('');
  console.log('Gegenprobe:');
  let sauber = true;
  const neu = {};
  for (const [k, p] of Object.entries(P)) neu[k] = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  for (const a of AENDERUNGEN) {
    const da = neu[a.d].includes(a.fertig) && !(a.art === 'textAlle' && neu[a.d].includes(a.alt));
    if (!da) sauber = false;
    if (!da) console.log(`  FEHLT    ${a.was}`);
  }
  console.log(`  ${sauber ? 'OK      ' : 'FEHLER  '} alle ${AENDERUNGEN.length} Aenderungen stehen in den Dateien`);
  for (const k of ['de', 'en']) {
    try {
      execSync(`node --check "${path.resolve(P[k])}"`, { stdio: ['ignore', 'pipe', 'pipe'] });
      console.log(`  OK       ${path.basename(P[k])} ist syntaktisch in Ordnung`);
    } catch (e) {
      sauber = false;
      console.log(`  FEHLER   ${path.basename(P[k])}: ${String(e.stderr || e.message).split('\n').slice(0, 3).join(' | ')}`);
    }
  }
  if (!sauber) zurueck('die Gegenprobe ist nicht sauber.');

  // Wo steht noch "Premium"? Nur zur Info, kein Fehler.
  const rest = [];
  for (const k of ['de', 'en', 'recht']) {
    neu[k].split('\n').forEach((z, i) => {
      if (/Premium/.test(z.replace(/nurPremium/g, '')) && !/^\s*\/\//.test(z) && !/schluessel|premium\./.test(z)) rest.push(`${path.basename(P[k])}:${i + 1}: ${z.trim().slice(0, 90)}`);
    });
  }

  // ---------- Bau ----------
  console.log('');
  console.log('Bau (npm run build) - das dauert eine Minute ...');
  try {
    execSync('npm run build', { stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000, env: { ...process.env, CI: '' } });
    console.log('  OK       Compiled - der Bau ist durchgelaufen');
  } catch (e) {
    const aus = String(e.stdout || '') + String(e.stderr || '');
    console.log(aus.split('\n').filter((z) => /error|fehl|failed|Syntax/i.test(z)).slice(0, 8).join('\n'));
    zurueck('der Bau ist fehlgeschlagen.');
  }

  console.log('');
  console.log('FERTIG.');
  if (rest.length) {
    console.log('');
    console.log('Hier steht noch "Premium" (zur Info - Aktion und Altes, bewusst nicht angefasst):');
    for (const r of rest.slice(0, 12)) console.log('  ' + r);
  }
  console.log('');
  if (link) {
    console.log('NAECHSTER SCHRITT: hochladen, dann bei Railway PREMIUM_VERKAUF=true.');
    console.log('Erst dann erscheint der Kaufknopf auf synora.li/premium.');
  } else {
    console.log('NAECHSTER SCHRITT: hochladen. Der Kaufknopf bleibt aus.');
    console.log('Sobald du den Stripe-Link hast:  node kaufStarten.js https://buy.stripe.com/...');
  }
  console.log('');
}

main();
