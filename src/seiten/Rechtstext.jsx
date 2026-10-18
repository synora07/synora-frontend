// ============================================
// SYNORA - Impressum, Datenschutz, Nutzungsbedingungen
// ============================================
// !!! ICH BIN KEIN ANWALT !!!
//
// Was hier steht, ist ein sorgfaeltiger Entwurf und keine
// Rechtsberatung. Vor dem oeffentlichen Start sollte das jemand
// anschauen, der es darf. Das ist keine Floskel:
//
//   - Ein falsches Impressum ist in der Schweiz nach UWG
//     Art. 3 Abs. 1 lit. s abmahnfaehig.
//   - Eine Datenschutzerklaerung, die nicht stimmt, ist nach
//     DSG und DSGVO ein eigenes Problem - und zwar eines, das
//     bei einer Beschwerde sofort auffaellt, weil man sie mit
//     dem Code vergleichen kann.
//   - Die Aktion "1 Jahr Premium gratis" weiter unten ist ein
//     bindendes Versprechen. Was dort steht, musst du halten.
//
// ============================================
// SCHWEIZER RECHT - DURCHGEGANGEN AM 10.10.2026
// ============================================
// Pavinash hat gesagt: "schweizer recht klar". Zu Recht - im
// Entwurf steckten vier Stellen, die aus EU-Recht stammten und
// fuer eine schweizerische Seite falsch waren:
//
//   1. In der Datentabelle stand "Art. 6 Abs. 1 lit. b DSGVO"
//      als Rechtsgrundlage. Das DSG kennt diesen Begriff fuer
//      Private gar nicht - eine Bearbeitung ist grundsaetzlich
//      erlaubt und braucht nur bei Verletzung von
//      Persoenlichkeitsrechten eine Rechtfertigung (Art. 31
//      DSG). Eine DSGVO-Nummer dort behauptet, das falsche
//      Gesetz gelte.
//
//   2. Die USA-Uebermittlung war nur mit den
//      EU-Standardvertragsklauseln begruendet. Fuer die Schweiz
//      gilt seit dem 15.09.2024 Anhang 1 DSV: die USA sind als
//      angemessen anerkannt, aber nur fuer Anbieter, die unter
//      dem Swiss-U.S. Data Privacy Framework zertifiziert sind.
//
//   3. Das Mindestalter 16 stammt aus Art. 8 DSGVO. Das
//      schweizerische Recht fragt nach Urteilsfaehigkeit
//      (Art. 19 ZGB), nicht nach einem Geburtsjahr.
//
//   4. Die Gerichtsstandsklausel war gegenueber Konsumenten so
//      nicht durchsetzbar - Art. 32 ZPO laesst den Wohnsitz
//      zu und ist nicht abdingbar.
//
// Das Widerrufsrecht war KEIN Fehler, sondern eine dokumentierte
// Entscheidung: 14 Tage freiwillig. Das steht jetzt auch
// ausdruecklich als freiwillig in den AGB, mit Quellen im
// Kommentar oben bei WIDERRUF_TAGE.
//
// ============================================
// WAS DU AUSFUELLEN MUSST
// ============================================
// Unten stehen drei Bloecke mit Luecken: ANGABEN (deine
// Firmendaten), DIENSTLEISTER (wo deine Daten liegen) und
// AKTION (die Gratis-Jahr-Aktion).
//
// Solange etwas leer ist, zeigt die Seite an der Stelle einen
// sichtbaren Hinweis statt eines erfundenen Werts.
//
// Das ist Absicht: Ein Impressum mit Platzhaltertext ist
// schlimmer als eines, das ehrlich sagt, dass es noch nicht
// fertig ist. Bei der Affiliate-Pruefung faellt beides auf -
// aber nur eines davon sieht nach Taeuschung aus.
//
// OHNE DIESE SEITEN KEINE AFFILIATE-ZULASSUNG
// AWIN und die Schweizer Shops verlangen ein vollstaendiges
// Impressum und eine Datenschutzerklaerung auf einer
// erreichbaren Seite. Affiliate-Provisionen sind dein
// einziger geplanter Umsatz bis 2028.
//
// ============================================
// WARUM HIER KEINE PREISE UND KEINE SUCHZAHLEN STEHEN
// ============================================
// Sie kommen aus GET /api/einstellungen - derselben Stelle, die
// sie auch durchsetzt.
//
// Der Grund ist derselbe wie bei der Startseite: Ein
// AGB-Text mit abgetippten Zahlen ist an dem Tag falsch, an dem
// du eine Zahl in der .env aenderst. Und falsche Zahlen in den
// AGB sind schlimmer als falsche Zahlen auf der Startseite,
// weil die AGB das sind, worauf sich jemand beruft.
// ============================================

import { useEffect, useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import { useSprache } from '../texte/Sprache';
import { einstellungenHolen, franken } from '../api';
import './Rechtstext.css';

// ============================================
// 1. HIER AUSFUELLEN - DEINE FIRMENDATEN
// ============================================
// Leer lassen heisst: Die Seite sagt, dass die Angabe fehlt.
// Niemals einen Beispielwert eintragen - sonst steht
// "Musterstrasse 1" im Impressum, und niemand merkt es.
const ANGABEN = {
  // Eingetragen am 10.10.2026 nach Angaben von Pavinash.
  //
  // "SYNORA" steht hier NICHT als Name. Das Impressum muss sagen,
  // wer verantwortlich ist, und das ist eine Person - eine Marke
  // kann man nicht anschreiben. SYNORA erscheint als Name der
  // Seite, zusaetzlich zum Verantwortlichen.
  rechtsform: 'Einzelunternehmen (nicht im Handelsregister eingetragen)',
  name: 'Pavinash Kugathayalan',
  adresse: 'Flughafenstrasse 12, 8302 Kloten',
  ort: 'Kloten',
  email: 'hallo@synora.li',

  // Leer, weil nicht eingetragen. Eine UID wird erst vergeben, wenn
  // man im Handelsregister, bei der MWST oder als Selbstaendiger bei
  // der AHV erfasst ist. Eintragungspflicht besteht fuer eine
  // Einzelfirma erst ab 100'000 Franken Jahresumsatz.
  //
  // PRUEFEN, BEVOR DU DICH BEWIRBST: ob AWIN und die Schweizer
  // Partnerprogramme eine UID verlangen. Falls ja, ist das ein
  // Behoerdengang mit Wartezeit - und dann besser jetzt als im
  // November.
  uid: '',

  // Leer, solange PREMIUM_VERKAUF=false ist. Es gibt keinen
  // Zahlungsanbieter zu nennen, wenn nichts verkauft wird.
  // Am Tag, an dem Stripe angeht, hier eintragen:
  //   'Stripe Payments Europe, Limited, Irland'
  zahlungsanbieter: ''
};

// ============================================
// ANGABEN, DIE ES BEI DIR NICHT GIBT
// ============================================
// Leer in ANGABEN heisst "fehlt noch" - die Seite zeigt dann eine
// markierte Luecke und oben einen Hinweis, dass sie unvollstaendig
// ist.
//
// Manche Angaben FEHLEN aber nicht, sondern existieren schlicht
// nicht. Eine UID bekommt nur, wer eingetragen ist. Einen
// Zahlungsanbieter nennt nur, wer Geld einnimmt.
//
// Fuer solche Felder hier den Grund eintragen. Dann steht der
// Grund auf der Seite statt einer Luecke, und die Angabe zaehlt
// nicht mehr als fehlend.
//
// WARUM DAS WICHTIG IST
// "UID - wird noch ergaenzt" liest sich wie eine Baustelle.
// "Keine, weil nicht eingetragen" ist eine vollstaendige Auskunft.
// Beim ersten legt ein Pruefer die Bewerbung weg, beim zweiten
// nicht.
//
// Sobald du eine UID hast: oben bei ANGABEN eintragen. Die Zeile
// hier unten kannst du dann loeschen - oder stehen lassen, der
// ausgefuellte Wert gewinnt.
const ENTFAELLT = {
  uid: 'Keine. SYNORA ist nicht im Handelsregister eingetragen und nicht mehrwertsteuerpflichtig.',
  zahlungsanbieter: 'Derzeit keiner. Über SYNORA werden keine Zahlungen abgewickelt.'
};

// ============================================
// 2. HIER AUSFUELLEN - WO DIE DATEN LIEGEN
// ============================================
// Die Datenschutzerklaerung MUSS sagen, wer die Daten zu sehen
// bekommt und in welchem Land. "Dienstleister im Ausland" ist
// zu wenig - weder das Schweizer DSG (Art. 19) noch die DSGVO
// (Art. 13) lassen das durchgehen.
//
// WAS ICH EINGETRAGEN HABE UND WAS NICHT
// Firma und Zweck kenne ich aus deinem Code - die stehen hier.
// Das LAND habe ich nur dort eingetragen, wo es durch den
// Anbieter festliegt.
//
// Bei der Datenbank steht es bewusst leer: Bei MongoDB Atlas
// waehlst DU die Region beim Anlegen des Clusters aus. Ich
// kann sie nicht wissen, und raten waere hier genau der
// Fehler, den diese Seite vermeiden soll.
//
// NACHSEHEN: Atlas -> dein Cluster -> der Regionsname steht
// direkt unter dem Clusternamen (z.B. "Frankfurt (eu-central-1)").
const DIENSTLEISTER = [
  {
    firma: 'SerpApi, LLC',
    land: 'USA',
    zweck: 'Fragt Preise und Verfügbarkeit bei den Shops ab',
    daten: 'Der Produktbegriff aus deiner Anfrage'
  },
  {
    firma: 'Perplexity AI, Inc.',
    land: 'USA',
    zweck: 'Formuliert die Empfehlung und ordnet die Produkte',
    daten: 'Der Text deiner Anfrage'
  },
  {
    firma: 'Brevo (Sendinblue SAS)',
    land: 'Frankreich',
    zweck: 'Verschickt Preisalarme und Bestätigungsmails',
    daten: 'Deine E-Mail-Adresse und der Inhalt der Mail'
  },
  {
    // Nachgesehen am 12.10.2026 in der Atlas-Konsole:
    //   Cluster0  ->  AWS / Frankfurt (eu-central-1)
    //
    // Das ist eine gute Nachricht. Deutschland ist EU, und die
    // Schweiz anerkennt die EU-Staaten als Laender mit
    // angemessenem Datenschutz (Art. 16 Abs. 1 DSG, Anhang 1
    // DSV). Fuer die Datenbank braucht es also weder
    // Standardvertragsklauseln noch eine Begruendung ueber das
    // Swiss-U.S. Data Privacy Framework.
    //
    // Der Vollstaendigkeit halber steht trotzdem unter der
    // Tabelle, dass MongoDB, Inc. ein US-Unternehmen ist.
    // Gespeichert wird in Frankfurt - ein Zugriff aus den USA
    // ist damit aber nicht ausgeschlossen, und das zu
    // verschweigen waere genau die halbe Wahrheit, die diese
    // Seite vermeiden soll.
    firma: 'MongoDB, Inc. (Atlas)',
    land: 'Deutschland (Frankfurt)',
    zweck: 'Betreibt die Datenbank',
    daten: 'Alle gespeicherten Daten'
  },
  {
    firma: 'Railway Corp.',
    land: 'USA',
    zweck: 'Betreibt den Server',
    daten: 'Alle Daten während der Verarbeitung'
  },
  {
    firma: 'Vercel Inc.',
    land: 'USA',
    zweck: 'Liefert die Website aus',
    daten: 'IP-Adresse beim Aufruf der Seite'
  }
];

// ============================================
// 3. HIER AUSFUELLEN - DIE GRATIS-JAHR-AKTION
// ============================================
// Du hast gesagt: "die ersten 1000 Nutzer, die wirklich über
// 300 fr kaufen, bekommen 1 Jahr gratis Premium".
//
// DAS IST EIN VERSPRECHEN, AN DAS DU GEBUNDEN BIST. Wer die
// Bedingung erfuellt, hat einen Anspruch. Darum muss hier
// stehen, was genau gilt - sonst entscheidet im Streitfall die
// fuer dich unguenstigste Auslegung.
//
// Vier Dinge hast du noch nicht festgelegt. Ich trage sie
// NICHT selbst ein, weil es Geschaeftsentscheidungen sind und
// jede davon dich Geld kosten kann:
//
//   1. Bis wann laeuft die Aktion?
//   2. Zaehlt EIN Kauf ueber 300 Franken, oder die Summe
//      mehrerer Kaeufe?
//   3. Was passiert, wenn der Kauf spaeter zurueckgegeben wird?
//   4. Zaehlen alle Shops oder nur die mit Partnerprogramm?
//      (Nur bei letzteren verdienst du etwas daran.)
//
// Solange AKTIV auf false steht, erscheint der ganze Abschnitt
// nicht auf der Seite. Schalte ihn erst ein, wenn alle vier
// Punkte ausgefuellt sind.
const AKTION = {
  aktiv: false,
  plaetze: 1000,
  mindestbetrag: 300,
  frist: '',             // z.B. "31. Dezember 2026"
  einKauf: null,         // true = ein einzelner Kauf, false = Summe
  beiRueckgabe: '',      // z.B. "Der Anspruch entfällt"
  nurPartnershops: null  // true = nur Shops mit Partnerprogramm
};

// ============================================
// WIDERRUFSRECHT - EINE ENTSCHEIDUNG, DIE DU PRUEFEN SOLLTEST
// ============================================
// In der Schweiz gibt es fuer Online-Vertraege KEIN
// gesetzliches Widerrufsrecht. In der EU schon: 14 Tage.
//
// NACHGEPRUEFT AM 10.10.2026, weil Pavinash gesagt hat
// "schweizer recht klar". Zwei unabhaengige Quellen:
//
//   - JUSTIS (Stand 20.04.2025): "Das Schweizer Recht kennt
//     kein allgemeines 14-taegiges Widerrufsrecht allein
//     deshalb, weil Sie online bestellt haben."
//   - Handelsverband.swiss: "In der Schweiz haben Sie keinen
//     gesetzlichen Anspruch auf Umtausch oder Rueckgabe."
//
// Art. 40a ff. OR gilt nur fuer Haustuer-, Telefon- und
// Strassengeschaefte ueber 100 Franken - und ausdruecklich
// NICHT, wenn der Kunde die Verhandlung selbst gesucht hat.
// Wer von sich aus auf synora.li Premium kauft, fiele also
// auch dann nicht darunter.
//
// Ein Revisionsentwurf, der ein Widerrufsrecht im Fernabsatz
// einfuehren wuerde, liegt seit 2012 herum und ist nie Gesetz
// geworden. Verlass dich nicht darauf, dass das so bleibt.
//
// Du sitzt in der Schweiz, deine Seite ist aber auf Deutsch und
// Englisch und von ueberall erreichbar. Sobald ein Kunde aus
// der EU Premium kauft, kann EU-Recht greifen.
//
// Ich habe WIDERRUF_TAGE auf 14 gesetzt - also fuer alle, nicht
// nur fuer EU-Kunden. Gruende:
//
//   - Es loest den Streit, bevor er entsteht.
//   - Bei 7 Franken im Monat ist das Risiko klein.
//   - Zwei verschiedene Regeln je nach Wohnort muesstest du im
//     Code abbilden UND im Zweifel beweisen koennen.
//
// Willst du nur das Schweizer Minimum: auf 0 setzen. Dann
// verschwindet der Abschnitt. Ich rate davon ab, aber es ist
// deine Entscheidung und sie ist zulaessig.
const WIDERRUF_TAGE = 14;

const STAND = '10. Oktober 2026';

// ============================================
// Hilfsdarstellungen
// ============================================
function Luecke({ was }) {
  return (
    <span className="rt-luecke">
      [{was} – wird noch ergänzt]
    </span>
  );
}

function Angabe({ wert, was, feld }) {
  if (wert) return <>{wert}</>;

  // Kein Wert, aber ein Grund hinterlegt: Das ist keine Luecke,
  // sondern eine Antwort.
  if (feld && ENTFAELLT[feld]) return <>{ENTFAELLT[feld]}</>;

  return <Luecke was={was} />;
}

// ============================================
// IMPRESSUM
// ============================================
function Impressum() {
  return (
    <>
      <h2>Verantwortlich für diese Website</h2>
      <p>
        <Angabe wert={ANGABEN.name} was="Name oder Firma" /><br />
        <Angabe wert={ANGABEN.rechtsform} was="Rechtsform" /><br />
        <Angabe wert={ANGABEN.adresse} was="Adresse" /><br />
        Schweiz
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a>
      </p>
      <p>
        Anfragen werden in der Regel innerhalb weniger Werktage beantwortet. SYNORA
        wird von einer einzelnen Person betrieben; es gibt keine Telefon-Hotline.
      </p>

      <h2>Handelsregister und Mehrwertsteuer</h2>
      <p>
        UID: <Angabe wert={ANGABEN.uid} was="UID-Nummer" feld="uid" />
      </p>

      <h2>Was SYNORA ist – und was nicht</h2>
      <p>
        SYNORA ist ein Empfehlungsdienst. SYNORA verkauft keine Produkte, ist nicht
        Vertragspartner beim Kauf und wickelt keine Zahlungen für Produkte ab. Der
        Kaufvertrag kommt ausschliesslich zwischen dir und dem jeweiligen Händler
        zustande. Für Lieferung, Gewährleistung, Rückgabe und Garantie ist der
        Händler zuständig.
      </p>

      <h2>Preise und Verfügbarkeit</h2>
      <p>
        Preise und Verfügbarkeit stammen aus Abfragen bei den Händlern und geben den
        Stand zum Zeitpunkt der Abfrage wieder. Sie können sich jederzeit ändern.
        Massgeblich ist immer der Preis beim Händler im Moment deiner Bestellung.
        Prüfe ihn dort, bevor du kaufst.
      </p>
      <p>
        Preise werden nie von einem Sprachmodell erzeugt oder geschätzt. Lässt sich
        für ein Produkt kein Preis aus einer Händlerabfrage lesen, zeigt SYNORA
        keinen – auch keinen ungefähren.
      </p>

      <h2>Werbung und Provisionen</h2>
      <p>
        SYNORA nimmt an Partnerprogrammen teil und erhält eine Provision, wenn du über
        einen Link auf SYNORA bei einem Händler kaufst. Für dich ändert sich dadurch
        nichts am Preis.
      </p>
      <p>
        Auf die Empfehlung hat das keinen Einfluss. Welche Produkte dir angezeigt werden
        und in welcher Reihenfolge, entscheidet nie, wer eine Provision zahlt. Produkte
        von Händlern ohne Partnerprogramm werden gleich behandelt.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Produktbilder, Produktbezeichnungen und Markennamen gehören den jeweiligen
        Händlern und Herstellern. Sie werden hier zur Kennzeichnung des Produkts
        verwendet. Texte und Gestaltung von SYNORA gehören dem oben genannten
        Betreiber.
      </p>

      <h2>Haftung</h2>
      <p>
        Die Empfehlungen entstehen automatisiert. Trotz sorgfältiger Prüfung können
        Angaben unvollständig oder überholt sein. Für Entscheidungen, die du auf Basis
        dieser Empfehlungen triffst, wird keine Haftung übernommen.
      </p>
    </>
  );
}

// ============================================
// DATENSCHUTZ
// ============================================
function Datenschutz() {
  return (
    <>
      <h2>Kurz gesagt</h2>
      <p>
        SYNORA speichert so wenig wie möglich: deine E-Mail-Adresse, damit du ein Konto
        haben kannst, und deine Suchanfragen, damit die Empfehlungen entstehen können.
        SYNORA verkauft keine Daten, setzt keine Werbe-Cookies und bindet keine
        Werbenetzwerke ein.
      </p>
      <p>
        Der Rest dieser Seite sagt dasselbe noch einmal ausführlich – mit Namen, Ländern
        und Fristen.
      </p>

      <h2>Wer verantwortlich ist</h2>
      <p>
        <Angabe wert={ANGABEN.name} was="Name oder Firma" />,{' '}
        <Angabe wert={ANGABEN.adresse} was="Adresse" />, Schweiz.<br />
        Bei Fragen zum Datenschutz: <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a>
      </p>
      <p>
        Für die Bearbeitung deiner Daten gilt das schweizerische Datenschutzgesetz
        (DSG, SR 235.1) in der seit dem 1. September 2023 geltenden Fassung. SYNORA
        richtet sich an Kundschaft in der Schweiz: die Preise sind in Franken, die
        Shops sind schweizerische.
      </p>
      <p>
        Die europäische DSGVO gilt dort, wo ein Angebot auf die EU ausgerichtet ist.
        Das ist bei SYNORA derzeit nicht der Fall. Damit das keine Frage der
        Auslegung bleibt, gilt hier Folgendes: <strong>die unten aufgeführten Rechte
        stehen allen Nutzerinnen und Nutzern zu – unabhängig vom Wohnsitz und
        unabhängig davon, welches Gesetz im Einzelfall greift.</strong>
      </p>

      <h2>Welche Daten, wofür, und wie lange</h2>
      <table className="rt-tabelle">
        <thead>
          <tr>
            <th>Daten</th>
            <th>Wofür</th>
            <th>Grundlage</th>
            <th>Wie lange</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-spalte="Daten">E-Mail-Adresse, Passwort (nur als Hashwert, nie im Klartext)</td>
            <td data-spalte="Wofür">Damit du dich anmelden kannst</td>
            <td data-spalte="Grundlage">Vertragsabwicklung (Art. 31 Abs. 2 lit. a DSG)</td>
            <td data-spalte="Wie lange">Bis du dein Konto löschst</td>
          </tr>
          <tr>
            <td data-spalte="Daten">Vorname, Nachname, Geburtsdatum</td>
            <td data-spalte="Wofür">Anrede und Altersprüfung bei der Registrierung</td>
            <td data-spalte="Grundlage">Vertragsabwicklung</td>
            <td data-spalte="Wie lange">Bis du dein Konto löschst</td>
          </tr>
          <tr>
            <td data-spalte="Daten">Deine Suchanfragen und die erzeugten Empfehlungen</td>
            <td data-spalte="Wofür">Um die Antwort zu erstellen und Fehler nachvollziehen zu können</td>
            <td data-spalte="Grundlage">Vertragsabwicklung und überwiegendes Interesse</td>
            <td data-spalte="Wie lange">Solange dein Konto besteht</td>
          </tr>
          <tr>
            <td data-spalte="Daten">Beobachtete Produkte und Zielpreise (Preisalarm)</td>
            <td data-spalte="Wofür">Um dich zu benachrichtigen, wenn der Preis fällt</td>
            <td data-spalte="Grundlage">Vertragsabwicklung</td>
            <td data-spalte="Wie lange">Bis du den Alarm löschst</td>
          </tr>
          <tr>
            <td data-spalte="Daten">Anzahl deiner Suchen im Zeitraum</td>
            <td data-spalte="Wofür">Um die Grenze deines Tarifs einzuhalten</td>
            <td data-spalte="Grundlage">Vertragsabwicklung</td>
            <td data-spalte="Wie lange">Pro Abrechnungszeitraum, danach zurückgesetzt</td>
          </tr>
          <tr>
            <td data-spalte="Daten">Rückmeldungen und gemeldete Käufe, die du selbst absendest</td>
            <td data-spalte="Wofür">Um SYNORA zu verbessern und Aktionen zu prüfen</td>
            <td data-spalte="Grundlage">Überwiegendes Interesse (Art. 31 DSG)</td>
            <td data-spalte="Wie lange">Bis zur Erledigung, längstens 2 Jahre</td>
          </tr>
          <tr>
            <td data-spalte="Daten">IP-Adresse beim Aufruf der Seite</td>
            <td data-spalte="Wofür">Technischer Betrieb und Missbrauchsabwehr</td>
            <td data-spalte="Grundlage">Überwiegendes Interesse (Art. 31 DSG)</td>
            <td data-spalte="Wie lange">Kurzfristig in Server-Protokollen</td>
          </tr>
        </tbody>
      </table>

      <p className="rt-hinweis">
        Zur Spalte „Grundlage": Das schweizerische Recht verlangt – anders als die
        DSGVO – keine Angabe einer Rechtsgrundlage für jede Bearbeitung. Diese Spalte
        steht hier freiwillig, damit du siehst, warum eine Angabe überhaupt
        gespeichert wird.
      </p>

      <h2>Wer sonst noch Daten sieht</h2>
      <p>
        Damit eine Empfehlung entstehen kann, werden Teile deiner Anfrage an
        Dienstleister weitergegeben. Deine E-Mail-Adresse wird dabei nur an den
        Mailversand übermittelt – nicht an die Such- und Sprachdienste.
      </p>
      <table className="rt-tabelle">
        <thead>
          <tr><th>Dienstleister</th><th>Land</th><th>Wofür</th><th>Was dorthin geht</th></tr>
        </thead>
        <tbody>
          {DIENSTLEISTER.map((d) => (
            <tr key={d.firma}>
              <td data-spalte="Dienstleister">{d.firma}</td>
              <td data-spalte="Land"><Angabe wert={d.land} was="Land" /></td>
              <td data-spalte="Wofür">{d.zweck}</td>
              <td data-spalte="Was dorthin geht">{d.daten}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Ein Teil dieser Dienstleister sitzt in den USA. Für die Übermittlung von
        Personendaten in die USA gilt nach schweizerischem Recht Folgendes: Der
        Bundesrat hat die USA mit Wirkung ab dem 15. September 2024 in die Liste der
        Staaten mit angemessenem Datenschutz aufgenommen (Art. 16 Abs. 1 DSG,
        Anhang 1 DSV) – allerdings nur für Unternehmen, die unter dem
        <em> Swiss&#8209;U.S. Data Privacy Framework</em> zertifiziert sind.
      </p>
      <p>
        Bei Dienstleistern, die dort nicht zertifiziert sind, stützt sich die
        Übermittlung auf Standardvertragsklauseln im Sinne von Art. 16 Abs. 2 lit. d
        DSG. In beiden Fällen bleibt bestehen, dass US&#8209;Behörden unter
        US&#8209;Recht auf Daten zugreifen können. Wer das nicht möchte, sollte SYNORA
        nicht nutzen – diese Verarbeitung lässt sich nicht abschalten, weil ohne sie
        keine Preisabfrage möglich ist.
      </p>
      <p>
        Die Datenbank selbst steht in <strong>Frankfurt am Main</strong>, also in der
        EU. Die Schweiz anerkennt die EU-Staaten als Länder mit angemessenem
        Datenschutz; für deine gespeicherten Daten braucht es daher keine
        zusätzliche Begründung. Betreiberin ist allerdings MongoDB, Inc. mit Sitz in
        den USA – ein Zugriff von dort ist damit nicht ausgeschlossen.
      </p>

      <h2>Automatisierte Empfehlungen</h2>
      <p>
        Die Reihenfolge der vorgeschlagenen Produkte entsteht automatisiert. Es handelt
        sich um eine Empfehlung, nicht um eine automatisierte Einzelentscheidung mit
        rechtlicher Wirkung im Sinne von Art. 21 DSG (in der EU: Art. 22 DSGVO). Du
        kaufst nichts über SYNORA, und es wird
        nichts über dich entschieden – du bekommst Vorschläge und entscheidest selbst.
      </p>

      <h2>Was im Speicher deines Browsers liegt</h2>
      <p>
        SYNORA setzt keine Cookies zu Werbe- oder Analysezwecken. Gespeichert wird nur,
        was zum Betrieb nötig ist:
      </p>
      <ul>
        <li>
          <code>synora_token</code> – dein Anmeldenachweis. Wenn du „Angemeldet bleiben"
          nicht ankreuzt, liegt er nur bis zum Schliessen des Tabs dort.
        </li>
        <li>
          <code>synora_sprache</code> – ob du die Seite auf Deutsch oder Englisch liest.
        </li>
      </ul>
      <p>
        Beides liegt ausschliesslich in deinem Browser und wird nicht an Dritte
        übermittelt. Du kannst es jederzeit über die Einstellungen deines Browsers
        löschen; danach bist du abgemeldet.
      </p>

      <h2>Sicherheit</h2>
      <p>
        Die Verbindung zur Website ist verschlüsselt (HTTPS). Passwörter werden nie im
        Klartext gespeichert, sondern nur als Hashwert. Der Zugriff auf die Datenbank
        ist auf den Betreiber beschränkt.
      </p>
      <p>
        Vollständige Sicherheit kann niemand zusichern. Falls es doch einmal zu einer
        Verletzung der Datensicherheit kommt, die ein hohes Risiko für dich bedeutet,
        wirst du informiert. Verletzungen der Datensicherheit, die ein hohes Risiko
        für dich bedeuten, werden ausserdem dem Eidgenössischen Datenschutz- und
        Öffentlichkeitsbeauftragten gemeldet (Art. 24 DSG).
      </p>

      <h2>Deine Rechte</h2>
      <p>Du kannst jederzeit verlangen:</p>
      <ul>
        <li>Auskunft darüber, welche Daten zu dir gespeichert sind (Art. 25 DSG)</li>
        <li>Berichtigung falscher Angaben (Art. 32 Abs. 1 DSG)</li>
        <li>Löschung deiner Daten und deines Kontos (Art. 32 Abs. 2 DSG)</li>
        <li>Untersagung einer bestimmten Bearbeitung oder Weitergabe (Art. 32 Abs. 2 DSG)</li>
        <li>Herausgabe deiner Daten in einem gängigen elektronischen Format (Art. 28 DSG)</li>
      </ul>
      <p>
        Eine Nachricht an <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a> genügt.
        Es entstehen dir dadurch keine Kosten.
      </p>
      <p>
        Wenn du findest, dass mit deinen Daten etwas nicht stimmt, kannst du dich beim
        Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) in Bern
        beschweren – das ist in der Schweiz die zuständige Aufsichtsbehörde. Wohnst du
        in der EU, kannst du dich zusätzlich an die Datenschutzbehörde deines Landes
        wenden.
      </p>

      <h2>Kinder und Jugendliche</h2>
      <p>
        SYNORA richtet sich an Erwachsene. Für ein Konto setzt SYNORA ein Mindestalter
        von 16 Jahren voraus. Das ist eine eigene Regel und keine Gesetzesvorgabe: das
        schweizerische Recht kennt keine feste Altersgrenze, sondern fragt danach, ob
        jemand urteilsfähig ist (Art. 19 ZGB). Für kostenpflichtige Abos brauchen
        Minderjährige die Zustimmung der gesetzlichen Vertretung. Jünger als 16? Dann
        frag bitte deine Eltern, bevor du dich anmeldest.
      </p>

      <h2>Änderungen</h2>
      <p>
        Diese Erklärung kann sich ändern, zum Beispiel wenn ein Dienstleister wechselt.
        Das Datum oben auf dieser Seite sagt dir, welche Fassung gerade gilt. Bei
        wesentlichen Änderungen wirst du per E-Mail informiert.
      </p>
    </>
  );
}

// ============================================
// NUTZUNGSBEDINGUNGEN (AGB)
// ============================================
// daten  = die Antwort von GET /api/einstellungen, oder null,
//          wenn sie nicht geladen werden konnte
function Nutzung({ daten }) {
  const stufen = daten && Array.isArray(daten.stufen) ? daten.stufen : null;
  const bezahlt = stufen ? stufen.filter((s) => s.preisMonat > 0) : [];

  // ============================================
  // Die Abschnitte zaehlen sich selbst
  // ============================================
  // Zwei Abschnitte erscheinen nur unter Bedingungen: der
  // Widerruf (wenn WIDERRUF_TAGE > 0) und die Aktion (wenn
  // AKTION.aktiv). Je nachdem verschieben sich alle Nummern
  // danach.
  //
  // Hier stand vorher an jeder Ueberschrift eine Rechnung wie
  //     {nr()}
  // Das funktioniert, aber beim naechsten neuen Abschnitt muss
  // man elf solche Stellen von Hand nachziehen - und wenn man
  // eine vergisst, stehen in den AGB zwei Abschnitte mit
  // derselben Nummer. In einem Vertragstext ist das nicht nur
  // haesslich, sondern im Streitfall ein Problem, weil sich
  // niemand mehr darauf berufen kann.
  //
  // Jetzt zaehlt nr() einfach hoch. Neue Abschnitte kann man
  // dazwischenschieben, ohne irgendetwas nachzurechnen.
  let zaehler = 0;
  const nr = () => ++zaehler;

  return (
    <>
      <h2>{nr()}. Worum es geht</h2>
      <p>
        SYNORA hilft dir, Produkte zu finden und zu vergleichen. Diese Bedingungen
        gelten für die Nutzung von synora.li und aller dort angebotenen Funktionen.
      </p>
      <p>
        SYNORA verkauft nichts und ist nicht Vertragspartner beim Kauf. Wenn du über
        einen Link bei einem Händler bestellst, kommt der Kaufvertrag ausschliesslich
        zwischen dir und diesem Händler zustande.
      </p>

      <h2>{nr()}. Dein Konto</h2>
      <p>
        Ein Konto ist kostenlos. Gib bei der Registrierung richtige Angaben an und
        behalte dein Passwort für dich. Pro Person ein Konto. Für ein Konto musst du
        mindestens 16 Jahre alt sein.
      </p>
      <p>
        Du bist für alles verantwortlich, was über dein Konto passiert. Wenn du den
        Verdacht hast, dass jemand anderes Zugriff hat, ändere dein Passwort und
        melde dich unter <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a>.
      </p>

      <h2>{nr()}. Wie viele Suchen dir zustehen</h2>
      <p>
        Das hängt von deinem Tarif ab. Die geltenden Zahlen stehen auf der{' '}
        <a href="/premium">Premium-Seite</a>.
      </p>
      <p>
        Sie werden dort direkt aus dem System gelesen, das sie auch durchsetzt – die
        angezeigte Zahl ist also immer die, die wirklich gilt. Deshalb stehen hier
        bewusst keine abgetippten Zahlen: Sie könnten veralten, die Premium-Seite
        nicht.
      </p>

      {/* ============================================
          Preise nur zeigen, wenn sie geladen wurden
          ============================================
          Dieselbe Regel wie auf der Premium-Seite: lieber
          nichts als eine Ersatzzahl. Eine AGB-Seite, die im
          Zweifel irgendeinen Preis nennt, ist genau das
          Problem, das diese Seite vermeiden soll. */}
      <h2>{nr()}. Premium</h2>
      {bezahlt.length > 0 ? (
        <>
          <p>Zur Zeit gelten diese Preise:</p>
          <ul>
            {bezahlt.map((s) => (
              <li key={s.schluessel}>
                <strong>{s.name}</strong>: {franken(s.preisMonat)} im Monat
                {s.preisJahr ? <> oder {franken(s.preisJahr)} im Jahr</> : null}
              </li>
            ))}
          </ul>
          <p>
            Alle Preise verstehen sich in Schweizer Franken und schliessen die
            Mehrwertsteuer ein, soweit sie anfällt.
          </p>
        </>
      ) : (
        <p>
          Die aktuellen Preise stehen auf der <a href="/premium">Premium-Seite</a>.
        </p>
      )}

      {daten && daten.verkaufAktiv === false && (
        <p>
          <strong>Premium ist derzeit nicht käuflich.</strong> Sobald der Verkauf
          startet, gelten die Preise, die dann auf der Premium-Seite stehen.
        </p>
      )}

      <h2>{nr()}. Zahlung, Verlängerung, Kündigung</h2>
      <p>
        Ein Premium-Abo läuft ab dem Kauf für den gewählten Zeitraum – einen Monat oder
        ein Jahr. Es verlängert sich automatisch um denselben Zeitraum, solange du nicht
        kündigst.
      </p>
      <p>
        Du kannst jederzeit zum Ende des laufenden Zeitraums kündigen. Eine Nachricht an{' '}
        <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a> genügt. Nach der
        Kündigung bleibt Premium bis zum Ende des bezahlten Zeitraums aktiv, danach
        wird dein Konto auf den Gratis-Tarif umgestellt. Dein Konto und deine
        Preisalarme bleiben bestehen.
      </p>
      <p>
        {ANGABEN.zahlungsanbieter ? (
          <>Zahlungen werden über {ANGABEN.zahlungsanbieter} abgewickelt. </>
        ) : ENTFAELLT.zahlungsanbieter ? (
          <>
            Solange Premium nicht verkauft wird, werden über SYNORA keine Zahlungen
            abgewickelt. Sobald das der Fall ist, steht der Zahlungsdienstleister hier
            und wird vorher in der Datenschutzerklärung genannt.{' '}
          </>
        ) : (
          <>
            Zahlungen werden über{' '}
            <Angabe wert={ANGABEN.zahlungsanbieter} was="Zahlungsanbieter" /> abgewickelt.{' '}
          </>
        )}
        SYNORA speichert keine Kreditkartendaten.
      </p>

      {WIDERRUF_TAGE > 0 && (
        <>
          <h2>{nr()}. Widerruf</h2>
          <p>
            Du kannst ein Premium-Abo innerhalb von {WIDERRUF_TAGE} Tagen nach dem Kauf
            ohne Angabe von Gründen widerrufen. Eine Nachricht an{' '}
            <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a> genügt. Der bezahlte
            Betrag wird vollständig zurückerstattet.
          </p>
          <p>
            Dieses Widerrufsrecht gewährt SYNORA <strong>freiwillig</strong>. Das
            schweizerische Recht schreibt für Verträge, die online geschlossen werden,
            kein Widerrufsrecht vor. SYNORA räumt es trotzdem ein, und zwar allen
            Kundinnen und Kunden unabhängig vom Wohnsitz. Was hier steht, gilt damit
            vertraglich – unabhängig davon, was das Gesetz verlangen würde.
          </p>
        </>
      )}

      {AKTION.aktiv && (
        <>
          <h2>{nr()}. Aktion: ein Jahr Premium gratis</h2>
          <p>
            Die ersten {AKTION.plaetze} Personen, die über einen Link auf SYNORA für
            mehr als {franken(AKTION.mindestbetrag)} einkaufen, erhalten ein Jahr
            Premium geschenkt.
          </p>
          <ul>
            <li>
              Die Aktion läuft bis <Angabe wert={AKTION.frist} was="Frist" />.
            </li>
            <li>
              {AKTION.einKauf === null
                ? <Luecke was="Ein Kauf oder Summe mehrerer Käufe" />
                : AKTION.einKauf
                  ? `Massgeblich ist ein einzelner Kauf über ${AKTION.mindestbetrag} Franken.`
                  : `Massgeblich ist die Summe deiner Käufe über ${AKTION.mindestbetrag} Franken.`}
            </li>
            <li>
              {AKTION.nurPartnershops === null
                ? <Luecke was="Welche Shops zählen" />
                : AKTION.nurPartnershops
                  ? 'Es zählen nur Käufe bei Händlern, die auf SYNORA als Partner gekennzeichnet sind.'
                  : 'Es zählen Käufe bei allen auf SYNORA gezeigten Händlern.'}
            </li>
            <li>
              Du meldest deinen Kauf selbst über <a href="/kauf-melden">Kauf melden</a>.
              Die Meldung wird von Hand geprüft; das kann einige Tage dauern.
            </li>
            <li>
              Bei einer Rückgabe oder Stornierung:{' '}
              <Angabe wert={AKTION.beiRueckgabe} was="Regel bei Rückgabe" />
            </li>
            <li>
              Der Anspruch kann nicht in Geld ausbezahlt und nicht übertragen werden.
            </li>
          </ul>
        </>
      )}

      <h2>{nr()}. Preisalarme</h2>
      <p>
        Ein Preisalarm benachrichtigt dich per E-Mail, wenn der beobachtete Preis fällt.
        Die Prüfung läuft in Abständen, nicht laufend – zwischen zwei Prüfungen kann
        sich ein Preis ändern, ohne dass du eine Mail bekommst.
      </p>
      <p>
        SYNORA kann nicht zusichern, dass jede Preisänderung erkannt wird, dass eine
        Mail ankommt oder dass das Angebot bei Erhalt der Mail noch gilt. Ein verpasster
        Alarm begründet keinen Anspruch.
      </p>

      <h2>{nr()}. Was du nicht tun sollst</h2>
      <ul>
        <li>SYNORA automatisiert abfragen oder Inhalte massenhaft auslesen</li>
        <li>Mehrere Konten anlegen, um die Suchgrenze zu umgehen</li>
        <li>Versuchen, in fremde Konten zu gelangen oder den Dienst zu stören</li>
        <li>Käufe melden, die es nicht gegeben hat</li>
      </ul>
      <p>
        Bei einem Verstoss kann dein Konto gesperrt werden. Bei einem bezahlten Abo wird
        der Betrag für den nicht genutzten Zeitraum zurückerstattet, sofern der Verstoss
        nicht in einer Täuschung bestand.
      </p>

      <h2>{nr()}. Empfehlungen sind Empfehlungen</h2>
      <p>
        Die Vorschläge entstehen automatisiert und können Fehler enthalten. Prüfe Preis,
        Verfügbarkeit und Eigenschaften beim Händler, bevor du kaufst. Die Entscheidung
        bleibt bei dir.
      </p>

      <h2>{nr()}. Verfügbarkeit</h2>
      <p>
        SYNORA bemüht sich um einen zuverlässigen Betrieb, sichert aber keine bestimmte
        Verfügbarkeit zu. Wartungsarbeiten, Störungen bei Dienstleistern oder
        Ausfälle können dazu führen, dass der Dienst vorübergehend nicht erreichbar
        ist.
      </p>
      <p>
        Fällt Premium länger als zusammenhängend sieben Tage aus, verlängert sich dein
        Abo um die Ausfallzeit.
      </p>

      <h2>{nr()}. Haftung</h2>
      <p>
        SYNORA haftet für Schäden aus Vorsatz und grober Fahrlässigkeit. Für leichte
        Fahrlässigkeit ist die Haftung ausgeschlossen, soweit das Gesetz das zulässt.
      </p>
      <p>
        Für den Kauf selbst – Lieferung, Mängel, Garantie, Rückgabe – haftet
        ausschliesslich der Händler.
      </p>

      <h2>{nr()}. Änderungen dieser Bedingungen</h2>
      <p>
        Diese Bedingungen können sich ändern. Die jeweils geltende Fassung steht auf
        dieser Seite, mit Datum. Bei wesentlichen Änderungen wirst du per E-Mail
        informiert, bevor sie gelten. Widersprichst du nicht innerhalb von 30 Tagen
        und nutzt SYNORA weiter, gilt die neue Fassung als angenommen.
      </p>

      <h2>{nr()}. Kündigung durch dich</h2>
      <p>
        Du kannst dein Konto jederzeit löschen lassen – eine Nachricht an{' '}
        <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a> genügt. Deine Daten
        werden dann gelöscht.
      </p>

      <h2>{nr()}. Anwendbares Recht</h2>
      <p>
        Es gilt schweizerisches Recht, unter Ausschluss des Übereinkommens der
        Vereinten Nationen über Verträge über den internationalen Warenkauf.
        Gerichtsstand ist{' '}
        <Angabe wert={ANGABEN.ort} was="Ort" />, Schweiz.
      </p>
      <p>
        Für Konsumentinnen und Konsumenten gilt das nur eingeschränkt: Nach Art. 32
        der Schweizerischen Zivilprozessordnung können sie auch an ihrem eigenen Wohnsitz
        klagen, und auf diesen Gerichtsstand kann im Voraus nicht verzichtet werden.
        Zwingende Konsumentenschutzvorschriften des Wohnsitzlandes bleiben ebenfalls
        unberührt. Diese Klausel schränkt also niemanden ein, dem das Gesetz mehr
        zugesteht.
      </p>
    </>
  );
}

const INHALTE = {
  impressum:   { titel: 'Impressum',             Inhalt: Impressum },
  datenschutz: { titel: 'Datenschutzerklärung',  Inhalt: Datenschutz },
  nutzung:     { titel: 'Nutzungsbedingungen',   Inhalt: Nutzung }
};

export default function Rechtstext({ art }) {
  const { t, sprache } = useSprache();
  const eintrag = INHALTE[art] || INHALTE.impressum;
  const { Inhalt } = eintrag;

  // ============================================
  // Zahlen aus derselben Quelle wie die Premium-Seite
  // ============================================
  // Nur die Nutzungsbedingungen brauchen sie. Faellt der Abruf
  // aus, bleibt daten null - dann zeigt der Abschnitt einen
  // Verweis auf die Premium-Seite statt einer Zahl.
  const [daten, setDaten] = useState(null);

  useEffect(() => {
    if (art !== 'nutzung') return;
    let abgebrochen = false;
    (async () => {
      const r = await einstellungenHolen();
      if (!abgebrochen && r.ok && r.daten) setDaten(r.daten);
    })();
    return () => { abgebrochen = true; };
  }, [art]);

  // Fehlt noch eine Angabe? Dann steht das oben auf der Seite -
  // sichtbar, nicht versteckt. Die Dienstleister-Laender zaehlen
  // mit: Eine Datenschutzerklaerung ohne Land ist unvollstaendig.
  // Felder mit hinterlegtem Grund zaehlen nicht als fehlend -
  // sonst stuende oben "Es fehlen noch 2 Angaben", obwohl beide
  // beantwortet sind.
  const fehlendeAngaben = Object.entries(ANGABEN)
    .filter(([schluessel, wert]) => !wert && !ENTFAELLT[schluessel])
    .map(([schluessel]) => schluessel);

  const fehlendeLaender = DIENSTLEISTER.filter((d) => !d.land).length;
  const fehlend = fehlendeAngaben.length + (art === 'datenschutz' ? fehlendeLaender : 0);

  return (
    <>
      <Kopfzeile />

      <main className="rt-seite">
        <h1>{eintrag.titel}</h1>
        <p className="rt-stand">{t('rechtliches.stand')}: {STAND}</p>

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

        {fehlend > 0 && (
          <aside className="rt-warnung" role="note">
            <strong>Diese Seite ist noch nicht vollständig.</strong>
            <p>
              Es fehlen noch {fehlend} Angabe{fehlend > 1 ? 'n' : ''}.
              Die betroffenen Stellen sind im Text markiert. Bis dahin erreichst du uns
              unter <a href={`mailto:${ANGABEN.email}`}>{ANGABEN.email}</a>.
            </p>
          </aside>
        )}

        <div className="rt-inhalt">
          <Inhalt daten={daten} />
        </div>
      </main>

      <Fusszeile />
    </>
  );
}