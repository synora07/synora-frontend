// ============================================
// SYNORA - ein Eingabefeld
// ============================================
// Sieht aus wie in deiner Vorlage: Symbol links, Beschriftung
// darueber, bei Passwoertern ein Auge zum Anzeigen.
//
// WAS HIER MEHR DRINSTECKT, ALS MAN SIEHT
//
// Jedes Feld hat eine echte <label>, die mit dem Eingabefeld
// verbunden ist. Das ist kein Schoenheitsdetail:
//
//   - Ein Vorleseprogramm sagt sonst nur "Eingabefeld" und der
//     Nutzer weiss nicht, was er eintippen soll.
//   - Ohne label kann man nicht auf den Text tippen, um ins
//     Feld zu kommen - auf dem Handy ein echter Unterschied.
//   - Passwortverwaltungen erkennen am label und am
//     autoComplete, was gespeichert werden soll.
//
// Fehlermeldungen haengen ueber aria-describedby am Feld. Sonst
// liest ein Vorleseprogramm die Meldung gar nicht vor, und der
// Nutzer sitzt vor einem roten Rand ohne zu wissen, warum.
// ============================================

import { useId, useState } from 'react';
import './Feld.css';

export default function Feld({
  art = 'text',
  beschriftung,
  wert,
  setWert,
  platzhalter = '',
  symbol = null,
  fehler = '',
  hinweis = '',
  autoComplete,
  pflicht = false,
  ...rest
}) {
  const id = useId();
  const [zeigen, setZeigen] = useState(false);
  const istPasswort = art === 'passwort';
  const echteArt = istPasswort ? (zeigen ? 'text' : 'password') : art;

  const fehlerId = `${id}-fehler`;
  const hinweisId = `${id}-hinweis`;

  return (
    <div className={`sy-feld ${fehler ? 'sy-feld-fehler' : ''}`}>
      <label htmlFor={id}>
        {beschriftung}
        {pflicht && <span aria-hidden="true"> *</span>}
      </label>

      <div className="sy-feld-rahmen">
        {symbol && <span className="sy-feld-symbol" aria-hidden="true">{symbol}</span>}

        <input
          id={id}
          type={echteArt}
          value={wert}
          onChange={(e) => setWert(e.target.value)}
          placeholder={platzhalter}
          autoComplete={autoComplete}
          required={pflicht}
          aria-invalid={fehler ? 'true' : undefined}
          aria-describedby={[fehler && fehlerId, hinweis && hinweisId].filter(Boolean).join(' ') || undefined}
          {...rest}
        />

        {istPasswort && (
          <button
            type="button"
            className="sy-feld-auge"
            onClick={() => setZeigen(!zeigen)}
            aria-label={zeigen ? 'Passwort verbergen' : 'Passwort anzeigen'}
            // Nicht in die Tab-Reihenfolge: Wer mit der Tastatur
            // durch das Formular geht, will vom Passwort zum
            // naechsten Feld, nicht zum Augensymbol.
            tabIndex={-1}
          >
            {zeigen ? '🙈' : '👁'}
          </button>
        )}
      </div>

      {hinweis && !fehler && (
        <p id={hinweisId} className="sy-feld-hinweis">{hinweis}</p>
      )}

      {fehler && (
        // role="alert" sorgt dafuer, dass ein Vorleseprogramm die
        // Meldung sofort vorliest, statt sie zu uebergehen.
        <p id={fehlerId} className="sy-feld-meldung" role="alert">{fehler}</p>
      )}
    </div>
  );
}
