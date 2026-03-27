import { Skeleton } from "@/components/ui/skeleton";
import FeaturedCategories from "../components/FeaturedCategories";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import RecommendedStrip from "../components/RecommendedStrip";
import Sidebar from "../components/Sidebar";
import {
  useGetAllCategories,
  useGetFeaturedProducts,
  useGetRecommendedProducts,
  useGetSiteSettings,
} from "../hooks/useQueries";

const FALLBACK_PRODUCTS = [
  {
    id: 1n,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 27999n,
    originalPrice: 34999n,
    rating: 4.8,
    reviewCount: 12043n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-headphones.dim_300x200.jpg",
    featured: true,
    recommended: true,
    description:
      "Industry-leading noise cancellation with exceptional sound quality.",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 2n,
    title: "MacBook Air M2 13-inch Laptop",
    price: 109900n,
    originalPrice: 119900n,
    rating: 4.9,
    reviewCount: 45231n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-laptop.dim_300x200.jpg",
    featured: true,
    recommended: false,
    description:
      "Apple's thinnest, lightest notebook with M2 chip performance.",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 3n,
    title: "Instant Pot Duo 7-in-1 Pressure Cooker",
    price: 7999n,
    originalPrice: 9999n,
    rating: 4.9,
    reviewCount: 234567n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-instapot.dim_300x200.jpg",
    featured: true,
    recommended: true,
    description: "America's most loved multi-use programmable pressure cooker.",
    category: 2n,
    createdAt: 0n,
  },
  {
    id: 4n,
    title: "Garmin Venu 3 Fitness Smartwatch",
    price: 24999n,
    originalPrice: 29999n,
    rating: 4.6,
    reviewCount: 18432n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-smartwatch.dim_300x200.jpg",
    featured: true,
    recommended: true,
    description: "Advanced health monitoring with GPS and 10-day battery life.",
    category: 3n,
    createdAt: 0n,
  },
  {
    id: 5n,
    title: "Amazon Echo Dot (5th Gen)",
    price: 4999n,
    originalPrice: 4999n,
    rating: 4.7,
    reviewCount: 89201n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-speaker.dim_300x200.jpg",
    featured: true,
    recommended: false,
    description:
      "Smart speaker with Alexa — now with better sound and motion sensing.",
    category: 1n,
    createdAt: 0n,
  },
  {
    id: 6n,
    title: "JBL Clip 4 Waterproof Bluetooth Speaker",
    price: 5999n,
    originalPrice: 7999n,
    rating: 4.7,
    reviewCount: 32100n,
    amazonUrl: "https://amazon.com",
    imageUrl: "/assets/generated/product-bt-speaker.dim_300x200.jpg",
    featured: false,
    recommended: true,
    description:
      "Ultra-portable carabiner speaker with IP67 waterproof rating.",
    category: 3n,
    createdAt: 0n,
  },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading: loadingProducts } =
    useGetFeaturedProducts();
  const { data: recommendedProducts } = useGetRecommendedProducts();
  const { data: categories } = useGetAllCategories();
  const { data: siteSettings } = useGetSiteSettings();

  const displayProducts =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts
      : FALLBACK_PRODUCTS;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero settings={siteSettings} />
        <FeaturedCategories categories={categories} />

        {/* Main 2-column layout */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Product grid */}
            <div
              className="flex-1 min-w-0"
              style={{ flex: "0 0 68%", maxWidth: "68%" }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Top Trending Deals &amp; Product Picks
              </h2>
              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={`skel-${i}`}
                      className="rounded-xl overflow-hidden"
                      data-ocid="products.loading_state"
                    >
                      <Skeleton className="h-44 w-full" />
                      <div className="p-4 flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-8 w-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayProducts.map((product, i) => (
                    <ProductCard
                      key={String(product.id)}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:w-80 shrink-0">
              <Sidebar />
            </div>
          </div>
        </div>

        <RecommendedStrip products={recommendedProducts} />
      </main>
      <Footer />
    </div>
  );
}
