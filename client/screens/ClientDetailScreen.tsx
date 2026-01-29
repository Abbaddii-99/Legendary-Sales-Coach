import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { CRMStackParamList } from "@/navigation/CRMStackNavigator";
import { Client } from "./CRMScreen";

type NavigationProp = NativeStackNavigationProp<CRMStackParamList>;
type RouteType = RouteProp<CRMStackParamList, "ClientDetail">;

const FOLLOW_UP_IDEAS = [
  "Send a handwritten thank-you card",
  "Share an article they might find interesting",
  "Send a birthday card to a family member",
  "Check in on a project they mentioned",
  "Invite them to an industry event",
  "Share a referral opportunity",
];

export default function ClientDetailScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { clientId } = route.params;

  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState("");

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    try {
      const saved = await AsyncStorage.getItem("clients");
      if (saved) {
        const clients: Client[] = JSON.parse(saved);
        const found = clients.find((c) => c.id === clientId);
        if (found) {
          setClient(found);
          setEditedNote(found.personalNote);
        }
      }
    } catch (error) {
      console.error("Error loading client:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!client) return;

    try {
      const saved = await AsyncStorage.getItem("clients");
      if (saved) {
        const clients: Client[] = JSON.parse(saved);
        const index = clients.findIndex((c) => c.id === clientId);
        if (index !== -1) {
          clients[index] = {
            ...clients[index],
            personalNote: editedNote,
            lastContact: new Date().toISOString(),
          };
          await AsyncStorage.setItem("clients", JSON.stringify(clients));
          setClient(clients[index]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Client",
      "Are you sure you want to remove this client from your CRM?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const saved = await AsyncStorage.getItem("clients");
              if (saved) {
                const clients: Client[] = JSON.parse(saved);
                const filtered = clients.filter((c) => c.id !== clientId);
                await AsyncStorage.setItem("clients", JSON.stringify(filtered));

                // Update connections count
                const statsData = await AsyncStorage.getItem("userStats");
                if (statsData) {
                  const stats = JSON.parse(statsData);
                  stats.connections = Math.max(0, stats.connections - 1);
                  await AsyncStorage.setItem("userStats", JSON.stringify(stats));
                }

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                navigation.goBack();
              }
            } catch (error) {
              console.error("Error deleting client:", error);
            }
          },
        },
      ]
    );
  };

  const handleLogContact = async () => {
    if (!client) return;

    try {
      const saved = await AsyncStorage.getItem("clients");
      if (saved) {
        const clients: Client[] = JSON.parse(saved);
        const index = clients.findIndex((c) => c.id === clientId);
        if (index !== -1) {
          clients[index] = {
            ...clients[index],
            lastContact: new Date().toISOString(),
          };
          await AsyncStorage.setItem("clients", JSON.stringify(clients));
          setClient(clients[index]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert("Contact Logged", "Last contact updated to today!");
        }
      }
    } catch (error) {
      console.error("Error logging contact:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!client) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  const randomFollowUp = FOLLOW_UP_IDEAS[Math.floor(Math.random() * FOLLOW_UP_IDEAS.length)];

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
    >
      {/* Client Header */}
      <View style={styles.header}>
        <View style={[styles.avatarLarge, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.avatarText}>
            {client.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText style={[styles.clientName, { color: theme.text }]}>
          {client.name}
        </ThemedText>
        <ThemedText style={[styles.memberSince, { color: theme.textSecondary }]}>
          In your network since {formatDate(client.createdAt)}
        </ThemedText>
      </View>

      {/* Last Contact */}
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="calendar" size={18} color={Colors.light.accent} />
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>
            Last Contact
          </ThemedText>
        </View>
        <ThemedText style={[styles.lastContactDate, { color: theme.text }]}>
          {formatDate(client.lastContact)}
        </ThemedText>
        <Pressable
          onPress={handleLogContact}
          style={[styles.logButton, { backgroundColor: Colors.light.accent }]}
        >
          <Feather name="check" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.logButtonText}>Log Contact Today</ThemedText>
        </Pressable>
      </View>

      {/* Personal Notes */}
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="file-text" size={18} color={Colors.light.accent} />
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>
            Personal Notes
          </ThemedText>
          {!isEditing ? (
            <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
              <Feather name="edit-2" size={16} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <>
            <TextInput
              style={[
                styles.noteInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                },
              ]}
              value={editedNote}
              onChangeText={setEditedNote}
              placeholder="Add personal details about this client..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
            <View style={styles.buttonRow}>
              <Pressable
                onPress={() => {
                  setIsEditing(false);
                  setEditedNote(client.personalNote);
                }}
                style={[styles.cancelButton, { borderColor: theme.textSecondary }]}
              >
                <ThemedText style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleSaveNote}
                style={[styles.saveButton, { backgroundColor: Colors.light.accent }]}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <ThemedText style={[styles.noteText, { color: theme.text }]}>
            {client.personalNote || "No notes yet. Tap edit to add some!"}
          </ThemedText>
        )}
      </View>

      {/* Follow-up Suggestion */}
      <View style={[styles.followUpCard, { backgroundColor: Colors.light.feedbackBg }]}>
        <View style={styles.cardHeader}>
          <Feather name="bell" size={18} color={Colors.light.accent} />
          <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
            Joe's Follow-up Idea
          </ThemedText>
        </View>
        <ThemedText style={[styles.followUpText, { color: Colors.light.primary }]}>
          {randomFollowUp}
        </ThemedText>
      </View>

      {/* Delete Button */}
      <Pressable
        onPress={handleDelete}
        style={[styles.deleteButton, { borderColor: Colors.light.error }]}
      >
        <Feather name="trash-2" size={18} color={Colors.light.error} />
        <ThemedText style={[styles.deleteButtonText, { color: Colors.light.error }]}>
          Remove from CRM
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: "Montserrat_700Bold",
  },
  clientName: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.xs,
  },
  memberSince: {
    fontSize: 12,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
  },
  editButton: {
    padding: Spacing.xs,
  },
  lastContactDate: {
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  logButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
  },
  noteInput: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  saveButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  saveButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  followUpCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  followUpText: {
    fontSize: 14,
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
});
