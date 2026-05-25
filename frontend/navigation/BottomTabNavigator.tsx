import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import LeadsScreen from "../screens/LeadsScreen";
import EscalationsScreen from "../screens/EscalationsScreen";
import FollowUpsScreen from "../screens/FollowUpsScreen";
import { TabParamList } from "../types";
import { useApp } from "../context/AppContext";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

const Tab = createBottomTabNavigator<TabParamList>();

function Dot({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

export default function BottomTabNavigator() {
  const { enquiries, escalations } = useApp();
  const newLeads = enquiries.filter((e) => e.status === "new").length;
  const openEscalations = escalations.filter((e) => !e.resolved).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Leads"
        component={LeadsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="people-outline" size={size} color={color} />
              <Dot count={newLeads} />
            </View>
          ),
          tabBarLabel: "Leads",
        }}
      />
      <Tab.Screen
        name="Escalations"
        component={EscalationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle-outline" size={size} color={color} />
              <Dot count={openEscalations} />
            </View>
          ),
          tabBarLabel: "Escalations",
        }}
      />
      <Tab.Screen
        name="FollowUps"
        component={FollowUpsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
          tabBarLabel: "Follow-ups",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 62,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: "800",
  },
});
