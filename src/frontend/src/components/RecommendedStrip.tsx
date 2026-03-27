import { ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react";
import { useRef } from "react";
import type { Product } from "../backend.d";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Sony WH-1000XM5 Headphones",
    price: 27999n,
    originalPrice: 34999n,
    rating: 4.8,
    reviewCount: 12043n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-headphones.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 2n,
    title: "Echo Dot Smart Speaker",
    price: 4999n,
    originalPrice: 4999n,
    rating: 4.7,
    reviewCount: 89201n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-speaker.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 3n,
    title: "Instant Pot Duo 7-in-1",
    price: 7999n,
    originalPrice: 9999n,
    rating: 4.9,
    reviewCount: 234567n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-instapot.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 2n,
    createdAt: 0n,
  },
  {
    id: 4n,
    title: "MacBook Air M2 Laptop",
    price: 109900n,
    originalPrice: 119900n,
    rating: 4.9,
    reviewCount: 45231n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-laptop.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 5n,
    title: "Garmin Fitness Smartwatch",
    price: 24999n,
    originalPrice: 29999n,
    rating: 4.6,
    reviewCount: 18432n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-smartwatch.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 3n,
    createdAt: 0n,
  },
  {
    id: 6n,
    title: "JBL Clip 4 Waterproof Speaker",
    price: 5999n,
    originalPrice: 7999n,
    rating: 4.7,
    reviewCount: 32100n,
    amazonUrl: "#",
    imageUrl: "/assets/generated/product-bt-speaker.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description: "",
    category: 3n,
    createdAt: 0n,
  },
];

interface Props {
  products?: Product[];
}

export default function RecommendedStrip({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 260 : -260,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="bg-card border-y border-border py-8 my-8"
      data-ocid="recommended.section"
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">
            Recommended This Week
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              data-ocid="recommended.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              data-ocid="recommended.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((p, i) => {
            const price = Number(p.price) / 100;
            const stars = Math.round(p.rating);
            return (
              <div
                key={String(p.id)}
                className="flex-none w-52 bg-background rounded-xl border border-border p-3 flex flex-col gap-2"
                data-ocid={`recommended.item.${i + 1}`}
              >
                <img
                  src={
                    p.imageUrl ||
                    "/assets/generated/product-headphones.dim_300x200.jpg"
                  }
                  alt={p.title}
                  className="w-full h-28 object-cover rounded-lg bg-secondary"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/generated/product-headphones.dim_300x200.jpg";
                  }}
                />
                <p className="text-xs font-semibold text-foreground line-clamp-2">
                  {p.title}
                </p>
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((si) => (
                    <Star
                      key={si}
                      className="w-2.5 h-2.5"
                      fill={si < stars ? "oklch(var(--star-gold))" : "none"}
                      stroke={
                        si < stars ? "oklch(var(--star-gold))" : "currentColor"
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold">${price.toFixed(2)}</span>
                  <a
                    href={p.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-accent transition-colors text-primary"
                    data-ocid="recommended.button"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
