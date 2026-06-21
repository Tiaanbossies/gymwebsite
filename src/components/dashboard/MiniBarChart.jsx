export default function MiniBarChart({ data = [], color = 'bg-brand-500' }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
          <div
            className={`w-full rounded-t ${color} transition-all`}
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <span className="text-[9px] text-ink-500 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
