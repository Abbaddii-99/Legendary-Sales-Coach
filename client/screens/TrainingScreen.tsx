import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  customerType: string;
  description: string;
  focusArea: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "automotive-1",
    title: "The Hesitant Buyer",
    category: "Automotive",
    difficulty: "Beginner",
    duration: "5-10 min",
    customerType: "hesitant",
    description: "A customer who loves the car but is afraid to commit.",
    focusArea: "Building Trust",
  },
  {
    id: "automotive-2",
    title: "The Price Shopper",
    category: "Automotive",
    difficulty: "Intermediate",
    duration: "10-15 min",
    customerType: "price-focused",
    description: "They've visited 5 dealerships and know every competitor's price.",
    focusArea: "Value Selling",
  },
  {
    id: "automotive-3",
    title: "The Angry Return",
    category: "Automotive",
    difficulty: "Advanced",
    duration: "10-15 min",
    customerType: "angry",
    description: "Previous customer unhappy with their purchase.",
    focusArea: "Conflict Resolution",
  },
  {
    id: "realestate-1",
    title: "First-Time Homebuyer",
    category: "Real Estate",
    difficulty: "Beginner",
    duration: "10-15 min",
    customerType: "nervous",
    description: "Young couple making their first major purchase.",
    focusArea: "Education & Guidance",
  },
  {
    id: "tech-1",
    title: "Enterprise Decision Maker",
    category: "Tech Services",
    difficulty: "Advanced",
    duration: "15-20 min",
    customerType: "analytical",
    description: "CTO evaluating your SaaS platform for their company.",
    focusArea: "Technical Credibility",
  },
  {
    id: "retail-1",
    title: "The Bargain Hunter",
    category: "Retail",
    difficulty: "Intermediate",
    duration: "5-10 min",
    customerType: "bargain",
    description: "They want the best deal and won't accept list price.",
    focusArea: "Negotiation",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return Colors.light.success;
    case "Intermediate":
      return Colors.light.warning;
    case "Advanced":
      return Colors.light.error;
    default:
      return Colors.light.textSecondary;
  }
};

const getCategoryIcon = (category: string): keyof typeof Feather.glyphMap => {
  switch (category) {
    case "Automotive":
      return "truck";
    case "Real Estate":
      return "home";
    case "Tech Services":
      return "cpu";
    case "Retail":
      return "shopping-bag";
    default:
      return "briefcase";
  }
};

export default function TrainingScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleScenarioPress = (scenario: Scenario) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("TrainingSession", {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      customerType: scenario.customerType,
    });
  };

  const renderScenario = ({ item, index }: { item: Scenario; index: number }) => (
    <Pressable
      onPress={() => handleScenarioPress(item)}
      style={({ pressed }) => [
        styles.scenarioCard,
        { backgroundColor: theme.backgroundDefault },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: Colors.light.primary },
          ]}
        >
          <Feather
            name={getCategoryIcon(item.category)}
            size={20}
            color={Colors.light.accent}
          />
        </View>
        <View style={styles.cardHeaderText}>
          <ThemedText style={[styles.scenarioTitle, { color: theme.text }]}>
            {item.title}
          </ThemedText>
          <ThemedText style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            {item.category}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={24} color={theme.textSecondary} />
      </View>

      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        {item.description}
      </ThemedText>

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: `${getDifficultyColor(item.difficulty)}20` },
          ]}
        >
          <ThemedText
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(item.difficulty) },
            ]}
          >
            {item.difficulty}
          </ThemedText>
        </View>
        <View style={styles.metaInfo}>
          <Feather name="clock" size={12} color={theme.textSecondary} />
          <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.duration}
          </ThemedText>
        </View>
        <View style={styles.metaInfo}>
          <Feather name="target" size={12} color={theme.textSecondary} />
          <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.focusArea}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={SCENARIOS}
      keyExtractor={(item) => item.id}
      renderItem={renderScenario}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
            Choose Your Challenge
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Master different customer personalities and scenarios
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scenarioCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 2,
  },
  categoryLabel: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  difficultyBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: "Montserrat_600SemiBold",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
});
