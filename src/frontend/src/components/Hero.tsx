import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { SiteSettings } from "../backend.d";

interface HeroProps {
  settings?: SiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  const title = settings?.heroTitle || "Discover the Best Deals on Amazon";
  const subtitle =
    settings?.heroSubtitle ||
    "Curated top picks, honest reviews, and exclusive deals to help you shop smarter every day.";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: 480 }}
      data-ocid="hero.section"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-tech-desk.dim_1400x600.jpg)",
        }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)" }}
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-start justify-center"
        style={{ minHeight: 480 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-block bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Amazon Associates
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/85 text-base md:text-lg mb-8 leading-relaxed">
            {subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg"
            data-ocid="hero.primary_button"
          >
            Explore Latest Deals
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
