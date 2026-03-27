import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">
            The Daily <span className="text-primary">Finder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md hover:bg-accent transition-colors"
            data-ocid="nav.link"
          >
            Home
          </Link>
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md hover:bg-accent transition-colors"
            data-ocid="nav.link"
          >
            Categories <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md hover:bg-accent transition-colors"
            data-ocid="nav.link"
          >
            Deals
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md hover:bg-accent transition-colors"
            data-ocid="nav.link"
          >
            About
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search products..."
                className="w-56 h-8 text-sm"
                data-ocid="header.search_input"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              data-ocid="header.search_input"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
          <Link to="/admin" className="hidden md:block" data-ocid="nav.link">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-primary text-primary hover:bg-accent"
            >
              Admin
            </Button>
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="header.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            className="py-2 text-sm font-medium"
            data-ocid="nav.link"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <button type="button" className="text-left py-2 text-sm font-medium">
            Categories
          </button>
          <button type="button" className="text-left py-2 text-sm font-medium">
            Deals
          </button>
          <button type="button" className="text-left py-2 text-sm font-medium">
            About
          </button>
          <Link
            to="/admin"
            className="py-2 text-sm font-medium text-primary"
            data-ocid="nav.link"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
