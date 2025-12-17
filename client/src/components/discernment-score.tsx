import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DiscernmentScoreProps {
  score: number;
  thresholds?: {
    faithSafe: number;
    caution: number;
  };
}

export function DiscernmentScore({
  score,
  thresholds = { faithSafe: 85, caution: 65 }
}: DiscernmentScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = score / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setDisplayScore(Math.min(Math.round(currentStep * stepValue), score));
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [score]);

  const getScoreColor = () => {
    if (score >= thresholds.faithSafe) return "hsl(142 71% 45%)"; // Green for faith-safe
    if (score >= thresholds.caution) return "hsl(45 93% 47%)"; // Amber for caution
    return "hsl(0 84% 60%)"; // Red for concern
  };

  const getScoreGradient = () => {
    if (score >= thresholds.faithSafe) return "from-green-500/20 via-green-400/10 to-transparent";
    if (score >= thresholds.caution) return "from-amber-500/20 via-amber-400/10 to-transparent";
    return "from-red-500/20 via-red-400/10 to-transparent";
  };

  const getScoreRing = () => {
    if (score >= thresholds.faithSafe) return "ring-green-500/20";
    if (score >= thresholds.caution) return "ring-amber-500/20";
    return "ring-red-500/20";
  };

  const getScoreLabel = () => {
    if (score >= thresholds.faithSafe) return "Faith-Safe";
    if (score >= thresholds.caution) return "Caution";
    return "Concern";
  };

  const getScoreGlow = () => {
    if (score >= thresholds.faithSafe) return "0 0 40px hsla(142, 71%, 45%, 0.4), 0 0 80px hsla(142, 71%, 45%, 0.2)";
    if (score >= thresholds.caution) return "0 0 40px hsla(45, 93%, 47%, 0.4), 0 0 80px hsla(45, 93%, 47%, 0.2)";
    return "0 0 40px hsla(0, 84%, 60%, 0.4), 0 0 80px hsla(0, 84%, 60%, 0.2)";
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
      data-testid="discernment-score"
    >
      {/* Decorative gradient background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`absolute inset-0 bg-gradient-to-b ${getScoreGradient()} blur-3xl -z-10`}
      />

      {/* Score circle with enhanced styling */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative ring-8 ${getScoreRing()} rounded-full p-4`}
      >
        <svg width="180" height="180" className="transform -rotate-90">
          {/* Background segment hints */}
          <defs>
            <linearGradient id="segmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity="0.15" />
              <stop offset={`${thresholds.caution - 1}%`} stopColor="hsl(0, 84%, 60%)" stopOpacity="0.15" />
              <stop offset={`${thresholds.caution}%`} stopColor="hsl(45, 93%, 47%)" stopOpacity="0.15" />
              <stop offset={`${thresholds.faithSafe - 1}%`} stopColor="hsl(45, 93%, 47%)" stopOpacity="0.15" />
              <stop offset={`${thresholds.faithSafe}%`} stopColor="hsl(142, 71%, 45%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Base track with segment gradient */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="url(#segmentGradient)"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            opacity="0.5"
          />
          {/* Animated score arc with glow */}
          <motion.circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(${getScoreGlow()})`,
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Score display with pulse effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-6xl font-heading font-bold"
            style={{ color: getScoreColor(), textShadow: `0 2px 20px ${getScoreColor()}40` }}
            data-testid="text-score-value"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            {displayScore}
          </motion.span>
          <motion.span
            className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            out of 100
          </motion.span>
        </div>
      </motion.div>

      {/* Label with pill background */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center space-y-3"
      >
        <div
          className="inline-flex items-center px-6 py-2.5 rounded-full font-semibold text-base shadow-lg"
          style={{
            backgroundColor: `${getScoreColor()}15`,
            color: getScoreColor(),
            border: `2px solid ${getScoreColor()}30`,
          }}
          data-testid="text-score-label"
        >
          {getScoreLabel()}
        </div>
        <p className="text-sm text-muted-foreground">SanctifAi Discernment Score</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          0–{thresholds.caution - 1}: Strong concerns · {thresholds.caution}–{thresholds.faithSafe - 1}: Mixed content · {thresholds.faithSafe}–100: Faith-safe
        </p>
      </motion.div>
    </motion.div>
  );
}
