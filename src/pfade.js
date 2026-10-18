// ============================================
// SYNORA - alle Backend-Adressen an einer Stelle
// ============================================
// GEPRUEFT am 05.10.2026 gegen public/js/auth.js und
// public/js/api.js aus deinem bisherigen Frontend.
//
// Die Adressen hatte ich richtig geraten. Die FELDNAMEN nicht:
//
//   geraten            richtig
//   firstName          firstname     (klein geschrieben)
//   lastName           lastname
//   -                  birthdate     (wird erwartet)
//   -                  terms         (wird erwartet)
//
// Mit meinen Namen waere die Registrierung fehlgeschlagen oder
// haette einen Nutzer ohne Namen angelegt. Deshalb schickt man
// Code nicht raus, ohne die Gegenstelle gesehen zu haben.
// ============================================

export const PFADE = {
  // ---------- Konto ----------
  // Alle drei bestaetigt aus public/js/auth.js.
  anmelden: '/api/auth/login',
  registrieren: '/api/auth/register',
  passwortVergessen: '/api/auth/forgot-password',

  // ---------- E-Mail bestaetigen ----------
  // Dein Backend verschickt nach der Registrierung eine Mail mit
  // einem Link auf ?verify=TOKEN. Der Token wird an diese
  // Adresse angehaengt - mit GET, nicht POST.
  //
  //     GET /api/auth/verify/abc123
  //
  // Ohne diese Zeile koennte sich niemand freischalten, der sich
  // ueber das neue Frontend registriert.
  bestaetigen: '/api/auth/verify',

  // ---------- Neues Passwort setzen ----------
  // In auth.js oeffnet ?reset=TOKEN nur ein Fenster - welche
  // Adresse danach aufgerufen wird, steht dort NICHT drin
  // (handleResetPassword fehlt in der Datei).
  //
  // Das hier ist darum die einzige geratene Adresse, die uebrig
  // ist. Pruef sie mit:
  //     node scripts/pfadePruefen.js
  passwortNeu: '/api/auth/reset-password',

  ich: '/api/auth/me',

  // ---------- Suche ----------
  chat: '/api/chat',
  chatVerlauf: '/api/chat/history',
  gastStand: '/api/chat/guest-status',

  // ---------- Preisalarm ----------
  // Sicher - die Route habe ich selbst gelesen.
  preisalarme: '/api/preisalarm',
  preisalarmPush: '/api/preisalarm/push',
  preisalarmPushSchluessel: '/api/preisalarm/push/schluessel',

  // ---------- Neu, von mir gebaut ----------
  einstellungen: '/api/einstellungen',
  feedback: '/api/feedback',
  kaufMelden: '/api/kauf-melden'
};

// ============================================
// Feldnamen - abgeschrieben, nicht geraten
// ============================================
// Quelle: public/js/auth.js, handleLogin() und handleRegister().

export function anmeldeDaten(email, passwort) {
  return { email, password: passwort };
}

export function registrierDaten({ vorname, nachname, email, passwort, geburtsdatum }) {
  return {
    firstname: vorname,
    lastname: nachname,
    email,
    password: passwort,
    birthdate: geburtsdatum || '',
    // Das Haekchen im Formular ist Pflicht, bevor abgeschickt
    // werden kann. Hier steht darum fest true - genau wie in
    // deinem bisherigen api.js.
    terms: true
  };
}
