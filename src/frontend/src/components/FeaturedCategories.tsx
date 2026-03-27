import { Bike, Home, Laptop, Shirt } from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../backend.d";

const DEFAULT_CATEGORIES = [
  {
    id: 1n,
    name: "Electronics",
    icon: "💻",
    color: "#E8F4FD",
    textColor: "#1E5A8A",
  },
  {
    id: 2n,
    name: "Home & Kitchen",
    icon: "🏠",
    color: "#E8F8F0",
    textColor: "#1A6640",
  },
  {
    id: 3n,
    name: "Outdoor & Sports",
    icon: "🏕️",
    color: "#E8FAF8",
    textColor: "#0F5E5B",
  },
  {
    id: 4n,
    name: "Fashion",
    icon: "👗",
    color: "#FDF0F8",
    textColor: "#8B2A72",
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  home: Home,
  bike: Bike,
  shirt: Shirt,
};

interface Props {
  categories?: Category[];
}

export default function FeaturedCategories({ categories }: Props) {
  const items =
    categories && categories.length > 0
      ? categories.slice(0, 4).map((c, i) => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          color: DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length].color,
          textColor:
            DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length].textColor,
        }))
      : DEFAULT_CATEGORIES;

  return (
    <section
      className="max-w-[1200px] mx-auto px-4 py-10"
      data-ocid="categories.section"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((cat, i) => {
          const IconComp = ICON_MAP[cat.icon] || null;
          return (
            <motion.button
              key={String(cat.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-card shadow-card border border-border cursor-pointer transition-all text-center"
              style={{ backgroundColor: cat.color }}
              data-ocid={`categories.item.${i + 1}`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${cat.textColor}20` }}
              >
                {IconComp ? (
                  <IconComp className="w-6 h-6" />
                ) : (
                  <span>{cat.icon}</span>
                )}
              </div>
              <div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: cat.textColor }}
                >
                  {cat.name}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: `${cat.textColor}99` }}
                >
                  Shop Now →
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
