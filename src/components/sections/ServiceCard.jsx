import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { fadeUp } from '../../lib/site.js';

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  bullets = [],
  to = '/services',
  tag,
  className = '',
}) {
  return (
    <motion.article
      variants={fadeUp}
      className={`group card-surface hover-lift flex flex-col gap-6 p-6 sm:p-7 hover:border-brand-500/40 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30 sm:h-12 sm:w-12">
          {Icon ? <Icon size={22} /> : null}
        </div>
        {tag && <span className="tag text-[10px] sm:text-[11px]">{tag}</span>}
      </div>

      <div>
        <h3 className="display-3 text-white">{title}</h3>
        <p className="mt-3 text-sm sm:text-[15px] text-ink-300 leading-relaxed">{description}</p>
      </div>

      {bullets.length > 0 && (
        <ul className="mt-auto flex flex-col gap-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {b}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={to}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400 transition-colors hover:text-brand-300"
      >
        Learn more
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.article>
  );
}
