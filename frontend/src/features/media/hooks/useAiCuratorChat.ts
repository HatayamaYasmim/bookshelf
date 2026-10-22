import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { sendAiChatMessage } from '../api/ai.api';

export interface CuratorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAiCuratorChat() {
  const [messages, setMessages] = useState<CuratorMessage[]>([]);

  const mutation = useMutation({
    mutationFn: sendAiChatMessage,

    onSuccess: (response) => {
      setMessages((current) => [
        ...current,

        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
        },
      ]);
    },
  });

  function sendMessage(message: string) {
    const content = message.trim();

    if (!content || mutation.isPending) {
      return;
    }

    setMessages((current) => [
      ...current,

      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
    ]);

    mutation.mutate(content);
  }

  return {
    messages,

    sendMessage,

    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
