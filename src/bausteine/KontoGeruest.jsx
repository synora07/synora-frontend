// ============================================
// SYNORA - Geruest fuer Anmelden, Registrieren, Passwort
// ============================================
// Alle drei Seiten sehen in deiner Vorlage gleich aus: links
// Text, rechts eine Glaskarte. Das steht hier einmal statt
// dreimal.
//
// Aenderst du den Aufbau, aenderst du ihn an einer Stelle - und
// die drei Seiten koennen nicht auseinanderlaufen.
// ============================================

import Kopfzeile from './Kopfzeile';
import Fusszeile from './Fusszeile';
import './KontoGeruest.css';

export default function KontoGeruest({
  obenKlein,
  titelTeil1,
  titelHervor,
  untertitel,
  links,          // was unter dem Titel steht (Vorteile o.ae.)
  children,       // die Karte rechts
  kartenBreit = false
}) {
  return (
    <>
      <Kopfzeile />

      <main className={`kg-seite ${kartenBreit ? 'kg-breit' : ''}`}>
        <div className="kg-links">
          {obenKlein && <p className="kg-oben">{obenKlein}</p>}

          <h1 className="kg-titel">
            {titelTeil1}
            {titelHervor && <><br /><span className="kg-hervor">{titelHervor}</span></>}
          </h1>

          {untertitel && <p className="kg-untertitel">{untertitel}</p>}

          {links}
        </div>

        <div className="kg-rechts">
          <div className="kg-karte">{children}</div>
        </div>
      </main>

      <Fusszeile />
    </>
  );
}

// ============================================
// Die Vorteilsliste links
// ============================================
export function Vorteile({ eintraege }) {
  return (
    <ul className="kg-vorteile">
      {eintraege.map((v) => (
        <li key={v.titel}>
          <span className="kg-punkt" aria-hidden="true" />
          <div>
            <strong>{v.titel}</strong>
            <span>{v.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ============================================
// Meldung ueber dem Formular
// ============================================
// art: 'fehler' | 'erfolg'
export function Meldung({ art, text }) {
  if (!text) return null;
  return (
    <p className={`kg-meldung kg-meldung-${art}`} role={art === 'fehler' ? 'alert' : 'status'}>
      {text}
    </p>
  );
}
