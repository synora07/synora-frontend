// ============================================
// SYNORA - Fusszeile
// ============================================
// WARUM HIER EIN AFFILIATE-HINWEIS STEHT
//
// SYNORA verdient an Vermittlungsprovisionen. Wer damit Geld
// verdient, muss es kenntlich machen - das verlangt das
// Schweizer UWG (Art. 3) ebenso wie die EU.
//
// Davon abgesehen: SYNORA verkauft Ehrlichkeit. Den Hinweis zu
// verstecken und spaeter darauf angesprochen zu werden, waere
// der teuerste mögliche Weg, ihn doch zu geben.
//
// Der Satz sagt beides: dass Provision fliesst, UND dass sie die
// Empfehlung nicht beeinflusst. Das zweite ist der eigentliche
// Unterschied zu Google Shopping.
//
// IMPRESSUM UND DATENSCHUTZ
// Beide Links sind da, die Seiten noch nicht gefuellt - dafuer
// fehlen Rechtsform, Firmenname, Adresse, Kontakt-Mail,
// Zahlungsanbieter und UID. Ohne diese zwei Seiten nehmen die
// Affiliate-Programme SYNORA nicht an.
// ============================================

import Logo from './Logo';
import { useSprache } from '../texte/Sprache';
import './Fusszeile.css';

const KONTAKT_MAIL = 'info@synora.li';

export default function Fusszeile() {
  const { t } = useSprache();
  const jahr = new Date().getFullYear();

  const spalten = [
    {
      titel: t('fuss.produkt'),
      links: [
        { text: t('menue.assistent'),   pfad: '/chat' },
        { text: t('menue.preisalarme'), pfad: '/preisalarme' },
        { text: t('menue.premium'),     pfad: '/premium' },
        { text: t('menue.ueberUns'),    pfad: '/ueber-uns' }
      ]
    },
    {
      titel: t('fuss.rechtliches'),
      links: [
        { text: t('fuss.impressum'),            pfad: '/impressum' },
        { text: t('fuss.datenschutz'),          pfad: '/datenschutz' },
        { text: t('fuss.nutzungsbedingungen'),  pfad: '/nutzungsbedingungen' }
      ]
    },
    {
      titel: t('fuss.kontakt'),
      links: [
        { text: t('fuss.feedbackGeben'), pfad: '/feedback' },
        { text: t('fuss.kaufMelden'),    pfad: '/kauf-melden' },
        { text: KONTAKT_MAIL,            pfad: `mailto:${KONTAKT_MAIL}` }
      ]
    }
  ];

  return (
    <footer className="sy-fuss">
      <div className="sy-fuss-innen">

        <div className="sy-fuss-oben">
          <div className="sy-fuss-marke">
            <Logo art="voll" groesse={34} leuchten={false} />
            <p>{t('fuss.beschreibung')}</p>
          </div>

          <div className="sy-fuss-spalten">
            {spalten.map((s) => (
              <nav key={s.titel} aria-label={s.titel}>
                <h3>{s.titel}</h3>
                <ul>
                  {s.links.map((l) => (
                    <li key={l.pfad}><a href={l.pfad}>{l.text}</a></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Der Hinweis steht bewusst VOR der Zeile mit dem
            Copyright und in normaler Textgroesse - nicht als
            Kleingedrucktes ganz unten, wo ihn niemand liest. */}
        <p className="sy-fuss-affiliate">{t('fuss.affiliate')}</p>

        <div className="sy-fuss-unten">
          <span>© {jahr} SYNORA. {t('fuss.rechte')}</span>
          <span className="sy-fuss-ort">Schweiz</span>
        </div>
      </div>
    </footer>
  );
}
