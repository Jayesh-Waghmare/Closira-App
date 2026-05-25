import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

interface Props {
  channel: 'whatsapp' | 'email' | 'call';
}

export default function ChannelBadge({ channel }: Props) {
  let bg = colors.emailLight;
  let text = colors.email;
  let label = 'Email';

  if (channel === 'whatsapp') {
    bg = colors.whatsappLight;
    text = colors.whatsapp;
    label = 'WhatsApp';
  } else if (channel === 'call') {
    bg = colors.callLight;
    text = colors.call;
    label = 'Call';
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
