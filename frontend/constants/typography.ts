import { colors } from './colors';

export const typography = {
  h1: { fontSize: 24, fontWeight: '800' as const, color: colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 14, fontWeight: '700' as const, color: colors.textPrimary, letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
};
