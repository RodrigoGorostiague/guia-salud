import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fontFamilies, typography, type AppColorToken, type TextVariant } from '@/theme';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: AppColorToken;
};

export function AppText({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  const textStyle = typography[variant] as TextStyle;

  return (
    <Text
      style={[
        {
          color: colors[color],
          fontFamily: textStyle.fontWeight === '400' ? fontFamilies.regular : fontFamilies.medium,
        },
        textStyle,
        style,
      ]}
      {...rest}
    />
  );
}
