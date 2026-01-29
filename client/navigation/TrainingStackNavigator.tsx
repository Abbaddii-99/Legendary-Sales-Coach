import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrainingScreen from "@/screens/TrainingScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useLanguage } from "@/hooks/useLanguage";

export type TrainingStackParamList = {
  Training: undefined;
};

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export default function TrainingStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useLanguage();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          headerTitle: t("trainingScenarios"),
        }}
      />
    </Stack.Navigator>
  );
}
