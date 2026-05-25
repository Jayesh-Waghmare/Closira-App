import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator";
import ConversationDetailScreen from "../screens/ConversationDetailScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
