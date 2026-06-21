export default function StatCard({ label, value, sub }) {
  return (
    <div className="card-surface rounded-2xl p-6 flex flex-col gap-1">
      <span className="eyebrow text-[10px]">{label}</span>
      <span className="font-display text-3xl tracking-headline text-white">{value}</span>
      {sub && <span className="text-xs text-ink-400">{sub}</span>}
    </div>
  );
}
