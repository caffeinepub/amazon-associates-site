import { ShoppingBag } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="mt-12"
      style={{
        backgroundColor: "oklch(var(--footer-bg))",
        color: "oklch(var(--footer-fg))",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-lg"
                style={{ color: "oklch(var(--footer-fg))" }}
              >
                The Daily Finder
              </span>
            </div>
            <p
              className="text-sm max-w-xs"
              style={{ color: "oklch(var(--footer-fg) / 0.65)" }}
            >
              Your trusted source for Amazon deals, reviews, and curated product
              picks.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {["Home", "Categories", "Deals", "About", "Contact"].map((link) => (
              <button
                type="button"
                key={link}
                className="hover:text-white transition-colors"
                style={{ color: "oklch(var(--footer-fg) / 0.7)" }}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { Icon: SiFacebook, label: "Facebook" },
              { Icon: SiX, label: "Twitter/X" },
              { Icon: SiInstagram, label: "Instagram" },
              { Icon: SiYoutube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <button
                type="button"
                key={label}
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "oklch(var(--footer-fg) / 0.7)",
                }}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-2 text-xs"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "oklch(var(--footer-fg) / 0.5)",
          }}
        >
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-center md:text-right">
            Amazon Associates Disclosure: We earn commissions from qualifying
            purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}
