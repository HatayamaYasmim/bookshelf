import {
    Button,
    Container,
    Group,
    Text,
} from '@mantine/core';

import {
    NavLink,
    useNavigate,
} from 'react-router-dom';

import { GiSpellBook } from 'react-icons/gi';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function AppHeader() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    async function handleLogout() {
        try {
            await signOut();

            navigate('/login', {
                replace: true,
            });
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

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
                        <Group>
                            <NavLink
                                to="/account"
                                title={user?.name}
                                className={({ isActive }) =>
                                    [
                                        'bookshelf-nav-link',
                                        'bookshelf-header-user-name',
                                        isActive
                                            ? 'bookshelf-nav-link-active'
                                            : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')
                                }
                            >
                                {user?.name}
                            </NavLink>

                            <Button
                                variant='none'
                                className='bookshelf-nav-link bookshelf-nav-link-active'
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Group>
                    </Group>
                </Group>
            </Container>
        </header>
    );
}