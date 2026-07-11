"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stagger } from "@/lib/animations";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function RevealSection({
  children,
  className = "",
}: RevealSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}