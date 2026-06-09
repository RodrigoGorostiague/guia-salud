import { Platform } from 'react-native';

export const fontFamilies = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
} as const;

export const typography = {
  display: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700' as const,
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  subheading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as const,
  },
  button: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
} as const;

export type TextVariant = keyof typeof typography;
