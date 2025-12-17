import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { VerseReflection } from "@shared/schema";

interface VerseCardProps {
  verse: VerseReflection;
}

export function VerseCard({ verse }: VerseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card
        className="relative overflow-hidden rounded-2xl border-2 border-primary/20 card-padding"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--chart-2) / 0.05) 100%)",
        }}
        data-testid="verse-card"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                Verse Reflection (NLT)
              </h3>
              <blockquote className="body-large font-serif italic text-foreground" data-testid="text-verse">
                "{verse.text}"
              </blockquote>
            </div>
            <p className="text-sm font-medium text-muted-foreground" data-testid="text-verse-reference">
              — {verse.reference}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
