import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  status: 'new' | 'qualified' | 'escalated';
}

export default function StatusBadge({ status }: Props) {
  let bg = colors.statusNewBg;
  let text = colors.statusNew;
  let label = 'New';

  if (status === 'qualified') {
    bg = colors.statusQualifiedBg;
    text = colors.statusQualified;
    label = 'Qualified';
  } else if (status === 'escalated') {
    bg = colors.statusEscalatedBg;
    text = colors.statusEscalated;
    label = 'Escalated';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[typography.label, styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
  },
});
