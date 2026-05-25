import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import ConversationBubble from '../components/ConversationBubble';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

type RouteType = RouteProp<RootStackParamList, 'ConversationDetail'>;

export default function ConversationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { enquiryId } = route.params;
  const { enquiries, messages, addMessage } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const enquiry = enquiries.find((e) => e.id === enquiryId);
  const chatMessages = messages.filter((m) => m.enquiryId === enquiryId);

  if (!enquiry) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centered}>
          <Text style={typography.h2}>Enquiry not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (!inputVal.trim()) return;
    addMessage(enquiry.id, inputVal.trim(), 'agent');
    setInputVal('');
    Alert.alert('Message Sent', `Sent successfully to ${enquiry.customer}.`);
  };

  const timelineData = [
    { title: 'Enquiry Received', detail: 'Customer inbound query logged', time: new Date(enquiry.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ];
  if (enquiry.sopMatch) {
    timelineData.push({ title: 'SOP Evaluated', detail: enquiry.sopMatch, time: 'Matched' });
  } else {
    timelineData.push({ title: 'SOP Evaluated', detail: 'No SOP matched', time: 'Failed' });
  }
  if (enquiry.status === 'escalated') {
    timelineData.push({ title: 'Escalated to Agent', detail: enquiry.reason || 'Pending action', time: 'Escalated' });
  } else if (enquiry.status === 'qualified') {
    timelineData.push({ title: 'Resolved Qualified', detail: 'Marked complete', time: 'Done' });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Escalated Banner */}
        {enquiry.status === 'escalated' && (
          <View style={styles.escalationBanner}>
            <Text style={styles.escalationBannerText}>
              ⚠️ This conversation has been escalated: {enquiry.reason || 'SOP mismatch'}
            </Text>
          </View>
        )}

        {/* Header bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.accent} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {enquiry.customer.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{enquiry.customer}</Text>
              <Text style={styles.headerSubtitle}>Direct Message</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          </View>
        </View>

        {/* SOP Match label */}
        <View style={styles.sopRow}>
          {enquiry.sopMatch ? (
            <View style={styles.sopBadge}>
              <Text style={styles.sopLabel}>SOP: {enquiry.sopMatch}</Text>
            </View>
          ) : (
            <View style={styles.sopBadgeFailed}>
              <Text style={styles.sopLabelFailed}>No SOP matched</Text>
            </View>
          )}
        </View>

        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Message }) => <ConversationBubble message={item} />}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* Collapsible Summary Card */}
              {enquiry.summary && (
                <View style={styles.summaryCard}>
                  <TouchableOpacity
                    onPress={() => setSummaryExpanded(!summaryExpanded)}
                    activeOpacity={0.8}
                    style={styles.summaryHeader}
                  >
                    <Text style={styles.summaryTitle}>Conversation Summary</Text>
                    <Text style={styles.expandText}>{summaryExpanded ? 'Collapse ▲' : 'Expand ▼'}</Text>
                  </TouchableOpacity>
                  {summaryExpanded && (
                    <View style={styles.summaryContent}>
                      <Text style={styles.summaryBody}>{enquiry.summary}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Status Timeline */}
              <View style={styles.timelineContainer}>
                <Text style={styles.timelineHeader}>Status Timeline</Text>
                {timelineData.map((event, idx) => {
                  const isLast = idx === timelineData.length - 1;
                  return (
                    <View key={idx} style={styles.timelineRow}>
                      <View style={styles.timelineLeft}>
                        <View style={styles.dot} />
                        {!isLast && <View style={styles.verticalLine} />}
                      </View>
                      <View style={styles.timelineRight}>
                        <Text style={styles.timelineTitle}>{event.title}</Text>
                        <Text style={styles.timelineDetail}>{event.detail} · {event.time}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          }
        />

        {/* Input reply bar */}
        <View style={styles.composer}>
          <TextInput
            placeholder="Draft your reply here..."
            value={inputVal}
            onChangeText={setInputVal}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputVal.trim()}
            style={[styles.sendButton, !inputVal.trim() && styles.disabledSendButton]}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={16} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backLink: {
    marginTop: spacing.md,
  },
  backLinkText: {
    color: colors.accent,
    fontWeight: '700',
  },
  escalationBanner: {
    backgroundColor: colors.statusEscalatedBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.statusEscalated,
  },
  escalationBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.statusEscalated,
    textAlign: 'center',
  },
  header: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sopRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sopBadge: {
    backgroundColor: colors.statusQualifiedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sopLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.statusQualified,
  },
  sopBadgeFailed: {
    backgroundColor: colors.statusEscalatedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sopLabelFailed: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.statusEscalated,
  },
  chatList: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.accentLight,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  expandText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  summaryContent: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  timelineContainer: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  timelineHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 45,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 16,
    marginRight: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  composer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 90,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendButton: {
    backgroundColor: colors.accent,
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
});
