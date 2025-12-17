import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Film, Tv, Gamepad2, Music, Info } from "lucide-react";
import type { TMDBResult } from "@shared/schema";

interface MediaSelectorProps {
  results: any[];
  onSelect: (result: any) => void;
  mediaType?: string;
}

export function MediaSelector({ results, onSelect, mediaType }: MediaSelectorProps) {
  const isSong = mediaType === "song";
  const isMovieOrShow = mediaType === "movie" || mediaType === "show";
  
  const getIcon = (type: string) => {
    switch (type) {
      case "show":
        return <Tv className="w-4 h-4" />;
      case "game":
        return <Gamepad2 className="w-4 h-4" />;
      case "song":
        return <Music className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Select Your Title
        </h2>
        <p className="text-muted-foreground">
          Multiple options found. Choose the exact title you want to analyze.
        </p>
      </div>

      {/* Step 1 Instruction - Only for Movies/Shows */}
      {isMovieOrShow && (
        <Alert className="mb-6 border-2 border-primary/20 bg-primary/5">
          <Info className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2 text-base font-medium">
            <span className="inline-flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold">1</span>
              <span>Select the exact movie or show you meant.</span>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((result, index) => {
          const imageUrl = isSong ? result.artwork : result.posterUrl;
          const displayType = isSong ? "song" : result.mediaType;
          const subtitle = isSong ? result.artist : null;
          
          return (
            <Card
              key={isSong ? result.id : result.tmdbId}
              className="cursor-pointer hover-elevate active-elevate-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.03] focus-within:ring-2 focus-within:ring-ring"
              onClick={() => onSelect(result)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(result)}
              data-testid={`media-option-${index}`}
              tabIndex={0}
              role="button"
              aria-label={`Select ${result.title}`}
            >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="aspect-[2/3] relative bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={result.title}
                      className="w-full h-full object-cover rounded-t-md"
                      data-testid={`img-poster-${index}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getIcon(displayType)}
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-sm line-clamp-2 mb-1.5 min-h-[2.5rem]"
                    data-testid={`text-title-${index}`}
                    title={result.title}
                  >
                    {result.title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2" title={subtitle}>
                      {subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap mt-auto">
                    {result.releaseYear && (
                      <span className="text-xs text-muted-foreground font-medium" data-testid={`text-year-${index}`}>
                        {result.releaseYear}
                      </span>
                    )}
                    <Badge variant="secondary" className="text-xs px-2 py-0.5" data-testid={`badge-type-${index}`}>
                      {displayType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
