// ============================================
// SYNORA - Premium-Seite
// ============================================
// Quelle: "SYNORA - Premium: Stufen und Technik", Stand 02.10.2026
//
// DREI DINGE, DIE DIESE SEITE NICHT TUT
//
// 1. Sie erfindet keine Zahlen.
//    Preise, Suchen und Alarme kommen aus GET /api/einstellungen,
//    also aus derselben Stelle, an der die Sperre sie anwendet.
//    Steht in der .env SUCHEN_PREMIUM=15, zeigt die Seite 15 -
//    auch wenn in der Tabelle 50 steht. Lieber eine unbequeme
//    Wahrheit als ein Versprechen, das die Sperre nicht haelt.
//
// 2. Sie verkauft nichts.
//    Laut Dokument wird Premium erst ab Juli 2027 verkauft, bis
//    dahin verschenkt. Darum kein Kaufknopf. Ein Knopf, hinter
//    dem nichts ist, kostet mehr Vertrauen als gar keiner.
//
// 3. Sie verspricht keine besseren Empfehlungen.
//    Aus dem Dokument: "Die Qualitaet ist auf allen Stufen
//    gleich. Gekauft werden nur Menge und Komfort, nie bessere
//    Empfehlungen. Das ist dein Versprechen gegen Google - es
//    darf nie brechen."
//    Darum stehen die drei Qualitaetszeilen bei JEDER Stufe mit
//    Haken da, auch bei Gratis. Das sieht nach schwacher
//    Verkaufe aus. Es ist das Gegenteil: es ist das Argument.
// ============================================

import { useEffect, useState } from 'react';
import { einstellungenHolen, franken, istAngemeldet } from '../api';
import { useSprache } from '../texte/Sprache';
import Erscheinen from '../bausteine/Erscheinen';
// GEFUNDEN am 08.10.2026 beim Gesamttest: Diese Seite war die
// EINZIGE ohne Kopf- und Fusszeile. Aufgefallen ist es an einer
// Zahl - jede andere Seite hatte 15 bis 23 Links, diese drei.
//
// Zwei Folgen, und die zweite ist die ernstere:
//   1. Wer auf der Preisseite landete, kam ohne Zurueck-Taste
//      nicht mehr weg. Kein Menue, keine Fusszeile.
//   2. In der Fusszeile stehen Impressum und Datenschutz. Die
//      muessen von JEDER Seite aus erreichbar sein - und
//      ausgerechnet auf der Seite, wo es ums Bezahlen geht,
//      fehlten sie.
import Kopfzeile from '../bausteine/Kopfzeile';
import Fusszeile from '../bausteine/Fusszeile';
import './Premium.css';

// ============================================
// WOHIN DER KAUF-KNOPF ZEIGT
// ============================================
// GEFUNDEN am 08.10.2026 beim Gesamttest: Der Knopf zeigte auf
// /premium/kaufen - diese Seite gibt es nicht. Wer draufklickt,
// landet auf der Fehlerseite.
//
// WARUM ES NIE AUFGEFALLEN IST
// Der Knopf erscheint nur, wenn das Backend verkaufAktiv=true
// meldet. In deiner .env steht PREMIUM_VERKAUF=false, also hat
// ihn noch nie jemand gesehen. Am Tag, an dem du den Verkauf
// einschaltest, waere er bei jedem Besucher kaputt gewesen -
// genau an der Stelle, an der Geld fliessen soll.
//
// DIE LOESUNG
// Solange hier null steht, zeigt die Seite "Noch nicht
// kaeuflich" - auch wenn das Backend den Verkauf freigibt. Ein
// Knopf, der ins Leere fuehrt, ist schlimmer als gar keiner.
//
// Wenn du die Kaufstrecke gebaut hast (Stripe), traegst du hier
// den Pfad ein, zum Beispiel '/premium/kaufen', und legst die
// Seite in App.jsx als Route an. Beides - sonst ist der Fehler
// wieder da.
const KAUF_PFAD = null;


// Die Zeilen der Tabelle. Reihenfolge wie im Dokument.
// "istQualitaet" markiert die drei, die auf allen Stufen gleich
// sein MUESSEN - siehe Punkt 3 oben.
// Nur die Schluessel. Die Beschriftung kommt aus den
// Sprachdateien - sonst steht die Tabelle auf Englisch
// weiterhin auf Deutsch da.
const ZEILEN = [
  { schluessel: 'dreiVorschlaege',   text: 'dreiVorschlaege',   istQualitaet: true },
  { schluessel: 'nachteilJeProdukt', text: 'nachteilJeProdukt', istQualitaet: true },
  { schluessel: 'endpreisSchweiz',   text: 'endpreisSchweiz',   istQualitaet: true },
  { schluessel: 'preisalarm',        text: 'preisalarm' },
  { schluessel: 'preisverlauf',      text: 'preisverlauf' },
  { schluessel: 'merkliste',         text: 'merkliste' },
  { schluessel: '__alarme',          text: 'alarme' },
  { schluessel: 'besitzWaechter',    text: 'besitzWaechter' },
  { schluessel: 'aktionenFrueher',   text: 'aktionenFrueher' },
  { schluessel: '__personen',        text: 'personen' }
];

function Zelle({ stufe, zeile, t }) {
  // Sonderfaelle: Zahlen statt ja/nein
  if (zeile.schluessel === '__alarme') {
    if (stufe.alarme.unbegrenzt) return <span className="pr-wert">{t('premium.unbegrenzt')}</span>;
    if (!stufe.alarme.anzahl) return <span className="pr-nein">–</span>;
    return <span className="pr-wert">{t('premium.bisX', { zahl: stufe.alarme.anzahl })}</span>;
  }

  if (zeile.schluessel === '__personen') {
    const n = stufe.kann.personenImKonto;
    if (!n || n <= 1) return <span className="pr-nein">–</span>;
    return <span className="pr-wert">{t('premium.bisX', { zahl: n })}</span>;
  }

  return stufe.kann[zeile.schluessel]
    ? <span className="pr-ja" aria-label="ja">✓</span>
    : <span className="pr-nein" aria-label="nein">–</span>;
}

function Suchzahl({ stufe, t }) {
  if (stufe.suchen.unbegrenzt) return <>{t('premium.unbegrenzt')}</>;
  if (stufe.suchen.anzahl === null) return <>–</>;
  return <>{stufe.suchen.anzahl}</>;
}

export default function Premium() {
  const { t } = useSprache();
  const [daten, setDaten] = useState(null);
  // ============================================
  // KEINEN UEBERSETZTEN TEXT IM ZUSTAND SPEICHERN
  // ============================================
  // Hier stand vorher der fertige Satz. Wechselt der Nutzer
  // danach die Sprache, bliebe die Meldung in der alten stehen -
  // und useEffect haette t als Abhaengigkeit gebraucht.
  //
  // Jetzt steht hier nur, DASS es schiefging. Uebersetzt wird
  // beim Anzeigen.
  //   null  alles gut
  //   true  fehlgeschlagen, Grund unbekannt
  //   Text  Grund vom Backend, der schon in der richtigen
  //         Sprache kommt
  const [ladeFehler, setLadeFehler] = useState(null);
  const [laedt, setLaedt] = useState(true);
  const [jahr, setJahr] = useState(false);

  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      const r = await einstellungenHolen();
      if (abgebrochen) return;
      if (r.ok && r.daten && Array.isArray(r.daten.stufen)) setDaten(r.daten);
      else setLadeFehler(r.fehler || true);
      setLaedt(false);
    })();
    return () => { abgebrochen = true; };
  }, []);

  // ============================================
  // Lieber nichts zeigen als falsche Preise
  // ============================================
  // Ohne Antwort vom Backend gibt es keine Ersatzzahlen. Eine
  // Preisseite, die im Zweifel irgendetwas anzeigt, ist genau
  // das Problem, das diese Seite vermeiden soll.
  if (laedt) {
    return (
      <>
        <Kopfzeile aktiv="premium" />
        <div className="pr-seite">
          <div className="pr-laedt">{t('premium.laden')}</div>
        </div>
        <Fusszeile />
      </>
    );
  }

  if (ladeFehler || !daten) {
    const fehlerText = ladeFehler === true ? t('fehler.preiseLaden') : ladeFehler;
    return (
      <>
        <Kopfzeile aktiv="premium" />
        <div className="pr-seite">
          <div className="pr-fehler">
            <h2>{t('premium.ladeFehlerTitel')}</h2>
            <p>{fehlerText}</p>
            <p className="pr-klein">{t('premium.ladeFehlerText')}</p>
            {/* Stand hier bis zum 10.10.2026 fest auf Deutsch - auch
                auf der englischen Seite. Der Schluessel dafuer gab
                es schon, ich hatte ihn nur nicht benutzt. Gefunden
                mit scripts-Suche nach festem deutschem Text im JSX. */}
            <button className="btn-primary" onClick={() => window.location.reload()}>
              {t('allgemein.nochmalVersuchen')}
            </button>
          </div>
        </div>
        <Fusszeile />
      </>
    );
  }

  const stufen = daten.stufen;
  const verkauft = daten.verkaufAktiv;

  return (
    <>
      <Kopfzeile aktiv="premium" />
      <div className="pr-seite">

      <header className="pr-kopf">
        <h1>
          {t('premium.titelTeil1')}{' '}
          <span className="pr-leuchtend">{t('premium.titelHervor')}</span>{' '}
          {t('premium.titelTeil2')}
        </h1>
        <p className="pr-unterzeile">{t('premium.unterzeile')}</p>

        {stufen.some((s) => s.preisJahr) && (
          <div className="pr-schalter" role="group" aria-label="Abrechnung">
            <button
              className={!jahr ? 'pr-schalter-an' : ''}
              onClick={() => setJahr(false)}
            >
              {t('premium.monatlich')}
            </button>
            <button
              className={jahr ? 'pr-schalter-an' : ''}
              onClick={() => setJahr(true)}
            >
              {t('premium.jaehrlich')}
            </button>
          </div>
        )}
      </header>

      {/* ---------- Die drei Spalten ---------- */}
      <div className="pr-spalten">
        {stufen.map((s, nr) => {
          const gratis = s.preisMonat === 0;
          const preis = jahr && s.preisJahr ? s.preisJahr : s.preisMonat;
          const einheit = gratis ? '' : (jahr && s.preisJahr ? t('premium.imJahr') : t('premium.imMonat'));

          return (
            <Erscheinen
              als="section"
              key={s.schluessel}
              verzoegerung={nr * 90}
              className={'pr-spalte' + (s.empfohlen ? ' pr-empfohlen' : '')}
            >
              {s.empfohlen && <div className="pr-band">{t('premium.meisteNehmen')}</div>}

              <h2 className="pr-name">{s.name}</h2>

              <div className="pr-preis">
                {gratis ? t('premium.gratis') : franken(preis)}
                {einheit && <span className="pr-einheit"> {einheit}</span>}
              </div>

              {/* Beim Jahrespreis zeigen, was gespart wird - aber
                  nur, wenn wirklich etwas gespart wird. */}
              {jahr && s.preisJahr && s.preisMonat > 0 && (
                <div className="pr-sparen">
                  {t('premium.stattMonatlich', { betrag: franken(s.preisMonat * 12) })}
                </div>
              )}

              <div className="pr-suchen">
                <strong><Suchzahl stufe={s} t={t} /></strong>
                <span> {t('premium.suchenImMonat')}</span>
              </div>

              {/* ============================================
                  EHRLICHKEIT GEGENUEBER DEM EIGENEN BACKEND
                  ============================================
                  durchgesetzt:false heisst: Diese Stufe steht nur
                  in der Tabelle, das Backend kennt sie nicht. Es
                  waere leicht, das wegzulassen - und genau so
                  entstehen Versprechen ohne Technik dahinter. */}
              {s.durchgesetzt === false && (
                <div className="pr-hinweis-bald">{t('premium.nochNichtFrei')}</div>
              )}

              {verkauft && KAUF_PFAD ? (
                gratis ? (
                  <a className="btn-primary pr-knopf" href="/registrieren">{t('premium.kontoErstellen')}</a>
                ) : (
                  <a className="btn-primary pr-knopf" href={`${KAUF_PFAD}?stufe=${s.schluessel}`}>
                    {t('premium.waehlen', { name: s.name })}
                  </a>
                )
              ) : gratis ? (
                <a className="btn-primary pr-knopf" href="/registrieren">
                  {istAngemeldet() ? t('premium.hastKonto') : t('allgemein.kostenlosStarten')}
                </a>
              ) : (
                <div className="pr-noch-nicht">{t('premium.nochNichtKaeuflich')}</div>
              )}
            </Erscheinen>
          );
        })}
      </div>

      {/* ---------- Die Tabelle ---------- */}
      <Erscheinen className="pr-tabelle-huelle">
        <table className="pr-tabelle">
          <caption className="pr-tabelle-titel">{t('premium.tabelleTitel')}</caption>
          <thead>
            <tr>
              <th scope="col"></th>
              {stufen.map((s) => (
                <th key={s.schluessel} scope="col" className={s.empfohlen ? 'pr-th-empfohlen' : ''}>
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="pr-zeile-zahl">
              <th scope="row">{t('premium.suchenImMonat')}</th>
              {stufen.map((s) => (
                <td key={s.schluessel} className={s.empfohlen ? 'pr-td-empfohlen' : ''}>
                  <strong><Suchzahl stufe={s} t={t} /></strong>
                </td>
              ))}
            </tr>

            {ZEILEN.map((z) => (
              <tr key={z.schluessel} className={z.istQualitaet ? 'pr-zeile-qualitaet' : ''}>
                <th scope="row">{t('premium.zeilen.' + z.text)}</th>
                {stufen.map((s) => (
                  <td key={s.schluessel} className={s.empfohlen ? 'pr-td-empfohlen' : ''}>
                    <Zelle stufe={s} zeile={z} t={t} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Erscheinen>

      {/* ============================================
          DAS VERSPRECHEN, AUSGESCHRIEBEN
          ============================================
          Die drei Zeilen mit Haken bei allen Stufen sehen aus
          wie ein Fehler im Verkaufsgespraech. Dieser Kasten
          erklaert, dass sie Absicht sind. */}
      <Erscheinen als="aside" className="pr-versprechen">
        <h3>{t('premium.versprechenTitel')}</h3>
        <p>{t('premium.versprechen1')}</p>
        <p>{t('premium.versprechen2')}</p>
      </Erscheinen>

      {!verkauft && (
        <aside className="pr-offen">
          <h3>{t('premium.offenTitel')}</h3>
          <p>{t('premium.offenText')}</p>
        </aside>
      )}
      </div>
      <Fusszeile />
    </>
  );
}