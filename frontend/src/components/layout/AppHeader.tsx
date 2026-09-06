import {
    Container,
    Group,
    Text,
} from '@mantine/core';

import {
    NavLink,
} from 'react-router-dom';

import { GiSpellBook } from 'react-icons/gi';

export function AppHeader() {
    return (
        <header className="bookshelf-app-header">
            <Container size="xl">
                <Group
                    justify="space-between"
                    h={72}
                >
                    <Group gap="xs">
                        <GiSpellBook
                            size={28}
                            color="var(--bookshelf-primary)"
                        />

                        <Text
                            fw={700}
                            size="lg"
                            c="var(--bookshelf-primary)"
                        >
                            bookshelf
                        </Text>
                    </Group>

                    <Group gap="lg">
                        <NavLink
                            to="/library"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bookshelf-nav-link bookshelf-nav-link-active'
                                    : 'bookshelf-nav-link'
                            }
                        >
                            Library
                        </NavLink>

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? 'bookshelf-nav-link bookshelf-nav-link-active'
                                    : 'bookshelf-nav-link'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </Group>
                </Group>
            </Container>
        </header>
    );
}