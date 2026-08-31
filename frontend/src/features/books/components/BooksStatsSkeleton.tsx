import { Group, Paper, SimpleGrid, Skeleton, Stack } from "@mantine/core";

export function BooksStatsSkeleton(){
    return (
        <SimpleGrid
        cols={{
            base:1,
            sm: 2,
            lg: 4,
        }}
        spacing="xl"
        >
            {Array.from({ length: 4}).map((_, index) => (
                <Paper key={index} p="xl" radius="xl" className="neo-neo-raised" mih={135}>
                     <Group
                        justify="space-between"
                        align="center"
                    >
                        <Stack gap="sm">
                            <Skeleton
                                height={12}
                                width={90}
                                radius="xl"
                            />

                            <Skeleton
                                height={38}
                                width={55}
                                radius="md"
                            />
                        </Stack>

                        <Skeleton
                            circle
                            height={52}
                        />
                    </Group>
                </Paper>
            ))}

        </SimpleGrid>
    )
}