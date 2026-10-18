// ============================================
// SYNORA - Seitenwechsel
// ============================================
// Ein kleiner eigener Seitenwechsler statt react-router.
//
// WARUM NICHT REACT-ROUTER
//
// Ich habe dein Frontend nie gesehen und weiss nicht, ob
// react-router installiert ist - und wenn ja, in welcher
// Fassung. Version 5 und Version 6 sind nicht vertraeglich
// zueinander: ein Import aus der falschen Fassung bringt die
// ganze App zum Absturz, mit einer Fehlermeldung, die nichts
// erklaert.
//
// Diese Datei hat keine Abhaengigkeit ausser React. Sie laeuft
// also sicher, egal was in deiner package.json steht.
//
// WENN DU SPAETER DOCH REACT-ROUTER WILLST
// Die Umstellung ist klein: <Link> wird zu <Link> von
// react-router, useRoute() zu useLocation(), navigiere() zu
// useNavigate(). Alle Seiten bleiben unveraendert, weil keine
// Seite direkt mit der Navigation redet - sie benutzen nur
// diese drei Dinge.
//
// WICHTIG FUER VERCEL
// Damit /premium auch beim direkten Aufruf funktioniert (und
// nicht 404 gibt), braucht es eine vercel.json im Frontend mit:
//
//   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
//
// Ohne diese Datei funktionieren nur Klicks innerhalb der Seite,
// aber kein Lesezeichen und kein geteilter Link.
// ============================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouteKontext = createContext(null);

function jetzigerPfad() {
  try {
    return window.location.pathname || '/';
  } catch (_) {
    return '/';
  }
}

export function RouteAnbieter({ children }) {
  const [pfad, setPfad] = useState(jetzigerPfad);

  // Zurueck- und Vorwaerts-Knopf des Browsers.
  useEffect(() => {
    const beiWechsel = () => setPfad(jetzigerPfad());
    window.addEventListener('popstate', beiWechsel);
    return () => window.removeEventListener('popstate', beiWechsel);
  }, []);

  const navigiere = useCallback((ziel, { ersetzen = false } = {}) => {
    if (typeof ziel !== 'string' || !ziel.startsWith('/')) return;
    if (ziel === jetzigerPfad()) return;

    try {
      if (ersetzen) window.history.replaceState({}, '', ziel);
      else window.history.pushState({}, '', ziel);
    } catch (_) {
      // Sollte das Verlaufsobjekt nicht verfuegbar sein, lieber
      // ganz neu laden als haengen bleiben.
      window.location.href = ziel;
      return;
    }

    setPfad(ziel);

    // Nach einem Seitenwechsel oben anfangen. Ohne das landet
    // man auf der neuen Seite an der Stelle, an der man auf der
    // alten gescrollt hatte - ein Fehler, den fast jede selbst
    // gebaute Navigation hat.
    try { window.scrollTo(0, 0); } catch (_) { /* egal */ }
  }, []);

  return (
    <RouteKontext.Provider value={{ pfad, navigiere }}>
      {children}
    </RouteKontext.Provider>
  );
}

export function useRoute() {
  const k = useContext(RouteKontext);
  if (!k) throw new Error('useRoute braucht den RouteAnbieter um sich herum. Siehe App.jsx.');
  return k;
}

export function navigiereZu(ziel) {
  // Fuer Stellen ausserhalb einer Komponente (etwa api.js bei
  // einem abgelaufenen Token). Laedt die Seite neu - das ist
  // hier richtig, weil dabei ohnehin alles zurueckgesetzt
  // werden soll.
  try { window.location.href = ziel; } catch (_) { /* egal */ }
}

// ============================================
// Link
// ============================================
// Sieht aus wie ein normales <a>, verhaelt sich aber ohne
// Neuladen.
//
// WICHTIG: Es BLEIBT ein echtes <a href="...">. Damit
// funktionieren Rechtsklick, Mittelklick (neuer Tab),
// "Link kopieren" und Suchmaschinen weiterhin. Ein <div onClick>
// kann das alles nicht - und genau daran merkt man selbst
// gebaute Navigation.
export function Link({ to, children, className, onClick, ...rest }) {
  const { navigiere } = useRoute();

  function klick(e) {
    // Modifikatortasten in Ruhe lassen: Strg/Cmd+Klick soll
    // weiterhin einen neuen Tab oeffnen, nicht die Seite
    // wechseln.
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;

    e.preventDefault();
    if (onClick) onClick(e);
    navigiere(to);
  }

  return (
    <a href={to} className={className} onClick={klick} {...rest}>
      {children}
    </a>
  );
}

// ============================================
// Welche Seite wird angezeigt
// ============================================
// Die Zuordnung steht in App.jsx. Hier nur das Nachschlagen,
// inklusive einfacher Platzhalter wie /preisalarm/:id.
export function passt(muster, pfad) {
  if (muster === pfad) return {};

  const m = muster.split('/').filter(Boolean);
  const p = pfad.split('/').filter(Boolean);
  if (m.length !== p.length) return null;

  const werte = {};
  for (let i = 0; i < m.length; i++) {
    if (m[i].startsWith(':')) werte[m[i].slice(1)] = decodeURIComponent(p[i]);
    else if (m[i] !== p[i]) return null;
  }
  return werte;
}
