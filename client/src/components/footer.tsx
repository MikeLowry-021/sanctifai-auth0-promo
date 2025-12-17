import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6 space-y-3">
        <div className="w-full flex justify-center mb-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground/80"
            aria-label="Powered by FAiTH"
            title="Powered by FAiTH"
          >
            <Shield className="w-3.5 h-3.5" />
            Powered by FAiTH
          </span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          SanctifAi © 2025 · Discern What You Watch.
        </p>
        <p className="text-center text-xs text-muted-foreground/70 max-w-3xl mx-auto leading-relaxed">
          Scripture quotations marked (NLT) are taken from the Holy Bible, New Living Translation, 
          copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, 
          Carol Stream, Illinois 60188. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
