// ============================================
// SYNORA - Preisalarme verwalten
// ============================================
// Das Backend dafuer ist seit dem 04.10.2026 fertig und von
// Ende zu Ende geprueft - bis hin zur echten Mail im Postfach.
// Im Frontend gab es dazu bisher gar nichts.
//
// Laut deinem Premium-Dokument ist das die Funktion mit der
// besten Marge: Ein Premium-Nutzer zahlt CHF 7, die zehn
// beobachteten Produkte kosten dich rund 50 Rappen im Monat.
//
// Umso wichtiger, dass die Seite erklaert, was passiert - und
// nicht nur eine Liste zeigt.
// ============================================

import { useEffect, useState } from 'react';
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import { useSprache } from '../texte/Sprache';
import { istAngemeldet, einstellungenHolen, franken } from '../api';
import { alarmeHolen, alarmLoeschen } from '../preisalarme';
import './Preisalarme.css';

export default function Preisalarme() {
  const { t } = useSprache();
  const [alarme, setAlarme] = useState(null);     // null = laedt noch
  const [fehler, setFehler] = useState('');
  const [premiumNoetig, setPremiumNoetig] = useState(false);
  const [grenze, setGrenze] = useState(null);
  const [loescht, setLoescht] = useState('');

  useEffect(() => {
    if (!istAngemeldet()) {
      window.location.href = '/anmelden';
      return;
    }

    let weg = false;
    (async () => {
      const [a, e] = await Promise.all([alarmeHolen(), einstellungenHolen()]);
      if (weg) return;

      if (a.ok) {
        setAlarme(a.alarme || []);
        if (typeof a.max === 'number') setGrenze(a.max);
      } else if (a.premiumNoetig) {
        setPremiumNoetig(true);
        setAlarme([]);
      } else {
        setFehler(a.fehler || t('fehler.alarmeLaden'));
        setAlarme([]);
      }

      // Falls das Backend keine Obergrenze mitschickt, aus den
      // Einstellungen holen - aber nie raten.
      if (e.ok && grenze === null) {
        const p = e.daten?.stufen?.find((s) => s.schluessel === 'premium');
        if (p && !p.alarme.unbegrenzt) setGrenze(p.alarme.anzahl);
      }
    })();
    return () => { weg = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function entfernen(id) {
    setLoescht(id);
    const r = await alarmLoeschen(id);
    setLoescht('');
    if (r.ok) setAlarme((liste) => liste.filter((a) => (a._id || a.id) !== id));
    else setFehler(r.fehler || t('fehler.allgemein'));
  }

  return (
    <>
      <Kopfzeile aktiv="preisalarme" />

      <main className="pa-seite">
        <header className="pa-kopf">
          <h1>{t('preisalarm.titel')}</h1>
          <p>{t('preisalarm.untertitel')}</p>
          {alarme && grenze !== null && !premiumNoetig && (
            <span className="pa-zaehler">{alarme.length} / {grenze}</span>
          )}
        </header>

        {fehler && <p className="pa-fehler" role="alert">{fehler}</p>}

        {/* ---------- Nur mit Premium ---------- */}
        {premiumNoetig && (
          <section className="pa-premium">
            <h2>{t('preisalarm.nurPremium')}</h2>
            <p>{t('preisalarm.untertitel')}</p>
            <a href="/premium" className="pa-knopf-voll">{t('menue.premium')} →</a>
          </section>
        )}

        {/* ---------- Laedt ---------- */}
        {alarme === null && <p className="pa-laedt">{t('allgemein.laedt')}</p>}

        {/* ---------- Leer ---------- */}
        {alarme?.length === 0 && !premiumNoetig && (
          <section className="pa-leer">
            <span className="pa-leer-symbol" aria-hidden="true">🔔</span>
            <h2>{t('preisalarm.keine')}</h2>
            <p>{t('preisalarm.keineHilfe')}</p>
            <a href="/chat" className="pa-knopf-voll">{t('menue.assistent')} →</a>
          </section>
        )}

        {/* ---------- Liste ---------- */}
        {alarme?.length > 0 && (
          <>
            <ul className="pa-liste">
              {alarme.map((a) => {
                const id = a._id || a.id;
                const jetzt = a.letzterPreis ?? a.startPreis;
                const start = a.startPreis;
                // Nur rechnen, wenn beide Zahlen da sind. Eine
                // erfundene Ersparnis waere schlimmer als keine.
                const gespart = (typeof jetzt === 'number' && typeof start === 'number' && start > jetzt)
                  ? start - jetzt : null;

                return (
                  <li key={id} className="pa-eintrag">
                    <div className="pa-bild">
                      {a.bildUrl
                        ? <img src={a.bildUrl} alt="" loading="lazy" />
                        : <span aria-hidden="true">📦</span>}
                    </div>

                    <div className="pa-text">
                      <h3>{a.produktName}</h3>

                      <div className="pa-preise">
                        <span className="pa-jetzt">
                          <small>{t('preisalarm.aktuell')}</small>
                          <strong>{typeof jetzt === 'number' ? franken(jetzt) : '–'}</strong>
                        </span>

                        <span className="pa-start">
                          <small>{t('preisalarm.beimSetzen')}</small>
                          <strong>{typeof start === 'number' ? franken(start) : '–'}</strong>
                        </span>

                        {a.zielPreis ? (
                          <span className="pa-ziel">
                            <small>{t('preisalarm.zielpreis')}</small>
                            <strong>{franken(a.zielPreis)}</strong>
                          </span>
                        ) : null}
                      </div>

                      {gespart !== null && (
                        <p className="pa-gespart">− {franken(gespart)}</p>
                      )}

                      {a.letzterShop && <p className="pa-shop">bei {a.letzterShop}</p>}
                    </div>

                    <button
                      className="pa-weg"
                      onClick={() => entfernen(id)}
                      disabled={loescht === id}
                      aria-label={`${t('preisalarm.loeschen')}: ${a.produktName}`}
                    >
                      {loescht === id ? '…' : '✕'}
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="pa-takt">{t('preisalarm.taktHinweis')}</p>
          </>
        )}
      </main>

      <Fusszeile />
    </>
  );
}
