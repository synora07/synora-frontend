// ============================================
// SYNORA - Produktkarte
// ============================================
// Das Wichtigste auf der ganzen Seite. Hier entscheidet sich, ob
// SYNORA anders ist als Google Shopping.
//
// DIE NACHTEILE STEHEN GLEICHBERECHTIGT DA
//
// Nicht kleiner, nicht ausgegraut, nicht hinter "mehr anzeigen"
// versteckt. Gleiche Schriftgroesse, gleiche Zeilenhoehe wie die
// Vorteile - nur ein anderes Zeichen davor.
//
// Das ist die eine Stelle, an der es weh tut und sich lohnt:
// Grundsatz 2 lautet, dass jedes Produkt einen echten,
// belegbaren Nachteil zeigen muss. Eine Karte, die den Nachteil
// kleiner setzt als den Vorteil, haelt den Grundsatz dem
// Buchstaben nach ein und bricht ihn dem Sinn nach.
//
// DER GLOCKENKNOPF
//
// Preisalarme sind Premium. Ein Gratis-Nutzer sieht den Knopf
// trotzdem - er ist der Moment, in dem Premium einen Sinn
// bekommt. Aus deinem Premium-Dokument, Moment 2:
//
//   "Zu teuer gerade? Ich beobachte das Produkt fuer dich und
//    melde mich, sobald der Preis faellt."
//
// Den Knopf zu verstecken waere die schlechteste Loesung: Dann
// erfaehrt der Gratis-Nutzer nie, dass es die Funktion gibt.
// ============================================

import { useState } from 'react';
import { useSprache } from '../texte/Sprache';
import { istAngemeldet } from '../api';
import { alarmAnlegen } from '../preisalarme';
import './Produktkarte.css';

function punkteKlasse(p) {
  if (typeof p !== 'number') return '';
  if (p >= 85) return 'pk-punkte-sehrgut';
  if (p >= 70) return 'pk-punkte-gut';
  if (p >= 50) return 'pk-punkte-mittel';
  return 'pk-punkte-schwach';
}

export default function Produktkarte({ produkt, rang, schmal = false }) {
  const { t } = useSprache();
  const [alarm, setAlarm] = useState('');     // '', 'laeuft', 'ok', Fehlertext
  const [premiumNoetig, setPremiumNoetig] = useState(false);

  if (!produkt) return null;

  const name = produkt.name || produkt.title || 'Produkt';
  const bild = produkt.imageUrl || produkt.thumbnail || null;
  const shop = produkt.shopName || produkt.source || produkt.shop || '';
  const link = produkt.shopUrl || produkt.link || produkt.productLink || '';
  const preis = produkt.price || (produkt.priceValue ? `CHF ${Number(produkt.priceValue).toFixed(2)}` : '');
  const punkte = typeof produkt.score === 'number' ? produkt.score : null;

  const dafuer = Array.isArray(produkt.whyItFits) ? produkt.whyItFits : [];
  const dagegen = Array.isArray(produkt.nachteile) ? produkt.nachteile : [];

  async function beobachten() {
    if (alarm === 'laeuft' || alarm === 'ok') return;

    if (!istAngemeldet()) {
      window.location.href = '/registrieren';
      return;
    }

    setAlarm('laeuft');
    setPremiumNoetig(false);

    const r = await alarmAnlegen({ produkt });

    if (r.ok) { setAlarm('ok'); return; }

    // premiumNoetig kommt vom Backend, wenn die Stufe nicht
    // reicht. Dann kein roter Fehler, sondern ein Weg nach vorn.
    if (r.premiumNoetig) {
      setPremiumNoetig(true);
      setAlarm(r.fehler || t('preisalarm.nurPremium'));
      return;
    }

    setAlarm(r.fehler || t('fehler.allgemein'));
  }

  return (
    <article className={`pk-karte ${schmal ? 'pk-schmal' : ''}`}>
      {rang && <span className="pk-rang">{rang}</span>}

      <div className="pk-oben">
        <div className={`pk-bild ${bild ? '' : 'pk-bild-ohne'}`}>
          {bild
            ? <img src={bild} alt="" loading="lazy" decoding="async" />
            : <span className="pk-bild-leer" aria-hidden="true">📦</span>}
        </div>

        <div className="pk-kopf">
          <h3 className="pk-name">{name}</h3>

          <div className="pk-preiszeile">
            <span className="pk-preis">{preis}</span>
            {shop && <span className="pk-shop">bei {shop}</span>}
          </div>

          {punkte !== null && (
            <span className={`pk-punkte ${punkteKlasse(punkte)}`}>
              <strong>{punkte}</strong><small>/100</small>
              <span className="pk-punkte-wort">SYNORA Score</span>
            </span>
          )}
        </div>
      </div>

      {/* ============================================
          VORTEILE UND NACHTEILE
          ============================================ */}
      {(dafuer.length > 0 || dagegen.length > 0) && (
        <div className="pk-gruende">
          {dafuer.length > 0 && (
            <div className="pk-spalte">
              <h4 className="pk-spalte-titel pk-dafuer-titel">{t('chat.dafuer')}</h4>
              <ul>
                {dafuer.map((d, i) => (
                  <li key={i}><span className="pk-ja" aria-hidden="true">✓</span>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {dagegen.length > 0 && (
            <div className="pk-spalte">
              <h4 className="pk-spalte-titel pk-dagegen-titel">{t('chat.dagegen')}</h4>
              <ul>
                {dagegen.map((d, i) => (
                  <li key={i}><span className="pk-nein" aria-hidden="true">✕</span>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ============================================
          KNOEPFE
          ============================================ */}
      <div className="pk-knoepfe">
        {link && (
          <a
            href={link}
            className="pk-knopf-voll"
            target="_blank"
            // noopener schuetzt davor, dass die Zielseite ueber
            // window.opener auf SYNORA zugreift.
            rel="noopener noreferrer nofollow sponsored"
          >
            {t('chat.zumShop')} ↗
          </a>
        )}

        <button
          className={`pk-knopf-glocke ${alarm === 'ok' ? 'pk-glocke-an' : ''}`}
          onClick={beobachten}
          disabled={alarm === 'laeuft'}
          title={t('chat.preisBeobachten')}
        >
          {alarm === 'ok' ? '🔔' : '🔕'} {t('chat.preisBeobachten')}
        </button>
      </div>

      {alarm === 'ok' && (
        <p className="pk-meldung pk-meldung-ok" role="status">{t('preisalarm.angelegt')}</p>
      )}

      {alarm && alarm !== 'ok' && alarm !== 'laeuft' && (
        <p className={`pk-meldung ${premiumNoetig ? 'pk-meldung-premium' : 'pk-meldung-fehler'}`} role="status">
          {alarm}
          {premiumNoetig && <> <a href="/premium">{t('menue.premium')} →</a></>}
        </p>
      )}
    </article>
  );
}
