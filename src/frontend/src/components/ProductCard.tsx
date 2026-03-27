import { ExternalLink, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const stars = Math.round(product.rating);
  const price = Number(product.price) / 100;
  const originalPrice = Number(product.originalPrice) / 100;
  const hasDiscount = originalPrice > price;
  const discount = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-secondary"
        style={{ height: 180 }}
      >
        <img
          src={
            product.imageUrl ||
            "/assets/generated/product-headphones.dim_300x200.jpg"
          }
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/generated/product-headphones.dim_300x200.jpg";
          }}
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-destructive text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((starIdx) => (
            <Star
              key={starIdx}
              className="w-3.5 h-3.5"
              fill={starIdx < stars ? "oklch(var(--star-gold))" : "none"}
              stroke={
                starIdx < stars
                  ? "oklch(var(--star-gold))"
                  : "oklch(var(--muted-foreground))"
              }
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({Number(product.reviewCount).toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "oklch(var(--amazon-btn))" }}
            data-ocid="products.button"
          >
            View on Amazon
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
