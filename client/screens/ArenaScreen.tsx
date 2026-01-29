import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UserStats {
  totalSessions: number;
  trustPoints: number;
  connections: number;
  level: string;
}

const DEFAULT_STATS: UserStats = {
  totalSessions: 0,
  trustPoints: 0,
  connections: 0,
  level: "Newcomer",
};

const MOTIVATIONAL_QUOTES = [
  "Every customer knows 250 other people. Never lose one!",
  "People don't buy products. They buy you!",
  "The only way to make a sale is to believe you can.",
  "Follow up until they buy or die!",
  "Your attitude determines your altitude in sales.",
];

export default function ArenaScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [dailyQuote, setDailyQuote] = useState("");
  const [userName, setUserName] = useState("Champion");

  useEffect(() => {
    loadData();
    const randomQuote =
      MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setDailyQuote(randomQuote);
  }, []);

  const loadData = async () => {
    try {
      const savedStats = await AsyncStorage.getItem("userStats");
      const savedName = await AsyncStorage.getItem("userName");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      if (savedName) {
        setUserName(savedName);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleStartTraining = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("TrainingSession", {
      scenarioId: "quick-start",
      scenarioTitle: "Quick Practice",
      customerType: "random",
    });
  };

  const getLevelColor = () => {
    if (stats.trustPoints >= 500) return Colors.light.accent;
    if (stats.trustPoints >= 200) return Colors.light.success;
    return Colors.light.warning;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Card */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={[styles.welcomeCard, { backgroundColor: Colors.light.primary }]}
      >
        <View style={styles.welcomeContent}>
          <ThemedText style={styles.welcomeGreeting}>
            Welcome back,
          </ThemedText>
          <ThemedText style={styles.welcomeName}>{userName}</ThemedText>
          <ThemedText style={styles.welcomeQuote}>"{dailyQuote}"</ThemedText>
          <ThemedText style={styles.welcomeAttribution}>- Joe Girard</ThemedText>
        </View>
        <Image
          source={require("../../assets/images/joe-avatar.png")}
          style={styles.joeAvatar}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Main Cards Row */}
      <View style={styles.cardsRow}>
        {/* The Arena Card */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.cardHalf}
        >
          <Pressable
            onPress={handleStartTraining}
            style={({ pressed }) => [
              styles.arenaCard,
              { backgroundColor: Colors.light.primary },
              pressed && styles.cardPressed,
            ]}
          >
            <ThemedText style={styles.cardTitle}>THE ARENA</ThemedText>
            <View style={styles.arenaIconContainer}>
              <Feather name="mic" size={32} color={Colors.light.accent} />
            </View>
            <Image
              source={require("../../assets/images/joe-avatar.png")}
              style={styles.smallAvatar}
              resizeMode="cover"
            />
            <View style={styles.speechBubble}>
              <ThemedText style={styles.speechText}>What are you selling today?</ThemedText>
            </View>
            <ThemedText style={styles.arenaSubtitle}>
              Live Sales Shadow - TRAIN WITH JOE
            </ThemedText>
          </Pressable>
        </Animated.View>

        {/* The 250 Map Card */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.cardHalf}
        >
          <View style={[styles.mapCard, { backgroundColor: Colors.light.primary }]}>
            <ThemedText style={styles.cardTitle}>THE 250 MAP</ThemedText>
            <View style={styles.networkIcon}>
              <Feather name="share-2" size={48} color={Colors.light.accent} />
            </View>
            <ThemedText style={styles.networkLabel}>Your Network Growth</ThemedText>
            <ThemedText style={styles.networkNumber}>{stats.connections}</ThemedText>
            <ThemedText style={styles.networkUnit}>CONNECTIONS</ThemedText>
          </View>
        </Animated.View>
      </View>

      {/* Daily Greeting Card */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(500)}
        style={[styles.greetingCard, { backgroundColor: Colors.light.primary }]}
      >
        <View style={styles.greetingIcon}>
          <Feather name="gift" size={24} color={Colors.light.accent} />
        </View>
        <View style={styles.greetingContent}>
          <ThemedText style={styles.greetingTitle}>DAILY GREETING</ThemedText>
          <ThemedText style={styles.greetingText}>
            AI Assistant: {stats.connections > 0
              ? "Check your CRM for follow-up suggestions!"
              : "Complete your first session to get personalized tips!"}
          </ThemedText>
          <Pressable
            style={styles.craftButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Main", { screen: "CRMTab" } as any);
            }}
          >
            <ThemedText style={styles.craftButtonText}>Craft Message</ThemedText>
          </Pressable>
        </View>
      </Animated.View>

      {/* Level Progress */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(500)}
        style={styles.levelSection}
      >
        <View style={styles.levelHeader}>
          <ThemedText style={[styles.levelTitle, { color: theme.text }]}>
            Level: {stats.level}
          </ThemedText>
          <View style={styles.trustPoints}>
            <Feather name="heart" size={16} color={Colors.light.accent} />
            <ThemedText style={[styles.trustPointsText, { color: Colors.light.accent }]}>
              {stats.trustPoints} Trust Points
            </ThemedText>
          </View>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: getLevelColor(),
                width: `${Math.min((stats.trustPoints / 500) * 100, 100)}%`,
              },
            ]}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  welcomeContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  welcomeGreeting: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
  },
  welcomeName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.sm,
  },
  welcomeQuote: {
    color: Colors.light.accent,
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: Spacing.xs,
  },
  welcomeAttribution: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.7,
  },
  joeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.light.accent,
  },
  cardsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cardHalf: {
    flex: 1,
  },
  arenaCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 200,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  arenaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.accent,
    marginBottom: Spacing.xs,
  },
  speechBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  speechText: {
    color: Colors.light.primary,
    fontSize: 11,
  },
  arenaSubtitle: {
    color: "#FFFFFF",
    fontSize: 10,
    opacity: 0.8,
  },
  mapCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minHeight: 200,
    alignItems: "center",
  },
  networkIcon: {
    marginVertical: Spacing.lg,
  },
  networkLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  networkNumber: {
    color: Colors.light.accent,
    fontSize: 32,
    fontFamily: "Montserrat_700Bold",
  },
  networkUnit: {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: 1,
  },
  greetingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  greetingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  greetingContent: {
    flex: 1,
  },
  greetingTitle: {
    color: Colors.light.accent,
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  greetingText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  craftButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: "flex-start",
  },
  craftButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  levelSection: {
    marginTop: Spacing.sm,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  levelTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  trustPoints: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  trustPointsText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
