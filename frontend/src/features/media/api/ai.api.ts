import { apiJson } from '../../../services/api';

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  message: string;
}

export function sendAiChatMessage(message: string): Promise<AiChatResponse> {
  return apiJson<AiChatResponse>('/ai/chat', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      message,
    }),
  });
}
