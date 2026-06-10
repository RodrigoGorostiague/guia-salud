import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const STARTUP_LOG_PREFIX = '[startup]';

let hasInstalledGlobalErrorHandler = false;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: error };
}

export function logStartupEvent(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.log(STARTUP_LOG_PREFIX, message, details);
    return;
  }

  console.log(STARTUP_LOG_PREFIX, message);
}

export function logStartupError(message: string, error: unknown, details?: Record<string, unknown>) {
  console.error(STARTUP_LOG_PREFIX, message, {
    ...details,
    error: serializeError(error),
  });
}

export function installGlobalStartupErrorLogging() {
  if (hasInstalledGlobalErrorHandler) {
    return;
  }

  hasInstalledGlobalErrorHandler = true;

  logStartupEvent('Installing startup diagnostics', {
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    executionEnvironment: Constants.executionEnvironment,
    deviceBrand: Device.brand ?? 'unknown',
    deviceModel: Device.modelName ?? 'unknown',
    osName: Device.osName ?? Platform.OS,
    osVersion: Device.osVersion ?? 'unknown',
    platform: Platform.OS,
    isDev: __DEV__,
  });

  const errorUtils = (globalThis as {
    ErrorUtils?: {
      getGlobalHandler?: () => ((error: unknown, isFatal?: boolean) => void) | undefined;
      setGlobalHandler?: (handler: (error: unknown, isFatal?: boolean) => void) => void;
    };
  }).ErrorUtils;

  if (!errorUtils?.setGlobalHandler) {
    logStartupEvent('Global ErrorUtils handler unavailable');
    return;
  }

  const previousHandler = errorUtils.getGlobalHandler?.();

  errorUtils.setGlobalHandler((error, isFatal) => {
    logStartupError('Unhandled JavaScript error during startup', error, { isFatal: Boolean(isFatal) });
    previousHandler?.(error, isFatal);
  });
}
