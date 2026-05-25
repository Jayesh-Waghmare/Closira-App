import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Escalation } from '../types';
import ChannelBadge from './ChannelBadge';
import { timeAgo } from '../utils/timeAgo';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  escalation: Escalation;
  onPress: () => void;
  onResolve: (id: string) => void;
}

export default function EscalationCard({ escalation, onPress, onResolve }: Props) {
  const isResolved = escalation.resolved;
  const leftBorderColor = escalation.urgency === 'high' ? colors.urgencyHigh : colors.urgencyMedium;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: leftBorderColor },
        isResolved && styles.resolvedCard,
      ]}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchArea}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, isResolved && styles.mutedText]}>
              {escalation.customer}
            </Text>
            <Text style={[typography.caption, styles.time]}>
              {timeAgo(escalation.createdAt)}
            </Text>
          </View>

          <View style={styles.badgeRow}>
            <ChannelBadge channel={escalation.channel} />
            {isResolved && (
              <View style={styles.resolvedBadge}>
                <Text style={styles.resolvedLabel}>RESOLVED</Text>
              </View>
            )}
          </View>

          <Text style={[styles.reason, isResolved && styles.mutedText]}>
            {escalation.reason}
          </Text>
        </TouchableOpacity>

        {!isResolved && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => onResolve(escalation.id)}
              activeOpacity={0.7}
              style={styles.resolveButton}
            >
              <Text style={styles.resolveText}>Resolve</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  touchArea: {
    padding: spacing.md,
  },
  resolvedCard: {
    opacity: 0.65,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  resolvedBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resolvedLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  reason: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
  },
  resolveButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  resolveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  mutedText: {
    color: colors.textMuted,
  },
});
