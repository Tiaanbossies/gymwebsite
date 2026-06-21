/**
 * LineChart — pure SVG, no library.
 * Props:
 *   series  — [{ label, color, data: [{ date: 'YYYY-MM-DD', count: number }] }]
 *   dates   — string[] of every date in the range (ensures a shared x-axis)
 *   height  — SVG height in px (default 180)
 */
export default function LineChart({ series = [], dates = [], height = 180 }) {
  if (!dates.length || !series.length) {
    return <p className="text-ink-500 text-xs py-6">No data yet.</p>;
  }

  const W = 600;
  const H = height;
  const PAD = { top: 12, right: 12, bottom: 36, left: 40 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Unified max across all series
  const allCounts = series.flatMap((s) => s.data.map((d) => d.count));
  const maxVal = Math.max(...allCounts, 1);

  // Y-axis gridlines: 4 levels
  const yLevels = [0, 0.33, 0.66, 1].map((f) => Math.round(f * maxVal));

  // X-axis: how many labels to show without crowding
  const n = dates.length;
  const step = n <= 7 ? 1 : n <= 30 ? 5 : 15;

  // Map date index → x pixel
  const xOf = (i) => PAD.left + (i / Math.max(n - 1, 1)) * plotW;
  // Map count → y pixel
  const yOf = (v) => PAD.top + plotH - (v / maxVal) * plotH;

  // Build <polyline> points string for each series
  function pointsStr(data) {
    return dates
      .map((date, i) => {
        const item = data.find((d) => d.date === date);
        return `${xOf(i)},${yOf(item?.count ?? 0)}`;
      })
      .join(' ');
  }

  // Build dot positions
  function dots(data) {
    return dates.map((date, i) => {
      const item = data.find((d) => d.date === date);
      const count = item?.count ?? 0;
      return { x: xOf(i), y: yOf(count), count };
    });
  }

  function shortDate(iso) {
    const [, m, d] = iso.split('-');
    return `${parseInt(m)}/${parseInt(d)}`;
  }

  const multiSeries = series.length > 1;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: Math.min(n * 18, 320) }}
        aria-hidden="true"
      >
        {/* Grid lines + y-axis labels */}
        {yLevels.map((val) => {
          const y = yOf(val);
          return (
            <g key={val}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X-axis date labels */}
        {dates.map((date, i) => {
          if (i % step !== 0 && i !== n - 1) return null;
          return (
            <text
              key={date}
              x={xOf(i)} y={H - PAD.bottom + 14}
              textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)"
            >
              {shortDate(date)}
            </text>
          );
        })}

        {/* Series lines + dots */}
        {series.map((s) => (
          <g key={s.label}>
            <polyline
              points={pointsStr(s.data)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.9"
            />
            {dots(s.data).map(({ x, y, count }, i) => (
              count > 0 && (
                <circle
                  key={i} cx={x} cy={y} r="3"
                  fill={s.color} stroke="#05070d" strokeWidth="1.5"
                />
              )
            ))}
          </g>
        ))}
      </svg>

      {/* Legend (only for multi-series) */}
      {multiSeries && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] text-ink-400 truncate max-w-[120px]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
