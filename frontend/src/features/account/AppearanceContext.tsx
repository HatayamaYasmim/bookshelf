import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createTheme, MantineProvider } from '@mantine/core';
import {
  getUserPreferences,
  updateUserPreferences,
  type UpdateUserPreferences,
  type UserPreferences,
} from '../../services/account';
import { useAuth } from '../auth/hooks/useAuth';

interface AppearanceContextValue {
  preferences: UserPreferences;
  isLoading: boolean;

  savePreferences: (data: UpdateUserPreferences) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'SYSTEM',
  primaryColor: 'indigo',
};

type ResolvedColorScheme = 'light' | 'dark';

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const { user, isInitializing } = useAuth();

  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const [isLoading, setIsLoading] = useState(false);

  const [systemColorScheme, setSystemColorScheme] = useState<ResolvedColorScheme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(event: MediaQueryListEvent) {
      setSystemColorScheme(event.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!user) {
      setPreferences(defaultPreferences);

      return;
    }

    let cancelled = false;

    async function loadPreferences() {
      try {
        setIsLoading(true);

        const data = await getUserPreferences();

        if (!cancelled) {
          setPreferences(data);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [user, isInitializing]);

  const colorScheme = useMemo<ResolvedColorScheme>(() => {
    if (preferences.theme === 'SYSTEM') {
      return systemColorScheme;
    }

    return preferences.theme === 'DARK' ? 'dark' : 'light';
  }, [preferences.theme, systemColorScheme]);

  const theme = useMemo(
    () =>
      createTheme({
        primaryColor: preferences.primaryColor,

        fontFamily: '"Plus Jakarta Sans", sans-serif',

        headings: {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: '600',
        },

        defaultRadius: 'md',
      }),
    [preferences.primaryColor],
  );

  async function savePreferences(data: UpdateUserPreferences) {
    const updated = await updateUserPreferences(data);

    setPreferences(updated);
  }

  return (
    <AppearanceContext.Provider
      value={{
        preferences,
        isLoading,
        savePreferences,
      }}
    >
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }

  return context;
}
