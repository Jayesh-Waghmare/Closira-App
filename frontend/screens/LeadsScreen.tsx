import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Enquiry, Status } from '../types';
import LeadCard from '../components/LeadCard';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LeadsScreen() {
  const navigation = useNavigation<Nav>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | Status>('all');
  const { enquiries } = useApp();

  const sorted = [...enquiries].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  const filtered = sorted.filter((item) => {
    const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getFilterLabel = (filterType: 'all' | Status) => {
    if (filterType === 'all') return 'All';
    if (filterType === 'new') return 'New';
    if (filterType === 'qualified') return 'Qualified';
    if (filterType === 'escalated') return 'Escalated';
    return filterType;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by customer name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'new', 'qualified', 'escalated'] as const).map((filterOpt) => {
          const isActive = selectedFilter === filterOpt;
          return (
            <TouchableOpacity
              key={filterOpt}
              onPress={() => setSelectedFilter(filterOpt)}
              activeOpacity={0.7}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
            >
              <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]}>
                {getFilterLabel(filterOpt)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Enquiry }) => (
          <LeadCard
            enquiry={item}
            onPress={() => navigation.navigate('ConversationDetail', { enquiryId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title={selectedFilter === 'all' ? 'No leads found' : `No ${selectedFilter} leads right now.`}
            subtitle={selectedFilter === 'all' ? 'Try checking your search term.' : `All caught up with ${selectedFilter} status enquiries.`}
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
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.xs + 3,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterTab: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeFilterTabText: {
    color: colors.surface,
  },
  listContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
