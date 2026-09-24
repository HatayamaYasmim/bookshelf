import type { ReactNode } from 'react';

import { Group, Modal, Text } from '@mantine/core';

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

          <Text size="lg" fw={600}>
            {title}
          </Text>
        </Group>
      }
      classNames={{
        overlay: 'bookshelf-modal-overlay',
        content: 'bookshelf-modal-content',
        header: 'bookshelf-modal-header',
        title: 'bookshelf-modal-title',
        body: 'bookshelf-modal-body',
        close: 'bookshelf-modal-close',
      }}
    >
      {children}
    </Modal>
  );
}
