import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CRMScreen from "@/screens/CRMScreen";
import ClientDetailScreen from "@/screens/ClientDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useLanguage } from "@/hooks/useLanguage";

export type CRMStackParamList = {
  CRM: undefined;
  ClientDetail: { clientId: string };
};

const Stack = createNativeStackNavigator<CRMStackParamList>();

export default function CRMStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useLanguage();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="CRM"
        component={CRMScreen}
        options={{
          headerTitle: t("myClients"),
        }}
      />
      <Stack.Screen
        name="ClientDetail"
        component={ClientDetailScreen}
        options={{
          headerTitle: t("clientDetails"),
        }}
      />
    </Stack.Navigator>
  );
}
