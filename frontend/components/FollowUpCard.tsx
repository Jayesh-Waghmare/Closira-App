import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FollowUp } from '../types';
import ChannelBadge from './ChannelBadge';
import { formatDueTime, isOverdue } from '../utils/timeAgo';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  followUp: FollowUp;
  onMarkDone: (id: string) => void;
}

export default function FollowUpCard({ followUp, onMarkDone }: Props) {
  const isDone = followUp.done;
  const isExpired = !isDone && isOverdue(followUp.dueAt);
  const dueLabel = formatDueTime(followUp.dueAt);

  return (
    <View style={[styles.card, isDone && styles.doneCard]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, isDone && styles.strikeName]}>
          {followUp.customer}
        </Text>
        <Text
          style={[
            typography.caption,
            styles.dueTime,
            isExpired && styles.overdueText,
            isDone && styles.mutedText,
          ]}
        >
          {isExpired ? `Overdue — ${dueLabel}` : dueLabel}
        </Text>
      </View>

      <View style={styles.badgeRow}>
        <ChannelBadge channel={followUp.channel} />
        {isDone && (
          <View style={styles.doneBadge}>
            <Text style={styles.doneLabel}>DONE</Text>
          </View>
        )}
      </View>

      <Text numberOfLines={2} style={[styles.message, isDone && styles.mutedText]}>
        {followUp.messagePreview}
      </Text>

      {!isDone && (
        <TouchableOpacity
          onPress={() => onMarkDone(followUp.id)}
          activeOpacity={0.7}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Mark as Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  doneCard: {
    opacity: 0.65,
    backgroundColor: colors.background,
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
  strikeName: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  dueTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  overdueText: {
    color: colors.danger,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  doneBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  doneLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  doneButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 4,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  mutedText: {
    color: colors.textMuted,
  },
});
