import { useState } from 'react';

import { Button, Drawer, Group, Loader, ScrollArea, Stack, Text, Textarea } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BsStars } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { useAiCuratorChat } from '../hooks/useAiCuratorChat';

interface AiCuratorDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function AiCuratorDrawer({ opened, onClose }: AiCuratorDrawerProps) {
  const { t } = useTranslation();

  const [message, setMessage] = useState('');

  const { messages, sendMessage, isPending, isError } = useAiCuratorChat();

  function handleSend() {
    const content = message.trim();

    if (!content || isPending) {
      return;
    }

    sendMessage(content);

    setMessage('');
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      handleSend();
    }
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <Group gap="xs">
          <BsStars size={17} color="var(--bookshelf-primary)" />

          <Text fw={600}>{t('media.ai.agent.title')}</Text>
        </Group>
      }
      overlayProps={{
        backgroundOpacity: 0.45,
        blur: 2,
      }}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
        },

        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        },
      }}
    >
      <Stack
        gap="md"
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <ScrollArea
          style={{
            flex: 1,
            minHeight: 0,
          }}
        >
          <Stack gap="md" pr="xs">
            {messages.length === 0 && (
              <>
                <Text
                  size="sm"
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  {t('media.ai.agent.welcome')}
                </Text>

                <Text size="xs" c="dimmed">
                  {t('media.ai.agent.hint')}
                </Text>
              </>
            )}

            {messages.map((item) => (
              <Group key={item.id} justify={item.role === 'user' ? 'flex-end' : 'flex-start'}>
                <Stack
                  gap={2}
                  maw="85%"
                  className={
                    item.role === 'user'
                      ? 'bookshelf-ai-message-user'
                      : 'bookshelf-ai-message-assistant'
                  }
                >
                  <div className="bookshelf-ai-message-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                  </div>
                </Stack>
              </Group>
            ))}

            {isPending && (
              <Group gap="xs">
                <Loader size="xs" />

                <Text size="xs" c="dimmed">
                  {t('media.ai.agent.thinking')}
                </Text>
              </Group>
            )}

            {isError && (
              <Text size="xs" c="red">
                {t('media.ai.agent.error')}
              </Text>
            )}
          </Stack>
        </ScrollArea>

        <Group align="flex-end" wrap="nowrap">
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('media.ai.agent.placeholder')}
            autosize
            minRows={2}
            maxRows={5}
            disabled={isPending}
            style={{
              flex: 1,
            }}
            classNames={{
              input: 'bookshelf-input',
            }}
          />

          <Button
            type="button"
            size="sm"
            radius="xl"
            rightSection={<FiSend size={15} />}
            onClick={handleSend}
            loading={isPending}
            disabled={message.trim().length === 0}
            className="bookshelf-button bookshelf-button-primary"
          >
            {t('media.ai.agent.send')}
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
