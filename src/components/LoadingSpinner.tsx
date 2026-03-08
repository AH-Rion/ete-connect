import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <GraduationCap className="w-12 h-12 text-accent" />
      </motion.div>
      <motion.p
        className="font-heading font-semibold text-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ETE Family
      </motion.p>
    </motion.div>
  </div>
);
