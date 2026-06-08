import { Platform } from 'react-native';

export const fontFamilies = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
} as const;

export const typography = {
  heading: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  subheading: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
} as const;

export type TextVariant = keyof typeof typography;
