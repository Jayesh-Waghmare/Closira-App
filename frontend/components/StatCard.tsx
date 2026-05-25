import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  label: string;
  value: number | string;
  accent?: boolean;
}

export default function StatCard({ label, value, accent = false }: Props) {
  return (
    <View style={[styles.card, accent && styles.accentCard]}>
      <Text style={[styles.value, accent && styles.accentValue]}>{value}</Text>
      <Text style={[typography.caption, styles.label, accent && styles.accentLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    minHeight: 80,
  },
  accentCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  accentValue: {
    color: colors.surface,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  accentLabel: {
    color: colors.textMuted,
  },
});
