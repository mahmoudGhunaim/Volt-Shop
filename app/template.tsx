"use client";

import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

// The first page load renders fully visible (good for LCP and no-JS);
// only client-side navigations get the transition.
let hasMounted = false;

/** Re-mounts on every navigation: a short rise-and-fade between pages. */
export default function Template({ children }: { children: ReactNode }) {
  const animateIn = hasMounted;
  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
