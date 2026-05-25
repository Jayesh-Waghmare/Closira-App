import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Enquiry } from '../types';
import ChannelBadge from './ChannelBadge';
import StatusBadge from './StatusBadge';
import { timeAgo } from '../utils/timeAgo';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  enquiry: Enquiry;
  onPress: () => void;
}

export default function LeadCard({ enquiry, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <Text style={styles.customerName}>{enquiry.customer}</Text>
        <Text style={[typography.caption, styles.time]}>{timeAgo(enquiry.receivedAt)}</Text>
      </View>

      <View style={styles.badgeRow}>
        <ChannelBadge channel={enquiry.channel} />
        <StatusBadge status={enquiry.status} />
      </View>

      {enquiry.summary ? (
        <Text numberOfLines={1} style={[typography.body, styles.summary]}>
          {enquiry.summary}
        </Text>
      ) : enquiry.reason ? (
        <Text numberOfLines={1} style={[typography.body, styles.summary]}>
          {enquiry.reason}
        </Text>
      ) : (
        <Text numberOfLines={1} style={[typography.body, styles.summary]}>
          {enquiry.message || ''}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  customerName: {
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
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  summary: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
