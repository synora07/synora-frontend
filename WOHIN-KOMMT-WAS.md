# SYNORA Frontend — wohin welche Datei kommt

Stand: 7. Oktober 2026

---

## Dein Aufbau steht fest

Deine `package.json` sagt `"react-scripts": "5.0.1"` — das ist **Create React App**, nicht Vite. React 19.2.3, kein react-router.

Alles unten ist schon darauf eingestellt. Du musst nichts umbenennen.

**Geprüft, nicht vermutet:** Ich habe ein CRA-5-Projekt mit deinen Abhängigkeiten aufgesetzt und `react-scripts build` laufen lassen. Der Build geht durch, und alle 14 Seiten laufen im fertigen Produktions-Build.

---

## Die Ordnerstruktur

Alles kommt in deinen **Frontend**-Ordner (nicht ins Backend):

```
dein-frontend/
├── vercel.json             ← NEU, wichtig (siehe unten)
├── package.json            ← bleibt wie sie ist
│
├── public/
│   ├── index.html          ← ERSETZT deine bisherige
│   ├── manifest.json       ← ERSETZT deine bisherige
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── synora-zeichen-256.webp      ← Logo, klein
│   ├── synora-zeichen-256.png
│   ├── synora-zeichen-512.webp
│   ├── synora-zeichen-512.png
│   ├── synora-schriftzug-512.webp
│   ├── synora-schriftzug-512.png
│   ├── synora-schriftzug-1024.webp
│   └── synora-schriftzug-1024.png
│
└── src/
    ├── index.js            ← ERSETZT deine bisherige
    ├── App.jsx
    ├── App.css
    ├── api.js
    ├── pfade.js            ← HIER ZUERST REINSCHAUEN
    ├── preisalarme.js
    ├── navigation.jsx
    ├── milchglas.css       ← NEU (siehe "Bewegung")
    │
    ├── texte/
    │   ├── de.js
    │   ├── en.js
    │   └── Sprache.jsx
    │
    ├── bausteine/
    │   ├── Hintergrund.jsx / Hintergrund.css   ← NEU, die Landschaft
    │   ├── Erscheinen.jsx / Erscheinen.css
    │   ├── Logo.jsx / Logo.css
    │   ├── Kopfzeile.jsx / Kopfzeile.css
    │   ├── Fusszeile.jsx / Fusszeile.css
    │   ├── Feld.jsx / Feld.css
    │   ├── KontoGeruest.jsx / KontoGeruest.css
    │   └── Produktkarte.jsx / Produktkarte.css
    │
    └── seiten/
        ├── Startseite.jsx / Startseite.css
        ├── Chat.jsx / Chat.css
        ├── Premium.jsx / Premium.css
        ├── Preisalarme.jsx / Preisalarme.css
        ├── Anmelden.jsx
        ├── Registrieren.jsx / Registrieren.css
        ├── PasswortVergessen.jsx / PasswortVergessen.css
        ├── KaufMelden.jsx
        ├── Feedback.jsx
        ├── UeberUns.jsx
        ├── Rechtstext.jsx / Rechtstext.css
        ├── NichtGefunden.jsx
        └── Formularseite.css
```

**Die Bilder aus `oeffentlich/` kommen in deinen `public/`-Ordner** — nicht in `src/`.

---

## Zuerst: ein Fehler, der die Seite auf Vercel lahmgelegt hätte

**Gefunden am 6. Oktober 2026 — und zwar nur durch Zufall.** Ich liess die neuen AGB gegen ein Test-Backend laufen und wunderte mich, warum keine Preise erschienen.

In `src/api.js` stand:

```js
if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
```

Das sieht nach Vorsicht aus, ist aber genau falsch herum.

**Warum:** Beim Bauen ersetzt webpack den Ausdruck `process.env.REACT_APP_API_URL` durch den Wert — aus der Variablen wird wörtlich `"https://api.synora.li"`. Dafür braucht der Browser kein `process`.

Den Ausdruck `typeof process` ersetzt webpack aber **nicht**. Der bleibt stehen und wird im Browser ausgeführt — und dort gibt es kein `process`. Create React App 5 baut auf webpack 5, und webpack 5 hat die Nachbildung von `process` entfernt, die es in Version 4 noch gab.

**Ergebnis:** Die Bedingung war *immer* falsch. Die Zeile dahinter wurde nie erreicht. Deine Backend-Adresse stand richtig im fertigen Build — sie wurde nur nie gelesen.

**Was das bedeutet hätte:** Auf Vercel wäre jede Anfrage an `http://localhost:5000` gegangen, also an den Rechner des Besuchers. Kein Login, keine Suche, keine Preise, keine Preisalarme — und in der Konsole nur „connection refused".

**Auf deinem eigenen Rechner wäre es nicht aufgefallen**, weil dort tatsächlich ein Server auf Port 5000 läuft. Es wäre erst beim ersten echten Besucher aufgefallen.

Derselbe Fehler steckte in `src/texte/Sprache.jsx`. Dort war er harmlos — die Prüfung auf fehlende Übersetzungen lief nur nie.

Beide sind behoben. Geprüft mit einem Test-Backend: Die Adresse aus `REACT_APP_API_URL` wird jetzt wirklich benutzt, auf der Premium-Seite und in den AGB.

---

## Die drei Sachen, die du ändern musst

### 1. `src/pfade.js` — nur noch EINE Adresse ist geraten

Aus deinem alten `public/js/auth.js` abgeschrieben und damit sicher:

| | |
|---|---|
| `POST /api/auth/login` | ✓ |
| `POST /api/auth/register` | ✓ |
| `POST /api/auth/forgot-password` | ✓ |
| `GET /api/auth/verify/:token` | ✓ |

**Dabei habe ich zwei Fehler in meiner ersten Fassung gefunden:**

Die Feldnamen stimmten nicht. Ich schickte `firstName`/`lastName` (gross), dein Backend will `firstname`/`lastname` (klein) — plus `birthdate` und `terms`. Die Registrierung wäre fehlgeschlagen.

Und: Dein Backend verschickt eine **Bestätigungs-Mail**. Der Link zeigt auf `synora.li/?verify=TOKEN`. In meiner ersten Fassung passierte damit nichts — niemand hätte sein Konto freischalten können. Dafür gibt es jetzt `src/seiten/Bestaetigen.jsx`.

**Offen bleibt eine Adresse:** `POST /api/auth/reset-password`. In deinem `auth.js` steht nur, dass bei `?reset=TOKEN` ein Fenster aufgeht — welche Adresse danach gerufen wird, fehlt dort. Prüf sie mit:

```
node scripts/pfadePruefen.js
```

### 2. `src/seiten/Rechtstext.jsx` — deine sechs Angaben

Ganz oben in der Datei:

```js
const ANGABEN = {
  rechtsform: '',        // z.B. "Einzelunternehmen"
  name: '',              // Firmenname oder dein Name
  adresse: '',           // Strasse, PLZ, Ort
  email: 'hallo@synora.li',
  uid: '',               // CHE-123.456.789
  zahlungsanbieter: ''
};
```

Solange die leer sind, zeigt die Seite an der Stelle einen sichtbaren Hinweis. **Das ist Absicht** — ein Impressum mit erfundenen Beispielwerten ist schlimmer als eines, das ehrlich sagt, dass es noch nicht fertig ist.

**Ohne Impressum und Datenschutz nehmen dich die Affiliate-Programme nicht an.**

### 3. Die Adresse deines Backends

Leg im Frontend-Ordner (neben der `package.json`) eine Datei `.env` an:

```
REACT_APP_API_URL=http://localhost:5000
```

Auf Vercel trägst du die Variable in den Projekt-Einstellungen ein, mit dem Wert `https://api.synora.li`.

**Wichtig bei Create React App:** Die Variable wird beim **Bauen** fest eingesetzt, nicht beim Laden. Änderst du sie, musst du neu bauen.

---

## `vercel.json` — nicht vergessen

Diese Datei kommt **neben deine package.json**, nicht in `src/`.

Ohne sie funktionieren nur Klicks innerhalb der Seite. Ein Lesezeichen auf `/premium`, ein geteilter Link oder ein Treffer bei Google landen auf einer Fehlerseite.

### Dazu noch: Vercel macht aus Warnungen Fehler

Vercel setzt beim Bauen `CI=true`. Create React App behandelt dann **jede ESLint-Warnung als Fehler** und bricht ab.

Zwei solche Warnungen waren in meinen Sprachdateien. Ich habe sie behoben und mit `CI=true` nachgebaut — es geht sauber durch.

Wenn dein Deploy trotzdem mal an einer Warnung scheitert, ist das der Grund. Die ehrliche Lösung ist, die Warnung zu beheben. Der schnelle Weg wäre `CI=false` in den Vercel-Einstellungen — davon rate ich ab, weil du dann nie wieder eine Warnung siehst.

---

## Was noch nicht geht — und wo das steht

| Funktion | Zustand | Wo du es siehst |
|---|---|---|
| Chat-Verlauf | Backend gibt immer eine leere Liste | Leiste im Chat, Hinweis „Bald" |
| Gespeicherte Produkte | gibt es nicht | dito |
| Vergleiche | gibt es nicht | dito |
| Premium Plus | Backend kennt nur Premium ja/nein | Premium-Seite, Hinweis „Noch nicht freigeschaltet" |
| Bezahlen | kein Zahlungsanbieter | Premium-Seite, „Noch nicht käuflich" |
| Bild hochladen / Sprache | gibt es nicht | ganz weggelassen |
| Filterspalte rechts im Chat | Backend nimmt nur Text entgegen | ganz weggelassen |

Nichts davon ist versteckt. Jede Lücke steht sichtbar auf der Seite.

---

## Was aus deiner Vorlage bewusst anders ist

| Vorlage | Hier | Warum |
|---|---|---|
| „3 kostenlose Suchen ohne Anmeldung" | „5 Suchen im Monat, gratis mit Konto" | Backend erlaubt **null** ohne Konto |
| „Unbegrenzt mit Account" | Zahl aus dem Backend | Es sind 5, nicht unbegrenzt |
| „100% kostenlos" | „Keine Provision entscheidet mit" | Premium kostet CHF 7 |
| „~3 Sek Antwortzeit" | weggelassen | Nicht gemessen. Perplexity allein hat 25 s Zeitlimit |
| „Echtzeit-Check" | „Preise kommen aus echten Shops" | SerpAPI liefert einen Stand, keine Echtzeit |
| Menü „Shop", „Deals" | weggelassen | SYNORA ist kein Shop und hat keine Deals |
| Geburtsdatum bei Registrierung | **wieder drin** | Ich hatte es aus Datenschutzgründen entfernt. Dein Backend erwartet `birthdate` — zwei Wochen vor Code-Freeze am Backend zu schrauben ist das grössere Risiko |
| „Mit Google / Apple anmelden" | weggelassen | Backend kann es nicht; Apple kostet 99 $/Jahr |

**Alle Zahlen auf der Seite kommen aus `GET /api/einstellungen`** — also aus derselben Stelle, die sie auch durchsetzt. Die Seite kann nicht mehr etwas anderes versprechen als das Backend tut.

---

## Prüfen, ob es läuft

```
npm start
```

Dann im Browser durchklicken:

- `/` Startseite
- `/chat` KI-Assistent
- `/premium` Preise
- `/preisalarme` deine Alarme
- `/anmelden` · `/registrieren` · `/passwort-vergessen`
- `/impressum` · `/datenschutz` · `/nutzungsbedingungen`
- `/ueber-uns` · `/feedback` · `/kauf-melden`
- `/?verify=abc` E-Mail bestätigen (Link aus der Mail)
- `/?reset=abc` neues Passwort setzen

**So geprüft, nicht vermutet:** Ich habe ein CRA-5-Projekt mit deinen Abhängigkeiten aufgesetzt, `react-scripts build` mit `CI=true` laufen lassen (so wie Vercel es tut) und alle 16 Seiten im **fertigen Produktions-Build** im Browser getestet — auf Deutsch und auf Englisch. Kein JavaScript-Fehler, kein Querscrollen auf dem Handy bei 390 Pixeln.

---

## Bewegung

Die Seite ist animiert — aber zurückhaltend:

- **Beim Laden** erscheinen Überschrift, Untertitel, Suchfeld und Knöpfe nacheinander. Das lenkt den Blick in der Reihenfolge, in der man lesen soll.
- **Beim Scrollen** blenden sich Abschnitte ein, sobald sie sichtbar werden. **Nur einmal** — wer zurückscrollt, sieht nicht alles nochmal aufgehen. Das ist der häufigste Grund, warum solche Effekte nerven.
- **Nach einer Suche** erscheinen die drei Vorschläge nacheinander. Die Animation sagt etwas aus: Platz 1 ist zuerst da.
- **Knöpfe** sinken beim Antippen leicht ein. Auf dem Handy ersetzt das die fehlende Maus-Rückmeldung.

### Der Hintergrund

Die Berglandschaft aus deiner Vorlage ist **mit Code gezeichnet**, nicht als Bild hinterlegt. Das Bild wäre zwei bis vier Megabyte gross gewesen; die Zeichnung sind rund zehn Kilobyte, ist auf jedem Bildschirm scharf — und kann sich bewegen.

Fünf Ebenen, alle unterschiedlich schnell:

| Ebene | Was sie tut | Dauer |
|---|---|---|
| Nordlicht | zieht durch den Himmel | 54 / 72 s |
| Sterne | funkeln versetzt | 4–9 s |
| Dunst | treibt über den Kämmen | 80 / 110 s |
| Berge | drei Reihen, verschieden schnell | 70–110 s |
| See | Lichtstreifen wandern, Spiegelung wogt | 24–64 s |

**Dass die Berge verschieden schnell sind, ist der ganze Trick.** Liefen alle gleich schnell, sähe es aus, als würde das Bild verrutschen. Weil die hinteren langsamer sind als die vorderen, liest das Auge daraus Tiefe — wie aus dem Zugfenster, wo die Berge am Horizont stehenbleiben und die Leitplanke vorbeirast.

Alles so langsam, dass man es nicht als Bewegung bemerkt. Man merkt nur, dass das Bild nicht tot ist.

Willst du doch ein Foto: als `public/hintergrund.jpg` ablegen und in `Hintergrund.jsx` oben `BILD_STATT_ZEICHNUNG` auf `true` setzen. Die Bewegung ist dann weg.

### Warum `milchglas.css` dazugekommen ist

**Gemessen, nicht geschätzt.** Deine Vorlage hat zwei Dinge, die sich gegenseitig im Weg stehen: Kacheln aus Milchglas (`backdrop-filter`) und einen Hintergrund, der sich bewegt.

| | Milchglas an | Milchglas aus |
|---|---|---|
| **Bewegung aus** | 59 Bilder/s | 61 Bilder/s |
| **Bewegung an** | 27 Bilder/s | 44 Bilder/s |

Einzeln kostet keines von beiden etwas. Zusammen halbiert sich die Bildrate: Milchglas heisst „nimm alles hinter dieser Kachel und verwische es" — bewegt sich der Hintergrund, rechnet der Browser das sechzigmal pro Sekunde neu, für jede Kachel.

Den Radius kleiner zu machen hilft **nicht**: `blur(24px)` und `blur(3px)` kosten gleich viel.

`src/milchglas.css` nimmt das Milchglas weg und macht die Kacheln dafür dichter (80 → 94 Prozent). Auf dunklem Grund sieht man keinen Unterschied — ausser dass keine Bergspitzen mehr durch die Produktkarte schimmern.

**Willst du das Milchglas zurück:** in `src/App.jsx` die Zeile `import './milchglas.css';` löschen und die Datei löschen. Dann hast du die Vorlage exakt, aber der Hintergrund läuft bei rund 27 Bildern pro Sekunde. Auf deinem Rechner fällt das kaum auf, auf einem drei Jahre alten Android schon.

**Willst du beides:** statt des Milchglases die Bewegung abschalten — in `src/bausteine/Hintergrund.css` den Block `@media (prefers-reduced-motion: no-preference)` löschen.

### Alles aus bei „Bewegung reduzieren"

Nicht weniger — keine. Wer das einstellt, hat meist einen Grund: Migräne, Schwindel, Epilepsie.

Geprüft mit eingeschalteter Einstellung: Einblendungen aus, Hover-Bewegungen aus, der ganze Hintergrund steht still, kein sanftes Scrollen.

Technisch steht die Bewegung deshalb **in** einem `@media (prefers-reduced-motion: no-preference)`-Block, nicht in einem, der sie nachträglich abschaltet. So kann man keine Regel vergessen — genau das war mir vorher einmal passiert.

## Sprache

Deutsch und Englisch sind drin, 169 Texte je Sprache, geprüft auf Vollständigkeit.

Umgeschaltet wird oben rechts. Die Auswahl merkt sich der Browser.

Französisch oder Italienisch später: **eine neue Datei** in `src/texte/`, kopiert von `de.js`, plus eine Zeile in `Sprache.jsx`. Keine Seite muss angefasst werden.

**Drei Seiten sind nur auf Deutsch:** Impressum, Datenschutz und Über uns. Auf Englisch steht dort ein sichtbarer Hinweis. Ein Rechtstext in holprigem Englisch ist schlechter als gar keiner — und ich kann ihn nicht prüfen lassen.

---

## Impressum, Datenschutz, AGB

Alle drei stehen in **einer** Datei: `src/seiten/Rechtstext.jsx`. Ganz oben darin sind drei Blöcke zum Ausfüllen.

### 1. `ANGABEN` — deine Firmendaten

Sieben Felder: Rechtsform, Name, Adresse, Ort, E-Mail, UID, Zahlungsanbieter. Solange eines leer ist, steht an der Stelle ein sichtbarer Hinweis **und** oben auf der Seite ein Kasten „Diese Seite ist noch nicht vollständig".

Das ist Absicht. Ein Impressum mit „Musterstrasse 1" ist schlimmer als eines, das ehrlich sagt, dass es noch nicht fertig ist.

### 2. `DIENSTLEISTER` — wo deine Daten liegen

Die Datenschutzerklärung **muss** sagen, wer die Daten sieht und in welchem Land. „Dienstleister im Ausland" reicht weder nach DSG Art. 19 noch nach DSGVO Art. 13.

Sechs Einträge stehen drin, aus deinem Code abgelesen: SerpApi, Perplexity, Brevo, MongoDB Atlas, Railway, Vercel — mit Zweck und was dorthin übermittelt wird.

**Ein Feld ist leer: die Region deines MongoDB-Clusters.** Die wählst du beim Anlegen selbst aus, ich kann sie nicht wissen. Nachsehen in Atlas → dein Cluster → der Regionsname steht unter dem Clusternamen.

### 3. `AKTION` — ein Jahr Premium gratis

Du hattest gesagt: die ersten 1000 Nutzer, die über 300 Franken kaufen, bekommen ein Jahr Premium geschenkt.

**Das ist ein bindendes Versprechen.** Wer die Bedingung erfüllt, hat einen Anspruch. Vier Dinge hast du noch nicht festgelegt, und ich trage sie nicht selbst ein, weil jede davon dich Geld kosten kann:

1. Bis wann läuft die Aktion?
2. Zählt **ein** Kauf über 300 Franken, oder die **Summe** mehrerer?
3. Was passiert bei einer Rückgabe?
4. Zählen alle Shops, oder nur die mit Partnerprogramm? (Nur bei letzteren verdienst du etwas.)

Solange `AKTION.aktiv` auf `false` steht, erscheint der Abschnitt gar nicht. Schalt ihn erst ein, wenn alle vier Punkte drin sind.

### Eine Entscheidung, die du prüfen solltest: Widerruf

In der Schweiz gibt es für Online-Verträge **kein** gesetzliches Widerrufsrecht. In der EU schon: 14 Tage.

Du sitzt in der Schweiz, deine Seite ist aber auf Deutsch und Englisch und von überall erreichbar. Kauft jemand aus der EU Premium, kann EU-Recht greifen.

Ich habe `WIDERRUF_TAGE = 14` gesetzt — für alle, nicht nur für EU-Kunden. Weil es den Streit löst, bevor er entsteht, weil bei 7 Franken im Monat das Risiko klein ist, und weil zwei Regeln je nach Wohnort du im Zweifel beweisen müsstest.

Auf `0` setzen schaltet den Abschnitt ab. Zulässig, aber ich rate davon ab.

### Warum in den AGB keine Preise und keine Suchzahlen stehen

Sie kommen aus `GET /api/einstellungen` — derselben Stelle, die sie auch durchsetzt.

Ein AGB-Text mit abgetippten Zahlen ist an dem Tag falsch, an dem du eine Zahl in der `.env` änderst. Und falsche Zahlen in den AGB sind schlimmer als auf der Startseite, weil die AGB das sind, worauf sich jemand beruft.

Kommt keine Antwort vom Backend, zeigt der Abschnitt einen Verweis auf die Premium-Seite statt einer Zahl. Nie eine Ersatzzahl.

### Und noch einmal, weil es wichtig ist

**Ich bin kein Anwalt.** Das sind sorgfältige Entwürfe, keine Rechtsberatung. Vor dem Start am 27. November sollte das jemand anschauen, der es darf — ein falsches Impressum ist in der Schweiz nach UWG Art. 3 Abs. 1 lit. s abmahnfähig.

---

## Die Chat-Seite nach deiner Vorlage

Drei Spalten, wie in deinem Bild: Leiste links, Unterhaltung in der Mitte, Infospalte rechts. Die Produktkarten stehen zu dritt nebeneinander, Bild oben.

### Was aus der Vorlage weggefallen ist — und warum

Du hast gesagt: aussehen wie die Vorlage, aber unnötige Sachen weg. *Unnötig* heisst hier: alles, wofür es im Backend nichts gibt. Ich habe jeden Punkt einzeln gegen die echten Endpunkte geprüft, nicht aus dem Kopf.

| Vorlage | Backend | hier |
|---|---|---|
| Neuer Chat | nur im Browser nötig | **da** |
| Chat-Verlauf | `/history` gibt `[]` zurück (TODO im Code) | grau, „bald" |
| Gespeicherte Produkte | gibt es nicht | **weg** |
| Vergleiche | gibt es nicht | **weg** |
| Einstellungen | gibt es nicht | **weg** |
| Letzte Chats (Liste) | `/history` gibt `[]` zurück | leerer Hinweis |
| SYNORA Pro (Kachel) | `/premium` gibt es | **da** |
| „Alle 12 Ergebnisse" | Backend liefert nur 3 | **weg** |
| „Vergleichen" am Produkt | gibt es nicht | **weg** |
| Bild hochladen | gibt es nicht | **weg** |
| Sprache (Mikrofon) | gibt es nicht | **weg** |
| Produktvergleich rechts | gibt es nicht | **weg** |
| Filter: Kategorie, Verwendungszweck, Grösse, Akkulaufzeit | Backend nimmt nur einen Text | **weg** |
| **Filter: Preisbereich** | **wird wirklich gelesen** | **da** |
| Shop-Logos | fremde Marken | nur Namen |
| Lieferzeit / Verfügbarkeit | steht nicht je Produkt | **weg** |
| SYNORA Score (Erklärung) | `score` kommt mit | **da** |

### Warum der Preisregler bleiben darf

Weil er als einziger Filter echt ist. In `chatController.js` steht `extrahiereBudget()` — die Funktion liest „unter 1000 CHF", „bis 500" oder „max. 200" direkt aus dem Fragetext und filtert danach wirklich.

Der Regler schickt also keinen heimlichen Parameter mit, den niemand auswertet. **Er tippt für dich:** Aus dem Regler wird „unter 1000 CHF" am Ende deiner Frage — sichtbar im Eingabefeld, bevor du abschickst. Genau das steht auch auf der Seite.

Ein Regler, der etwas anderes tut als er verspricht, wäre dasselbe Problem wie die „3 kostenlosen Suchen" auf der alten Startseite.

### Zwei Fehler, die dabei aufgefallen sind

**Der Knopf oben rechts zeigte ins Leere.** Für angemeldete Nutzer stand dort „Preisalarme", verlinkt war aber `/konto` — diese Seite gibt es nicht. Wer darauf klickte, landete auf der Fehlerseite. Der Knopf ist ersatzlos weg: „Preisalarme" steht schon im Menü.

**Die Knöpfe auf der Produktkarte standen auf dem Handy nebeneinander statt untereinander.** Ursache: Weiter oben steht `flex: 1 1 100%`. In einer *Zeile* heisst das „volle Breite" — richtig. In einer *Spalte* heisst dieselbe Angabe „volle Höhe". Beide Knöpfe wollten die ganze Höhe, zusammen passten sie nicht, und wegen `flex-wrap: wrap` ist der zweite in eine neue Spalte umgebrochen.

Gemessen hatte ich: 134×94 bei x=54 und 139×94 bei x=197 — nebeneinander, obwohl `flex-direction: column` dastand. Merksatz: `flex-basis` zeigt immer in Richtung der Hauptachse; dreht man die Achse, dreht sich die Bedeutung mit.

### Unter 1280 Pixeln

Die Infospalte verschwindet zuerst — sie erklärt nur, sie macht nichts. Der Preisregler ist dann weg, aber das Budget kann man jederzeit in die Frage tippen, und genau das hat der Regler auch getan.
