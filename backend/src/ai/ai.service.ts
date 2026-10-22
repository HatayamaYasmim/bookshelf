import {
  BadRequestException,
  HttpException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { MediaService } from 'src/media/media.service';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { OpenRouterService } from './openrouter.service';

type MediaTasteProfile = {
  summary: string;
  genres: string[];
  themes: string[];
  mood: string[];
};

type AiRecommendation = {
  title: string;
  type: 'MOVIE' | 'TV';
};

type AiRecommendationsResult = {
  profile: MediaTasteProfile;
  recommendations: AiRecommendation[];
};

@Injectable()
export class AiService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly tmdbService: TmdbService,
    private readonly openRouterService: OpenRouterService,
  ) {}

  async generateMediaProfile(userId: number) {
    const collection = await this.mediaService.findAllByUser(userId);

    if (collection.length === 0) {
      throw new BadRequestException(
        'Add some movies or TV series before generating your taste profile',
      );
    }

    const preferences = this.buildPreferences(collection);

    try {
      const response = await this.openRouterService.generate(`
Analyze the user's movie and TV preferences using only the collection data below.

Collection:
${JSON.stringify(preferences, null, 2)}

Use these signals with different importance:

1. Favorites are the strongest preference signal.
2. Watched titles are a strong signal.
3. Currently watching titles are a moderate signal.
4. Watchlist titles indicate curiosity or future interest and should have lower weight.

Rules:
- Do not recommend titles yet.
- Do not invent information about titles that are not present in the collection.
- Generate a concise taste profile describing the user's likely genre, theme and mood preferences.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the JSON in code fences.

Return exactly this structure:

{
  "summary": "string",
  "genres": ["string"],
  "themes": ["string"],
  "mood": ["string"]
}
`);

      return this.parseJsonResponse<MediaTasteProfile>(response);
    } catch (error) {
      this.handleAiError(error);
    }
  }

  async generateRecommendations(userId: number) {
    const collection = await this.mediaService.findAllByUser(userId);

    if (collection.length === 0) {
      throw new BadRequestException(
        'Add some movies or TV series before generating recommendations',
      );
    }

    const preferences = this.buildPreferences(collection);

    try {
      const response = await this.openRouterService.generate(`
Analyze the user's movie and TV preferences using the collection below.

Collection:
${JSON.stringify(preferences, null, 2)}

Use these signals with different importance:

1. Favorites are the strongest preference signal.
2. Watched titles are a strong signal.
3. Currently watching titles are a moderate signal.
4. Watchlist titles indicate curiosity or future interest and should have lower weight.

Your response must contain:

1. A concise taste profile with:
   - summary
   - genres
   - themes
   - mood

2. Fifteen movie or TV series recommendations that match this profile.

Rules:
- Return only real movies or TV series.
- Do not recommend anything already present in the collection above.
- Include a mix of movies and TV series when appropriate.
- Prefer recommendations that strongly match the user's genres, themes and mood.
- Do not explain the recommendations.
- Return exactly 15 recommendations when possible.
- The type must be exactly "MOVIE" or "TV".
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the JSON in code fences.

Return exactly this structure:

{
  "profile": {
    "summary": "string",
    "genres": ["string"],
    "themes": ["string"],
    "mood": ["string"]
  },
  "recommendations": [
    {
      "title": "string",
      "type": "MOVIE"
    }
  ]
}
`);

      const aiResult =
        this.parseJsonResponse<AiRecommendationsResult>(response);

      const validated = await Promise.all(
        aiResult.recommendations.map((suggestion) =>
          this.tmdbService.findSuggestedMedia(
            suggestion.title,
            suggestion.type,
          ),
        ),
      );

      const existingMedia = new Set(
        collection.map((item) => `${item.media.type}:${item.media.tmdbId}`),
      );

      const recommendations = validated
        .filter((item) => item !== null)
        .filter((item) => !existingMedia.has(`${item.type}:${item.tmdbId}`));

      const uniqueRecommendations = Array.from(
        new Map(
          recommendations.map((item) => [`${item.type}:${item.tmdbId}`, item]),
        ).values(),
      );

      return {
        profile: aiResult.profile,
        recommendations: uniqueRecommendations.slice(0, 10),
      };
    } catch (error) {
      this.handleAiError(error);
    }
  }

  private buildPreferences(
    collection: Awaited<ReturnType<MediaService['findAllByUser']>>,
  ) {
    const favorites = collection
      .filter((item) => item.favorite)
      .map((item) => `${item.media.title} (${item.media.type})`);

    const watched = collection
      .filter((item) => item.status === 'WATCHED')
      .map((item) => `${item.media.title} (${item.media.type})`);

    const watching = collection
      .filter((item) => item.status === 'WATCHING')
      .map((item) => `${item.media.title} (${item.media.type})`);

    const watchlist = collection
      .filter((item) => item.status === 'WATCHLIST')
      .map((item) => `${item.media.title} (${item.media.type})`);

    return {
      favorites,
      watched,
      watching,
      watchlist,
    };
  }

  private parseJsonResponse<T>(response: string): T {
    try {
      const cleaned = response
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      return JSON.parse(cleaned) as T;
    } catch {
      console.error('Invalid AI JSON response:', response);

      throw new ServiceUnavailableException('AI returned an invalid response.');
    }
  }

  private handleAiError(error: unknown): never {
    console.error('AI service error:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new ServiceUnavailableException(
      'AI service is temporarily unavailable.',
    );
  }
}
