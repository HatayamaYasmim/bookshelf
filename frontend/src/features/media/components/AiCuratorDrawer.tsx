import { useState } from 'react';

import { Button, Drawer, Group, ScrollArea, Stack, Text, Textarea } from '@mantine/core';

import { BsStars } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

interface AiCuratorDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function AiCuratorDrawer({ opened, onClose }: AiCuratorDrawerProps) {
  const { t } = useTranslation();

  const [message, setMessage] = useState('');

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
          </Stack>
        </ScrollArea>

        <Group align="flex-end" wrap="nowrap">
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
            placeholder={t('media.ai.agent.placeholder')}
            autosize
            minRows={1}
            maxRows={5}
            style={{
              flex: 1,
            }}
            classNames={{
              input: 'bookshelf-input',
            }}
          />

          <Button
            size="sm"
            radius="xl"
            rightSection={<FiSend size={15} />}
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
