import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Escalation } from '../types';
import EscalationCard from '../components/EscalationCard';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EscalationsScreen() {
  const navigation = useNavigation<Nav>();
  const [refreshing, setRefreshing] = useState(false);
  const { enquiries, escalations, resolveEscalation } = useApp();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleResolve = (id: string) => {
    resolveEscalation(id);
  };

  const handlePress = (esc: Escalation) => {
    navigation.navigate('ConversationDetail', { enquiryId: esc.enquiryId });
  };

  const activeEscalations = escalations
    .filter((esc) => !esc.resolved)
    .sort((a, b) => {
      if (a.urgency === 'high' && b.urgency !== 'high') return -1;
      if (a.urgency !== 'high' && b.urgency === 'high') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const resolvedEscalations = escalations.filter((esc) => esc.resolved);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <SectionHeader title="Active Escalations" />

        {activeEscalations.length === 0 ? (
          <EmptyState
            title="All caught up — no open escalations."
            subtitle="Everything is running smoothly."
            icon="✅"
          />
        ) : (
          <View style={styles.listSection}>
            {activeEscalations.map((item) => (
              <EscalationCard
                key={item.id}
                escalation={item}
                onPress={() => handlePress(item)}
                onResolve={handleResolve}
              />
            ))}
          </View>
        )}

        {resolvedEscalations.length > 0 && (
          <View>
            <SectionHeader title="Resolved Escalations" />
            <View style={styles.listSection}>
              {resolvedEscalations.map((item) => (
                <EscalationCard
                  key={item.id}
                  escalation={item}
                  onPress={() => handlePress(item)}
                  onResolve={handleResolve}
                />
              ))}
            </View>
          </View>
        )}
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
  listSection: {
    padding: spacing.lg,
  },
});
