import { ScrollView, StyleSheet, type ScrollViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, useAppTheme } from '@/theme';

type AppContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  style?: ViewStyle;
};

export function AppContainer({
  children,
  scrollable = false,
  contentContainerStyle,
  style,
}: AppContainerProps) {
  const { colors } = useAppTheme();

  const content = (
    <>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </>
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: colors.background }, style]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
});
