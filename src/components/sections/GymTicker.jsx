import ScrollVelocity from '../ui/ScrollVelocity.jsx';

const TICKER_TEXT = 'Honesty · Commitment · Community · Family-run · Centurion · Personal Training · Free Trial ·';

export default function GymTicker() {
  return (
    <div className="border-y border-white/[0.07] bg-ink-950/70 py-5 overflow-hidden select-none">
      <ScrollVelocity
        texts={[TICKER_TEXT]}
        velocity={38}
        className="text-white/20"
        numCopies={4}
        scrollerStyle={{
          fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      />
    </div>
  );
}
