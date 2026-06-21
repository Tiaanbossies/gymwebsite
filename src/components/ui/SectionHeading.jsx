import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/site.js';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`flex max-w-3xl flex-col gap-3 sm:gap-4 ${alignCls} ${className}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="display-2 text-white text-balance">{title}</h2>
      {description && <p className="body-lg text-balance">{description}</p>}
    </motion.div>
  );
}
