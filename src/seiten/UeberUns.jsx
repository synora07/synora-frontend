// ============================================
// SYNORA - Ueber uns
// ============================================
// Diese Seite hat keine Vorlage von dir. Sie ist im selben Stil
// gebaut - und sie sagt, was SYNORA wirklich macht, nicht was
// gut klingt.
//
// Sie nennt auch die Grenzen. Das ist ungewoehnlich fuer eine
// "Ueber uns"-Seite und genau deshalb richtig: Wer von sich
// sagt, er zeige die Nachteile der Produkte, muss auch die
// eigenen nennen koennen.
// ============================================

import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import Logo from '../bausteine/Logo';
import { useSprache } from '../texte/Sprache';
import './Rechtstext.css';

const GRUNDSAETZE = [
  {
    titel: 'Kein Preis wird erfunden',
    text: 'Preise und Verfügbarkeit kommen aus der Abfrage bei den Shops. Ein Sprachmodell darf bei SYNORA keinen Preis nennen – das ist technisch gesperrt, nicht nur eine Absichtserklärung. Wenn wir keinen Preis haben, steht dort nichts.'
  },
  {
    titel: 'Jedes Produkt hat einen Nachteil',
    text: 'Zu jeder Empfehlung gehört, was gegen das Produkt spricht. Finden wir keinen belegbaren Nachteil, zeigen wir das Produkt nicht. Ein Vorschlag ohne Einschränkung ist Werbung, keine Empfehlung.'
  },
  {
    titel: 'Provision entscheidet nie mit',
    text: 'SYNORA verdient an Vermittlungsprovisionen. Welche Produkte du siehst und in welcher Reihenfolge, hat damit nichts zu tun. Shops ohne Partnerprogramm werden gleich behandelt.'
  },
  {
    titel: 'Bezahlen kauft keine besseren Empfehlungen',
    text: 'Premium bringt mehr Suchen und Werkzeuge wie den Preisalarm. Die Qualität der Empfehlung ist auf jeder Stufe gleich – auch gratis.'
  }
];

const GRENZEN = [
  'SYNORA durchsucht Schweizer Shops. Angebote aus dem Ausland sind nicht vollständig abgedeckt.',
  'Die Empfehlungen entstehen automatisiert und können Fehler enthalten. Prüfe Preis und Eigenschaften beim Händler, bevor du kaufst.',
  'Preise sind der Stand zum Zeitpunkt der Abfrage, nicht in Echtzeit.',
  'SYNORA ist jung. Manche Funktionen sind noch nicht fertig – wo das so ist, steht es auf der Seite.'
];

export default function UeberUns() {
  const { t, sprache } = useSprache();

  return (
    <>
      <Kopfzeile aktiv="ueberUns" />

      <main className="rt-seite">
        <div className="rt-logo"><Logo art="voll" groesse={44} /></div>

        <h1>Warum es SYNORA gibt</h1>

        {/* ============================================
            NUR AUF DEUTSCH
            ============================================
            Diese Seite gibt es nicht auf Englisch. Ein
            Rechtstext in holprigem Englisch ist schlechter als
            gar keiner - und niemand hier kann ihn pruefen.
            Darum steht das sichtbar da, statt dass ein
            englischsprachiger Besucher raetselt. */}
        {sprache !== 'de' && (
          <p className="rt-nurdeutsch">{t('nurDeutsch')}</p>
        )}


        <div className="rt-inhalt">
          <p className="rt-vorspann">
            Produktsuche im Netz ist kaputt. Was oben steht, steht dort meistens, weil
            jemand dafür bezahlt hat. Vergleichsseiten sortieren nach Provision,
            Testberichte sind oft Werbung, und Bewertungen lassen sich kaufen.
          </p>
          <p className="rt-vorspann">
            SYNORA versucht es andersherum: Jede Empfehlung wird begründet, jedes Produkt
            bekommt auch einen Nachteil, und kein Sprachmodell darf einen Preis erfinden.
          </p>

          <h2>Vier Regeln, an die wir uns halten</h2>
          <ol className="rt-grundsaetze">
            {GRUNDSAETZE.map((g) => (
              <li key={g.titel}>
                <strong>{g.titel}</strong>
                <span>{g.text}</span>
              </li>
            ))}
          </ol>

          <h2>Was SYNORA nicht kann</h2>
          <p>
            Wer die Nachteile von Produkten zeigt, sollte auch die eigenen nennen können:
          </p>
          <ul className="rt-grenzen">
            {GRENZEN.map((g) => <li key={g}>{g}</li>)}
          </ul>

          <h2>Wie SYNORA Geld verdient</h2>
          <p>
            Über Vermittlungsprovisionen, wenn du über einen Link bei einem Händler kaufst.
            Für dich ändert sich am Preis nichts. Dazu kommt Premium für alle, die mehr als
            die kostenlosen Suchen im Monat brauchen.
          </p>
          <p>
            Wir verkaufen keine Nutzerdaten und nehmen kein Geld dafür, ein Produkt weiter
            oben zu zeigen. Das ist keine Grosszügigkeit, sondern das Einzige, was SYNORA
            von einer Werbeplattform mit Suchfeld unterscheidet.
          </p>

          <h2>Etwas stimmt nicht?</h2>
          <p>
            Eine Empfehlung passte nicht, ein Preis war falsch, etwas war kaputt? Sag es uns
            über <a href="/feedback">Feedback</a>. SYNORA soll aus Fehlern lernen – das geht
            nur, wenn wir davon erfahren.
          </p>
        </div>
      </main>

      <Fusszeile />
    </>
  );
}
