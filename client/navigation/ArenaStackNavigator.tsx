import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArenaScreen from "@/screens/ArenaScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type ArenaStackParamList = {
  Arena: undefined;
};

const Stack = createNativeStackNavigator<ArenaStackParamList>();

export default function ArenaStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Arena"
        component={ArenaScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Girard's Legacy" />,
        }}
      />
    </Stack.Navigator>
  );
}
