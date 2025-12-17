import OpenAI from "openai";
import { config } from "./config";

/**
 * The shape of the discernment result returned by the AI.
 */
export interface DiscernmentAnalysis {
  discernmentScore: number;
  faithAnalysis: string;
  tags: string[];
  verseText: string;
  verseReference: string;
  alternatives: Array<{
    title: string;
    reason: string;
  }>;
}

/**
 * Build a rich prompt for the AI based on media metadata.
 */
function buildPrompt(
  title: string,
  mediaType: string = "movie",
  releaseYear?: string | null,
  overview?: string | null
): string {
  const isBook = mediaType === "book";
  let contextInfo = `"${title}" (a ${mediaType}`;

  if (releaseYear) {
    contextInfo += `, ${isBook ? "published" : "released"} ${releaseYear}`;
  }
  contextInfo += `)`;

  if (overview) {
    contextInfo += `\n\n${isBook ? "Synopsis" : "Plot Summary"}: ${overview}`;
  }

  const instructions = `
You are a Christian media discernment expert. Analyze ${contextInfo} and provide
a concise assessment from a biblical worldview.

**CRITICAL CONTEXT VS. KEYWORD DISTINCTION RULE:**
- If content mentions "God," "prayer," "blessings," or similar religious terms BUT the primary object of affection, devotion, or focus is a human being (indicated by terms like "baby," "girl," "boy," romantic longing, physical attraction, or relationship dynamics), you MUST classify it as SECULAR.
- Do NOT label such content as "Faith-Safe," "God-honoring," or "Christian" solely based on religious keywords when the core message is romantic or human-centered.
- Reserve scores of 85+ ONLY for content that is explicitly theocentric (focused on worship, gospel, or God as the primary subject).

Return your answer as **valid JSON** ONLY, with this exact shape:

{
  "discernmentScore": <number 0-100>,
  "faithAnalysis": "<2 short paragraphs, max 4-5 sentences total>",
  "tags": ["<short tag>", "..."],
  "verseText": "<Bible verse text, NLT>",
  "verseReference": "<Book chapter:verse (NLT)>",
  "alternatives": [
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" },
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" },
    { "title": "<title>", "reason": "<1 short sentence (max 15 words)>" }
  ]
}

**Scoring Guidelines:**
- 90-100: Explicitly Christian worship, gospel, or biblical content with God as the central focus
- 85-89: Faith-affirming content that aligns with Christian values and mentions God meaningfully
- 70-84: Clean secular content with positive moral messages (including clean romance)
- 60-79: Morally neutral content with minor concerns
- 40-59: Content with moderate moral issues or questionable themes
- 20-39: Content with significant moral problems
- 0-19: Content that directly contradicts Christian values

**Analysis Requirements:**
1. Identify the PRIMARY subject and theme of the content
2. Distinguish between incidental religious references and genuine spiritual focus
3. Evaluate moral cleanliness separate from religious classification
4. Provide specific examples from the content to support your assessment

In "faithAnalysis":
- Clearly state whether content is Christian/Gospel, Clean Secular, or contains concerning elements
- Briefly highlight any occult, sexual, violent, or anti‑biblical content
- Then give clear, pastoral guidance for Christians (no fear‑mongering)
  `;

  return instructions.trim();
}

/**
 * Create a Perplexity AI client in a safe, lazy way.
 * Returns null if API key is not available.
 *
 * MIGRATION NOTE: Changed from OpenAI to Perplexity API for real-time web access
 * Base URL: https://api.perplexity.ai
 * Model: sonar-pro (optimized for deep web research)
 */
function getPerplexityClient(): OpenAI | null {
  const apiKey = config.perplexityApiKey;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.perplexity.ai'
  });
}

/**
 * Call Perplexity AI and parse the JSON response into our DiscernmentAnalysis type.
 *
 * MIGRATION NOTE: Updated to use Perplexity API with real-time web search capabilities
 */
export async function analyzeMedia(
  title: string,
  mediaType: string = "movie",
  releaseYear?: string | null,
  overview?: string | null
): Promise<DiscernmentAnalysis> {
  const client = getPerplexityClient();

  if (!client) {
    return {
      discernmentScore: 50,
      faithAnalysis: "AI service is unavailable right now.",
      tags: ["service-unavailable"],
      verseText: "",
      verseReference: "",
      alternatives: [],
    };
  }

  const prompt = buildPrompt(title, mediaType, releaseYear, overview);

  console.log(
    `[Perplexity] Analyzing media: "${title}" (${mediaType}), year=${releaseYear ?? "N/A"}`
  );

  try {
    const completion = await client.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are an expert media analyst with real-time web access specializing in Christian discernment. Search for the specific title's parents guide, plot themes, lyrics (for songs), and reviews before generating the discernment score. CRITICAL: Distinguish between romantic/human-centered content and truly theocentric (God-focused) content. Do NOT give high scores to romantic love songs that merely mention God incidentally. Reserve 85+ scores ONLY for content where God is the primary subject of devotion. Be precise and cite sources. You must respond with valid JSON only. Do not include markdown formatting like ```json ... ```. Return only the raw JSON object.",
        },
        { role: "user", content: prompt },
      ],
    });

    console.log("[Usage Monitor] Model: sonar | Input Tokens:", completion.usage?.prompt_tokens, "| Output Tokens:", completion.usage?.completion_tokens);

    const rawContent = completion.choices[0]?.message?.content?.trim() ?? "";

    console.log("Raw Perplexity Output:", rawContent);

    let parsed: any;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawContent;

      console.log("[Perplexity] Extracted JSON:", cleanJson.substring(0, 200) + "...");

      parsed = JSON.parse(cleanJson);

      console.log("[Perplexity] Successfully parsed JSON with score:", parsed.discernmentScore);
    } catch (err) {
      console.error("[Perplexity] Failed to parse JSON response.");
      console.error("[Perplexity] Raw content:", rawContent);
      console.error("[Perplexity] Parse error:", err);
      console.error("Analysis Error Details:", err);
      throw new Error("Failed to parse Perplexity JSON response");
    }

    let verseText = "";
    let verseReference = "";

    try {
      verseText = String(parsed.verseText ?? "");
      verseReference = String(parsed.verseReference ?? "");

      if (!verseText && !verseReference) {
        console.log("[Scripture] No Bible verses provided in analysis response");
      }
    } catch (scriptureError) {
      console.error("[Scripture] Failed to extract Bible verses:", scriptureError);
      verseText = "";
      verseReference = "";
    }

    const result: DiscernmentAnalysis = {
      discernmentScore: Number(parsed.discernmentScore ?? 50),
      faithAnalysis: String(parsed.faithAnalysis ?? "No analysis was provided."),
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t: any) => String(t))
        : [],
      verseText: verseText,
      verseReference: verseReference,
      alternatives: Array.isArray(parsed.alternatives)
        ? parsed.alternatives.map((alt: any) => ({
            title: String(alt?.title ?? ""),
            reason: String(alt?.reason ?? ""),
          }))
        : [],
    };

    console.log("[Perplexity] Analysis complete. Final score:", result.discernmentScore);

    return result;
  } catch (error) {
    console.error("[Perplexity] Error while analyzing media:", error);
    console.error("Analysis Error Details:", error);

    return {
      discernmentScore: 50,
      faithAnalysis:
        "We encountered an issue while generating a full discernment analysis for this title. Please try again later, or use prayerful wisdom and biblical principles as you decide whether to watch or read this content.",
      tags: ["analysis-error"],
      verseText: "",
      verseReference: "",
      alternatives: [],
    };
  }
}

/**
 * Placeholder IMDB fetcher – not used by routes yet,
 * but exported to keep the original API surface.
 */
export async function fetchIMDBData(title: string) {
  console.log("[Perplexity] fetchIMDBData stub called for title:", title);

  return {
    imdbRating: undefined,
    genre: undefined,
    description: undefined,
    posterUrl: undefined,
    trailerUrl: undefined,
  };
}
