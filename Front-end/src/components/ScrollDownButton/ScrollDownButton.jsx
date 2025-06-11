import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScrollDownButton.module.scss";
import { useState, useEffect } from "react";

export default function ScrollDownButton({ targetId = "kittens-list" }) {
  const handleScroll = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // show only near top
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY < window.innerHeight * 0.25);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="scroll-btn"
          className={styles.glassBtn}
          onClick={handleScroll}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.3 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            aria-hidden
          >
            <path d="M6 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 14l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
