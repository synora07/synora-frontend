// ============================================
// SYNORA - tauscht die Kontaktadresse
// ============================================
//   node mailTauschen.js
//
//   hallo@synora.li  ->  info@synora.li
//
// WARUM
// Im Impressum und in der Datenschutzerklaerung stand
// hallo@synora.li. Gelesen wird aber info@synora.li. Eine
// Kontaktadresse, die niemand liest, ist schlimmer als gar
// keine: Sie sieht aus wie ein Versprechen.
//
// WO
//   src/bausteine/Fusszeile.jsx   KONTAKT_MAIL
//   src/seiten/Rechtstext.jsx     ANGABEN.email
//
// SICHERHEIT
// In jeder Datei muss die Adresse GENAU EINMAL vorkommen.
// Stimmt die Zahl irgendwo nicht, wird KEINE Datei angefasst -
// auch nicht die, bei der es gestimmt haette. Lieber gar nichts
// als die Haelfte.
//
// Vorher wird von jeder Datei eine Sicherung angelegt.
// Zweimal laufen lassen ist harmlos.
// ============================================
'use strict';

const fs = require('fs');
const path = require('path');

const ALT = 'hallo@synora.li';
const NEU = 'info@synora.li';

const DATEIEN = [
  path.join('src', 'bausteine', 'Fusszeile.jsx'),
  path.join('src', 'seiten', 'Rechtstext.jsx')
];

function raus(text, code) { console.log(text); process.exit(code); }

console.log('\n' + '='.repeat(58));
console.log(`${ALT}  ->  ${NEU}`);
console.log('='.repeat(58) + '\n');

// ---------- Erst alles lesen und zaehlen, nichts schreiben ----------
const geplant = [];
let schonFertig = 0;

for (const datei of DATEIEN) {
  if (!fs.existsSync(datei)) {
    raus(`FEHLER: ${datei} nicht gefunden.\n` +
         'Bitte aus dem Ordner synora-frontend-main starten.\n', 1);
  }
  const inhalt = fs.readFileSync(datei, 'utf8');
  const treffer = inhalt.split(ALT).length - 1;
  const schon = inhalt.split(NEU).length - 1;

  if (treffer === 0 && schon >= 1) {
    console.log(`  ${datei}`);
    console.log(`      steht schon auf ${NEU}`);
    schonFertig++;
    continue;
  }
  if (treffer !== 1) {
    raus(
      `  ${datei}\n` +
      `      ${treffer}x gefunden, erwartet 1\n\n` +
      'Die Datei sieht anders aus als erwartet.\n' +
      'Es wurde NICHTS geaendert, auch nicht in der anderen Datei.\n' +
      'Schick sie mir, dann schaue ich es mir an.\n', 1
    );
  }
  geplant.push({ datei, inhalt });
  console.log(`  ${datei}`);
  console.log(`      1x gefunden - wird getauscht`);
}

if (geplant.length === 0) {
  raus('\nAlles steht schon richtig. Nichts zu tun.\n', 0);
}

// ---------- Sicherungen ZUERST ----------
console.log('\nSicherungen:');
const stempel = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
for (const { datei, inhalt } of geplant) {
  const sicherung = `${datei}.vorher-${stempel}`;
  fs.writeFileSync(sicherung, inhalt, 'utf8');
  console.log('  ' + path.basename(sicherung));
}

// ---------- Jetzt schreiben ----------
for (const { datei, inhalt } of geplant) {
  fs.writeFileSync(datei, inhalt.split(ALT).join(NEU), 'utf8');
}

// ---------- Gegenprobe: wirklich keine mehr da ----------
console.log('\nGegenprobe:');
let schlecht = 0;
for (const datei of DATEIEN) {
  const jetzt = fs.readFileSync(datei, 'utf8');
  const alt = jetzt.split(ALT).length - 1;
  const neu = jetzt.split(NEU).length - 1;
  const ok = alt === 0 && neu >= 1;
  if (!ok) schlecht++;
  console.log(`  ${ok ? 'ok  ' : 'FEHL'}  ${datei}   alt: ${alt}   neu: ${neu}`);
}

// ---------- Und sind die Dateien noch heil? ----------
// Ein Tausch in einer Zeichenkette kann JSX nicht kaputt machen,
// aber pruefen kostet nichts. Zaehlt nur die Klammern.
console.log('\nKlammern unveraendert:');
for (const { datei, inhalt } of geplant) {
  const jetzt = fs.readFileSync(datei, 'utf8');
  const zaehle = (t, z) => t.split(z).length - 1;
  const gleich = ['{', '}', '(', ')'].every((z) => zaehle(inhalt, z) === zaehle(jetzt, z));
  if (!gleich) schlecht++;
  console.log(`  ${gleich ? 'ok  ' : 'FEHL'}  ${datei}`);
}

console.log('\n' + '-'.repeat(58));
if (schlecht) {
  console.log('Etwas stimmt nicht. Die Sicherungen liegen daneben.');
  process.exit(1);
}
console.log('Getauscht. Naechster Schritt: npm start und das Impressum');
console.log('ansehen - dort muss jetzt info@synora.li stehen.');
console.log('-'.repeat(58) + '\n');
