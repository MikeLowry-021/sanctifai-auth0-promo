import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

/**
 * QuickAuth: Guest-only header component
 * Authentication UI elements have been removed for guest-only mode
 */
export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-black/40 supports-[backdrop-filter]:bg-black/30">
      <div className="container flex h-16 items-center justify-between mx-auto px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center hover-elevate active-elevate-2 px-3 py-2 -ml-3 rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" tabIndex={0}>
            <img
              src="/logo-full.png"
              alt="SanctifAi Logo"
              className="h-8 w-auto"
            />
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" data-testid="link-search">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              Search
            </span>
          </Link>
          {/* My Library hidden in guest mode */}
          <Link href="/community" data-testid="link-community">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/community" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              Community
            </span>
          </Link>
          <Link href="/about" data-testid="link-about">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/about" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              About
            </span>
          </Link>
          <ThemeToggle />

          {/* QuickAuth: Guest Mode indicator */}
          <Button
            variant="outline"
            size="sm"
            disabled
            className="cursor-default"
          >
            Guest Mode
          </Button>
        </nav>
      </div>
    </header>
  );
}
