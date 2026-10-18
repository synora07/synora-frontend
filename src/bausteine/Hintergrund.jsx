// ============================================
// SYNORA - der Hintergrund
// ============================================
// Nachgebaut nach deiner Design-Vorlage: Berglandschaft mit See,
// Nadelbaeumen und den leuchtenden Baendern.
//
// ============================================
// DIE FARBEN SIND AUS DER VORLAGE GEMESSEN
// ============================================
// Am 07.10.2026 habe ich deine Vorlage Pixel fuer Pixel
// ausgewertet, statt die Farben nach Augenmass zu waehlen. Das
// Ergebnis war eindeutig - mein erster Nachbau war VIEL zu
// dunkel und zu grau:
//
//   Hoehenband        Vorlage      mein erster Versuch
//   oberer Himmel     #112d71      #061232
//   Bergmitte         #2a429f      #3a6cb8 (aber unter
//                                  einem dunklen Schleier)
//   unteres Drittel   #081d66      #0e2d5c
//
// Deine Vorlage ist ein kraeftiges Koenigsblau, kein
// Graublau. Die Werte unten stammen direkt aus dieser Messung.
//
// ============================================
// WARUM GEZEICHNET UND NICHT ALS FOTO
// ============================================
// Das Bild aus deiner Vorlage waere als Datei zwei bis vier
// Megabyte gross. Auf jeder Seite geladen heisst das auf dem
// Handy mehrere Sekunden, bevor ueberhaupt etwas zu sehen ist.
//
// Das hier sind rund zwoelf Kilobyte, ist sofort da, auf jedem
// Bildschirm scharf (auch auf 4K, wo ein Foto unscharf wuerde) -
// und es bewegt sich. Ein Foto kann das nicht.
//
// WENN DU DOCH DAS ECHTE BILD WILLST
// Leg es als public/hintergrund.jpg ab und setz unten
// BILD_STATT_ZEICHNUNG auf true. Dann ist allerdings die
// Bewegung weg.
//
// ============================================
// DIE BEWEGUNG - FUENF EBENEN
// ============================================
//   1. NORDLICHT   zieht durch den Himmel         (54 / 72 s)
//   2. STERNE      funkeln versetzt               (4 - 9 s)
//   3. DUNST       treibt ueber den Kaemmen       (80 / 110 s)
//   4. BERGE       drei Reihen, verschieden schnell (70-110 s)
//   5. SEE         Lichtstreifen wandern          (38 - 64 s)
//
// DASS DIE BERGE VERSCHIEDEN SCHNELL SIND, IST DER GANZE TRICK.
// Liefen alle gleich schnell, saehe es aus, als wuerde das Bild
// verrutschen. Weil die hinteren langsamer sind als die
// vorderen, liest das Auge daraus Tiefe - wie aus dem
// Zugfenster, wo die Berge am Horizont stehenbleiben und die
// Leitplanke vorbeirast.
//
// WARUM DIE RAENDER UEBERSTEHEN
// Die Berge sind links und rechts 60 Einheiten breiter
// gezeichnet als das Bild. Ohne diesen Ueberstand waere beim
// Verschieben an einer Seite ein Streifen Himmel unter dem Berg
// zu sehen, wo Fels sein muesste.
//
// KEIN WEICHZEICHNER
// Alle weichen Stellen entstehen durch Farbverlaeufe, die nach
// aussen durchsichtig werden - nicht durch feGaussianBlur. Mit
// Weichzeichnern lief die Seite mit 6 Bildern pro Sekunde, ohne
// sie mit 47. Siehe milchglas.css fuer die ganze Messung.
// ============================================

import './Hintergrund.css';

const BILD_STATT_ZEICHNUNG = false;
const BILD_PFAD = '/hintergrund.jpg';

// Der grosse Lichtbogen aus der Vorlage. Einmal definiert, weil
// er viermal uebereinander gezeichnet wird - breit und blass
// unten, schmal und hell oben. Das ergibt den Schein, ohne dass
// ein Weichzeichner rechnen muss.
const BOGEN = 'M-140 905 C 190 820, 300 660, 600 648 S 1010 760, 1255 640 S 1540 405, 1760 430';
const BOGEN2 = 'M-140 845 C 240 790, 430 655, 720 690 S 1090 800, 1330 700 S 1590 520, 1760 548';
const BOGEN3 = 'M-140 735 C 150 690, 290 545, 560 552 S 965 645, 1210 556 S 1530 400, 1760 412';

export default function Hintergrund() {
  return (
    <div className="hg" aria-hidden="true">

      <svg
        className="hg-bild"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ---------- Himmel ----------
              Oben fast schwarz, zum Horizont hin das kraeftige
              Blau aus der Vorlage. */}
          <linearGradient id="hgHimmel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010617" />
            <stop offset="28%"  stopColor="#061437" />
            <stop offset="55%"  stopColor="#112d71" />
            <stop offset="80%"  stopColor="#21399250" />
            <stop offset="100%" stopColor="#2a429f" />
          </linearGradient>

          {/* ---------- Nordlicht ----------
              Weiche Flecken, kein Weichzeichner: Der Verlauf
              wird nach aussen durchsichtig, das sieht genauso
              weich aus und kostet nichts. */}
          <radialGradient id="hgNordA" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#4FD6F5" stopOpacity="0.30" />
            <stop offset="45%"  stopColor="#3f7ae8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="hgNordB" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.26" />
            <stop offset="50%"  stopColor="#2B7FFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2B7FFF" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="hgNebel" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#b9d6ff" stopOpacity="0.26" />
            <stop offset="55%"  stopColor="#8fb6f0" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#8fb6f0" stopOpacity="0" />
          </radialGradient>

          {/* ---------- Berge ----------
              Je weiter hinten, desto heller: Dazwischen liegt
              Luft, und Luft ist blau. Das ist der Grund, warum
              ferne Berge heller aussehen als nahe - und der
              einzige Trick, mit dem auf einem flachen Bild
              Tiefe entsteht. */}
          <linearGradient id="hgBergFern" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7d93ea" />
            <stop offset="35%"  stopColor="#3f58c2" />
            <stop offset="100%" stopColor="#1b3184" />
          </linearGradient>

          <linearGradient id="hgBergMitte" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4660c9" />
            <stop offset="40%"  stopColor="#1f3792" />
            <stop offset="100%" stopColor="#0c1c56" />
          </linearGradient>

          <linearGradient id="hgBergNah" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a2f74" />
            <stop offset="100%" stopColor="#050e28" />
          </linearGradient>

          {/* ---------- See ---------- */}
          <linearGradient id="hgSee" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a429f" />
            <stop offset="22%"  stopColor="#13266e" />
            <stop offset="60%"  stopColor="#071340" />
            <stop offset="100%" stopColor="#02081c" />
          </linearGradient>

          <linearGradient id="hgWelle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#a9d8ff" stopOpacity="0" />
            <stop offset="50%"  stopColor="#a9d8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a9d8ff" stopOpacity="0" />
          </linearGradient>

          {/* ---------- Die leuchtenden Baender ----------
              Aus der Vorlage: Sie laufen von links unten in
              einem grossen Bogen nach rechts oben und sind das,
              was die Seite lebendig macht. */}
          <linearGradient id="hgBand1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#4FD6F5" stopOpacity="0" />
            <stop offset="22%"  stopColor="#8af0ff" stopOpacity="1" />
            <stop offset="55%"  stopColor="#3b96ff" stopOpacity="1" />
            <stop offset="82%"  stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hgBand2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0" />
            <stop offset="40%"  stopColor="#2B7FFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4FD6F5" stopOpacity="0" />
          </linearGradient>

          {/* Schein ueber dem Horizont */}
          <radialGradient id="hgSchein" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#4a8cff" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#2B7FFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2B7FFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ---------- Himmel ---------- */}
        <rect x="-80" y="-40" width="1760" height="980" fill="url(#hgHimmel)" />

        {/* ---------- Nordlicht ----------
            Zwei Schleier, gegenlaeufig. Gleichlaeufig saehe man
            nach einer Minute wieder dieselbe Form; gegenlaeufig
            ueberlagern sie sich dauernd neu. */}
        <g className="hg-nord hg-nord-1">
          <ellipse cx="520"  cy="185" rx="680" ry="150" fill="url(#hgNordA)" />
          <ellipse cx="1210" cy="130" rx="500" ry="110" fill="url(#hgNordA)" />
        </g>

        <g className="hg-nord hg-nord-2">
          <ellipse cx="980" cy="290" rx="760" ry="130" fill="url(#hgNordB)" />
          <ellipse cx="250" cy="335" rx="450" ry="100" fill="url(#hgNordB)" />
        </g>

        {/* ---------- Sterne ----------
            Die opacity-Werte hier gelten, solange nicht animiert
            wird - also bei "Bewegung reduzieren". Sonst
            uebernimmt das Funkeln aus dem CSS. */}
        <g className="hg-sterne" fill="#eaf3ff">
          <circle cx="140"  cy="58"  r="1.4" opacity="0.75" />
          <circle cx="330"  cy="118" r="1"   opacity="0.5" />
          <circle cx="520"  cy="45"  r="1.6" opacity="0.85" />
          <circle cx="760"  cy="96"  r="1"   opacity="0.45" />
          <circle cx="980"  cy="52"  r="1.5" opacity="0.78" />
          <circle cx="1180" cy="126" r="1"   opacity="0.5" />
          <circle cx="1390" cy="68"  r="1.7" opacity="0.9" />
          <circle cx="1510" cy="158" r="1.2" opacity="0.6" />
          <circle cx="240"  cy="196" r="1"   opacity="0.42" />
          <circle cx="880"  cy="172" r="1.3" opacity="0.62" />
          <circle cx="430"  cy="224" r="1.1" opacity="0.48" />
          <circle cx="1290" cy="206" r="1.4" opacity="0.55" />
        </g>

        {/* ---------- Schein ueber dem Horizont ---------- */}
        <ellipse cx="820" cy="520" rx="900" ry="300" fill="url(#hgSchein)" />

        {/* ---------- Dunst, erste Lage ----------
            Liegt zwischen den Bergschichten. Nebel bewegt sich
            sichtbar, Fels nicht - genau dieser Unterschied
            macht, dass die Berge stehen und das Bild lebt. */}
        <g className="hg-dunst hg-dunst-1">
          <ellipse cx="420"  cy="500" rx="360" ry="40" fill="url(#hgNebel)" />
          <ellipse cx="1140" cy="482" rx="310" ry="32" fill="url(#hgNebel)" opacity="0.85" />
        </g>

        {/* ---------- Berge, hinten ----------
            Langsamste Ebene: am weitesten weg. */}
        <g className="hg-berg hg-berg-fern">
          <path
            d="M-60 504 L-60 234 L100 380 L225 240 L393 394 L513 273 L642 380 L791 282 L959 375
               L1059 242 L1237 332 L1362 316 L1493 455 L1637 272 L1660 368 L1660 600 L-60 600 Z"
            fill="url(#hgBergFern)"
          />
          <g fill="#eef4ff" opacity="0.85">
            <path d="M225 240 L272 284 L250 275 L235 258 L213 277 L198 272 L178 284 Z" />
            <path d="M1059 242 L1117 291 L1095 282 L1069 265 L1047 284 L1021 279 L1001 291 Z" />
            <path d="M1637 272 L1698 326 L1676 317 L1647 300 L1625 319 L1596 314 L1576 326 Z" />
            <path d="M513 273 L566 320 L544 311 L522 294 L500 313 L476 308 L456 320 Z" />
            <path d="M791 282 L846 331 L824 322 L800 305 L778 324 L752 319 L732 331 Z" />
          </g>
        </g>

        {/* ---------- Dunst, zweite Lage ---------- */}
        <g className="hg-dunst hg-dunst-2">
          <ellipse cx="760" cy="560" rx="420" ry="36" fill="url(#hgNebel)" opacity="0.9" />
          <ellipse cx="180" cy="572" rx="280" ry="28" fill="url(#hgNebel)" opacity="0.7" />
        </g>

        {/* ---------- Berge, Mitte ---------- */}
        <g className="hg-berg hg-berg-mitte">
          <path
            d="M-60 569 L-60 393 L134 475 L282 433 L448 509 L640 431 L850 549 L1017 449
               L1205 525 L1366 392 L1529 487 L1660 554 L1660 640 L-60 640 Z"
            fill="url(#hgBergMitte)"
          />
          <g fill="#e2ecff" opacity="0.7">
            <path d="M1366 392 L1419 447 L1397 438 L1376 421 L1354 440 L1333 435 L1313 447 Z" />
            <path d="M640 431 L696 482 L674 473 L650 456 L628 475 L604 470 L584 482 Z" />
            <path d="M282 433 L334 484 L312 475 L292 458 L270 477 L248 472 L228 484 Z" />
            <path d="M1017 449 L1070 498 L1048 489 L1027 472 L1005 491 L982 486 L962 498 Z" />
          </g>
        </g>

        {/* ---------- Berge, vorn ----------
            Schnellste Bergebene: am naechsten dran. */}
        <g className="hg-berg hg-berg-nah">
          <path
            d="M-60 634 L-60 522 L162 627 L321 502 L587 592 L751 529 L999 611 L1152 538
               L1391 619 L1549 507 L1660 578 L1660 680 L-60 680 Z"
            fill="url(#hgBergNah)"
          />
          <g fill="#ccdcff" opacity="0.42">
            <path d="M321 502 L384 555 L362 546 L331 529 L309 548 L278 543 L258 555 Z" />
            <path d="M1549 507 L1600 554 L1578 545 L1559 528 L1537 547 L1518 542 L1498 554 Z" />
            <path d="M751 529 L821 578 L799 569 L761 552 L739 571 L701 566 L681 578 Z" />
            <path d="M1152 538 L1212 586 L1190 577 L1160 560 L1138 579 L1110 574 L1090 586 Z" />
          </g>
        </g>

        {/* ---------- See ---------- */}
        <rect x="-60" y="672" width="1720" height="268" fill="url(#hgSee)" />

        {/* Spiegelung: dieselbe Bergform, umgeklappt und gestaucht.
            Sie wird NUR in der Helligkeit bewegt, nicht verschoben -
            an ihr haengt schon ein eigener transform, und ein
            transform aus dem CSS wuerde den ersetzen statt
            ergaenzen. Dann staende die Spiegelung aufrecht. */}
        <g className="hg-spiegel" opacity="0.22" transform="translate(0,1352) scale(1,-0.4)">
          <path
            d="M-60 634 L-60 522 L162 627 L321 502 L587 592 L751 529 L999 611 L1152 538
               L1391 619 L1549 507 L1660 578 L1660 680 L-60 680 Z"
            fill="#35519f"
          />
        </g>

        {/* Lichtstreifen, die ueber das Wasser wandern */}
        <g className="hg-wellen">
          <rect className="hg-welle hg-welle-1" x="-320" y="712" width="540" height="2.6" rx="1.3" fill="url(#hgWelle)" />
          <rect className="hg-welle hg-welle-2" x="-320" y="782" width="720" height="2"   rx="1"   fill="url(#hgWelle)" />
          <rect className="hg-welle hg-welle-3" x="-320" y="852" width="620" height="2.8" rx="1.4" fill="url(#hgWelle)" />
        </g>

        {/* Lichter am Ufer und ihre Spiegelung im Wasser.
            Warmes Gelb gegen das viele Blau - in der Vorlage
            ist das der einzige warme Punkt im ganzen Bild, und
            genau deshalb faellt das Auge darauf. */}
        <g>
          <g className="hg-lichter" fill="#ffcf8a">
            <circle cx="596" cy="655" r="2"   opacity="0.95" />
            <circle cx="626" cy="652" r="1.5" opacity="0.8" />
            <circle cx="658" cy="656" r="1.8" opacity="0.9" />
            <circle cx="690" cy="651" r="1.3" opacity="0.7" />
            <circle cx="722" cy="655" r="1.9" opacity="0.85" />
            <circle cx="754" cy="652" r="1.4" opacity="0.75" />
            <circle cx="788" cy="656" r="1.7" opacity="0.8" />
            <circle cx="822" cy="653" r="1.2" opacity="0.65" />
          </g>
          {/* Im Wasser laufen Lichter in die Laenge, nicht rund. */}
          <g className="hg-lichtspiegel" fill="#ffcf8a" opacity="0.32">
            <rect x="595"  y="664" width="2.6" height="34" rx="1.3" />
            <rect x="625"  y="664" width="2.2" height="26" rx="1.1" />
            <rect x="657"  y="664" width="2.4" height="40" rx="1.2" />
            <rect x="721"  y="664" width="2.5" height="31" rx="1.2" />
            <rect x="787"  y="664" width="2.3" height="37" rx="1.1" />
          </g>
        </g>

        {/* ---------- Die leuchtenden Baender ----------
            WIE DER SCHEIN OHNE WEICHZEICHNER ENTSTEHT
            Jedes Band ist mehrfach uebereinander gezeichnet: ein
            sehr breiter, fast durchsichtiger Strich, darueber
            ein mittlerer, darauf der schmale helle.

            Das Auge liest diese Stufen als weichen Schein -
            dasselbe Ergebnis wie ein Weichzeichner, aber zum
            Preis von drei gewoehnlichen Strichen statt einer
            Rechnung ueber die ganze Bildschirmflaeche.

            Die Bewegung sitzt am aeusseren <g>, damit alle
            Striche zusammen als ein Stueck verschoben werden. */}
        <g className="hg-band hg-band-1" fill="none" strokeLinecap="round">
          <path d={BOGEN} stroke="url(#hgBand1)" strokeWidth="38" opacity="0.13" />
          <path d={BOGEN} stroke="url(#hgBand1)" strokeWidth="14" opacity="0.34" />
          <path d={BOGEN} stroke="url(#hgBand1)" strokeWidth="5" />
          <path d={BOGEN} stroke="#eafaff" strokeWidth="1.6" opacity="0.75" />
        </g>

        <g className="hg-band hg-band-2" fill="none" strokeLinecap="round">
          <path d={BOGEN2} stroke="url(#hgBand2)" strokeWidth="22" opacity="0.13" />
          <path d={BOGEN2} stroke="url(#hgBand2)" strokeWidth="4.5" opacity="0.85" />
        </g>

        <g className="hg-band hg-band-3" fill="none" strokeLinecap="round">
          <path d={BOGEN3} stroke="url(#hgBand2)" strokeWidth="16" opacity="0.11" />
          <path d={BOGEN3} stroke="url(#hgBand2)" strokeWidth="3" opacity="0.7" />
        </g>

        {/* ---------- Nadelbaeume am Rand ----------
            Sie rahmen das Bild und geben dem Auge einen
            Anhaltspunkt fuer die Groesse: Ohne etwas Bekanntes
            daneben koennte der Berg auch ein Kieselstein sein.
            Weil sie am naechsten stehen, bewegen sie sich am
            staerksten. */}
        <g className="hg-berg hg-baeume" fill="#02071a">
          <path d="M62 900 L62 648 L28 728 L48 728 L16 812 L42 812 L6 900 Z" />
          <path d="M68 900 L68 662 L100 742 L80 742 L112 822 L86 822 L122 900 Z" />
          <path d="M158 900 L158 706 L130 776 L148 776 L120 848 L142 848 L112 900 Z" />
          <path d="M214 900 L214 744 L192 802 L206 802 L182 864 L200 864 L174 900 Z" />
          <path d="M1548 900 L1548 630 L1582 718 L1560 718 L1596 806 L1566 806 L1606 900 Z" />
          <path d="M1542 900 L1542 668 L1510 746 L1530 746 L1498 826 L1524 826 L1486 900 Z" />
          <path d="M1444 900 L1444 716 L1420 782 L1438 782 L1410 852 L1432 852 L1402 900 Z" />
          <path d="M1374 900 L1374 752 L1356 810 L1370 810 L1348 868 L1364 868 L1340 900 Z" />
        </g>
      </svg>

      {/* ---------- Echtes Bild, falls hinterlegt ---------- */}
      {BILD_STATT_ZEICHNUNG && (
        <div
          className="hg-foto"
          style={{ backgroundImage: `url(${BILD_PFAD})` }}
        />
      )}

      {/* Die Abdunklung fuer die Lesbarkeit. Sie liegt hier als
          CSS-Schicht, nicht im SVG - siehe Hintergrund.css. */}
      <div className="hg-schleier" />
    </div>
  );
}
