import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import TrainingSessionScreen from "@/screens/TrainingSessionScreen";
import SessionSummaryScreen from "@/screens/SessionSummaryScreen";
import SessionHistoryScreen from "@/screens/SessionHistoryScreen";
import SessionDetailScreen from "@/screens/SessionDetailScreen";
import AddClientScreen from "@/screens/AddClientScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useLanguage } from "@/hooks/useLanguage";
import { SessionScores, SessionMessage } from "@/lib/sessionStorage";

export type RootStackParamList = {
  Main: undefined;
  TrainingSession: {
    scenarioId: string;
    scenarioTitle: string;
    customerType: string;
  };
  SessionSummary: {
    sessionId: string;
    scenarioId: string;
    scenarioTitle: string;
    customerType: string;
    score: number;
    feedback: string;
    scores: SessionScores;
    messages: SessionMessage[];
    keyStrengths: string[];
    areasToImprove: string[];
    duration: number;
    trustPointsEarned: number;
  };
  SessionHistory: undefined;
  SessionDetail: {
    sessionId: string;
  };
  AddClient: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useLanguage();

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
        name="SessionHistory"
        component={SessionHistoryScreen}
        options={{
          headerTitle: t("sessionHistory"),
        }}
      />
      <Stack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{
          headerTitle: t("viewSession"),
        }}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{
          presentation: "modal",
          headerTitle: t("addClient"),
        }}
      />
    </Stack.Navigator>
  );
}
