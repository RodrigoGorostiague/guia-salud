import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { colorThemes, type AppTheme } from '@/theme/colors';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  themeName: AppTheme;
  colors: (typeof colorThemes)[AppTheme];
  isDark: boolean;
  preference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  isReady: boolean;
};

const THEME_PREFERENCE_KEY = 'guia-salud:theme-preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadThemePreference() {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);

        if (!isMounted) {
          return;
        }

        if (storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system') {
          setPreference(storedPreference);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void loadThemePreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const setThemePreference = async (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, nextPreference);
  };

  const resolvedTheme: AppTheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({
      themeName: resolvedTheme,
      colors: colorThemes[resolvedTheme],
      isDark: resolvedTheme === 'dark',
      preference,
      setThemePreference,
      isReady,
    }),
    [isReady, preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context;
}
