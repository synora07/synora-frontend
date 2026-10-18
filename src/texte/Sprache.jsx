// ============================================
// SYNORA - Sprachumschalter
// ============================================
// Kein Paket, keine Abhaengigkeit. Rund hundert Zeilen, die
// genau das tun, was SYNORA braucht: Texte in zwei Sprachen,
// Platzhalter fuellen, Auswahl merken.
//
// SO BENUTZT DU ES
//
//   const { t, sprache, spracheSetzen } = useSprache();
//
//   t('start.titelHervor1')                  -> "WAS,"
//   t('start.kacheln.gratis.titel', {zahl:5})-> "5 Suchen im Monat"
//   t('chat.alleErgebnisse', { zahl: 12 })   -> "Alle 12 Ergebnisse anzeigen"
//
// Ganz oben in der App einmal:
//
//   <SpracheProvider><App /></SpracheProvider>
// ============================================

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import de from './de';
import en from './en';
import { meldungenSetzen } from '../api';

const SPRACHEN = { de, en };
const VORGABE = 'de';
const SCHLUESSEL = 'synora_sprache';

// ============================================
// Fehlende Uebersetzungen finden, bevor es jemand sieht
// ============================================
// Deutsch ist die Hauptsprache. Jeder Schluessel, den es dort
// gibt und in einer anderen Sprache nicht, wird beim Start im
// Entwicklungsmodus gemeldet.
//
// Ohne diese Pruefung faellt eine vergessene Uebersetzung erst
// auf, wenn ein englischsprachiger Besucher auf der Seite steht
// und dort ploetzlich ein deutsches Wort liest.

function schluesselSammeln(objekt, praefix = '', hinein = []) {
  for (const [name, wert] of Object.entries(objekt || {})) {
    const pfad = praefix ? `${praefix}.${name}` : name;
    if (wert && typeof wert === 'object' && !Array.isArray(wert)) {
      schluesselSammeln(wert, pfad, hinein);
    } else {
      hinein.push(pfad);
    }
  }
  return hinein;
}

function uebersetzungenPruefen() {
  const inDeutsch = schluesselSammeln(de);

  for (const [kuerzel, texte] of Object.entries(SPRACHEN)) {
    if (kuerzel === 'de') continue;

    const vorhanden = new Set(schluesselSammeln(texte));
    const fehlend = inDeutsch.filter((s) => !vorhanden.has(s));

    if (fehlend.length) {
      console.warn(
        `[sprache] ${fehlend.length} Text(e) fehlen in "${kuerzel}". ` +
        'Dort erscheint vorerst Deutsch:'
      );
      for (const s of fehlend.slice(0, 20)) console.warn('[sprache]   ' + s);
      if (fehlend.length > 20) console.warn(`[sprache]   … und ${fehlend.length - 20} weitere`);
    }
  }
}

// Nur beim Entwickeln. In Produktion soll die Konsole des
// Besuchers sauber bleiben.
try {
  // Create React App setzt NODE_ENV selbst: "development" beim
  // Entwickeln, "production" beim Bauen.
  //
  // Hier stand vorher zusaetzlich eine Abfrage fuer Vite. Die
  // ist raus - siehe die Begruendung in api.js.
  //
  // Hier stand ebenfalls ein "typeof process"-Schutz. Der war
  // im Browser immer falsch (siehe die ausfuehrliche
  // Begruendung in api.js), und darum lief diese Pruefung NIE -
  // auch nicht beim Entwickeln. Eine vergessene Uebersetzung
  // waere also erst aufgefallen, wenn jemand sie auf der Seite
  // liest.
  //
  // process.env.NODE_ENV allein ist sicher: webpack ersetzt es
  // beim Bauen durch "production" bzw. "development".
  const entwicklung = process.env.NODE_ENV !== 'production';
  if (entwicklung) uebersetzungenPruefen();
} catch (_) { /* egal */ }

// ============================================
// Einen Text holen
// ============================================
function ausPfad(objekt, pfad) {
  let hier = objekt;
  for (const teil of pfad.split('.')) {
    if (hier === null || hier === undefined) return undefined;
    hier = hier[teil];
  }
  return hier;
}

// {zahl} und {preis} ersetzen.
function fuellen(text, werte) {
  if (typeof text !== 'string' || !werte) return text;
  return text.replace(/\{(\w+)\}/g, (ganz, name) =>
    Object.prototype.hasOwnProperty.call(werte, name) ? String(werte[name]) : ganz
  );
}

export function textHolen(kuerzel, pfad, werte) {
  const gewaehlt = SPRACHEN[kuerzel] || SPRACHEN[VORGABE];

  let wert = ausPfad(gewaehlt, pfad);

  // ============================================
  // LIEBER DEUTSCH ALS EIN SCHLUESSELNAME
  // ============================================
  // Fehlt der Text in der gewaehlten Sprache, kommt der deutsche.
  // Die Alternative waere, "start.titelHervor1" auf der Seite
  // stehen zu haben - das sieht nach kaputter Software aus.
  if (wert === undefined && gewaehlt !== SPRACHEN[VORGABE]) {
    wert = ausPfad(SPRACHEN[VORGABE], pfad);
  }

  // Gibt es den Schluessel nirgends, ist das ein Tippfehler im
  // Code. Im Entwicklungsmodus laut, auf der Seite leer - ein
  // leerer Platz faellt weniger auf als Kauderwelsch.
  if (wert === undefined) {
    console.warn(`[sprache] Unbekannter Text: "${pfad}"`);
    return '';
  }

  if (Array.isArray(wert)) {
    return werte ? wert.map((e) => (typeof e === 'string' ? fuellen(e, werte) : e)) : wert;
  }

  return fuellen(wert, werte);
}

// ============================================
// Der Kontext
// ============================================
const SpracheKontext = createContext(null);

function gemerkteSprache() {
  try {
    const g = localStorage.getItem(SCHLUESSEL);
    if (g && SPRACHEN[g]) return g;
  } catch (_) { /* privates Fenster */ }

  // Noch nie gewaehlt: nach der Browsersprache richten.
  try {
    const browser = String(navigator.language || '').slice(0, 2).toLowerCase();
    if (SPRACHEN[browser]) return browser;
  } catch (_) { /* kein navigator */ }

  return VORGABE;
}

export function SpracheProvider({ children }) {
  const [sprache, setSprache] = useState(gemerkteSprache);

  useEffect(() => {
    try { localStorage.setItem(SCHLUESSEL, sprache); } catch (_) { /* egal */ }

    // Wichtig fuer Vorleseprogramme und fuer Google: ohne
    // lang-Attribut liest ein Screenreader englischen Text mit
    // deutscher Aussprache vor.
    try { document.documentElement.lang = sprache; } catch (_) { /* egal */ }

    // api.js kommt an useSprache() nicht heran - es ist keine
    // Komponente. Darum bekommt es seine Meldungen von hier.
    try {
      meldungenSetzen({
        keineVerbindung: textHolen(sprache, 'netz.keineVerbindung'),
        fehlerMitNummer: textHolen(sprache, 'netz.fehlerMitNummer'),
        zuLange: textHolen(sprache, 'netz.zuLange')
      });
    } catch (_) { /* egal */ }
  }, [sprache]);

  const wert = useMemo(() => ({
    sprache,
    spracheSetzen: (neu) => { if (SPRACHEN[neu]) setSprache(neu); },
    verfuegbar: Object.entries(SPRACHEN).map(([k, v]) => ({
      kuerzel: k,
      kurz: v.sprache.kuerzel,
      name: v.sprache.name
    })),
    t: (pfad, werte) => textHolen(sprache, pfad, werte)
  }), [sprache]);

  return <SpracheKontext.Provider value={wert}>{children}</SpracheKontext.Provider>;
}

export function useSprache() {
  const k = useContext(SpracheKontext);

  // Ohne Provider wuerde jede Komponente abstuerzen. Stattdessen
  // Deutsch und eine Warnung - eine fehlende Klammer ganz oben
  // soll nicht die ganze Seite schwarz machen.
  if (!k) {
    return {
      sprache: VORGABE,
      spracheSetzen: () => {},
      verfuegbar: [],
      t: (pfad, werte) => textHolen(VORGABE, pfad, werte)
    };
  }

  return k;
}