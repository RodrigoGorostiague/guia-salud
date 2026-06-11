import { Component, useEffect, useState, type ReactNode } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
          <Text style={styles.errorTitle}>No se pudo iniciar la aplicacion</Text>
          <Text style={styles.errorBody}>
            Revisa Logcat para ver el detalle del error de arranque.
          </Text>
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
    backgroundColor: '#07111F',
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    color: '#F5F8FC',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBody: {
    color: '#9DB0C8',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
