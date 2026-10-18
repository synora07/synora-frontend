// ============================================
// SYNORA - die App
// ============================================
// Hier wird entschieden, welche Seite bei welcher Adresse
// angezeigt wird. Mehr steht hier nicht - jede Seite bringt
// ihre eigene Kopfzeile und Fusszeile mit, weil der Chat eine
// andere Anordnung braucht als die Startseite.
//
// ============================================
// WICHTIG FUER VERCEL
// ============================================
// Damit /premium auch beim DIREKTEN Aufruf funktioniert und
// nicht als 404 endet, braucht es im Frontend-Ordner eine
// vercel.json mit:
//
//   {
//     "rewrites": [
//       { "source": "/(.*)", "destination": "/index.html" }
//     ]
//   }
//
// Ohne diese Datei funktionieren nur Klicks innerhalb der
// Seite. Ein Lesezeichen auf /premium, ein geteilter Link oder
// ein Treffer bei Google landen auf einer Fehlerseite.
//
// Diese Datei liegt bei - sie heisst vercel.json und gehoert
// neben deine package.json.
// ============================================

import { RouteAnbieter, useRoute } from './navigation';
import { SpracheProvider } from './texte/Sprache';

import Startseite from './seiten/Startseite';
import Chat from './seiten/Chat';
import Premium from './seiten/Premium';
import Preisalarme from './seiten/Preisalarme';
import Anmelden from './seiten/Anmelden';
import Registrieren from './seiten/Registrieren';
import PasswortVergessen from './seiten/PasswortVergessen';
import KaufMelden from './seiten/KaufMelden';
import Feedback from './seiten/Feedback';
import UeberUns from './seiten/UeberUns';
import Rechtstext from './seiten/Rechtstext';
import NichtGefunden from './seiten/NichtGefunden';
import Bestaetigen, { tokenAusAdresse } from './seiten/Bestaetigen';
import Hintergrund from './bausteine/Hintergrund';

// Nimmt das Milchglas von den Kacheln, damit der bewegte
// Hintergrund fluessig laeuft. Gemessen: 27 -> 47 Bilder pro
// Sekunde. Die ganze Begruendung steht in der Datei selbst.
//
// Die Regeln dort sind absichtlich mit :root geschrieben, damit
// sie unabhaengig von der Ladereihenfolge gewinnen. Dieser
// Import darf also auch woanders stehen - aber lass ihn ruhig
// hier unten, dann sieht man sofort, dass er zum Schluss kommt.
import './milchglas.css';

// ============================================
// Adresse -> Seite
// ============================================
// Die Schreibweisen sind absichtlich deutsch. Ein Nutzer, der
// synora.li/preisalarme in der Adresszeile sieht, versteht
// sofort, wo er ist.
const SEITEN = {
  '/':                     Startseite,
  '/chat':                 Chat,
  '/premium':              Premium,
  '/preisalarme':          Preisalarme,
  '/anmelden':             Anmelden,
  '/registrieren':         Registrieren,
  '/passwort-vergessen':   PasswortVergessen,
  '/kauf-melden':          KaufMelden,
  '/feedback':             Feedback,
  '/ueber-uns':            UeberUns,

  // Die drei Rechtsseiten teilen sich eine Komponente - sie
  // unterscheiden sich nur im Inhalt.
  '/impressum':            () => <Rechtstext art="impressum" />,
  '/datenschutz':          () => <Rechtstext art="datenschutz" />,
  '/nutzungsbedingungen':  () => <Rechtstext art="nutzung" />,

  // Englische Schreibweisen, damit ein geteilter Link aus der
  // englischen Fassung nicht ins Leere laeuft.
  '/pricing':              Premium,
  '/login':                Anmelden,
  '/signup':               Registrieren,
  '/register':             Registrieren
};

function Weiche() {
  const { pfad } = useRoute();

  // ============================================
  // BESTAETIGUNGS-LINKS HABEN VORRANG
  // ============================================
  // Dein Backend verschickt Links auf  synora.li/?verify=abc
  // und  synora.li/?reset=abc  - also auf die STARTSEITE mit
  // einem Parameter dran, nicht auf einen eigenen Pfad.
  //
  // Darum wird das hier zuerst geprueft, vor der normalen
  // Zuordnung. Sonst landet jemand mit einem Bestaetigungslink
  // einfach auf der Startseite, und sein Konto bleibt gesperrt.
  const marke = tokenAusAdresse();
  if (marke) return <Bestaetigen art={marke.art} token={marke.token} />;

  // Abschliessenden Schraegstrich ignorieren: /premium und
  // /premium/ sollen dieselbe Seite zeigen.
  const sauber = pfad.length > 1 ? pfad.replace(/\/+$/, '') : pfad;

  const Seite = SEITEN[sauber] || SEITEN[sauber.toLowerCase()] || NichtGefunden;
  return <Seite />;
}

export default function App() {
  return (
    <SpracheProvider>
      <RouteAnbieter>
        {/* Die Berglandschaft aus deiner Vorlage. Liegt hinter
            allem und faengt keine Klicks ab. */}
        <Hintergrund />

        <Weiche />
      </RouteAnbieter>
    </SpracheProvider>
  );
}
