import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search-bar";
import { MediaSelector } from "@/components/media-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Heart, Loader2, ArrowLeft } from "lucide-react";
import type { TMDBResult } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{title: string; mediaType: string} | null>(null);

  // Fetch TMDB results when search is initiated
  const { data: tmdbData, isLoading: isFetchingTMDB, error: tmdbError } = useQuery<{ results: TMDBResult[] }>({
    queryKey: ["/api/tmdb/search", searchQuery?.title, searchQuery?.mediaType],
    enabled: !!searchQuery,
    queryFn: async () => {
      if (!searchQuery) throw new Error("No search query");
      const params = new URLSearchParams({
        query: searchQuery.title,
        mediaType: searchQuery.mediaType,
      });
      const response = await fetch(`/api/tmdb/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to search TMDB");
      }
      return response.json();
    },
  });

  // Auto-selection and fallback effect
  useEffect(() => {
    if (!searchQuery || isFetchingTMDB) return;

    // If TMDB fails or returns no results, proceed directly to analysis
    if (tmdbError || (tmdbData && tmdbData.results.length === 0)) {
      const params = new URLSearchParams({
        title: searchQuery.title,
        mediaType: searchQuery.mediaType,
      });
      setLocation(`/results?${params.toString()}`);
      setIsSearching(false);
      setSearchQuery(null);
      return;
    }

    // AUTO-SELECTION: If exactly one result, automatically select it
    if (tmdbData && tmdbData.results.length === 1) {
      const result = tmdbData.results[0];
      const params = new URLSearchParams({
        title: result.title,
        mediaType: result.mediaType,
        tmdbId: result.tmdbId.toString(),
      });
      if (result.posterUrl) params.append("posterUrl", result.posterUrl);
      if (result.releaseYear) params.append("releaseYear", result.releaseYear);
      if (result.overview) params.append("overview", result.overview);

      setLocation(`/results?${params.toString()}`);
      setIsSearching(false);
      setSearchQuery(null);
    }
  }, [searchQuery, isFetchingTMDB, tmdbError, tmdbData, setLocation]);

  const handleSearch = (title: string, mediaType?: string, artist?: string) => {
    const finalMediaType = mediaType || "movie";

    // Books don't use TMDB - go directly to analysis
    if (finalMediaType === "book") {
      const params = new URLSearchParams({
        title,
        mediaType: finalMediaType,
      });
      setLocation(`/results?${params.toString()}`);
      return;
    }

    // Songs go directly to results page where iTunes search happens
    if (finalMediaType === "song") {
      const params = new URLSearchParams({
        title,
        mediaType: finalMediaType,
      });
      // Add artist parameter if provided
      if (artist) {
        params.append("artist", artist);
      }
      setLocation(`/results?${params.toString()}`);
      return;
    }

    // For other media types (movie, show, book), use TMDB search
    setIsSearching(true);
    setSearchQuery({ title, mediaType: finalMediaType });
  };

  const handleMediaSelect = (result: any) => {
    // Handle media selection (movies, shows, books)
    const params = new URLSearchParams({ 
      title: result.title,
      mediaType: result.mediaType,
      tmdbId: result.tmdbId.toString(),
    });
    if (result.posterUrl) params.append("posterUrl", result.posterUrl);
    if (result.releaseYear) params.append("releaseYear", result.releaseYear);
    if (result.overview) params.append("overview", result.overview);
    
    setLocation(`/results?${params.toString()}`);
    setIsSearching(false);
    setSearchQuery(null);
  };

  const handleSkipSelection = () => {
    if (!searchQuery) return;
    const params = new URLSearchParams({ 
      title: searchQuery.title,
      mediaType: searchQuery.mediaType,
    });
    setLocation(`/results?${params.toString()}`);
    setIsSearching(false);
    setSearchQuery(null);
  };

  // Show media selector if we're searching
  if (searchQuery) {
    // Still loading TMDB results
    if (isFetchingTMDB) {
      return (
        <div className="min-h-[calc(100vh-4rem)] py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Searching for titles...</p>
          </div>
        </div>
      );
    }

    // Single result auto-selection (handled by useEffect, but show briefly if still here)
    if (tmdbData?.results && tmdbData.results.length === 1) {
      const result = tmdbData.results[0];
      return (
        <div className="min-h-[calc(100vh-4rem)] py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Found exact match!</p>
              <p className="text-muted-foreground">
                Analyzing: <span className="font-medium text-foreground">{result.title}</span>
                {result.releaseYear && <span className="text-muted-foreground"> ({result.releaseYear})</span>}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // If we have TMDB results, show media selector
    if (tmdbData?.results && tmdbData.results.length > 0) {
      return (
        <div className="min-h-[calc(100vh-4rem)] py-8">
          <div className="container mx-auto px-6">
            <button
              onClick={() => {
                setSearchQuery(null);
                setIsSearching(false);
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              data-testid="button-back-to-search"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Search</span>
            </button>
          </div>
          <MediaSelector
            mediaType={searchQuery.mediaType}
            results={tmdbData.results} 
            onSelect={handleMediaSelect}
          />
          <div className="text-center mt-6">
            <button
              onClick={handleSkipSelection}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              data-testid="button-skip-selection"
            >
              Or continue without selecting a specific title
            </button>
          </div>
        </div>
      );
    }

    // Fallback handled by useEffect
    return null;
  }

  const trendingTitles = [
    { title: "The Chosen", type: "TV Show", score: 98 },
    { title: "Soul Surfer", type: "Movie", score: 92 },
    { title: "Wonder", type: "Movie", score: 88 },
    { title: "Unbroken", type: "Movie", score: 90 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative section-spacing-large overflow-hidden min-h-[85vh] flex items-center">
        {/* Background with Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

        {/* Abstract Light Aurora Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-center lg:text-left space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge
                    variant="outline"
                    className="gap-2 py-2 px-5 text-sm border-white/30 text-white bg-black/20 backdrop-blur-sm hover-elevate transition-all"
                    aria-label="Powered by FAiTH"
                  >
                    <Shield className="w-4 h-4" />
                    Powered by FAiTH
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl leading-tight">
                    SanctifAi
                  </h1>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/95 drop-shadow-lg leading-tight">
                    Discern What You Watch
                  </h2>
                </div>

                <p className="text-lg md:text-xl text-white/80 max-w-2xl lg:mx-0 mx-auto leading-relaxed">
                  Get Scripture-guided discernment scores and faith-based insights for movies, shows, books, and songs—before you hit play.
                </p>
              </div>

              <div className="pt-6 space-y-4">
                <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                <p className="text-sm md:text-base text-white/70 max-w-2xl lg:mx-0 mx-auto leading-relaxed">
                  <span className="font-medium text-white/90">How it works:</span> Search a title → SanctifAi analyzes themes, content, and Scripture alignment → you decide with confidence.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Preview Card (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block lg:col-span-5"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-chart-2/20 to-transparent rounded-3xl blur-3xl" />

                {/* Preview Card */}
                <div className="relative">
                  <div className="space-y-6">
                    {/* Mini Score Display */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <svg width="140" height="140" className="transform -rotate-90">
                          <circle
                            cx="70"
                            cy="70"
                            r="55"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="10"
                          />
                          <circle
                            cx="70"
                            cy="70"
                            r="55"
                            fill="none"
                            stroke="hsl(142, 71%, 45%)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 55}
                            strokeDashoffset={2 * Math.PI * 55 * (1 - 0.92)}
                            style={{
                              filter: 'drop-shadow(0 0 20px hsla(142, 71%, 45%, 0.6))',
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-white drop-shadow-lg">92</span>
                          <span className="text-xs text-white/70 font-medium">out of 100</span>
                        </div>
                      </div>
                      <div className="mt-4 px-4 py-1.5 rounded-full bg-green-500/20 border-2 border-green-500/30">
                        <span className="text-sm font-semibold text-white">Faith-Safe</span>
                      </div>
                    </div>

                    {/* Sample Title */}
                    <div className="text-center space-y-2 border-t border-white/10 pt-6">
                      <p className="text-white/90 font-medium">Instant Analysis</p>
                      <p className="text-sm text-white/60">Scripture-guided insights for every title</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            <Card className="rounded-2xl border-2 hover-elevate transition-all duration-300 hover:shadow-lg">
              <CardContent className="card-padding pt-6 md:pt-8 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="heading-3 mt-4">
                  Ai-Powered Analysis
                </h3>
                <p className="body-small text-muted-foreground mt-2">
                  Get comprehensive discernment scores (0-100) with detailed
                  faith-based analysis of content alignment with Christian values.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover-elevate transition-all duration-300 hover:shadow-lg">
              <CardContent className="card-padding pt-6 md:pt-8 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-chart-2/10 flex-shrink-0">
                  <Heart className="w-6 h-6 text-chart-2" />
                </div>
                <h3 className="heading-3 mt-4">
                  Scripture Guidance
                </h3>
                <p className="body-small text-muted-foreground mt-2">
                  Receive relevant Bible verses (NLT) that reflect the moral
                  themes and provide spiritual perspective on the content.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover-elevate transition-all duration-300 hover:shadow-lg">
              <CardContent className="card-padding pt-6 md:pt-8 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="heading-3 mt-4">
                  Faith-Safe Alternatives
                </h3>
                <p className="body-small text-muted-foreground mt-2">
                  Discover three uplifting, biblically-aligned alternatives with
                  clear reasons for each recommendation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center content-spacing mb-12">
              <h2 className="heading-1">
                Trending Faith-Safe Titles
              </h2>
              <p className="text-muted-foreground">
                Popular content that aligns with Christian values
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingTitles.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card
                    className="rounded-2xl hover-elevate active-elevate-2 cursor-pointer transition-all"
                    onClick={() => handleSearch(item.title)}
                    data-testid={`trending-card-${index}`}
                  >
                    <CardContent className="pt-6 pb-6 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold leading-tight">
                          {item.title}
                        </h4>
                        <Badge variant="outline" className="flex-shrink-0 text-xs border-primary/30 text-primary">
                          {item.score}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
