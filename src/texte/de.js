// ============================================
// SYNORA - alle deutschen Texte
// ============================================
// KEIN Text steht im Code. Alles steht hier.
//
// WARUM
// Englisch ist jetzt schon dabei. Franzoesisch oder Italienisch
// sind spaeter EINE neue Datei - nicht zwanzig Komponenten, die
// nochmal angefasst werden muessen. In der Schweiz ist das keine
// Spielerei, sondern absehbar.
//
// ZAHLEN STEHEN HIER NICHT
// Preise, Suchgrenzen und Alarmzahlen kommen aus
// GET /api/einstellungen, also aus dem Backend. Genau daran ist
// die Design-Vorlage gescheitert: dort standen "3 kostenlose
// Suchen ohne Anmeldung" und "Unbegrenzt mit Account", waehrend
// das Backend null und fuenf erlaubte.
//
// Wo eine Zahl in den Text muss, steht ein Platzhalter {zahl},
// der zur Laufzeit gefuellt wird.
// ============================================

// ============================================
// ERST ZUWEISEN, DANN AUSGEBEN
// ============================================
// Hier stand "export default { ... }" direkt. Das baut zwar,
// aber ESLint warnt davor - und Create React App macht aus
// Warnungen FEHLER, sobald CI=true gesetzt ist. Vercel setzt
// das automatisch.
//
// Gefunden am 05.10.2026 bei einem echten Build. Lokal lief es
// durch, auf Vercel waere der Deploy abgebrochen - mit einer
// Meldung, die nach einem Problem im Code aussieht statt nach
// einer Stilregel.
const deutsch = {
  sprache: { name: 'Deutsch', kuerzel: 'DE' },

  // ==========================================
  // ALLGEMEIN
  // ==========================================
  allgemein: {
    anmelden: 'Anmelden',
    registrieren: 'Registrieren',
    abmelden: 'Abmelden',
    kostenlosStarten: 'Kostenlos starten',
    weiter: 'Weiter',
    abbrechen: 'Abbrechen',
    speichern: 'Speichern',
    zurueck: 'Zurück',
    laedt: 'Einen Moment …',
    nochmalVersuchen: 'Nochmal versuchen',
    pflichtfeld: 'Dieses Feld brauchen wir',
    bald: 'Bald',
    kommtBald: 'Kommt bald',
    mehrErfahren: 'Mehr erfahren'
  },

  // ==========================================
  // MENUE
  // ==========================================
  // "Shop" und "Deals" aus der Vorlage fehlen hier mit Absicht:
  // SYNORA ist kein Shop und hat keine Deals. Ein Menuepunkt,
  // der ins Leere fuehrt, kostet mehr Vertrauen als ein Menue
  // mit vier statt sechs Eintraegen.
  menue: {
    assistent: 'KI-Assistent',
    kategorien: 'Kategorien',
    preisalarme: 'Preisalarme',
    premium: 'Premium',
    ueberUns: 'Über uns'
  },

  // ==========================================
  // STARTSEITE
  // ==========================================
  start: {
    ueberschriftOben: 'Shoppen. Besser entscheiden. Mit SYNORA.',

    // Die Zeile aus deiner Vorlage. Sie ist gut und sie stimmt -
    // das "Warum" ist genau das, was SYNORA liefert.
    titelTeil1: 'SYNORA sagt dir nicht nur',
    titelHervor1: 'WAS,',
    titelTeil2: 'sondern',
    titelHervor2: 'WARUM.',

    // In der Vorlage stand hier "Transparente, SCHNELLE und
    // unabhaengige Produktempfehlungen". "Schnell" ist raus:
    // allein Perplexity hat 25 Sekunden Zeitlimit, und ein
    // Versprechen, das die erste Suche widerlegt, ist teurer als
    // ein fehlendes Adjektiv.
    untertitel:
      'Unabhängige Produktempfehlungen aus Schweizer Shops. SYNORA vergleicht für dich, ' +
      'erklärt jede Empfehlung – und nennt bei jedem Produkt auch, was dagegen spricht.',

    // Die Beispielkarte auf der Startseite. Sie gehoert hierher
    // und nicht in die Komponente: sonst bleibt sie deutsch,
    // auch wenn die Seite auf Englisch steht. Genau das war am
    // 05.10.2026 der Fall.
    beispiel: {
      name: 'Kopfhörer, Beispiel',
      preis: 'CHF 279.–',
      beiShop: 'bei {shop}',
      shop: 'Beispielshop',
      dafuer: [
        'Sehr gute Geräuschunterdrückung',
        '30 Stunden Akku',
        'Faltbar für die Reise'
      ],
      dagegen: [
        'Bügel knarzt nach längerem Tragen',
        'Kein Klinkenanschluss'
      ],
      hinweis: 'Beispiel zur Veranschaulichung – keine echte Empfehlung'
    },

    sucheBeispiel: 'Zum Beispiel: Welcher Laptop ist gut für mein Studium?',

    beispiele: [
      'Laptop für Studium unter 1000 CHF',
      'Beste Noise-Cancelling Kopfhörer',
      'Geschenkideen unter 100 CHF'
    ],

    // ==========================================
    // DIE DREI KACHELN
    // ==========================================
    // In der Vorlage stand hier:
    //   "3 kostenlose Suchen ohne Anmeldung"  -> es sind null
    //   "Unbegrenzt mit Account"              -> es sind fuenf
    //   "100% kostenlos und unabhaengig"      -> Premium kostet 7
    //
    // Alle drei falsch. {zahl} wird aus /api/einstellungen
    // gefuellt, kann also nicht mehr auseinanderlaufen.
    kacheln: {
      gratis: {
        titel: '{zahl} Suchen im Monat',
        text: 'Gratis, sobald du ein Konto hast'
      },
      premium: {
        titel: '{zahl} Suchen mit Premium',
        text: 'CHF {preis} im Monat'
      },
      ehrlich: {
        titel: 'Keine Provision entscheidet mit',
        text: 'Wir zeigen auch die Nachteile'
      }
    },

    // ==========================================
    // DIE DREI VERSPRECHEN
    // ==========================================
    // In der Vorlage standen hier "84/100 SYNORA SCORE",
    // "~3 Sek Antwortzeit" und "100% Transparent".
    //
    // Der Score ist eine Produktbewertung, keine Kennzahl der
    // Firma. Die 3 Sekunden sind nicht gemessen. Beides raus.
    // Geblieben ist, was wirklich nachweisbar ist.
    versprechen: [
      {
        titel: 'Preise kommen aus echten Shops',
        text: 'Kein Sprachmodell darf bei SYNORA einen Preis erfinden. Preise und Verfügbarkeit kommen aus der Shop-Abfrage – oder gar nicht.'
      },
      {
        titel: 'Bei jedem Produkt ein Nachteil',
        text: 'Jede Empfehlung nennt auch, was gegen das Produkt spricht. Wenn wir keinen Nachteil finden, zeigen wir das Produkt nicht.'
      },
      {
        titel: 'Endpreis für die Schweiz',
        text: 'Was du am Ende zahlst, nicht was im Ausland angeschrieben steht.'
      }
    ],

    kategorienTitel: 'Entdecke, was zu dir passt.',
    kategorienOben: 'Beliebte Kategorien',
    alleKategorien: 'Alle Kategorien ansehen',

    kategorien: [
      { schluessel: 'laptops',      name: 'Laptops',      text: 'Für Studium, Arbeit und mehr' },
      { schluessel: 'smartphones',  name: 'Smartphones',  text: 'Die neuesten Modelle im Vergleich' },
      { schluessel: 'kopfhoerer',   name: 'Kopfhörer',    text: 'Besserer Sound für jeden Tag' },
      { schluessel: 'smartwatches', name: 'Smartwatches', text: 'Fitness, Gesundheit und Lifestyle' },
      { schluessel: 'gaming',       name: 'Gaming',       text: 'Für dein nächstes Level' },
      { schluessel: 'haushalt',     name: 'Haushalt',     text: 'Smarte Helfer für Zuhause' }
    ]
  },

  // ==========================================
  // ANMELDEN
  // ==========================================
  anmelden: {
    obenKlein: 'Shoppen. Besser entscheiden. Mit SYNORA.',
    titelTeil1: 'Willkommen',
    titelHervor: 'zurück.',
    untertitel: 'Melde dich an, um weiterzufahren.',

    kartenTitel: 'Anmelden',
    kartenText: 'Melde dich an, um weiterzufahren.',

    email: 'E-Mail-Adresse',
    passwort: 'Passwort',
    angemeldetBleiben: 'Angemeldet bleiben',
    passwortVergessen: 'Passwort vergessen?',
    knopf: 'Anmelden',
    nochKeinKonto: 'Noch kein Konto?',
    jetztRegistrieren: 'Jetzt registrieren',

    // Die Vorteile links in der Vorlage. "Merkliste und
    // Bestellungen" steht dort - Bestellungen gibt es bei SYNORA
    // nicht, SYNORA verkauft nichts. Angepasst.
    vorteile: [
      { titel: 'Dein Konto',        text: 'Deine Suchen und Preisalarme an einem Ort' },
      { titel: 'Preise im Blick',   text: 'SYNORA meldet sich, wenn ein Preis fällt' },
      { titel: 'Auf jedem Gerät',   text: 'Einmal anmelden, überall weitermachen' }
    ],

    fehlerAllgemein: 'Anmeldung nicht möglich. Prüfe E-Mail und Passwort.'
  },

  // ==========================================
  // REGISTRIEREN
  // ==========================================
  registrieren: {
    titelTeil1: 'Kostenlos',
    titelHervor: 'registrieren',
    untertitel:
      'Unabhängige Produktempfehlungen aus Schweizer Shops. ' +
      'Objektiv, nachvollziehbar – und mit Nachteilen, nicht nur Vorteilen.',

    kartenTitel: 'Konto erstellen',
    kartenText: 'In wenigen Sekunden registrieren und loslegen.',

    vorname: 'Vorname',
    nachname: 'Nachname',
    email: 'E-Mail',
    geburtsdatum: 'Geburtsdatum',
    passwort: 'Passwort',
    passwortHinweis: 'Mindestens 8 Zeichen',
    passwortWiederholen: 'Passwort bestätigen',
    passwortWiederholenHinweis: 'Passwort erneut eingeben',
    passwortStaerke: 'Passwort-Stärke',
    staerke: ['Zu kurz', 'Schwach', 'Geht so', 'Gut', 'Stark'],

    bedingungenTeil1: 'Ich akzeptiere die',
    nutzungsbedingungen: 'Nutzungsbedingungen',
    bedingungenUnd: 'und',
    datenschutz: 'Datenschutzerklärung',

    knopf: 'Kostenlos registrieren',
    schonKonto: 'Bereits ein Konto?',
    jetztAnmelden: 'Jetzt anmelden',

    // In der Vorlage wird ein Geburtsdatum abgefragt. Das ist
    // hier nicht dabei: SYNORA braucht es fuer nichts, und jede
    // Angabe, die man nicht braucht, darf man nach Schweizer DSG
    // und DSGVO auch nicht verlangen. Ausserdem springt bei jedem
    // Pflichtfeld ein Teil der Leute ab.
    vorteile: [
      { titel: '{zahl} Suchen im Monat', text: 'Gratis mit Konto.' },
      { titel: 'Preisalarm mit Premium', text: 'SYNORA meldet sich, wenn der Preis fällt.' },
      { titel: 'Unabhängig',             text: 'Keine Provision entscheidet über die Empfehlung.' }
    ],

    fehlerPasswoerter: 'Die beiden Passwörter sind nicht gleich.',
    fehlerBedingungen: 'Bitte akzeptiere die Nutzungsbedingungen.',
    fehlerAllgemein: 'Registrierung nicht möglich.'
  },

  // ==========================================
  // PASSWORT VERGESSEN
  // ==========================================
  passwortVergessen: {
    titelTeil1: 'Passwort',
    titelHervor: 'vergessen?',
    untertitel:
      'Kein Problem. Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurücksetzen.',
    email: 'E-Mail-Adresse',
    knopf: 'Link senden',
    zurueck: 'Zurück zur Anmeldung',

    hinweise: [
      {
        titel: 'Link per E-Mail',
        text: 'Du bekommst in wenigen Minuten einen Link zum Zurücksetzen deines Passworts.'
      },
      {
        titel: 'Zeitlich begrenzt',
        text: 'Der Link gilt nur für dich und läuft nach kurzer Zeit ab.'
      },
      {
        titel: 'Keine E-Mail erhalten?',
        text: 'Schau auch im Spam-Ordner nach. Kommt nichts an, versuch es in ein paar Minuten nochmal.'
      }
    ],

    // Immer dieselbe Antwort, egal ob die Adresse existiert.
    // Sonst kann jemand durchprobieren, wer bei SYNORA ein Konto
    // hat.
    gesendet:
      'Wenn es zu dieser Adresse ein Konto gibt, ist der Link unterwegs. Schau auch im Spam-Ordner nach.'
  },

  // ==========================================
  // CHAT
  // ==========================================
  chat: {
    neuerChat: 'Neuer Chat',
    verlauf: 'Chat-Verlauf',
    gespeichert: 'Gespeicherte Produkte',
    vergleiche: 'Vergleiche',
    einstellungen: 'Einstellungen',
    letzteChats: 'Letzte Chats',
    alleAnzeigen: 'Alle anzeigen',

    begruessung: 'Hallo! Ich bin SYNORA.',
    begruessungText:
      'Dein unabhängiger Einkaufs-Assistent. Ich helfe dir, das passende Produkt zu finden – ' +
      'mit nachvollziehbaren Empfehlungen aus Schweizer Shops.',

    merkmale: [
      { titel: 'Unabhängig',     text: 'Keine Herstellerbindung' },
      { titel: 'Nachvollziehbar', text: 'Jede Empfehlung begründet' },
      { titel: 'Schweizer Shops', text: 'Digitec, Galaxus, Interdiscount und mehr' }
    ],

    eingabe: 'Frag SYNORA nach einem Produkt …',
    senden: 'Senden',
    denkt: 'SYNORA sucht …',

    empfehlungenTitel: 'Meine Vorschläge für dich',
    alleErgebnisse: 'Alle {zahl} Ergebnisse anzeigen',
    zumShop: 'Zum Shop',
    vergleichen: 'Vergleichen',
    preisBeobachten: 'Preis beobachten',
    dafuer: 'Dafür spricht',
    dagegen: 'Dagegen spricht',

    // Hinweis beim Erreichen des Limits. Aus dem Premium-
    // Dokument, Moment 1: "Nicht bestrafen, sondern nach vorn
    // zeigen."
    limitErreicht:
      'Du hast diesen Monat {genutzt} Mal gesucht. Mit Premium suchst du weiter – ' +
      'und bekommst einen Preisalarm, der sich meldet, sobald dein Produkt günstiger wird.',
    limitKnopf: 'Premium ansehen',

    ohneKonto:
      'Zum Suchen brauchst du ein Konto. Es ist kostenlos und dauert eine Minute.',

    // Funktionen aus der Vorlage, die es im Backend nicht gibt.
    nochNicht: 'Diese Funktion kommt bald.',

    // ---------- Infospalte rechts ----------
    infoSpalte: 'Hinweise zur Suche',
    zumBeispiel: 'Zum Beispiel:',
    verlaufLeer: 'Noch keine gespeicherten Unterhaltungen. Sobald der Verlauf da ist, findest du sie hier.',

    budgetTitel: 'Preisbereich',
    budgetBis: 'bis',
    budgetOhne: 'ohne Grenze',
    budgetHinweis:
      'Schieb den Regler, dann hänge ich „unter X CHF" an deine Frage an. ' +
      'Du siehst es im Eingabefeld, bevor du abschickst.',
    budgetAktiv:
      'Deine nächste Frage bekommt „unter {zahl} CHF" angehängt – sichtbar, nicht heimlich.',

    shopsTitel: 'Schweizer Shops',
    shopsText: 'Preise und Verfügbarkeit kommen aus Abfragen bei diesen Händlern.',
    shopsListe: ['Digitec', 'Galaxus', 'Interdiscount', 'MediaMarkt Schweiz', 'Microspot', 'Brack'],

    scoreTitel: 'SYNORA Score',
    scoreText:
      'Die Zahl fasst zusammen, wie gut ein Produkt zu deiner Frage passt – ' +
      'nicht, wie gut es allgemein ist. Wer eine Provision zahlt, fliesst nie ein.'
  },

  // ==========================================
  // E-MAIL BESTAETIGEN / PASSWORT NEU
  // ==========================================
  // Dein Backend verschickt Links auf ?verify=... und ?reset=...
  // Diese Texte gehoeren hierher und nicht in die Komponente -
  // sonst stehen sie auf Englisch weiterhin auf Deutsch da.
  // ==========================================
  // PREMIUM-SEITE
  // ==========================================
  premium: {
    titelTeil1: 'Alle sehen',
    titelHervor: 'dieselben',
    titelTeil2: 'Empfehlungen.',
    unterzeile: 'Bezahlen ändert nur, wie oft du fragen kannst und wie viel SYNORA für dich im Blick behält. Nie, welche Produkte du bekommst.',

    monatlich: 'Monatlich',
    jaehrlich: 'Jährlich',
    gratis: 'Gratis',
    imMonat: 'im Monat',
    imJahr: 'im Jahr',
    stattMonatlich: 'statt {betrag} bei monatlicher Zahlung',
    suchenImMonat: 'Suchen im Monat',
    unbegrenzt: 'unbegrenzt',
    meisteNehmen: 'Die meisten nehmen diese',
    nochNichtFrei: 'Noch nicht freigeschaltet',
    nochNichtKaeuflich: 'Noch nicht käuflich',
    kontoErstellen: 'Konto erstellen',
    hastKonto: 'Du hast ein Konto',
    waehlen: '{name} wählen',
    tabelleTitel: 'Was jede Stufe kann',
    bisX: 'bis {zahl}',

    zeilen: {
      dreiVorschlaege: 'Drei Vorschläge mit Begründung',
      nachteilJeProdukt: 'Nachteil bei jedem Produkt',
      endpreisSchweiz: 'Endpreis für die Schweiz',
      preisalarm: 'Preisalarm',
      preisverlauf: 'Preisverlauf',
      merkliste: 'Merkliste und Suchverlauf',
      alarme: 'Produkte gleichzeitig beobachten',
      besitzWaechter: 'Besitz-Wächter',
      aktionenFrueher: 'Aktionen 24 Stunden früher',
      personen: 'Mehrere Personen im Konto'
    },

    versprechenTitel: 'Warum die oberen drei Zeilen überall einen Haken haben',
    versprechen1: 'Weil die Empfehlung nicht verhandelbar ist. Wer zahlt, bekommt nicht die besseren Produkte — sondern mehr Suchen und Werkzeuge, die Preise für ihn im Auge behalten.',
    versprechen2: 'Wären Empfehlungen käuflich, wäre SYNORA eine Werbeplattform mit Suchfeld. Davon gibt es genug.',

    offenTitel: 'Premium kannst du gerade nicht kaufen',
    offenText: 'Das ist Absicht. Solange SYNORA in der Testphase ist, wird Premium verschenkt statt verkauft — erst wenn die Empfehlungen gut genug sind, kostet es etwas.',

    ladeFehlerTitel: 'Preise gerade nicht abrufbar',
    ladeFehlerText: 'Wir zeigen hier lieber nichts als eine Zahl, die vielleicht nicht stimmt.',
    laden: 'Preise werden geladen …'
  },

  fehler: {
    allgemein: 'Das hat nicht geklappt.',
    alarmeLaden: 'Die Preisalarme konnten nicht geladen werden.',
    preiseLaden: 'Die Preise konnten nicht geladen werden.'
  },

  // Fuer Seiten, die es nur auf Deutsch gibt.
  nurDeutsch: '',

  bestaetigen: {
    laeuft: 'E-Mail wird bestätigt …',
    laeuftUnter: 'Einen Moment.',
    okTitel: 'Deine E-Mail ist bestätigt.',
    okUnter: 'Du kannst dich jetzt anmelden.',
    fehlerTitel: 'Das hat nicht geklappt.',
    fehlerUnter: 'Der Link ist abgelaufen oder wurde schon benutzt. Wenn du dein Konto schon bestätigt hast, melde dich einfach an.',

    neuTitel: 'Neues Passwort setzen',
    neuUnter: 'Wähle ein neues Passwort. Mindestens acht Zeichen.',
    neuFertig: 'Dein Passwort ist geändert. Du kannst dich jetzt anmelden.'
  },

  // Meldungen aus api.js. Stehen hier, damit auch ein
  // Netzwerkfehler in der gewaehlten Sprache erscheint.
  netz: {
    keineVerbindung: 'Keine Verbindung zu SYNORA. Prüfe deine Internetverbindung.',
    fehlerMitNummer: 'Fehler {status}',
    zuLange: 'SYNORA antwortet gerade nicht. Versuch es in einer Minute nochmal.'
  },

  // ==========================================
  // PREISALARME
  // ==========================================
  preisalarm: {
    titel: 'Deine Preisalarme',
    untertitel: 'SYNORA prüft die Preise und meldet sich, wenn es günstiger wird.',
    keine: 'Du beobachtest noch kein Produkt.',
    keineHilfe: 'Such nach einem Produkt und tipp auf "Preis beobachten".',

    zielpreis: 'Zielpreis',
    zielpreisHinweis: 'Freiwillig. Ohne Zielpreis melden wir jede echte Preissenkung.',
    aktuell: 'Aktuell',
    beimSetzen: 'Beim Setzen',
    loeschen: 'Nicht mehr beobachten',
    anlegen: 'Preis beobachten',
    angelegt: 'SYNORA beobachtet dieses Produkt jetzt für dich.',

    nurPremium: 'Preisalarme gibt es mit Premium.',
    vollTitel: 'Alle Plätze belegt',
    voll: 'Du beobachtest schon {zahl} Produkte. Entferne eines, um Platz zu machen.',

    // Wie oft geprueft wird, kommt aus PREISALARM_TAKT_TAGE.
    taktHinweis: 'SYNORA prüft die Preise regelmässig – nicht stündlich, das wäre teuer und bringt nichts.'
  },

  // ==========================================
  // KAUF MELDEN (die CHF-300-Aktion)
  // ==========================================
  kaufMelden: {
    titel: 'Kauf melden',
    untertitel:
      'Hast du über SYNORA für mehr als CHF {betrag} gekauft? Dann bekommst du ein Jahr Premium geschenkt.',
    shop: 'In welchem Shop?',
    betrag: 'Betrag in CHF',
    bestellnummer: 'Bestellnummer',
    bestellnummerHinweis: 'Steht in deiner Bestellbestätigung.',
    datum: 'Datum des Kaufs',
    knopf: 'Kauf melden',

    gesendet:
      'Danke. Wir schauen uns die Meldung an und schalten Premium frei, sobald wir den Kauf bestätigen können.',

    // Ehrlich sagen, dass von Hand geprueft wird. Wer das weiss,
    // wartet geduldiger - und ueberlegt es sich zweimal, falsche
    // Angaben zu machen.
    hinweis:
      'Jede Meldung wird von Hand geprüft. Das dauert ein paar Tage.'
  },

  // ==========================================
  // FEEDBACK
  // ==========================================
  feedback: {
    titel: 'Was läuft falsch?',
    untertitel:
      'SYNORA soll aus Fehlern lernen. Sag uns, wenn eine Empfehlung nicht gepasst hat – ' +
      'wir schauen uns das an.',
    art: {
      falschesProdukt: 'Empfehlung passte nicht',
      falscherPreis: 'Preis stimmte nicht',
      fehler: 'Etwas war kaputt',
      wunsch: 'Ich wünsche mir etwas',
      sonstiges: 'Etwas anderes'
    },
    nachricht: 'Was ist passiert?',
    knopf: 'Absenden',
    gesendet: 'Danke. Das hilft wirklich.'
  },

  // ==========================================
  // FUSSZEILE
  // ==========================================
  fuss: {
    beschreibung:
      'Unabhängige Produktempfehlungen aus Schweizer Shops. Mit Begründung – und mit Nachteilen.',
    produkt: 'Produkt',
    rechtliches: 'Rechtliches',
    kontakt: 'Kontakt',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    nutzungsbedingungen: 'Nutzungsbedingungen',
    feedbackGeben: 'Feedback geben',
    kaufMelden: 'Kauf melden',

    // Affiliate-Hinweis. In der Schweiz und der EU muss
    // Werbung als solche erkennbar sein - und es ist ohnehin
    // besser, das selbst zu sagen, als dabei erwischt zu werden.
    affiliate:
      'SYNORA verdient an Vermittlungsprovisionen, wenn du über einen Link kaufst. ' +
      'Auf die Empfehlung hat das keinen Einfluss – welche Produkte du siehst, ' +
      'entscheidet nie, wer zahlt.',

    rechte: 'Alle Rechte vorbehalten.'
  },

  // ==========================================
  // IMPRESSUM UND DATENSCHUTZ
  // ==========================================
  rechtliches: {
    impressumTitel: 'Impressum',
    datenschutzTitel: 'Datenschutzerklärung',
    stand: 'Stand',
    nochNichtFertig: 'Diese Seite wird gerade erstellt.',
    nochNichtFertigText:
      'Die vollständigen Angaben folgen vor dem öffentlichen Start. ' +
      'Bei Fragen erreichst du uns unter {mail}.'
  }
};

export default deutsch;