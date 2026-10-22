import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenRouter, stepCountIs } from '@openrouter/agent';

import { MediaService } from 'src/media/media.service';

import { createGetUserMediaTool } from './tools/get-user-media.tool';

@Injectable()
export class AiCuratorService {
  private readonly client: OpenRouter;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mediaService: MediaService,
  ) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    this.model =
      this.configService.get<string>('OPENROUTER_MODEL') ?? 'openrouter/free';

    this.client = new OpenRouter({
      apiKey,
    });
  }

  async chat(userId: number, message: string) {
    const getUserMedia = createGetUserMediaTool(userId, this.mediaService);

    const result = this.client.callModel({
      model: this.model,

      input: message,
      instructions: `
You are the Bookshelf intelligent curator.
Your job is to help the user decide what movie or TV series to watch.
Important rules:

- Talk naturally with the user.
- Ask questions when the user's request is too vague.
- Use tools only when they provide useful information.
- Use get_user_media when you need to understand the user's taste, favorites, viewing history or watchlist.
- Never claim to know information about the user's collection unless you obtained it through a tool.
- Do not invent user preferences.
- Do not modify the user's collection.

Response style:

- Keep responses concise and conversational.
- Prefer short paragraphs.
- Recommend at most 3 titles unless the user asks for more.
- When recommending titles, use a numbered Markdown list.
- Highlight movie and TV titles in bold.
- Give only a short reason for each recommendation.
- Avoid long introductions.
- Do not repeat the user's request unnecessarily.
`,

      tools: [getUserMedia],

      stopWhen: stepCountIs(5),
    });

    const text = await result.getText();

    return {
      message: text,
    };
  }
}
