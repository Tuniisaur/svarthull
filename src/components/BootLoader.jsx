import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BootLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 1600; // 1.6s smooth Apple-style loader
    const interval = 20;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step + (Math.random() * 1.5 - 0.5);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsDone(true), 150);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isDone && (
        <motion.div
          key="bootloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center select-none cursor-default"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <img
              src="/icons/logo.svg"
              alt="Svart Hull Logo"
              className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.04)]"
            />
          </motion.div>

          {/* macOS Apple-style Progress Bar */}
          <div className="w-48 md:w-56 h-1.5 bg-[#2c2c2e] rounded-full overflow-hidden p-[1px]">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* OS Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-3.5 text-[11px] font-medium tracking-wider text-neutral-400 select-none"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
          >
            SvartHullOS
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
