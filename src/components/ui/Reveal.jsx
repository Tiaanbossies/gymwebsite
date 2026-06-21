import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../../lib/site.js';

/**
 * Reveal — drops children into viewport with a staggered fade-up.
 * Use <Reveal.Item> for individual children when staggering.
 */
function Reveal({ as: As = 'div', className = '', children, delay = 0, y = 24 }) {
  const variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

Reveal.Group = function RevealGroup({ className = '', children }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
};

Reveal.Item = function RevealItem({ className = '', children }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
};

export default Reveal;
