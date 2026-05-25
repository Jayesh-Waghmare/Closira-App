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
  isLast?: boolean;
}

export default function ActivityFeedItem({ enquiry, onPress, isLast = false }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.container, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.leftCol}>
        <Text style={styles.name}>{enquiry.customer}</Text>
        <View style={styles.badgeRow}>
          <ChannelBadge channel={enquiry.channel} />
          <StatusBadge status={enquiry.status} />
        </View>
      </View>
      <Text style={[typography.caption, styles.time]}>{timeAgo(enquiry.receivedAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftCol: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  time: {
    color: colors.textMuted,
  },
});
