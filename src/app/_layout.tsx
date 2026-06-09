import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppStartupLoader } from '@/components/app-startup-loader';
import { ThemeProvider, useAppTheme } from '@/theme';

function RootNavigator() {
  const { colors, isDark, isReady } = useAppTheme();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1700);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      {(!isReady || showLoader) ? <AppStartupLoader /> : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
