import { useColorScheme } from 'react-native';

import { colorThemes, type AppTheme } from '@/theme/colors';

export function useAppTheme() {
  const scheme = useColorScheme();
  const themeName: AppTheme = scheme === 'dark' ? 'dark' : 'light';

  return {
    themeName,
    colors: colorThemes[themeName],
    isDark: themeName === 'dark',
  };
}
