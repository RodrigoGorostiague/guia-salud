import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/base/app-icon';
import { AppText } from '@/components/base/app-text';
import { spacing } from '@/theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <AppIcon label="GS" size="lg" />
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
