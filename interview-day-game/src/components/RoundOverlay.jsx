// RoundOverlay.jsx
import { AnimatePresence, motion } from "framer-motion";
function RoundOverlay({ round, renderHour }) {
  return (
    <AnimatePresence>
      {round !== null && (
        <motion.div
          key={round}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 1 }}
          className="round-overlay"
        >
          <h1 style={{ color: "black" }}>{renderHour(round)}</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default RoundOverlay;
