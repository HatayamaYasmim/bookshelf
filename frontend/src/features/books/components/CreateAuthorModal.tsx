import {
    Button,
    Group,
    Modal,
    Stack,
    TextInput,
    Text,
} from '@mantine/core';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateAuthorData } from '../../../services/authors';
import { GiMagicPalm } from 'react-icons/gi';

const createAuthorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Informe o nome do autor')
        .max(150, 'O nome deve possuir no máximo 150 caracteres'),
});

type CreateAuthorFormData = z.infer<
    typeof createAuthorSchema
>;

interface CreateAuthorModalProps {
    opened: boolean;
    onClose: () => void;

    onSubmit: (
        data: CreateAuthorData,
    ) => Promise<unknown>;

    isSubmitting?: boolean;
}

export function CreateAuthorModal({
    opened,
    onClose,
    onSubmit,
    isSubmitting = false,
}: CreateAuthorModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateAuthorFormData>({
        resolver: zodResolver(createAuthorSchema),

        defaultValues: {
            name: '',
        },
    });

    async function handleCreateAuthor(
        data: CreateAuthorFormData,
    ) {
        await onSubmit({
            name: data.name,
        });

        reset();
        onClose();
    }

    function handleClose() {
        reset();
        onClose();
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Group gap="xs">
                    <GiMagicPalm size={18} />
                    <Text fw={600}>Author</Text>
                </Group>
            }
            centered
        >
            <form
                onSubmit={handleSubmit(handleCreateAuthor)}
            >
                <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Ex: J.R.R. Tolkien"
                        withAsterisk
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}