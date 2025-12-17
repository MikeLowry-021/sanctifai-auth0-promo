// client/src/lib/rules.ts
export type Rule = {
  id: string;
  title: string;
  description: string;
  category: "theology" | "ethics" | "content";
  weight: number; // negative or positive
  anchors: string[];
};

export const RULES: Rule[] = [
  // paste the same objects you have in YAML, translated to TS objects
  // … include your doctrine rules …
  {
    id: "explicit-language",
    title: "Avoid profane and coarse language",
    description: "Song contains profanity or coarse talk.",
    category: "ethics",
    weight: -8,
    anchors: ["Ephesians 4:29", "Colossians 3:8", "James 3:10"],
  },
  // … include the rest of the lyrics rules you added …
];
