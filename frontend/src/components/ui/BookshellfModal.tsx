import type { ReactNode } from 'react';

import {
  Group,
  Modal,
  Text,
} from '@mantine/core';

interface BookshelfModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  size?: string | number;
}

export function BookshelfModal({
  opened,
  onClose,
  title,
  icon,
  children,
  size = 'md',
}: BookshelfModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size={size}
      radius="xl"
      overlayProps={{
        backgroundOpacity: 0.18,
        blur: 2,
      }}
      title={
        <Group gap="xs">
          {icon}

          <Text
            size="lg"
            fw={600}
          >
            {title}
          </Text>
        </Group>
      }
      styles={{
        content: {
          background: 'var(--bookshelf-background)',
          boxShadow:
            '12px 12px 28px rgba(0,0,0,0.10), -10px -10px 24px rgba(255,255,255,0.65)',
        },

        header: {
          background: 'var(--bookshelf-background)',
          padding: '24px 28px 12px',
        },

        body: {
          padding: '16px 28px 28px',
        },

        close: {
          borderRadius: '999px',
          background: 'var(--bookshelf-background)',
          boxShadow:
            '4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.65)',
        },
      }}
    >
      {children}
    </Modal>
  );
}