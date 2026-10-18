// ============================================
// SYNORA - Zugriff auf das Backend
// ============================================
// Eine Stelle fuer alle Anfragen ans Backend. Vorher stand die
// Adresse in jeder Komponente neu - wer sie aendert, muss sonst
// jede Datei anfassen und vergisst eine.
//
// WOHIN DIE ANFRAGEN GEHEN
// Lokal:      http://localhost:5000
// Produktion: https://api.synora.li
//
// Gesetzt wird das ueber VITE_API_URL (Vite) oder
// REACT_APP_API_URL (Create React App). Welches von beiden deine
// App benutzt, erkennt die Datei selbst - du musst nichts
// umstellen.
// ============================================

function basisAdresse() {
  // ============================================
  // CREATE REACT APP, NICHT VITE
  // ============================================
  // Deine package.json sagt "react-scripts": "5.0.1" - das ist
  // Create React App. Dort heissen Umgebungsvariablen
  // REACT_APP_* und werden beim Bauen fest eingesetzt.
  //
  // Hier stand vorher zusaetzlich eine Abfrage auf
  // import.meta.env fuer Vite. Die ist raus: import.meta ist
  // Modul-Syntax, die der Babel-Schritt von CRA 5 nicht
  // zuverlaessig uebersetzt - im schlechtesten Fall bricht der
  // Build mit einer Meldung ab, die nichts erklaert.
  //
  // WENN DU SPAETER AUF VITE WECHSELST
  // Dann wird aus der Zeile unten:
  //     import.meta.env.VITE_API_URL
  // Eine Zeile, eine Datei.
  // ============================================
  // HIER STAND EIN SCHUTZ, DER ALLES KAPUTT GEMACHT HAT
  // ============================================
  // GEFUNDEN AM 06.10.2026 - und zwar nur, weil ich die AGB
  // gegen ein Test-Backend laufen liess und mich wunderte,
  // warum keine Preise erschienen.
  //
  // Vorher stand hier:
  //
  //     if (typeof process !== 'undefined' && process.env && ...)
  //
  // Das sieht nach Vorsicht aus, ist aber genau falsch herum.
  //
  // WARUM
  // Beim Bauen ersetzt webpack den Ausdruck
  // process.env.REACT_APP_API_URL durch den Wert - aus
  //     process.env.REACT_APP_API_URL
  // wird woertlich
  //     "https://api.synora.li"
  // Dafuer braucht der Browser kein process.
  //
  // Den Ausdruck  typeof process  ersetzt webpack aber NICHT.
  // Der bleibt stehen und wird im Browser ausgefuehrt - und
  // dort gibt es kein process. Create React App 5 baut auf
  // webpack 5, und webpack 5 hat die Nachbildung von process
  // entfernt, die es in Version 4 noch gab.
  //
  // Ergebnis: Die Bedingung war IMMER falsch. Die Zeile
  // dahinter wurde nie erreicht. Die Adresse stand richtig im
  // fertigen Build - sie wurde nur nie gelesen.
  //
  // WAS DAS BEDEUTET HAETTE
  // Auf Vercel waere jede Anfrage an http://localhost:5000
  // gegangen, also an den Rechner des Besuchers. Kein Login,
  // keine Suche, keine Preise - und in der Konsole nur
  // "connection refused". Auf deinem eigenen Rechner waere es
  // nicht aufgefallen, weil dort tatsaechlich ein Server auf
  // 5000 laeuft.
  //
  // Die Vorgabe unten bleibt - aber sie greift jetzt wirklich
  // nur noch, wenn nichts gesetzt ist.
  const gesetzt = process.env.REACT_APP_API_URL;
  if (gesetzt) return String(gesetzt).replace(/\/+$/, '');

  // Nichts gesetzt: lokal entwickeln.
  return 'http://localhost:5000';
}

export const API = basisAdresse();

// ============================================
// MELDUNGEN IN DER RICHTIGEN SPRACHE
// ============================================
// api.js ist keine Komponente und kommt an useSprache() nicht
// heran. Darum traegt SpracheProvider die Texte beim Start hier
// ein.
//
// Die Vorgaben unten sind nur da, falls das einmal nicht
// passiert - ein deutscher Satz ist besser als ein leerer.
export const MELDUNGEN = {
  keineVerbindung: 'Keine Verbindung zu SYNORA. Prüfe deine Internetverbindung.',
  fehlerMitNummer: 'Fehler {status}',
  zuLange: 'SYNORA antwortet gerade nicht. Versuch es in einer Minute nochmal.'
};

export function meldungenSetzen(neu) {
  if (neu && typeof neu === 'object') Object.assign(MELDUNGEN, neu);
}

// ============================================
// Anmeldung
// ============================================
const SCHLUESSEL = 'synora_token';

// ============================================
// "ANGEMELDET BLEIBEN" - UND ZWAR WIRKLICH
// ============================================
// Das Haekchen auf der Anmeldeseite muss etwas tun, sonst ist es
// eine Luege in einem Formular.
//
//   angehakt:     localStorage   - bleibt, bis man sich abmeldet
//   nicht:        sessionStorage - weg, sobald der Tab zugeht
//
// Das ist der Unterschied, den ein Nutzer erwartet, und es
// braucht keine Aenderung am Backend. Richtig waere zusaetzlich
// eine kuerzere Laufzeit des Tokens vom Server - das kommt
// spaeter dazu und aendert an dieser Stelle nichts.
//
// Gelesen wird aus BEIDEN Speichern: Wer sich einmal mit und
// einmal ohne Haekchen angemeldet hat, soll nicht je nach
// Reihenfolge herausfliegen.

function speicher(dauerhaft) {
  return dauerhaft ? localStorage : sessionStorage;
}

export function tokenLesen() {
  try {
    // ============================================
    // DEN ALTEN SCHLUESSEL AUCH LESEN
    // ============================================
    // Dein bisheriges public/js/auth.js speichert den Token
    // unter "token", dein public/js/api.js unter
    // "synora_token" - zwei verschiedene Namen in zwei Dateien
    // desselben Projekts.
    //
    // Wirksam war auth.js, also liegt bei allen, die sich bisher
    // angemeldet haben, ein Token unter "token".
    //
    // Ohne diese Zeile waeren die beim ersten Besuch der neuen
    // Seite ploetzlich abgemeldet - ohne zu verstehen, warum.
    return localStorage.getItem(SCHLUESSEL)
        || sessionStorage.getItem(SCHLUESSEL)
        || localStorage.getItem('token')
        || null;
  } catch (_) {
    // Privates Fenster oder gesperrte Speicherung. Kein Grund
    // abzustuerzen - der Nutzer ist dann eben nicht angemeldet.
    return null;
  }
}

export function tokenSetzen(token, dauerhaft = true) {
  try {
    // Immer zuerst beide leeren. Sonst bleibt beim Wechsel von
    // "mit Haekchen" auf "ohne" der alte Token im localStorage
    // liegen - und das Haekchen waere wieder wirkungslos.
    localStorage.removeItem(SCHLUESSEL);
    sessionStorage.removeItem(SCHLUESSEL);

    if (token) speicher(dauerhaft).setItem(SCHLUESSEL, token);
  } catch (_) { /* siehe oben */ }
}

export function istAngemeldet() {
  return !!tokenLesen();
}

// ============================================
// Die eigentliche Anfrage
// ============================================
// WARUM HIER NICHTS GEWORFEN WIRD
//
// Ein fetch, das wirft, reisst die ganze Seite ab, wenn es
// jemand nicht abfaengt. Stattdessen kommt immer ein Objekt
// zurueck:
//
//   { ok: true,  daten }
//   { ok: false, fehler: 'Text fuer den Nutzer', status }
//
// Die Komponente prueft .ok und zeigt .fehler an. Kein
// try/catch in jeder Datei, keine weisse Seite.

export async function anfrage(pfad, { methode = 'GET', koerper = null, mitToken = true } = {}) {
  const kopf = { 'Content-Type': 'application/json' };

  if (mitToken) {
    const t = tokenLesen();
    if (t) kopf.Authorization = `Bearer ${t}`;
  }

  // ============================================
  // ZEITGRENZE - SONST WARTET DIE SEITE EWIG
  // ============================================
  // GEFUNDEN am 10.10.2026 beim Haertetest: Hier stand keine
  // Zeitgrenze. Ich habe das Backend absichtlich haengen lassen
  // und nachgesehen, was passiert - nach zwoelf Sekunden stand
  // auf der Premium-Seite immer noch "Preise werden geladen",
  // ohne jeden Hinweis.
  //
  // Ohne eigene Grenze gilt nur die des Browsers, und die liegt
  // bei rund fuenf Minuten. So lange schaut niemand zu; der
  // Besucher denkt, die Seite ist kaputt, und geht.
  //
  // Das ist kein erfundener Fall: Railway faehrt Dienste bei
  // Nichtbenutzung herunter, und der erste Aufruf danach kann
  // dauern. Dasselbe bei einer Stoerung bei MongoDB Atlas.
  //
  // WARUM 20 SEKUNDEN
  // Eine Suche ist der langsamste Fall: SerpAPI fragen, dann
  // zwei Sprachmodelle. Perplexity allein hat 25 Sekunden
  // Zeitlimit. Darum fuer die Suche mehr Zeit als fuer den Rest -
  // sonst bricht eine Suche ab, die noch laeuft.
  const grenzeMs = pfad.startsWith('/api/chat') ? 45000 : 20000;
  const abbruch = new AbortController();
  const uhr = setTimeout(() => abbruch.abort(), grenzeMs);

  let antwort;
  try {
    antwort = await fetch(`${API}${pfad}`, {
      method: methode,
      headers: kopf,
      body: koerper ? JSON.stringify(koerper) : undefined,
      signal: abbruch.signal
    });
  } catch (e) {
    clearTimeout(uhr);

    // Zeitgrenze gerissen - das ist etwas anderes als "kein Netz",
    // und der Nutzer soll den Unterschied sehen. Beim einen hilft
    // es, die Verbindung zu pruefen; beim anderen nur Warten.
    if (e && e.name === 'AbortError') {
      return {
        ok: false,
        status: 0,
        fehler: MELDUNGEN.zuLange || MELDUNGEN.keineVerbindung
      };
    }

    // Netzwerk weg, Server aus, falsche Adresse. Der Nutzer kann
    // mit "Failed to fetch" nichts anfangen.
    return {
      ok: false,
      status: 0,
      fehler: MELDUNGEN.keineVerbindung
    };
  }
  clearTimeout(uhr);

  let daten = null;
  try {
    const text = await antwort.text();
    daten = text ? JSON.parse(text) : null;
  } catch (_) {
    daten = null;
  }

  if (!antwort.ok) {
    // Das Backend schickt den Grund mal als error, mal als grund.
    // Beides annehmen, statt sich auf eines zu verlassen.
    const grund =
      (daten && (daten.error || daten.grund || daten.message)) ||
      MELDUNGEN.fehlerMitNummer.replace('{status}', antwort.status);

    // 401 heisst: Token abgelaufen oder ungueltig. Dann weg
    // damit, sonst haengt der Nutzer in einem Zustand fest, in
    // dem er angemeldet SCHEINT, aber nichts funktioniert.
    if (antwort.status === 401) tokenSetzen(null);

    return { ok: false, status: antwort.status, fehler: String(grund), daten };
  }

  return { ok: true, status: antwort.status, daten };
}

// ============================================
// Die Zahlen, die auf den Seiten stehen
// ============================================
// NIE Preise oder Suchgrenzen im Frontend hartcodieren. Genau
// daran ist die Design-Vorlage gescheitert: dort standen
// "3 kostenlose Suchen" und "Unbegrenzt mit Account", waehrend
// das Backend null und fuenf erlaubte.
//
// Diese Funktion holt die Zahlen von dort, wo sie gelten.
export async function einstellungenHolen() {
  return anfrage('/api/einstellungen', { mitToken: false });
}

export function franken(betrag) {
  const n = Number(betrag);
  if (!Number.isFinite(n)) return '';
  return n % 1 === 0 ? `CHF ${n}.–` : `CHF ${n.toFixed(2)}`;
}