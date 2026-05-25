import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import StatCard from '../components/StatCard';
import ActivityFeedItem from '../components/ActivityFeedItem';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { enquiries, escalations, followUps } = useApp();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLeads = enquiries.filter((e) => new Date(e.receivedAt) >= todayStart).length;
  const missedEnquiries = enquiries.filter((e) => e.status === 'escalated' && !e.sopMatch).length;
  const openEscalations = escalations.filter((e) => !e.resolved).length;
  const pendingFollowUps = followUps.filter((f) => !f.done).length;

  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.welcome}>Overview</Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <StatCard label="Inquiries Today" value={todayLeads} accent />
            <StatCard label="Awaiting Reply" value={missedEnquiries} />
          </View>
          <View style={styles.gridRow}>
            <StatCard label="Active Escalations" value={openEscalations} />
            <StatCard label="Pending Follow-ups" value={pendingFollowUps} />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Escalations')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Escalations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            onPress={() => navigation.navigate('FollowUps')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonTextSecondary}>Follow-ups</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Inbox Activity</Text>
        </View>

        <View style={styles.feedList}>
          {recentEnquiries.map((item, index) => (
            <ActivityFeedItem
              key={item.id}
              enquiry={item}
              onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
              isLast={index === recentEnquiries.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  welcome: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  gridContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  feedList: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
