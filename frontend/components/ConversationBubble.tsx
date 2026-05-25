import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { timeAgo } from '../utils/timeAgo';

interface Props {
  message: Message;
}

export default function ConversationBubble({ message }: Props) {
  const isCustomer = message.sender === 'customer';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.senderName, !isCustomer && styles.agentName]}>
          {isCustomer ? 'Customer' : 'You'}
        </Text>
        <Text style={styles.time}>{timeAgo(message.timestamp)}</Text>
      </View>
      <View style={styles.messageBlock}>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  agentName: {
    color: colors.accent,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
  },
  messageBlock: {
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
