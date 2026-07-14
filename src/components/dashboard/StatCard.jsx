export default function StatCard({ label, value, sub, highlight = false }) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-1 ${highlight ? 'bg-brand-500/10 border border-brand-500/30' : 'card-surface'}`}>
      <span className={`eyebrow text-[10px] ${highlight ? 'text-brand-300' : ''}`}>{label}</span>
      <span className="font-display text-3xl tracking-headline text-white">{value}</span>
      {sub && <span className={`text-xs ${highlight ? 'text-brand-400' : 'text-ink-400'}`}>{sub}</span>}
    </div>
  );
}
