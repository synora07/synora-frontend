// ============================================
// SYNORA - Erscheinen beim Scrollen
// ============================================
// Inhalte blenden sich ein, sobald sie sichtbar werden.
//
// VIER REGELN, DAMIT ES NICHT KITSCHIG WIRD
//
// 1. NUR EINMAL. Wer zurueckscrollt, soll nicht alles nochmal
//    aufgehen sehen. Das ist der haeufigste Grund, warum solche
//    Effekte nerven - und der Beobachter wird danach abgemeldet,
//    kostet also auch keine Rechenzeit mehr.
//
// 2. KURZ UND KLEIN. 16 Pixel Bewegung, eine halbe Sekunde.
//    Alles darueber faellt auf, und was auffaellt, lenkt vom
//    Inhalt ab.
//
// 3. NICHTS VERSTECKEN, WAS SCHON SICHTBAR IST. Was beim Laden
//    bereits im Bild steht, wird nicht erst ausgeblendet und
//    dann eingeblendet - das sieht nach einem Ladefehler aus.
//
// 4. AUS BEI "BEWEGUNG REDUZIEREN". Wer das eingestellt hat,
//    hat meist einen Grund: Migraene, Schwindel, Epilepsie.
//    Dann erscheint alles sofort, ohne Bewegung.
//
// KEIN PAKET, KEINE ABHAENGIGKEIT
// IntersectionObserver kann jeder Browser seit 2019. Eine
// Animationsbibliothek waere hier 30 KB fuer vier Regeln.
// ============================================

import { useEffect, useRef, useState } from 'react';
import './Erscheinen.css';

function willKeineBewegung() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {
    return false;
  }
}

/**
 * verzoegerung  in Millisekunden, fuer gestaffeltes Erscheinen
 * als           welches Element herauskommt (div, section, li …)
 */
export default function Erscheinen({
  children,
  verzoegerung = 0,
  als: Element = 'div',
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [sichtbar, setSichtbar] = useState(() => willKeineBewegung());

  useEffect(() => {
    if (sichtbar) return;

    const knoten = ref.current;
    if (!knoten) return;

    // Kein IntersectionObserver (sehr alter Browser): alles
    // sofort zeigen. Lieber ohne Effekt als unsichtbarer Inhalt.
    if (typeof IntersectionObserver === 'undefined') {
      setSichtbar(true);
      return;
    }

    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (!eintrag.isIntersecting) return;
        setSichtbar(true);
        // Abmelden: einmal erschienen, nie wieder beobachtet.
        beobachter.disconnect();
      },
      {
        threshold: 0.12,
        // Etwas frueher ausloesen, damit der Inhalt schon da
        // ist, wenn der Nutzer ihn erreicht - statt vor seinen
        // Augen aufzublenden.
        rootMargin: '0px 0px -40px 0px'
      }
    );

    beobachter.observe(knoten);
    return () => beobachter.disconnect();
  }, [sichtbar]);

  return (
    <Element
      ref={ref}
      className={`sy-erscheinen ${sichtbar ? 'sy-da' : ''} ${className}`}
      style={verzoegerung ? { transitionDelay: `${verzoegerung}ms` } : undefined}
      {...rest}
    >
      {children}
    </Element>
  );
}
