import { motion } from "framer-motion";

const Animate = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start 50 pixels down from the final position
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
      transition={{ duration: .3, ease: "easeOut" }} // Use easeOut for a more natural effect
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default Animate;