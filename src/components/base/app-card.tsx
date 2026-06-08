import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

type AppCardProps = ViewProps & {
  tone?: 'default' | 'muted' | 'highlight';
  elevated?: boolean;
};

export function AppCard({ tone = 'default', elevated = false, style, ...rest }: AppCardProps) {
  return (
    <View
      style={[
        styles.base,
        tone === 'default' && styles.default,
        tone === 'muted' && styles.muted,
        tone === 'highlight' && styles.highlight,
        elevated && styles.elevated,
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
    borderColor: colors.border,
  },
  default: {
    backgroundColor: colors.surface,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  highlight: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  elevated: {
    ...shadows.md,
  },
});
