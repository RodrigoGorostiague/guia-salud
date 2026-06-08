import { StyleSheet, View, type ViewProps } from 'react-native';

import { radii, shadows, spacing, useAppTheme } from '@/theme';

type AppCardProps = ViewProps & {
  tone?: 'default' | 'muted' | 'highlight';
  elevated?: boolean;
};

export function AppCard({ tone = 'default', elevated = false, style, ...rest }: AppCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.base,
        { borderColor: colors.border },
        tone === 'default' && { backgroundColor: colors.surface },
        tone === 'muted' && { backgroundColor: colors.surfaceMuted },
        tone === 'highlight' && { backgroundColor: colors.primary, borderColor: colors.primary },
        elevated && { ...styles.elevated, shadowColor: colors.shadow },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
  },
  elevated: {
    ...shadows.md,
  },
});
