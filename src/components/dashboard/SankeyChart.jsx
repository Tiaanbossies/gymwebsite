import { useMemo } from 'react';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

const NODE_WIDTH = 16;
const NODE_PADDING = 14;
const MIN_LINK_COUNT = 2;
const CHART_W = 820;
const CHART_H = 440;

const COLORS = [
  '#dc2b38', '#3d6479', '#22c55e', '#eab308',
  '#a855f7', '#f97316', '#06b6d4', '#84cc16',
];

function fmtMs(ms) {
  if (!ms || ms <= 0) return null;
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function buildSankeyData(views) {
  if (!views || views.length < 5) return null;

  const sessions = {};
  for (const v of views) {
    if (!sessions[v.session_id]) sessions[v.session_id] = [];
    sessions[v.session_id].push(v);
  }

  const transitionCounts = {};
  const durationSums = {};
  const durationCounts = {};
  const visitCounts = {};
  const exitCounts = {};

  for (const seq of Object.values(sessions)) {
    seq.sort((a, b) => new Date(a.entered_at) - new Date(b.entered_at));

    // Only track the first visit to each page per session — prevents cycles
    // in the Sankey layout that d3-sankey cannot handle.
    const seen = new Set();
    const path = [];
    for (const v of seq) {
      if (!seen.has(v.page)) {
        seen.add(v.page);
        path.push(v);
      }
    }

    for (let i = 0; i < path.length; i++) {
      const { page, duration_ms } = path[i];
      visitCounts[page] = (visitCounts[page] || 0) + 1;
      if (duration_ms != null && duration_ms > 0) {
        durationSums[page] = (durationSums[page] || 0) + duration_ms;
        durationCounts[page] = (durationCounts[page] || 0) + 1;
      }
      if (i < path.length - 1) {
        const key = `${page}|${path[i + 1].page}`;
        transitionCounts[key] = (transitionCounts[key] || 0) + 1;
      } else {
        exitCounts[page] = (exitCounts[page] || 0) + 1;
      }
    }
  }

  const validLinks = Object.entries(transitionCounts)
    .filter(([, count]) => count >= MIN_LINK_COUNT)
    .map(([key, value]) => {
      const [source, target] = key.split('|');
      return { source, target, value };
    });

  if (validLinks.length === 0) return null;

  const pageSet = new Set();
  for (const { source, target } of validLinks) {
    pageSet.add(source);
    pageSet.add(target);
  }
  const pages = [...pageSet];
  const pageIndex = Object.fromEntries(pages.map((p, i) => [p, i]));

  const nodes = pages.map((page) => ({
    id: page,
    visits: visitCounts[page] || 0,
    avgDuration: durationCounts[page]
      ? Math.round(durationSums[page] / durationCounts[page])
      : null,
    exitRate: visitCounts[page]
      ? (exitCounts[page] || 0) / visitCounts[page]
      : 0,
  }));

  const links = validLinks.map(({ source, target, value }) => ({
    source: pageIndex[source],
    target: pageIndex[target],
    value,
  }));

  return { nodes, links };
}

export default function SankeyChart({ views }) {
  const data = useMemo(() => buildSankeyData(views), [views]);

  const layout = useMemo(() => {
    if (!data) return null;
    try {
      const gen = d3Sankey()
        .nodeWidth(NODE_WIDTH)
        .nodePadding(NODE_PADDING)
        .nodeSort(null)
        .extent([[1, 1], [CHART_W - 60, CHART_H - 6]]);
      return gen({
        nodes: data.nodes.map((n) => ({ ...n })),
        links: data.links.map((l) => ({ ...l })),
      });
    } catch {
      return null;
    }
  }, [data]);

  if (!layout) {
    return (
      <p className="text-ink-500 text-xs py-2">
        Not enough cross-page navigation data yet — needs at least {MIN_LINK_COUNT} sessions
        moving between different pages.
      </p>
    );
  }

  const maxX1 = Math.max(...layout.nodes.map((n) => n.x1));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full min-w-[560px]"
        style={{ maxHeight: CHART_H }}
        aria-label="User navigation flow diagram"
      >
        {/* Links */}
        {layout.links.map((link, i) => (
          <path
            key={i}
            d={sankeyLinkHorizontal()(link)}
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth={Math.max(1.5, link.width)}
          />
        ))}

        {/* Nodes */}
        {layout.nodes.map((node, i) => {
          const color = COLORS[i % COLORS.length];
          const onRight = node.x1 >= maxX1 - 4;
          const labelX = onRight ? node.x0 - 8 : node.x1 + 8;
          const anchor = onRight ? 'end' : 'start';
          const midY = (node.y0 + node.y1) / 2;
          const dur = fmtMs(node.avgDuration);
          const exit = `${Math.round(node.exitRate * 100)}% exit`;
          const sublabel = [dur && `avg ${dur}`, exit].filter(Boolean).join(' · ');
          const label = node.id === '/' ? 'Home' : node.id.slice(1).replace(/-/g, ' ');
          const nodeH = Math.max(1, node.y1 - node.y0);

          return (
            <g key={i}>
              <rect
                x={node.x0}
                y={node.y0}
                width={NODE_WIDTH}
                height={nodeH}
                fill={color}
                opacity={0.88}
                rx={2}
              />
              <text
                x={labelX}
                y={midY - (sublabel ? 6 : 0)}
                textAnchor={anchor}
                fill="#e2e8f0"
                fontSize={11}
                dominantBaseline="middle"
                style={{ textTransform: 'capitalize', fontFamily: 'inherit' }}
              >
                {label}
              </text>
              {sublabel && (
                <text
                  x={labelX}
                  y={midY + 8}
                  textAnchor={anchor}
                  fill="#64748b"
                  fontSize={9}
                  dominantBaseline="middle"
                  style={{ fontFamily: 'inherit' }}
                >
                  {sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
