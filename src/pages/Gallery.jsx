/**
 * GalleryGrid.jsx
 *
 * Real gym photography — June 2026.
 * All SVG placeholders replaced with actual photos of the facility.
 *
 * Copy photos to public/images/gym/ using the filename mapping below:
 *
 *  FLOOR OVERVIEWS
 *    floor-hero.webp                  ← DSC_0188.webp  (wide floor, Bossie's sign + trophy + statue)
 *    floor-overview.webp              ← DSC_0186.webp  (full floor from seating area)
 *    floor-through-archway.webp       ← DSC_0167.webp  (floor through archway)
 *    floor-main-aisle.webp            ← DSC_0159.webp  (main aisle overview)
 *
 *  WEIGHT TRAINING
 *    weights-power-rack.webp          ← DSC_0133.webp  (power rack room)
 *    weights-dumbbells-wide.webp      ← DSC_0140.webp  (full dumbbell rack, wide)
 *    weights-dumbbells-close.webp     ← DSC_0144.webp  (dumbbell rack close)
 *    weights-machines-floor.webp      ← DSC_0169.webp  (machines floor wide)
 *    weights-machines-aisle.webp      ← DSC_0170.webp  (machines looking down aisle)
 *    weights-cable-room.webp          ← DSC_0172.webp  (cable/machine room)
 *    weights-machines-wide.webp       ← DSC_0174.webp  (full machines floor wide)
 *    weights-yellow-machines.webp     ← DSC_0176.webp  (yellow machines area)
 *
 *  CARDIO
 *    cardio-treadmills-sign.webp      ← DSC_0138.webp  (treadmill row + Bossie's Gym sign)
 *    cardio-floor-wide.webp           ← DSC_0153.webp  (wide floor showing treadmills + weights)
 *    cardio-treadmills-angle.webp     ← DSC_0154.webp  (treadmill close angle)
 *
 *  FUNCTIONAL / CARDIO
 *    functional-stairmill-rower.webp  ← DSC_0147.webp  (stair climber + rowing machine)
 *    cardio-weights-floor.webp        ← DSC_0145.webp  (dumbbell rack + cardio behind)
 *
 *  CHANGEROOMS (from previous batch)
 *    changerooms-washroom-wide.webp   ← DSC_0155.webp
 *    changerooms-washroom-angle.webp  ← DSC_0157.webp
 *    changerooms-shower.webp          ← DSC_0158.webp
 *
 * The `limit` prop (used on the Home page preview) caps tiles shown.
 * Hero/wide shots are prioritised first for the home preview.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import anime from 'animejs';

import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Container from '../components/ui/Container.jsx';
import ClickSpark from '../components/ui/ClickSpark.jsx';
import { fadeUp, stagger, site } from '../lib/site.js';

// ---------------------------------------------------------------------------
// Section data — each section renders its own labelled grid
// ---------------------------------------------------------------------------

const floorOverviews = [
  {
    id: 'floor-hero',
    src: '/images/gym/floor-hero.webp',
    alt: "Wide view of Bossie's Gym training floor — Bossie's Gym sign, trophy and bronze statue in foreground with full equipment floor behind",
    label: 'The Training Floor',
    span: 'sm:col-span-2',
    homePreview: true,
  },
  {
    id: 'floor-overview',
    src: '/images/gym/floor-overview.webp',
    alt: "Full floor view from the seating area at Bossie's Gym — machines and yellow equipment across a large open floor",
    label: 'The Training Floor',
    span: '',
    homePreview: true,
  },
  {
    id: 'floor-through-archway',
    src: '/images/gym/floor-through-archway.webp',
    alt: "Looking through the archway at Bossie's Gym showing the depth of the training floor",
    label: 'The Training Floor',
    span: '',
    homePreview: false,
  },
  {
    id: 'floor-main-aisle',
    src: '/images/gym/floor-main-aisle.webp',
    alt: "Main aisle of the training floor showing weights left and cardio right at Bossie's Gym",
    label: 'The Training Floor',
    span: '',
    homePreview: false,
  },
];

const weightTiles = [
  {
    id: 'weights-power-rack',
    src: '/images/gym/weights-power-rack.webp',
    alt: "MyRack power rack and free weights area at Bossie's Gym, Centurion — exposed brick, rubber flooring",
    label: 'Power Rack & Free Weights',
    span: 'sm:col-span-2',
    homePreview: true,
  },
  {
    id: 'weights-dumbbells-wide',
    src: '/images/gym/weights-dumbbells-wide.webp',
    alt: "Full dumbbell rack at Bossie's Gym showing a wide range of weights from light to heavy",
    label: 'Dumbbell Rack',
    span: '',
    homePreview: false,
  },
  {
    id: 'weights-dumbbells-close',
    src: '/images/gym/weights-dumbbells-close.webp',
    alt: "Close-up of the dumbbell rack at Bossie's Gym — 2.5kg through 35kg",
    label: 'Dumbbell Selection',
    span: '',
    homePreview: false,
  },
  {
    id: 'weights-machines-floor',
    src: '/images/gym/weights-machines-floor.webp',
    alt: "Machines floor at Bossie's Gym — plate-loaded and selectorised equipment on a large open floor",
    label: 'Machines Floor',
    span: '',
    homePreview: false,
  },
  {
    id: 'weights-machines-aisle',
    src: '/images/gym/weights-machines-aisle.webp',
    alt: "Looking down the machine aisle at Bossie's Gym — rows of equipment on exposed brick background",
    label: 'Machine Aisle',
    span: '',
    homePreview: false,
  },
  {
    id: 'weights-cable-room',
    src: '/images/gym/weights-cable-room.webp',
    alt: "Cable machine and free weights room at Bossie's Gym with bodybuilding photo wall and mirror",
    label: 'Cable & Machine Room',
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'weights-machines-wide',
    src: '/images/gym/weights-machines-wide.webp',
    alt: "Wide view of the full machines floor at Bossie's Gym — yellow plate-loaded equipment and silver selectorised machines",
    label: 'Equipment Floor',
    span: '',
    homePreview: false,
  },
  {
    id: 'weights-yellow-machines',
    src: '/images/gym/weights-yellow-machines.webp',
    alt: "Yellow and black plate-loaded machines at Bossie's Gym with mirrors and exposed brick walls",
    label: 'Plate-Loaded Machines',
    span: '',
    homePreview: false,
  },
];

const cardioTiles = [
  {
    id: 'cardio-treadmills-sign',
    src: '/images/gym/cardio-treadmills-sign.webp',
    alt: "Treadmill row at Bossie's Gym with the Bossie's Gym sign on the wall — brick interior",
    label: 'Cardio Area',
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'cardio-floor-wide',
    src: '/images/gym/cardio-floor-wide.webp',
    alt: "Wide shot showing both treadmills and weight equipment at Bossie's Gym — full-length floor view",
    label: 'Cardio & Weights Floor',
    span: '',
    homePreview: false,
  },
  {
    id: 'cardio-treadmills-angle',
    src: '/images/gym/cardio-treadmills-angle.webp',
    alt: "Treadmills in a row at Bossie's Gym with machines visible in the background and spin bikes",
    label: 'Treadmills',
    span: '',
    homePreview: false,
  },
];

const functionalTiles = [
  {
    id: 'functional-stairmill-rower',
    src: '/images/gym/functional-stairmill-rower.webp',
    alt: "Stair climber and rowing machine at Bossie's Gym with open roller door to the outside",
    label: 'Stair Climber & Rower',
    span: '',
    homePreview: false,
  },
  {
    id: 'cardio-weights-floor',
    src: '/images/gym/cardio-weights-floor.webp',
    alt: "Dumbbell racks with cardio equipment visible behind at Bossie's Gym",
    label: 'Mixed Training Floor',
    span: '',
    homePreview: false,
  },
];

const mensTiles = [
  {
    id: 'changerooms-washroom-wide',
    src: '/images/gym/changerooms-washroom-wide.webp',
    alt: "Men's washroom at Bossie's Gym — two basins and urinals with clean grey tile finish",
    label: "Men's Washroom",
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'changerooms-washroom-angle',
    src: '/images/gym/changerooms-washroom-angle.webp',
    alt: "Second angle of men's washroom at Bossie's Gym",
    label: "Men's Washroom",
    span: '',
    homePreview: false,
  },
  {
    id: 'changerooms-shower',
    src: '/images/gym/changerooms-shower.webp',
    alt: "Men's shower at Bossie's Gym with mosaic tile floor and feature wall tiling",
    label: 'Showers',
    span: '',
    homePreview: false,
  },
];

// Ladies' changeroom — real photography supplied June 2026 (DSC_0160–0166)
//   public/images/gym/ladies-entry.webp          ← DSC_0160.webp
//   public/images/gym/ladies-basins.webp         ← DSC_0161.webp
//   public/images/gym/ladies-shower.webp         ← DSC_0162.webp
//   public/images/gym/ladies-toilets.webp        ← DSC_0166.webp
//
//  TANNING & ASSESSMENTS
//    tanning-sunbed-close.webp        ← DSC_0149.webp  (Ambassador Turbo sunbed close-up)
//    tanning-room-wide.webp           ← DSC_0150.webp  (sunbed room wide — desk, mirror)
//    assessment-desk.webp             ← DSC_0152.webp  (body assessment desk with calipers)
//
//  RECEPTION & LOUNGE
//    reception-lounge.webp            ← DSC_0178.webp  (reception, seating, trophy, trophies wall)
//    reception-lockers.webp           ← DSC_0182.webp  (member lockers + trophies)
const ladiesTiles = [
  {
    id: 'ladies-entry',
    src: '/images/gym/ladies-entry.webp',
    alt: "Ladies' changeroom entry at Bossie's Gym — full-length mirror, bench, basin and mosaic feature tile",
    label: "Ladies' Changeroom",
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'ladies-basins',
    src: '/images/gym/ladies-basins.webp',
    alt: "Ladies' twin basins at Bossie's Gym with fresh flowers and mirror shelf",
    label: "Ladies' Basins",
    span: '',
    homePreview: false,
  },
  {
    id: 'ladies-shower',
    src: '/images/gym/ladies-shower.webp',
    alt: "Ladies' rain shower at Bossie's Gym with mosaic feature wall tiling",
    label: 'Rain Shower',
    span: '',
    homePreview: false,
  },
  {
    id: 'ladies-toilets',
    src: '/images/gym/ladies-toilets.webp',
    alt: "Ladies' toilet cubicles at Bossie's Gym — clean grey tile finish with private stalls",
    label: 'Toilet Cubicles',
    span: '',
    homePreview: false,
  },
];

// Tanning & assessments — real photography supplied June 2026 (DSC_0149–0152)
//   public/images/gym/tanning-sunbed-close.webp ← DSC_0149.webp
//   public/images/gym/tanning-room-wide.webp    ← DSC_0150.webp
//   public/images/gym/assessment-desk.webp      ← DSC_0152.webp
const tanningTiles = [
  {
    id: 'tanning-room-wide',
    src: '/images/gym/tanning-room-wide.webp',
    alt: "Tanning room at Bossie's Gym — Ambassador Turbo sunbed, vanity desk, mirror and fitness balls",
    label: 'Tanning Room',
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'tanning-sunbed-close',
    src: '/images/gym/tanning-sunbed-close.webp',
    alt: "Close-up of the Ambassador Turbo sunbed at Bossie's Gym",
    label: 'Sunbed',
    span: '',
    homePreview: false,
  },
  {
    id: 'assessment-desk',
    src: '/images/gym/assessment-desk.webp',
    alt: "Body assessment station at Bossie's Gym — desk with skinfold calipers, body composition tools and framed mirror",
    label: 'Body Assessment Station',
    span: '',
    homePreview: false,
  },
];

// Reception & lounge — real photography supplied June 2026 (DSC_0178, DSC_0182)
//   public/images/gym/reception-lounge.webp   ← DSC_0178.webp
//   public/images/gym/reception-lockers.webp  ← DSC_0182.webp
const receptionTiles = [
  {
    id: 'reception-lounge',
    src: '/images/gym/reception-lounge.webp',
    alt: "Reception and lounge area at Bossie's Gym — seating, trophy table, Bossie's Gym signage and bodybuilding poster wall",
    label: 'Reception & Lounge',
    span: 'sm:col-span-2',
    homePreview: false,
  },
  {
    id: 'reception-lockers',
    src: '/images/gym/reception-lockers.webp',
    alt: "Member lockers at Bossie's Gym with competition trophies displayed on top — numbered 1 through 12",
    label: 'Member Lockers',
    span: '',
    homePreview: false,
  },
];

// All tiles in priority order for the `limit` prop (Home page preview)
const allTiles = [
  ...floorOverviews,
  ...weightTiles,
  ...cardioTiles,
  ...functionalTiles,
  ...tanningTiles,
  ...receptionTiles,
  ...mensTiles,
  ...ladiesTiles,
];

const homeTiles = allTiles.filter((t) => t.homePreview);

// ---------------------------------------------------------------------------
// Section + filter config
// ---------------------------------------------------------------------------

const SECTIONS = [
  { id: 'floor',      label: 'The training floor',        filterId: 'floor',       cols: 'sm:grid-cols-[2fr_1fr_1fr]',     tiles: floorOverviews,  first: true },
  { id: 'weights',    label: 'Weight training',            filterId: 'weights',     cols: 'sm:grid-cols-[2fr_1fr_1fr]',     tiles: weightTiles },
  { id: 'cardio',     label: 'Cardio',                    filterId: 'cardio',      cols: 'sm:grid-cols-[2fr_1fr_1fr]',     tiles: cardioTiles },
  { id: 'functional', label: 'Functional & conditioning', filterId: 'cardio',      cols: 'sm:grid-cols-[1fr_1fr]',         tiles: functionalTiles },
  { id: 'tanning',    label: 'Tanning & assessments',     filterId: 'facilities',  cols: 'sm:grid-cols-[2fr_1fr_1fr]',     tiles: tanningTiles },
  { id: 'reception',  label: 'Reception & lounge',        filterId: 'facilities',  cols: 'sm:grid-cols-[2fr_1fr]',         tiles: receptionTiles },
  { id: 'mens',       label: "Men's changeroom",          filterId: 'changerooms', cols: 'sm:grid-cols-[2fr_1fr_1fr]',     tiles: mensTiles },
  { id: 'ladies',     label: "Ladies' changeroom",        filterId: 'changerooms', cols: 'sm:grid-cols-[2fr_1fr_1fr_1fr]', tiles: ladiesTiles },
];

const FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'floor',       label: 'Training Floor' },
  { id: 'weights',     label: 'Weights' },
  { id: 'cardio',      label: 'Cardio' },
  { id: 'facilities',  label: 'Facilities' },
  { id: 'changerooms', label: 'Changerooms' },
];

// ---------------------------------------------------------------------------
// Main export — dispatches to HomePreview or GalleryPage (no hooks here)
// ---------------------------------------------------------------------------

export default function GalleryGrid({ limit }) {
  if (limit) return <HomePreview limit={limit} />;
  return <GalleryPage />;
}

// ---------------------------------------------------------------------------
// Home page preview (framer-motion stagger, no lightbox)
// ---------------------------------------------------------------------------

function HomePreview({ limit }) {
  const tiles = (homeTiles.length >= limit ? homeTiles : allTiles).slice(0, limit);
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-3 auto-rows-[220px] sm:auto-rows-[280px] sm:grid-cols-[2fr_1fr_1fr]"
    >
      {tiles.map((tile, index) => (
        <PhotoTile key={tile.id} tile={tile} priority={index < 2} tileVariants={fadeUp} />
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Full gallery page
// ---------------------------------------------------------------------------

function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const visibleSections = activeFilter === 'all'
    ? SECTIONS
    : SECTIONS.filter((s) => s.filterId === activeFilter);

  const visibleTiles = visibleSections.flatMap((s) => s.tiles);

  const openLightbox = useCallback((tile) => {
    const idx = visibleTiles.findIndex((t) => t.id === tile.id);
    setLightbox({ tiles: visibleTiles, index: Math.max(0, idx) });
  }, [visibleTiles]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PagePose>
      <PageHero
        eyebrow="Gallery"
        title="Inside Bossie's Gym."
        description="A look at the training floor, equipment, and facilities — weights, cardio, functional, boxing, and the spaces around them."
        imagePath="/images/gym/floor-hero.webp"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]}
      />

      <section className="section">
        <Container>
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-ink-500">
                {visibleTiles.length} photo{visibleTiles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <FilterTabs active={activeFilter} onChange={setActiveFilter} />
          </div>

          <div className="flex flex-col gap-14">
            {visibleSections.map((section) => (
              <GridSection
                key={`${section.id}-${activeFilter}`}
                section={section}
                onOpen={openLightbox}
              />
            ))}
          </div>
        </Container>
      </section>

      {lightbox && (
        <Lightbox
          tiles={lightbox.tiles}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      <CTASection
        eyebrow="Like what you see?"
        title="Come see it in person."
        description="Book a free trial, give us a call, or send a WhatsApp — we'll show you around the floor."
        primary={{ label: site.ctas.join.label, to: site.ctas.join.to }}
        secondary={{ label: `Call ${site.phone.display}`, href: site.ctas.call.href, variant: 'ghost' }}
        tertiary={{ label: 'Start a Free Trial', to: site.ctas.trial.to, variant: 'link' }}
      />
    </PagePose>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs with anime.js animated underline indicator
// ---------------------------------------------------------------------------

function FilterTabs({ active, onChange }) {
  const indicatorRef = useRef(null);
  const tabsRef = useRef([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const idx = FILTERS.findIndex((f) => f.id === active);
    const tab = tabsRef.current[idx];
    if (!tab || !indicatorRef.current) return;

    requestAnimationFrame(() => {
      anime({
        targets: indicatorRef.current,
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        duration: isFirstRender.current ? 0 : 320,
        easing: 'easeOutExpo',
      });
      isFirstRender.current = false;
    });
  }, [active]);

  return (
    <div className="relative overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="relative flex min-w-max border-b border-white/10">
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-brand-500"
          style={{ left: 0, width: 0 }}
        />
        {FILTERS.map((f, idx) => (
          <button
            key={f.id}
            ref={(el) => { tabsRef.current[idx] = el; }}
            type="button"
            onClick={() => onChange(f.id)}
            className={`whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
              active === f.id ? 'text-white' : 'text-ink-500 hover:text-ink-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper — anime.js cascade entrance on mount / filter change
// ---------------------------------------------------------------------------

function GridSection({ section, onOpen }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const tiles = gridRef.current?.querySelectorAll('[data-tile]');
    if (!tiles?.length) return;

    anime.set(tiles, { opacity: 0, translateY: 22, scale: 0.97 });
    anime({
      targets: tiles,
      opacity: 1,
      translateY: 0,
      scale: 1,
      delay: anime.stagger(55, { start: 60 }),
      duration: 560,
      easing: 'easeOutExpo',
    });
  }, []);

  return (
    <div>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
        {section.label}
      </h2>
      <div
        ref={gridRef}
        className={`grid gap-3 auto-rows-[220px] sm:auto-rows-[280px] ${section.cols}`}
      >
        {section.tiles.map((tile, index) => (
          <PhotoTile
            key={tile.id}
            tile={tile}
            priority={section.first && index < 2}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual photo tile — ClickSpark + hover reveal + optional lightbox click
// ---------------------------------------------------------------------------

function PhotoTile({ tile, priority, onOpen, tileVariants }) {
  return (
    <motion.div
      data-tile
      variants={tileVariants}
      onClick={onOpen ? () => onOpen(tile) : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift ${onOpen ? 'cursor-pointer' : ''} ${tile.span || ''}`}
    >
      <ClickSpark sparkColor="#f4535f" sparkRadius={26} sparkCount={6} sparkSize={8} duration={480}>
        <img
          src={tile.src}
          alt={tile.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-300 transition-colors duration-300 group-hover:text-white">
            {tile.label}
          </p>
          {onOpen && (
            <p className="mt-0.5 translate-y-1 text-[10px] text-ink-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Click to view
            </p>
          )}
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 transition-all duration-300 group-hover:ring-white/10" />
      </ClickSpark>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Lightbox — portal, keyboard nav, anime.js open / slide / close
// ---------------------------------------------------------------------------

function Lightbox({ tiles, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const indexRef = useRef(startIndex);
  const isAnimating = useRef(false);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Body scroll lock + entrance animation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    anime({ targets: backdropRef.current, opacity: [0, 1], duration: 220, easing: 'easeOutQuad' });
    anime({ targets: contentRef.current, scale: [0.92, 1], opacity: [0, 1], duration: 380, easing: 'easeOutExpo' });

    return () => { document.body.style.overflow = ''; };
  }, []);

  const navigate = useCallback((dir) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    anime({
      targets: contentRef.current,
      opacity: [1, 0],
      translateX: [0, dir > 0 ? -28 : 28],
      duration: 180,
      easing: 'easeInQuad',
      complete: () => {
        const next = (indexRef.current + dir + tiles.length) % tiles.length;
        indexRef.current = next;
        flushSync(() => setIndex(next));
        anime({
          targets: contentRef.current,
          opacity: [0, 1],
          translateX: [dir > 0 ? 28 : -28, 0],
          duration: 300,
          easing: 'easeOutExpo',
          complete: () => { isAnimating.current = false; },
        });
      },
    });
  }, [tiles.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate, onClose]);

  const tile = tiles[index];

  return createPortal(
    <div
      ref={backdropRef}
      style={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={tile.alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/96 p-4 backdrop-blur-sm md:p-10"
    >
      {/* Counter */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">
        {index + 1} / {tiles.length}
      </p>

      {/* Close */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <X size={18} />
      </button>

      {/* Prev */}
      {tiles.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(-1); }}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:left-5"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div
        ref={contentRef}
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-14 flex max-h-[88vh] w-full max-w-5xl flex-col items-center gap-4 md:mx-24"
      >
        <img
          key={tile.id}
          src={tile.src}
          alt={tile.alt}
          className="max-h-[80vh] w-full rounded-xl object-contain"
        />
        <p className="text-sm font-medium text-white">{tile.label}</p>
      </div>

      {/* Next */}
      {tiles.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(1); }}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:right-5"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>,
    document.body,
  );
}
