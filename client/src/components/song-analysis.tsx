import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Music, AlertCircle, ScrollText } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { DiscernmentScore } from "@/components/discernment-score";
import { motion } from "framer-motion";

interface SongAnalysisProps {
  title: string;
  artist: string;
  artwork?: string;
  album?: string;
}

interface LyricsAnalysisResult {
  meta: {
    title: string;
    artist: string;
  };
  lyricsAvailable: boolean;
  provider?: string;
  cached?: boolean;
  message?: string;
  analysis?: {
    signals: any[];
    score: {
      total: number;
      hits: Array<{
        category: string;
        severity: string;
        description: string;
        refs: string[];
      }>;
    };
    verses: Record<string, { text: string; translation: string }>;
  };
}

export function SongAnalysis({ title, artist, artwork, album }: SongAnalysisProps) {
  const [showLyricsInput, setShowLyricsInput] = useState(false);
  const [manualLyrics, setManualLyrics] = useState("");

  // Only fetch if we have both title and artist
  const shouldFetch = !!title && !!artist;

  const { data, isLoading, error } = useQuery<LyricsAnalysisResult>({
    queryKey: ["/api/analyze/lyrics", artist, title],
    enabled: shouldFetch,
    queryFn: async () => {
      const response = await fetch("/api/analyze/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist, title }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze lyrics");
      }

      return response.json();
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (lyrics: string) => {
      const response = await fetch("/api/analyze/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist, title, rawLyrics: lyrics }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze lyrics");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analyze/lyrics", artist, title] });
      setShowLyricsInput(false);
      setManualLyrics("");
    },
  });

  const handleAnalyzeManualLyrics = () => {
    if (manualLyrics.trim()) {
      analyzeMutation.mutate(manualLyrics);
    }
  };



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground">Analyzing song lyrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">Failed to analyze song. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  // Show manual input if no artist or no data fetched
  if (!shouldFetch || !data || !data.lyricsAvailable || showLyricsInput) {
    return (
      <div className="content-spacing">
        {/* Page Heading */}
        <div className="text-center space-y-2">
          <h1 className="heading-1">
            Analyze a Song with Lyrics
          </h1>
        </div>

        {artwork && (
          <div className="flex items-center gap-4">
            <img src={artwork} alt={title} className="w-24 h-24 rounded-md shadow-lg" />
            <div>
              <h2 className="heading-2">{title}</h2>
              <p className="body-large text-muted-foreground">{artist}</p>
              {album && <p className="body-small text-muted-foreground">{album}</p>}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5" />
              Paste Lyrics for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="content-spacing">
            <p className="body-small text-muted-foreground">
              {!shouldFetch
                ? "If we couldn't automatically find lyrics for this song, paste them below to continue the analysis."
                : data?.message || "If we couldn't automatically find lyrics for this song, paste them below to continue the analysis."}
            </p>
            <Textarea
              placeholder="Paste song lyrics here..."
              value={manualLyrics}
              onChange={(e) => setManualLyrics(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              data-testid="textarea-manual-lyrics"
            />
            <p className="body-small text-muted-foreground">
              Paste the lyrics (or most important verses) of the song. SanctifAi will evaluate themes and spiritual alignment based on this text.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyzeManualLyrics}
                disabled={!manualLyrics.trim() || analyzeMutation.isPending}
                data-testid="button-analyze-lyrics"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Lyrics"
                )}
              </Button>
              {showLyricsInput && (
                <Button variant="outline" onClick={() => setShowLyricsInput(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { analysis } = data;
  if (!analysis) return null;

  return (
    <div className="content-spacing-large">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Song Info */}
        <div className="lg:col-span-1 space-y-6">
          {artwork && (
            <div className="flex justify-center">
              <img src={artwork} alt={title} className="w-64 h-64 rounded-xl shadow-xl" />
            </div>
          )}
          <Card className="rounded-2xl border-2">
            <CardContent className="pt-6 pb-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-5 h-5 text-primary" />
                  <h1 className="heading-2">{title}</h1>
                </div>
                <p className="body-large text-muted-foreground">{artist}</p>
                {album && <p className="body-small text-muted-foreground mt-1">{album}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <Music className="w-3 h-3 mr-1" />
                  Song
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Discernment Analysis */}
        <div className="lg:col-span-2 content-spacing-large">
          {/* Discernment Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="rounded-2xl border-0 bg-transparent">
              <CardContent className="pt-6 pb-6 flex justify-center">
                <DiscernmentScore
                  score={analysis.score.total}
                  thresholds={{ faithSafe: 80, caution: 50 }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Analysis */}
          <Card className="rounded-2xl border-0 bg-transparent">
            <CardContent className="card-padding content-spacing">
              <h2 className="heading-3">
                Content Analysis
              </h2>

              {/* Score-based explanation */}
              <p className="body-base text-muted-foreground leading-relaxed">
                {analysis.score.total >= 80
                  ? "Lyrics are clearly God-honoring with worship, gratitude, or Christ-centered themes. No explicit or blasphemous language was detected."
                  : analysis.score.total < 50
                  ? "Lyrics contain strong content concerns such as explicit language, sexual themes, or similar. This song is unlikely to be spiritually helpful."
                  : "Lyrics are mostly secular or mixed in theme. No major explicit content detected, but the song isn't clearly worshipful. Pray and use personal discernment in your context."}
              </p>

              {/* Content concerns/hits */}
              {analysis.score.hits.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Detected Signals:
                  </p>
                  {analysis.score.hits.map((hit, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{hit.category}</Badge>
                        <Badge variant={hit.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                          {hit.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{hit.description}</p>
                      {hit.refs.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {hit.refs.map((ref) => {
                            const verse = analysis.verses[ref];
                            if (!verse) return null;
                            return (
                              <div key={ref} className="bg-muted/50 p-3 rounded-md">
                                <p className="text-sm font-medium text-primary mb-1">{ref}</p>
                                <p className="text-sm italic">{verse.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Input Option */}
      <div className="text-center mt-8">
        <Button variant="outline" onClick={() => setShowLyricsInput(true)} data-testid="button-re-analyze">
          Re-analyze with Different Lyrics
        </Button>
      </div>
    </div>
  );
}
