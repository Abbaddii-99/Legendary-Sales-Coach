import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import TrainingSessionScreen from "@/screens/TrainingSessionScreen";
import SessionSummaryScreen from "@/screens/SessionSummaryScreen";
import AddClientScreen from "@/screens/AddClientScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  TrainingSession: {
    scenarioId: string;
    scenarioTitle: string;
    customerType: string;
  };
  SessionSummary: {
    sessionId: string;
    score: number;
    feedback: string;
  };
  AddClient: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TrainingSession"
        component={TrainingSessionScreen}
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SessionSummary"
        component={SessionSummaryScreen}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{
          presentation: "modal",
          headerTitle: "Add Client",
        }}
      />
    </Stack.Navigator>
  );
}
