import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/base/app-icon';
import { AppText } from '@/components/base/app-text';
import { spacing } from '@/theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  iconLabel?: string;
  iconTone?: 'primary' | 'secondary' | 'neutral';
};

export function AppHeader({
  title,
  subtitle,
  iconLabel = 'GS',
  iconTone = 'primary',
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <AppIcon label={iconLabel} size="lg" tone={iconTone} />
      <View style={styles.textBlock}>
        <AppText variant="subheading">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
});
