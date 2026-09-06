import { Container, Stack, Title, Text } from "@mantine/core";

export function DashboardPage() {
    return (
        <Container size="xl" py="xl">
            <Stack gap="xs">
                <Title
                    order={1}
                    c="var(--bookshelf-primary)"
                >
                    Reading Dashboard
                </Title>

                <Text>
                    Your reading activity and statistics.
                </Text>
            </Stack>
        </Container>
    );
}