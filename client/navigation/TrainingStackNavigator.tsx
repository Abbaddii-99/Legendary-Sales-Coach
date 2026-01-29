import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrainingScreen from "@/screens/TrainingScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type TrainingStackParamList = {
  Training: undefined;
};

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export default function TrainingStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          headerTitle: "Training Scenarios",
        }}
      />
    </Stack.Navigator>
  );
}
