import {
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/base/app-text';
import { triggerSelectionHaptics } from '@/services/haptics';
import { radii, spacing, useAppTheme } from '@/theme';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
};

export function AppButton({
  label,
  variant = 'primary',
  icon,
  style,
  disabled,
  onPress,
  ...rest
}: AppButtonProps) {
  const { colors } = useAppTheme();

  const handlePress = async (event: GestureResponderEvent) => {
    if (disabled) {
      return;
    }

    await triggerSelectionHaptics();
    await onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={handlePress}
      style={(state) => {
        const { pressed } = state;
        const resolvedStyle =
          typeof style === 'function' ? style(state) : (style as StyleProp<ViewStyle>);

        return [
          styles.base,
          variant === 'primary' && { backgroundColor: colors.primary },
          variant === 'secondary' && { backgroundColor: colors.secondarySoft },
          variant === 'outline' && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          },
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
          resolvedStyle,
        ];
      }}
      {...rest}>
      <View style={styles.content}>
        {icon}
        <AppText
          variant="button"
          color={variant === 'primary' ? 'textOnPrimary' : variant === 'secondary' ? 'secondary' : 'textPrimary'}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
