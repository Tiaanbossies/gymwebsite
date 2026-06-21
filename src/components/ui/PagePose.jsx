import { motion } from 'framer-motion';
import { pageVariants } from '../../lib/site.js';

export default function PagePose({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
