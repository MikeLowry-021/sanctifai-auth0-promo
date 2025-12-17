/**
 * Manual lyrics provider (fallback)
 * User-provided lyrics for testing or when API unavailable
 */

import type { LyricsProvider, LyricsResult } from './index';

export class ManualProvider implements LyricsProvider {
  name = 'manual';

  async search(artist: string, title: string): Promise<LyricsResult | null> {
    // Manual provider doesn't search - only used when lyrics are directly provided
    return null;
  }

  createResult(lyrics: string, artist?: string, title?: string): LyricsResult {
    return {
      lyrics,
      provider: this.name,
      cached: false,
      trackMeta: artist && title ? {
        title,
        artist,
      } : undefined,
    };
  }
}
