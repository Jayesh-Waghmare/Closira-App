import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  title: string;
  subtitle: string;
  icon?: string;
}

export default function EmptyState({ title, subtitle, icon = '📂' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[typography.h3, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.subtitle]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
