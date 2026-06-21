import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      {items.map((item, i) => {
        const isOpen = i === openIndex;
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <button
              type="button"
              id={triggerId}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className={`flex w-full min-h-[3.25rem] items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:gap-6 sm:px-6 sm:py-5 ${
                isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/5'
              }`}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="pr-2 font-display text-base tracking-headline text-white sm:text-lg">
                {item.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink-200 transition-transform duration-300 ${
                  isOpen ? 'rotate-45 border-brand-500/50 text-brand-400' : ''
                }`}
                aria-hidden
              >
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="whitespace-pre-line px-5 pb-5 pt-1 text-sm text-ink-300 leading-relaxed sm:px-6 sm:pb-6 sm:text-[15px]"
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
