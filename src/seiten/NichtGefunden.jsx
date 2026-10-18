// ============================================
// SYNORA - Seite nicht gefunden
// ============================================
// Keine Entschuldigung, kein Witz - ein Weg zurueck.
// ============================================

import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import { useSprache } from '../texte/Sprache';
import './Formularseite.css';

export default function NichtGefunden() {
  const { t } = useSprache();
  return (
    <>
      <Kopfzeile />
      <main className="fs-seite fs-mitte">
        <p className="fs-gross">404</p>
        <h1>Diese Seite gibt es nicht.</h1>
        <p className="fs-unter">
          Vielleicht hat sich die Adresse geaendert, oder es war ein Tippfehler.
        </p>
        <div className="fs-knopfreihe">
          <a href="/" className="fs-knopf fs-knopf-link">Zur Startseite</a>
          <a href="/chat" className="fs-knopf-leer">{t('menue.assistent')}</a>
        </div>
      </main>
      <Fusszeile />
    </>
  );
}
