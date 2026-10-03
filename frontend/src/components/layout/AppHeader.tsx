import { Burger, Button, Container, Drawer, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GiSpellBook } from 'react-icons/gi';

import { useAuth } from '../../features/auth/hooks/useAuth';

export function AppHeader() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  async function handleLogout() {
    try {
      setMobileMenuOpened(false);

      await signOut();

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  function handleMobileNavigation() {
    setMobileMenuOpened(false);
  }

  return (
    <>
      <header className="bookshelf-app-header">
        <Container size="xl">
          <Group justify="space-between" h={72}>
            <Group gap="xs">
              <GiSpellBook size={28} color="var(--bookshelf-primary)" />

              <Text fw={700} size="lg" c="var(--bookshelf-primary)">
                bookshelf
              </Text>
            </Group>

            <Group gap="lg" className="bookshelf-desktop-nav">
              <NavLink
                to="/library"
                className={({ isActive }) =>
                  isActive
                    ? 'bookshelf-nav-link bookshelf-nav-link-active'
                    : 'bookshelf-nav-link'
                }
              >
                {t('navigation.library')}
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? 'bookshelf-nav-link bookshelf-nav-link-active'
                    : 'bookshelf-nav-link'
                }
              >
                {t('navigation.dashboard')}
              </NavLink>

              <NavLink
                to="/media"
                className={({ isActive }) =>
                  isActive
                    ? 'bookshelf-nav-link bookshelf-nav-link-active'
                    : 'bookshelf-nav-link'
                }
              >
                {t('navigation.media')}
              </NavLink>

              <Group>
                <NavLink
                  to="/account"
                  title={user?.name}
                  className={({ isActive }) =>
                    [
                      'bookshelf-nav-link',
                      'bookshelf-header-user-name',
                      isActive ? 'bookshelf-nav-link-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {user?.name}
                </NavLink>

                <Button
                  variant="none"
                  className="bookshelf-nav-link bookshelf-nav-link-active"
                  onClick={handleLogout}
                >
                  {t('common.logout')}
                </Button>
              </Group>
            </Group>

            <Burger
              opened={mobileMenuOpened}
              onClick={() => setMobileMenuOpened((opened) => !opened)}
              aria-label={t('common.menu', { defaultValue: 'Menu' })}
              className="bookshelf-mobile-menu-button"
              color="var(--bookshelf-primary)"
              size="sm"
            />
          </Group>
        </Container>
      </header>

      <Drawer
        opened={mobileMenuOpened}
        onClose={() => setMobileMenuOpened(false)}
        position="right"
        size="xs"
        title={
          <Group gap="xs">
            <GiSpellBook size={24} color="var(--bookshelf-primary)" />

            <Text fw={700} c="var(--bookshelf-primary)">
              bookshelf
            </Text>
          </Group>
        }
      >
        <Stack gap="md">
          <NavLink
            to="/library"
            onClick={handleMobileNavigation}
            className={({ isActive }) =>
              isActive
                ? 'bookshelf-nav-link bookshelf-nav-link-active'
                : 'bookshelf-nav-link'
            }
          >
            {t('navigation.library')}
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={handleMobileNavigation}
            className={({ isActive }) =>
              isActive
                ? 'bookshelf-nav-link bookshelf-nav-link-active'
                : 'bookshelf-nav-link'
            }
          >
            {t('navigation.dashboard')}
          </NavLink>

          <NavLink
            to="/media"
            onClick={handleMobileNavigation}
            className={({ isActive }) =>
              isActive
                ? 'bookshelf-nav-link bookshelf-nav-link-active'
                : 'bookshelf-nav-link'
            }
          >
            {t('navigation.media')}
          </NavLink>

          <NavLink
            to="/account"
            onClick={handleMobileNavigation}
            className={({ isActive }) =>
              isActive
                ? 'bookshelf-nav-link bookshelf-nav-link-active'
                : 'bookshelf-nav-link'
            }
          >
            {user?.name}
          </NavLink>

          <Button
            variant="subtle"
            justify="flex-start"
            px={0}
            onClick={handleLogout}
            className="bookshelf-nav-link bookshelf-nav-link-active"
          >
            {t('common.logout')}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}