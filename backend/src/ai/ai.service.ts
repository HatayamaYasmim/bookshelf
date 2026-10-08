import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { MediaService } from 'src/media/media.service';
import { TmdbService } from 'src/tmdb/tmdb.service';

type AiRecommendation = {
  title: string;
  type: 'MOVIE' | 'TV';
};

type AiRecommendationResponse = {
  recommendations: AiRecommendation[];
};

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly mediaService: MediaService,
    private readonly tmdbService: TmdbService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.ai = new GoogleGenAI({
      apiKey,
    });
  }

  async generateMediaProfile(userId: number) {
    const collection = await this.mediaService.findAllByUser(userId);

    if (collection.length === 0) {
      throw new BadRequestException(
        'Add some movies or TV series before generating your taste profile',
      );
    }

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

    const preferences = {
      favorites,
      watched,
      watching,
      watchlist,
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: `
Analyze the user's movie and TV preferences using only the collection data below.

Collection:
${JSON.stringify(preferences, null, 2)}

Use these signals with different importance:

1. Favorites are the strongest preference signal.
2. Watched titles are a strong signal.
3. Currently watching titles are a moderate signal.
4. Watchlist titles indicate curiosity or future interest and should have lower weight.

Do not recommend titles yet.
Do not invent information about titles that are not present in the collection.

Generate a concise taste profile describing the user's likely genre, theme and mood preferences.
        `,

        config: {
          temperature: 0.2,

          responseMimeType: 'application/json',

          responseSchema: {
            type: 'object',

            properties: {
              summary: {
                type: 'string',
              },

              genres: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              themes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              mood: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },

            required: ['summary', 'genres', 'themes', 'mood'],
          },
        },
      });

      if (!response.text) {
        throw new Error('Gemini returned an empty response');
      }

      return JSON.parse(response.text);
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

    const preferences = {
      favorites,
      watched,
      watching,
      watchlist,
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: `
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
- Do not explain the recommendations yet.
`,

        config: {
          temperature: 0.7,

          responseMimeType: 'application/json',

          responseSchema: {
            type: 'object',

            properties: {
              profile: {
                type: 'object',

                properties: {
                  summary: {
                    type: 'string',
                  },

                  genres: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },

                  themes: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },

                  mood: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },

                required: ['summary', 'genres', 'themes', 'mood'],
              },

              recommendations: {
                type: 'array',

                items: {
                  type: 'object',

                  properties: {
                    title: {
                      type: 'string',
                    },

                    type: {
                      type: 'string',
                      enum: ['MOVIE', 'TV'],
                    },
                  },

                  required: ['title', 'type'],
                },
              },
            },

            required: ['profile', 'recommendations'],
          },
        },
      });

      if (!response.text) {
        throw new Error('Gemini returned an empty response');
      }

      const aiResult = JSON.parse(response.text) as {
        profile: {
          summary: string;
          genres: string[];
          themes: string[];
          mood: string[];
        };

        recommendations: {
          title: string;
          type: 'MOVIE' | 'TV';
        }[];
      };

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

  private handleAiError(error: unknown): never {
    console.error('AI service error:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
      if (error.status === 429) {
        throw new HttpException(
          'AI request limit reached. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (error.status === 503) {
        throw new ServiceUnavailableException(
          'AI service is temporarily busy. Please try again in a few moments.',
        );
      }
    }

    throw new ServiceUnavailableException(
      'AI service is temporarily unavailable.',
    );
  }
}
