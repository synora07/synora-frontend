// ============================================
// SYNORA - Logo
// ============================================
// Dein Logo kam als PNG mit 1254x1254 (948 KB) und 2172x724
// (587 KB). Zusammen 1,5 MB - fuer ein Logo, das im Kopf der
// Seite 40 Pixel hoch dargestellt wird.
//
// Auf dem Handy im Zug ist das der Unterschied zwischen "die
// Seite ist da" und "die Seite laedt noch". Und es ist die
// erste Sekunde, die ueber einen neuen Besucher entscheidet.
//
// Darum liegen im Ordner jetzt kleinere Fassungen:
//
//   synora-zeichen-256.webp      17 KB   fuer den Kopf
//   synora-zeichen-512.webp      43 KB   fuer grosse Darstellung
//   synora-schriftzug-512.webp   22 KB
//   synora-schriftzug-1024.webp  52 KB
//
// Dazu jeweils eine PNG-Fassung. <picture> nimmt WebP, wenn der
// Browser es kann, und sonst das PNG - kein Browser bleibt aussen
// vor, und niemand laedt mehr als noetig.
//
// Die Originale bleiben liegen. Brauchst du das Logo einmal
// gross gedruckt, nimmst du die.
// ============================================

import './Logo.css';

/**
 * art    'voll'      Zeichen + Schriftzug (Kopfzeile, Startseite)
 *        'zeichen'   nur das S (enge Stellen, Ladebildschirm)
 *        'schrift'   nur der Schriftzug
 * groesse  Hoehe des Zeichens in Pixeln
 * leuchten  blauer Schein darunter
 */
export default function Logo({ art = 'voll', groesse = 40, leuchten = true, className = '' }) {
  // Ueber 128 Pixel lohnt die groessere Fassung - darunter waere
  // sie nur unnoetiges Gewicht.
  const gross = groesse > 128;
  const zeichen = gross ? 'synora-zeichen-512' : 'synora-zeichen-256';
  const schrift = gross ? 'synora-schriftzug-1024' : 'synora-schriftzug-512';

  const Bild = ({ datei, alt, stil }) => (
    <picture>
      <source srcSet={`/${datei}.webp`} type="image/webp" />
      <img
        src={`/${datei}.png`}
        alt={alt}
        style={stil}
        // Das Logo steht ganz oben und soll zuerst da sein,
        // nicht erst beim Scrollen.
        loading="eager"
        decoding="async"
        draggable="false"
      />
    </picture>
  );

  if (art === 'zeichen') {
    return (
      <span className={`sy-logo ${leuchten ? 'sy-logo-leuchtet' : ''} ${className}`}>
        <Bild datei={zeichen} alt="SYNORA" stil={{ height: groesse, width: 'auto' }} />
      </span>
    );
  }

  if (art === 'schrift') {
    return (
      <span className={`sy-logo ${leuchten ? 'sy-logo-leuchtet' : ''} ${className}`}>
        <Bild datei={schrift} alt="SYNORA" stil={{ height: groesse * 0.62, width: 'auto' }} />
      </span>
    );
  }

  return (
    <span className={`sy-logo sy-logo-voll ${leuchten ? 'sy-logo-leuchtet' : ''} ${className}`}>
      {/* Nur EIN alt-Text fuer beide Bilder zusammen. Haetten
          beide "SYNORA", laese ein Vorleseprogramm den Namen
          zweimal hintereinander vor. */}
      <Bild datei={zeichen} alt="SYNORA" stil={{ height: groesse, width: 'auto' }} />
      <Bild datei={schrift} alt="" stil={{ height: groesse * 0.52, width: 'auto' }} />
    </span>
  );
}
