import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { OpenRouter } from '@openrouter/sdk';

@Injectable()
export class OpenRouterService {
  private readonly client: OpenRouter;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    this.model =  this.configService.get<string>('OPENROUTER_MODEL') ?? 'openrouter/free';

    this.client = new OpenRouter({
      apiKey,
    });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.send({
        chatRequest: {
          model: this.model,

          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],

          stream: false,
        },
      });

      if (!('choices' in response)) {
        throw new InternalServerErrorException(
          'OpenRouter returned an invalid response',
        );
      }

      const content = response.choices[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        throw new InternalServerErrorException(
          'OpenRouter returned an empty response',
        );
      }

      return content;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number(error.status)
        : undefined;

    if (status === 401 || status === 403) {
      throw new InternalServerErrorException(
        'OpenRouter authentication failed',
      );
    }

    if (status === 429) {
      throw new HttpException(
        'OpenRouter rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (status === 503) {
      throw new ServiceUnavailableException(
        'OpenRouter is temporarily unavailable',
      );
    }

    if (error instanceof InternalServerErrorException) {
      throw error;
    }

    throw new ServiceUnavailableException(
      'Unable to communicate with OpenRouter',
    );
  }
}
