import { config } from "../server/config.js";

console.log("Config check:", {
  hasOpenAI: !!config.openaiApiKey,
  hasTMDB: !!config.tmdbApiKey,
});
