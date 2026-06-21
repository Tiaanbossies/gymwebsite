import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../../lib/site.js';

export default function FeatureGrid({ items = [] }) {
  return (
    <motion.ul
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={fadeUp}
          className="group relative flex flex-col gap-4 bg-ink-900 p-7 transition-colors hover:bg-ink-800"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
            {item.icon ? <item.icon size={20} /> : null}
          </div>
          <h3 className="font-display text-xl tracking-headline text-white">{item.title}</h3>
          <p className="text-sm text-ink-300 leading-relaxed">{item.description}</p>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.li>
      ))}
    </motion.ul>
  );
}
