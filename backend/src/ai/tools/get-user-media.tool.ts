import { tool } from '@openrouter/agent';
import { z } from 'zod';

import { MediaService } from 'src/media/media.service';

export function createGetUserMediaTool(
  userId: number,
  mediaService: MediaService,
) {
  return tool({
    name: 'get_user_media',

    description:
      'Returns the authenticated user media collection, including titles, media type, watch status and favorite state. Use this when you need to understand the user taste, viewing history, favorites or watchlist.',

    inputSchema: z.object({}),

    execute: async () => {
      const collection = await mediaService.findAllByUser(userId);

      return collection.map((item) => ({
        title: item.media.title,
        type: item.media.type,
        status: item.status,
        favorite: item.favorite,
      }));
    },
  });
}
