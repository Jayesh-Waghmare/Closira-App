import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FollowUp } from '../types';
import FollowUpCard from '../components/FollowUpCard';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { isOverdue } from '../utils/timeAgo';

type ListItem =
  | { type: 'header'; title: string }
  | { type: 'card'; data: FollowUp };

export default function FollowUpsScreen() {
  const { followUps, markFollowUpDone } = useApp();

  const handleMarkDone = (id: string) => {
    markFollowUpDone(id);
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86400000);

  const dueToday = followUps
    .filter((f) => {
      const d = new Date(f.dueAt);
      return d < tomorrowStart;
    })
    .sort((a, b) => {
      const aOverdue = !a.done && isOverdue(a.dueAt);
      const bOverdue = !b.done && isOverdue(b.dueAt);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });

  const upcoming = followUps
    .filter((f) => {
      const d = new Date(f.dueAt);
      return d >= tomorrowStart;
    })
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const listData: ListItem[] = [];
  if (dueToday.length > 0) {
    listData.push({ type: 'header', title: 'Due Today' });
    dueToday.forEach((item) => {
      listData.push({ type: 'card', data: item });
    });
  }
  if (upcoming.length > 0) {
    listData.push({ type: 'header', title: 'Upcoming' });
    upcoming.forEach((item) => {
      listData.push({ type: 'card', data: item });
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={listData}
        keyExtractor={(item, index) => (item.type === 'header' ? `h_${item.title}` : `c_${item.data.id}`)}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <SectionHeader title={item.title} />;
          }
          return (
            <View style={styles.cardContainer}>
              <FollowUpCard followUp={item.data} onMarkDone={handleMarkDone} />
            </View>
          );
        }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No follow-ups scheduled."
            subtitle="Take a breather! There are no tasks waiting for you."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xxl,
  },
  cardContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
