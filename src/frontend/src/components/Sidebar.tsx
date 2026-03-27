import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const POPULAR_POSTS = [
  { title: "Top 10 Wireless Headphones of 2026", date: "Mar 20, 2026" },
  { title: "Best Budget Laptops Under $500", date: "Mar 15, 2026" },
  { title: "Smart Home Starter Kit Guide", date: "Mar 10, 2026" },
  { title: "Outdoor Gear for Spring 2026", date: "Mar 5, 2026" },
  { title: "Kitchen Essentials Worth Buying", date: "Feb 28, 2026" },
];

export default function Sidebar() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return;
    toast.success("Thanks for subscribing! Check your inbox.");
    setEmail("");
  };

  return (
    <aside className="flex flex-col gap-6" data-ocid="sidebar.panel">
      {/* Popular Posts */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="font-bold text-base text-foreground mb-4">
          Popular Posts
        </h3>
        <ul className="flex flex-col gap-3">
          {POPULAR_POSTS.map((post, i) => (
            <li
              key={post.title}
              className="flex items-start gap-2 group cursor-pointer"
              data-ocid={`sidebar.item.${i + 1}`}
            >
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {post.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="font-bold text-base text-foreground mb-1">
          Stay Updated
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Get the best deals delivered to your inbox every week.
        </p>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm"
            data-ocid="sidebar.input"
          />
          <Button
            onClick={handleSubscribe}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-semibold"
            data-ocid="sidebar.submit_button"
          >
            Subscribe Now
          </Button>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-accent rounded-xl border border-border p-5">
        <h3 className="font-bold text-sm text-accent-foreground mb-2">
          💡 Pro Tip
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enable Amazon price alerts to never miss a flash deal on your wishlist
          items.
        </p>
      </div>

      {/* Affiliate Disclosure */}
      <div className="bg-secondary rounded-xl border border-border p-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Affiliate Disclosure
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          As an Amazon Associate, we earn from qualifying purchases. This site
          participates in the Amazon Services LLC Associates Program.
        </p>
      </div>
    </aside>
  );
}
