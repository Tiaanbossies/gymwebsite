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

import { motion } from 'framer-motion';
import PagePose from '../components/ui/PagePose.jsx';
import PageHero from '../components/sections/PageHero.jsx';
import CTASection from '../components/sections/CTASection.jsx';
import Container from '../components/ui/Container.jsx';
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
// Component
// ---------------------------------------------------------------------------

export default function GalleryGrid({ limit }) {
  if (limit) {
    const tiles = (homeTiles.length >= limit ? homeTiles : allTiles).slice(0, limit);
    return (
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr] auto-rows-[220px] sm:auto-rows-[280px]"
      >
        {tiles.map((tile, index) => (
          // Eagerly load the first 2 images on the home page, lazy load the rest
          <PhotoTile key={tile.id} tile={tile} priority={index < 2} />
        ))}
      </motion.div>
    );
  }

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
          <div className="flex flex-col gap-14">
            <GridSection
              label="The training floor"
              tiles={floorOverviews}
              isFirstSection={true} // Flags this section to load instantly
            />
            <GridSection
              label="Weight training"
              tiles={weightTiles}
            />
            <GridSection
              label="Cardio"
              tiles={cardioTiles}
            />
            <GridSection
              label="Functional & conditioning"
              tiles={functionalTiles}
              cols="sm:grid-cols-[1fr_1fr]"
            />
            <GridSection
              label="Tanning & assessments"
              tiles={tanningTiles}
            />
            <GridSection
              label="Reception & lounge"
              tiles={receptionTiles}
              cols="sm:grid-cols-[2fr_1fr]"
            />
            <GridSection
              label="Men's changeroom"
              tiles={mensTiles}
            />
            <GridSection
              label="Ladies' changeroom"
              tiles={ladiesTiles}
              cols="sm:grid-cols-[2fr_1fr_1fr_1fr]"
            />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Like what you see?"
        title="Come see it in person."
        description="Book a free trial, give us a call, or send a WhatsApp — we'll show you around the floor."
        primary={{ label: site.ctas.join.label, to: site.ctas.join.to }}
        secondary={{
          label: `Call ${site.phone.display}`,
          href: site.ctas.call.href,
          variant: 'ghost',
        }}
        tertiary={{ label: 'Start a Free Trial', to: site.ctas.trial.to, variant: 'link' }}
      />
    </PagePose>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function GridSection({ label, tiles, cols, isFirstSection = false }) {
  return (
    <div>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400">
        {label}
      </h2>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className={`grid gap-3 auto-rows-[220px] sm:auto-rows-[280px] ${cols || 'sm:grid-cols-[2fr_1fr_1fr]'}`}
      >
        {tiles.map((tile, index) => (
          // Only apply priority loading to the first 2 images of the very first section
          <PhotoTile 
            key={tile.id} 
            tile={tile} 
            priority={isFirstSection && index < 2} 
          />
        ))}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual photo tile
// ---------------------------------------------------------------------------

function PhotoTile({ tile, priority }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 hover-lift ${tile.span || ''}`}
    >
      <img
        src={tile.src}
        alt={tile.alt}
        // Swaps between immediate loading for top images and lazy loading for off-screen images
        loading={priority ? "eager" : "lazy"}
        // Tells the browser to decode the image off the main thread so scrolling doesn't stutter
        decoding="async" 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {/* Gradient overlay — keeps label legible on any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-ink-950/10 to-transparent" />
      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-300">
          {tile.label}
        </p>
      </div>
      {/* Subtle inner ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
    </motion.div>
  );
}