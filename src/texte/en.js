// ============================================
// SYNORA - all English texts
// ============================================
// Same keys as de.js. If a key is missing here, the German text
// is used instead - a visible German word is better than an
// empty space or the raw key name on a live page.
//
// The check in Sprache.jsx compares both files on start and
// lists anything missing in the browser console, so gaps are
// found during development, not by a visitor.
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
const english = {
  sprache: { name: 'English', kuerzel: 'EN' },

  allgemein: {
    anmelden: 'Sign in',
    registrieren: 'Sign up',
    abmelden: 'Sign out',
    kostenlosStarten: 'Start for free',
    weiter: 'Continue',
    abbrechen: 'Cancel',
    speichern: 'Save',
    zurueck: 'Back',
    laedt: 'One moment …',
    nochmalVersuchen: 'Try again',
    pflichtfeld: 'We need this field',
    bald: 'Soon',
    kommtBald: 'Coming soon',
    mehrErfahren: 'Learn more'
  },

  menue: {
    assistent: 'AI Assistant',
    kategorien: 'Categories',
    preisalarme: 'Price alerts',
    premium: 'Premium',
    ueberUns: 'About'
  },

  start: {
    ueberschriftOben: 'Shop. Decide better. With SYNORA.',

    titelTeil1: 'SYNORA tells you not just',
    titelHervor1: 'WHAT,',
    titelTeil2: 'but',
    titelHervor2: 'WHY.',

    untertitel:
      'Independent product recommendations from Swiss shops. SYNORA compares for you, ' +
      'explains every recommendation – and names a downside for every product.',

    beispiel: {
      name: 'Headphones, example',
      preis: 'CHF 279.–',
      beiShop: 'at {shop}',
      shop: 'Example Shop',
      dafuer: [
        'Very good noise cancelling',
        '30 hours of battery',
        'Folds up for travel'
      ],
      dagegen: [
        'Headband creaks after longer wear',
        'No headphone jack'
      ],
      hinweis: 'Example for illustration – not a real recommendation'
    },

    sucheBeispiel: 'For example: which laptop is good for my studies?',

    beispiele: [
      'Laptop for studying under CHF 1000',
      'Best noise-cancelling headphones',
      'Gift ideas under CHF 100'
    ],

    kacheln: {
      gratis: {
        titel: '{zahl} searches a month',
        text: 'Free once you have an account'
      },
      premium: {
        titel: '{zahl} searches with Premium',
        text: 'CHF {preis} a month'
      },
      ehrlich: {
        titel: 'No commission decides',
        text: 'We show the downsides too'
      }
    },

    versprechen: [
      {
        titel: 'Prices come from real shops',
        text: 'No language model is allowed to invent a price at SYNORA. Prices and availability come from the shop query – or not at all.'
      },
      {
        titel: 'A downside for every product',
        text: 'Every recommendation also names what speaks against the product. If we find no downside, we do not show it.'
      },
      {
        titel: 'Final price for Switzerland',
        text: 'What you actually pay, not what is listed abroad.'
      }
    ],

    kategorienTitel: 'Find what fits you.',
    kategorienOben: 'Popular categories',
    alleKategorien: 'See all categories',

    kategorien: [
      { schluessel: 'laptops',      name: 'Laptops',      text: 'For studying, work and more' },
      { schluessel: 'smartphones',  name: 'Smartphones',  text: 'The latest models compared' },
      { schluessel: 'kopfhoerer',   name: 'Headphones',   text: 'Better sound every day' },
      { schluessel: 'smartwatches', name: 'Smartwatches', text: 'Fitness, health and lifestyle' },
      { schluessel: 'gaming',       name: 'Gaming',       text: 'For your next level' },
      { schluessel: 'haushalt',     name: 'Home',         text: 'Smart helpers for your home' }
    ]
  },

  anmelden: {
    obenKlein: 'Shop. Decide better. With SYNORA.',
    titelTeil1: 'Welcome',
    titelHervor: 'back.',
    untertitel: 'Sign in to continue.',

    kartenTitel: 'Sign in',
    kartenText: 'Sign in to continue.',

    email: 'Email address',
    passwort: 'Password',
    angemeldetBleiben: 'Stay signed in',
    passwortVergessen: 'Forgot your password?',
    knopf: 'Sign in',
    nochKeinKonto: 'No account yet?',
    jetztRegistrieren: 'Sign up now',

    vorteile: [
      { titel: 'Your account',     text: 'Your searches and price alerts in one place' },
      { titel: 'Prices watched',   text: 'SYNORA tells you when a price drops' },
      { titel: 'On every device',  text: 'Sign in once, continue anywhere' }
    ],

    fehlerAllgemein: 'Sign-in failed. Check your email and password.'
  },

  registrieren: {
    titelTeil1: 'Sign up',
    titelHervor: 'for free',
    untertitel:
      'Independent product recommendations from Swiss shops. ' +
      'Objective, explained – and with downsides, not just upsides.',

    kartenTitel: 'Create account',
    kartenText: 'Sign up in seconds and get started.',

    vorname: 'First name',
    nachname: 'Last name',
    email: 'Email',
    geburtsdatum: 'Date of birth',
    passwort: 'Password',
    passwortHinweis: 'At least 8 characters',
    passwortWiederholen: 'Confirm password',
    passwortWiederholenHinweis: 'Enter the password again',
    passwortStaerke: 'Password strength',
    staerke: ['Too short', 'Weak', 'Okay', 'Good', 'Strong'],

    bedingungenTeil1: 'I accept the',
    nutzungsbedingungen: 'Terms of Use',
    bedingungenUnd: 'and the',
    datenschutz: 'Privacy Policy',

    knopf: 'Sign up for free',
    schonKonto: 'Already have an account?',
    jetztAnmelden: 'Sign in',

    vorteile: [
      { titel: '{zahl} searches a month',   text: 'Free with an account.' },
      { titel: 'Price alerts with Premium', text: 'SYNORA tells you when the price drops.' },
      { titel: 'Independent',               text: 'No commission decides the recommendation.' }
    ],

    fehlerPasswoerter: 'The two passwords do not match.',
    fehlerBedingungen: 'Please accept the Terms of Use.',
    fehlerAllgemein: 'Sign-up failed.'
  },

  passwortVergessen: {
    titelTeil1: 'Forgot your',
    titelHervor: 'password?',
    untertitel:
      'No problem. Enter your email address and we will send you a link to reset it.',
    email: 'Email address',
    knopf: 'Send link',
    zurueck: 'Back to sign in',

    hinweise: [
      {
        titel: 'Link by email',
        text: 'You will get a link to reset your password within a few minutes.'
      },
      {
        titel: 'Time limited',
        text: 'The link is only for you and expires after a short while.'
      },
      {
        titel: 'No email?',
        text: 'Check your spam folder. If nothing arrives, try again in a few minutes.'
      }
    ],

    gesendet:
      'If there is an account for this address, the link is on its way. Check your spam folder too.'
  },

  chat: {
    neuerChat: 'New chat',
    verlauf: 'Chat history',
    gespeichert: 'Saved products',
    vergleiche: 'Comparisons',
    einstellungen: 'Settings',
    letzteChats: 'Recent chats',
    alleAnzeigen: 'Show all',

    begruessung: 'Hi! I am SYNORA.',
    begruessungText:
      'Your independent shopping assistant. I help you find the right product – ' +
      'with recommendations from Swiss shops that explain themselves.',

    merkmale: [
      { titel: 'Independent',  text: 'No ties to manufacturers' },
      { titel: 'Explained',    text: 'Every recommendation justified' },
      { titel: 'Swiss shops',  text: 'Digitec, Galaxus, Interdiscount and more' }
    ],

    eingabe: 'Ask SYNORA about a product …',
    senden: 'Send',
    denkt: 'SYNORA is searching …',

    empfehlungenTitel: 'My suggestions for you',
    alleErgebnisse: 'Show all {zahl} results',
    zumShop: 'To the shop',
    vergleichen: 'Compare',
    preisBeobachten: 'Watch price',
    dafuer: 'In favour',
    dagegen: 'Against',

    limitErreicht:
      'You have searched {genutzt} times this month. With Premium you keep searching – ' +
      'and get a price alert that tells you as soon as your product gets cheaper.',
    limitKnopf: 'See Premium',

    ohneKonto:
      'You need an account to search. It is free and takes a minute.',

    nochNicht: 'This feature is coming soon.',

    // ---------- Info column ----------
    infoSpalte: 'About this search',
    zumBeispiel: 'For example:',
    verlaufLeer: 'No saved conversations yet. Once history is available, they will show up here.',

    budgetTitel: 'Price range',
    budgetBis: 'up to',
    budgetOhne: 'no limit',
    budgetHinweis:
      'Move the slider and I will add "unter X CHF" to your question. ' +
      'You will see it in the input field before you send.',
    budgetAktiv:
      'Your next question gets "unter {zahl} CHF" appended – visible, not hidden.',

    shopsTitel: 'Swiss shops',
    shopsText: 'Prices and availability come from queries to these retailers.',
    shopsListe: ['Digitec', 'Galaxus', 'Interdiscount', 'MediaMarkt Schweiz', 'Microspot', 'Brack'],

    scoreTitel: 'SYNORA Score',
    scoreText:
      'The number sums up how well a product fits your question – ' +
      'not how good it is in general. Who pays a commission never factors in.'
  },

  premium: {
    titelTeil1: 'Everyone sees',
    titelHervor: 'the same',
    titelTeil2: 'recommendations.',
    unterzeile: 'Paying only changes how often you can ask and how much SYNORA watches for you. Never which products you get.',

    monatlich: 'Monthly',
    jaehrlich: 'Yearly',
    gratis: 'Free',
    imMonat: 'a month',
    imJahr: 'a year',
    stattMonatlich: 'instead of {betrag} paying monthly',
    suchenImMonat: 'searches a month',
    unbegrenzt: 'unlimited',
    meisteNehmen: 'Most people pick this',
    nochNichtFrei: 'Not unlocked yet',
    nochNichtKaeuflich: 'Not for sale yet',
    kontoErstellen: 'Create account',
    hastKonto: 'You have an account',
    waehlen: 'Choose {name}',
    tabelleTitel: 'What each tier can do',
    bisX: 'up to {zahl}',

    zeilen: {
      dreiVorschlaege: 'Three suggestions with reasons',
      nachteilJeProdukt: 'A downside for every product',
      endpreisSchweiz: 'Final price for Switzerland',
      preisalarm: 'Price alert',
      preisverlauf: 'Price history',
      merkliste: 'Saved products and search history',
      alarme: 'Products watched at once',
      besitzWaechter: 'Ownership guard',
      aktionenFrueher: 'Deals 24 hours earlier',
      personen: 'Several people per account'
    },

    versprechenTitel: 'Why the top three rows have a tick everywhere',
    versprechen1: 'Because the recommendation is not negotiable. Paying does not get you the better products — it gets you more searches and tools that watch prices for you.',
    versprechen2: 'If recommendations were for sale, SYNORA would be an ad platform with a search box. There are plenty of those.',

    offenTitel: 'You cannot buy Premium right now',
    offenText: 'That is on purpose. While SYNORA is in testing, Premium is given away rather than sold — it will only cost something once the recommendations are good enough.',

    ladeFehlerTitel: 'Prices not available right now',
    ladeFehlerText: 'We would rather show nothing than a number that might be wrong.',
    laden: 'Loading prices …'
  },

  fehler: {
    allgemein: 'That did not work.',
    alarmeLaden: 'The price alerts could not be loaded.',
    preiseLaden: 'The prices could not be loaded.'
  },

  nurDeutsch: 'This page is only available in German.',

  bestaetigen: {
    laeuft: 'Confirming your email …',
    laeuftUnter: 'One moment.',
    okTitel: 'Your email is confirmed.',
    okUnter: 'You can sign in now.',
    fehlerTitel: 'That did not work.',
    fehlerUnter: 'The link has expired or was already used. If you have already confirmed your account, just sign in.',

    neuTitel: 'Set a new password',
    neuUnter: 'Choose a new password. At least eight characters.',
    neuFertig: 'Your password has been changed. You can sign in now.'
  },

  netz: {
    keineVerbindung: 'No connection to SYNORA. Check your internet connection.',
    fehlerMitNummer: 'Error {status}',
    zuLange: 'SYNORA is not responding right now. Try again in a minute.'
  },

  preisalarm: {
    titel: 'Your price alerts',
    untertitel: 'SYNORA checks the prices and tells you when they drop.',
    keine: 'You are not watching any product yet.',
    keineHilfe: 'Search for a product and tap "Watch price".',

    zielpreis: 'Target price',
    zielpreisHinweis: 'Optional. Without one we report any real price drop.',
    aktuell: 'Now',
    beimSetzen: 'When set',
    loeschen: 'Stop watching',
    anlegen: 'Watch price',
    angelegt: 'SYNORA is now watching this product for you.',

    nurPremium: 'Price alerts come with Premium.',
    vollTitel: 'All slots taken',
    voll: 'You are already watching {zahl} products. Remove one to make room.',

    taktHinweis: 'SYNORA checks prices regularly – not hourly, that would be expensive and pointless.'
  },

  kaufMelden: {
    titel: 'Report a purchase',
    untertitel:
      'Bought something through SYNORA for more than CHF {betrag}? Then a year of Premium is on us.',
    shop: 'Which shop?',
    betrag: 'Amount in CHF',
    bestellnummer: 'Order number',
    bestellnummerHinweis: 'It is in your order confirmation.',
    datum: 'Date of purchase',
    knopf: 'Report purchase',

    gesendet:
      'Thank you. We will look at your report and unlock Premium once we can confirm the purchase.',

    hinweis: 'Every report is checked by hand. That takes a few days.'
  },

  feedback: {
    titel: 'What went wrong?',
    untertitel:
      'SYNORA should learn from mistakes. Tell us when a recommendation did not fit – ' +
      'we will look into it.',
    art: {
      falschesProdukt: 'The recommendation did not fit',
      falscherPreis: 'The price was wrong',
      fehler: 'Something was broken',
      wunsch: 'I would like something',
      sonstiges: 'Something else'
    },
    nachricht: 'What happened?',
    knopf: 'Send',
    gesendet: 'Thank you. That really helps.'
  },

  fuss: {
    beschreibung:
      'Independent product recommendations from Swiss shops. Explained – and with downsides.',
    produkt: 'Product',
    rechtliches: 'Legal',
    kontakt: 'Contact',
    impressum: 'Legal notice',
    datenschutz: 'Privacy',
    nutzungsbedingungen: 'Terms of Use',
    feedbackGeben: 'Give feedback',
    kaufMelden: 'Report a purchase',

    affiliate:
      'SYNORA earns a commission when you buy through a link. ' +
      'This has no influence on the recommendation – which products you see ' +
      'is never decided by who pays.',

    rechte: 'All rights reserved.'
  },

  rechtliches: {
    impressumTitel: 'Legal notice',
    datenschutzTitel: 'Privacy policy',
    stand: 'Last updated',
    nochNichtFertig: 'This page is being written.',
    nochNichtFertigText:
      'The full details will follow before the public launch. ' +
      'If you have questions, reach us at {mail}.'
  }
};

export default english;