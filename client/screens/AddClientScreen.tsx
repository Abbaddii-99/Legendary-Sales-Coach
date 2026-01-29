import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function AddClientScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [personalNote, setPersonalNote] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const client = {
      id: Date.now().toString(),
      name: name.trim(),
      personalNote: personalNote.trim() || "New contact",
      lastContact: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("clients");
      const clients = existing ? JSON.parse(existing) : [];
      clients.unshift(client);
      await AsyncStorage.setItem("clients", JSON.stringify(clients));

      // Update connections count
      const statsData = await AsyncStorage.getItem("userStats");
      const stats = statsData ? JSON.parse(statsData) : {
        totalSessions: 0,
        trustPoints: 0,
        connections: 0,
        level: "Newcomer",
      };
      stats.connections += 1;
      await AsyncStorage.setItem("userStats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving client:", error);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
    >
      <ThemedText style={[styles.label, { color: theme.text }]}>
        Client Name *
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundDefault,
            color: theme.text,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Enter client's name"
        placeholderTextColor={theme.textSecondary}
        autoFocus
      />

      <ThemedText style={[styles.label, { color: theme.text }]}>
        Personal Notes
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: theme.backgroundDefault,
            color: theme.text,
          },
        ]}
        value={personalNote}
        onChangeText={setPersonalNote}
        placeholder="Add details: hobbies, family, preferences..."
        placeholderTextColor={theme.textSecondary}
        multiline
        numberOfLines={4}
      />

      <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
        Remember Joe's rule: "The more you know about your customer, the more they'll buy from you!"
      </ThemedText>

      <Pressable
        onPress={handleSave}
        style={[
          styles.saveButton,
          {
            backgroundColor: name.trim()
              ? Colors.light.accent
              : theme.backgroundSecondary,
          },
        ]}
        disabled={!name.trim()}
      >
        <Feather
          name="user-plus"
          size={20}
          color={name.trim() ? Colors.light.primary : theme.textSecondary}
        />
        <ThemedText
          style={[
            styles.saveButtonText,
            { color: name.trim() ? Colors.light.primary : theme.textSecondary },
          ]}
        >
          Add to Network
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
});
