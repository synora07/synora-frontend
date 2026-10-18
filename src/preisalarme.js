// ============================================
// SYNORA - Preisalarme
// ============================================
// Das Backend dafür ist seit dem 04.10.2026 fertig und Ende zu
// Ende geprüft: Alarm anlegen, bündeln, Preis prüfen, Treffer
// erkennen, Mail verschicken.
//
// Im Frontend gab es dafür bis jetzt KEINE einzige Stelle. Die
// Funktion war gebaut und unerreichbar.
//
// Diese Datei ist die Verbindung. Die Adressen stammen aus
// src/routes/preisalarm.js, nicht geraten.
// ============================================

import { anfrage } from './api';

export async function alarmeHolen() {
  const r = await anfrage('/api/preisalarm');
  if (!r.ok) return r;

  const d = r.daten || {};
  return {
    ok: true,
    daten: {
      alarme: Array.isArray(d.alarme) ? d.alarme : [],
      anzahl: d.anzahl ?? 0,
      maximum: d.maximum ?? 0,
      maximumPremium: d.maximumPremium ?? 0,
      premium: !!d.premium,
      taktTage: d.taktTage ?? null
    }
  };
}

/**
 * produkt ist das Objekt aus der Suche, unverändert.
 * Das Backend liest daraus name, priceValue, produktId und
 * imageUrl - genau die Felder, die /api/chat liefert.
 */
export async function alarmAnlegen({ produkt, zielPreis = null, kanaele = ['email'] }) {
  const r = await anfrage('/api/preisalarm', {
    methode: 'POST',
    koerper: {
      produkt: {
        // Die Feldnamen, die anlegen() liest. Der Name links
        // ist das, was das Backend erwartet - rechts steht,
        // wie /api/chat es nennt.
        produktId: produkt.produktId || produkt.id,
        name: produkt.name,
        priceValue: produkt.priceValue,
        imageUrl: produkt.imageUrl,
        suchbegriff: produkt.suchbegriff || produkt.name
      },
      zielPreis,
      kanaele
    }
  });

  if (!r.ok) {
    // 409 ist kein Fehler, sondern eine Regel: entweder ist das
    // Höchstmass erreicht oder die Funktion gehört zu Premium.
    // premiumNoetig sagt dem Frontend, dass es den
    // Premium-Hinweis zeigen soll statt einer roten Meldung.
    return {
      ok: false,
      status: r.status,
      fehler: r.fehler,
      premiumNoetig: !!(r.daten && r.daten.premiumNoetig)
    };
  }

  return { ok: true, daten: r.daten };
}

export async function alarmLoeschen(id) {
  return anfrage(`/api/preisalarm/${encodeURIComponent(id)}`, { methode: 'DELETE' });
}
