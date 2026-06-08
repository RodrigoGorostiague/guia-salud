import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';

export default function RootLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
