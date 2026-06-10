import { Component, useEffect, useState, type ReactNode } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base';
import { AppStartupLoader } from '@/components/app-startup-loader';
import {
  installGlobalStartupErrorLogging,
  logStartupError,
  logStartupEvent,
} from '@/services/startup-logging';
import { ThemeProvider, useAppTheme } from '@/theme';

class StartupErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logStartupError('Root render failed during startup', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorScreen}>
          <AppText variant="subheading">No se pudo iniciar la aplicacion</AppText>
          <AppText variant="body" color="textSecondary">
            Revisa Logcat para ver el detalle del error de arranque.
          </AppText>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootNavigator() {
  const { colors, isDark, isReady } = useAppTheme();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    logStartupEvent('Root navigator mounted', {
      isDark,
      isReady,
      showLoader,
    });
  }, [isDark, isReady, showLoader]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
      logStartupEvent('Startup loader hidden');
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
  useEffect(() => {
    installGlobalStartupErrorLogging();
    logStartupEvent('Root layout mounted');
  }, []);

  return (
    <StartupErrorBoundary>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </StartupErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
