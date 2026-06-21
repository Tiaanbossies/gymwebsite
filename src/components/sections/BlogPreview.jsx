import { motion } from 'framer-motion';
import { Calendar, Trophy, Users } from 'lucide-react';

import { fadeUp, stagger } from '../../lib/site.js';

/**
 * BlogPreview — stylised update cards. Topic framing is based on the analysis,
 * which identified blog posts about competitions and gym achievements.
 * No specific dates or fake details are fabricated.
 */
const defaultUpdates = [
  {
    icon: Trophy,
    kicker: 'Competition',
    title: 'Competition season updates',
    blurb:
      'Recap posts and news from members stepping on stage — a window into our competitive culture.',
  },
  {
    icon: Users,
    kicker: 'Community',
    title: 'Achievements on the floor',
    blurb:
      'Member milestones, lifts and progress shared from our training community throughout the year.',
  },
  {
    icon: Calendar,
    kicker: 'Studio',
    title: 'Life inside Bossie\'s',
    blurb:
      'A closer look at how we train — coaching sessions, training days and the day-to-day studio.',
  },
];

export default function BlogPreview({ updates = defaultUpdates }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-5 md:grid-cols-3"
    >
      {updates.map((u) => (
        <motion.article
          key={u.title}
          variants={fadeUp}
          className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-ink-900 p-6 transition-colors hover:border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
              <u.icon size={18} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-400">
              {u.kicker}
            </span>
          </div>
          <h3 className="font-display text-xl tracking-headline text-white">{u.title}</h3>
          <p className="text-sm text-ink-300 leading-relaxed">{u.blurb}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
