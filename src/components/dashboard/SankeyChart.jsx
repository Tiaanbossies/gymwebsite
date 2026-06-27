import { useMemo } from 'react';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';

const NODE_WIDTH = 16;
const NODE_PADDING = 14;
const MIN_LINK_COUNT = 1;
const CHART_W = 860;
const CHART_H = 460;

const PALETTE = [
  '#dc2b38', '#3d6479', '#22c55e', '#eab308',
  '#a855f7', '#f97316', '#06b6d4', '#84cc16',
];

function stableColor(page) {
  let h = 0;
  for (let i = 0; i < page.length; i++) h = (h * 31 + page.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function fmtMs(ms) {
  if (!ms || ms <= 0) return null;
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function pageName(id) {
  if (id === '/') return 'Home';
  return id.slice(1).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildSankeyData(views) {
  if (!views || views.length < 2) return { nodes: [], links: [], sessionCount: 0, debug: 'fewer than 2 page views' };

  const sessions = {};
  for (const v of views) {
    if (!v.session_id) continue;
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

  const sessionCount = Object.keys(sessions).length;
  const totalTransitions = Object.keys(transitionCounts).length;

  const validLinks = Object.entries(transitionCounts)
    .filter(([, count]) => count >= MIN_LINK_COUNT)
    .map(([key, value]) => {
      const [source, target] = key.split('|');
      return { source, target, value };
    });

  if (validLinks.length === 0) {
    return { nodes: [], links: [], sessionCount, debug: `${sessionCount} sessions, ${totalTransitions} transitions — all single-page` };
  }

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

  return { nodes, links, sessionCount, debug: null };
}

export default function SankeyChart({ views }) {
  const data = useMemo(() => buildSankeyData(views), [views]);

  const layout = useMemo(() => {
    if (!data || data.links.length === 0) return null;
    try {
      const gen = d3Sankey()
        .nodeWidth(NODE_WIDTH)
        .nodePadding(NODE_PADDING)
        .extent([[1, 1], [CHART_W - 140, CHART_H - 6]]);
      return gen({
        nodes: data.nodes.map((n) => ({ ...n })),
        links: data.links.map((l) => ({ ...l })),
      });
    } catch (err) {
      console.error('[SankeyChart] d3-sankey layout error:', err);
      return null;
    }
  }, [data]);

  if (!layout) {
    const sessionLine = data?.sessionCount > 0
      ? `${data.sessionCount} session${data.sessionCount !== 1 ? 's' : ''} recorded, but each only visited one page.`
      : 'No sessions recorded yet.';
    return (
      <div className="py-3 space-y-1">
        <p className="text-ink-400 text-xs">{sessionLine}</p>
        <p className="text-ink-600 text-xs">
          The flow diagram needs at least one visitor to navigate between pages in a single
          session — e.g. Home → Pricing → Contact. Open the site in a new tab, browse
          through a few pages, and the chart will appear here automatically.
        </p>
      </div>
    );
  }

  const maxX1 = Math.max(...layout.nodes.map((n) => n.x1));
  const linkPath = sankeyLinkHorizontal();

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full min-w-[560px]"
        style={{ maxHeight: CHART_H, overflow: 'visible' }}
        aria-label="User navigation flow diagram"
      >
        {/* Links */}
        {layout.links.map((link, i) => (
          <path
            key={i}
            d={linkPath(link)}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={Math.max(2, link.width)}
          />
        ))}

        {/* Nodes */}
        {layout.nodes.map((node) => {
          const color = stableColor(node.id);
          const onRight = node.x1 >= maxX1 - 4;
          const labelX = onRight ? node.x0 - 8 : node.x1 + 8;
          const anchor = onRight ? 'end' : 'start';
          const midY = (node.y0 + node.y1) / 2;
          const dur = fmtMs(node.avgDuration);
          const exitPct = Math.round(node.exitRate * 100);
          const sublabel = [dur && `avg ${dur}`, `${exitPct}% exit`].filter(Boolean).join(' · ');
          const nodeH = Math.max(2, node.y1 - node.y0);

          return (
            <g key={node.id}>
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
                y={midY - 6}
                textAnchor={anchor}
                fill="#e2e8f0"
                fontSize={11}
                dominantBaseline="middle"
                style={{ fontFamily: 'inherit' }}
              >
                {pageName(node.id)}
              </text>
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
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-[10px] text-ink-600">
        Based on {data.sessionCount} session{data.sessionCount !== 1 ? 's' : ''} ·
        link width = relative transition volume · exit % = sessions that left from this page
      </p>
    </div>
  );
}
