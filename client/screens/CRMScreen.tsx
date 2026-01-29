import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { CRMStackParamList } from "@/navigation/CRMStackNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { HeaderButton } from "@react-navigation/elements";

type CRMNavigationProp = NativeStackNavigationProp<CRMStackParamList>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface Client {
  id: string;
  name: string;
  personalNote: string;
  lastContact: string;
  followUpIdea?: string;
  createdAt: string;
}

export default function CRMScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const crmNavigation = useNavigation<CRMNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const [clients, setClients] = useState<Client[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadClients = async () => {
    try {
      const saved = await AsyncStorage.getItem("clients");
      if (saved) {
        setClients(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const handleAddClient = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rootNavigation.navigate("AddClient");
  };

  const handleClientPress = (client: Client) => {
    Haptics.selectionAsync();
    crmNavigation.navigate("ClientDetail", { clientId: client.id });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderClient = ({ item }: { item: Client }) => (
    <Pressable
      onPress={() => handleClientPress(item)}
      style={({ pressed }) => [
        styles.clientCard,
        { backgroundColor: theme.backgroundDefault },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.clientHeader}>
        <View
          style={[styles.avatar, { backgroundColor: Colors.light.primary }]}
        >
          <ThemedText style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.clientInfo}>
          <ThemedText style={[styles.clientName, { color: theme.text }]}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.lastContact, { color: theme.textSecondary }]}>
            Last contact: {formatDate(item.lastContact)}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>

      <ThemedText
        style={[styles.noteSnippet, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {item.personalNote}
      </ThemedText>

      {item.followUpIdea ? (
        <View style={[styles.followUpBadge, { backgroundColor: Colors.light.feedbackBg }]}>
          <Feather name="bell" size={12} color={Colors.light.accent} />
          <ThemedText style={[styles.followUpText, { color: Colors.light.primary }]}>
            {item.followUpIdea}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/empty-crm.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
        No clients tracked yet
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
        Complete a training session to start building your network of connections.
      </ThemedText>
      <Pressable
        style={[styles.addButton, { backgroundColor: Colors.light.accent }]}
        onPress={handleAddClient}
      >
        <Feather name="plus" size={20} color={Colors.light.primary} />
        <ThemedText style={styles.addButtonText}>Add Your First Client</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing["3xl"],
            paddingHorizontal: Spacing.lg,
          },
          clients.length === 0 && styles.emptyContentContainer,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderClient}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {clients.length > 0 ? (
        <Pressable
          style={[styles.fab, { backgroundColor: Colors.light.accent }]}
          onPress={handleAddClient}
        >
          <Feather name="plus" size={24} color={Colors.light.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  clientCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 2,
  },
  lastContact: {
    fontSize: 12,
  },
  noteSnippet: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  followUpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  followUpText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  addButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
