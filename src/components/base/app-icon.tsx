import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base/app-text';
import { colors, radii, spacing } from '@/theme';

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
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.base,
        tone === 'primary' && styles.primary,
        tone === 'secondary' && styles.secondary,
        tone === 'neutral' && styles.neutral,
        { width: iconSizes[size], height: iconSizes[size] },
      ]}>
      <AppText variant="bodyStrong" color={tone === 'neutral' ? 'textPrimary' : 'primary'}>
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
  primary: {
    backgroundColor: colors.primarySoft,
  },
  secondary: {
    backgroundColor: colors.secondarySoft,
  },
  neutral: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
});
