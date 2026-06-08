import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base/app-text';
import { radii, spacing, useAppTheme } from '@/theme';

type AppIconProps = {
  label: string;
  tone?: 'primary' | 'secondary' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
};

const iconSizes = {
  sm: 36,
  md: 48,
  lg: 56,
} as const;

export function AppIcon({ label, tone = 'primary', size = 'md' }: AppIconProps) {
  const { colors } = useAppTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.base,
        tone === 'primary' && { backgroundColor: colors.primarySoft },
        tone === 'secondary' && { backgroundColor: colors.secondarySoft },
        tone === 'neutral' && {
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.sm,
        },
        { width: iconSizes[size], height: iconSizes[size] },
      ]}>
      <AppText
        variant="bodyStrong"
        color={tone === 'secondary' ? 'secondary' : tone === 'neutral' ? 'textPrimary' : 'primary'}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
