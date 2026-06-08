export const colors = {
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  secondary: '#14B8A6',
  secondarySoft: '#CCFBF1',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textOnPrimary: '#FFFFFF',
} as const;

export type AppColorToken = keyof typeof colors;
