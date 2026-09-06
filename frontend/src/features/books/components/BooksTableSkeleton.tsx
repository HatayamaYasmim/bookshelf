import { Skeleton, Stack } from "@mantine/core";

export function BooksTableSkeleton() {
    return (
        <Stack gap="sm" py="sm">
            {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                    key={index}
                    height={42}
                    radius="md"
                />

            ))}
        </Stack>
    )
}