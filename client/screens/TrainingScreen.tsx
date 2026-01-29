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
import { useLanguage } from "@/hooks/useLanguage";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { TranslationKey } from "@/lib/i18n";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Scenario {
  id: string;
  titleKey: TranslationKey;
  categoryKey: TranslationKey;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  customerType: string;
  descriptionEn: string;
  descriptionAr: string;
  focusAreaEn: string;
  focusAreaAr: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "automotive-1",
    titleKey: "theHesitantBuyer",
    categoryKey: "automotive",
    difficulty: "beginner",
    duration: "5-10",
    customerType: "hesitant",
    descriptionEn: "A customer who loves the car but is afraid to commit.",
    descriptionAr: "عميل يحب السيارة لكنه يخاف من الالتزام.",
    focusAreaEn: "Building Trust",
    focusAreaAr: "بناء الثقة",
  },
  {
    id: "automotive-2",
    titleKey: "thePriceShopper",
    categoryKey: "retail",
    difficulty: "intermediate",
    duration: "10-15",
    customerType: "price-focused",
    descriptionEn: "They've visited 5 dealerships and know every competitor's price.",
    descriptionAr: "زار 5 معارض ويعرف أسعار كل المنافسين.",
    focusAreaEn: "Value Selling",
    focusAreaAr: "بيع القيمة",
  },
  {
    id: "automotive-3",
    titleKey: "theAngryReturn",
    categoryKey: "retail",
    difficulty: "advanced",
    duration: "10-15",
    customerType: "angry",
    descriptionEn: "Previous customer unhappy with their purchase.",
    descriptionAr: "عميل سابق غير راضٍ عن مشترياته.",
    focusAreaEn: "Conflict Resolution",
    focusAreaAr: "حل النزاعات",
  },
  {
    id: "realestate-1",
    titleKey: "firstTimeHomebuyer",
    categoryKey: "realEstate",
    difficulty: "beginner",
    duration: "10-15",
    customerType: "nervous",
    descriptionEn: "Young couple making their first major purchase.",
    descriptionAr: "زوجان شابان يقومان بأول عملية شراء كبيرة.",
    focusAreaEn: "Education & Guidance",
    focusAreaAr: "التعليم والإرشاد",
  },
  {
    id: "tech-1",
    titleKey: "enterpriseDecisionMaker",
    categoryKey: "techServices",
    difficulty: "advanced",
    duration: "15-20",
    customerType: "analytical",
    descriptionEn: "CTO evaluating your SaaS platform for their company.",
    descriptionAr: "مدير تقني يقيّم منصتك لشركته.",
    focusAreaEn: "Technical Credibility",
    focusAreaAr: "المصداقية التقنية",
  },
  {
    id: "retail-1",
    titleKey: "theBargainHunter",
    categoryKey: "retail",
    difficulty: "intermediate",
    duration: "5-10",
    customerType: "bargain",
    descriptionEn: "They want the best deal and won't accept list price.",
    descriptionAr: "يريد أفضل صفقة ولن يقبل السعر المعلن.",
    focusAreaEn: "Negotiation",
    focusAreaAr: "التفاوض",
  },
];

const getCategoryIcon = (categoryKey: string): keyof typeof Feather.glyphMap => {
  switch (categoryKey) {
    case "automotive":
      return "truck";
    case "realEstate":
      return "home";
    case "techServices":
      return "cpu";
    case "retail":
      return "shopping-bag";
    default:
      return "briefcase";
  }
};

export default function TrainingScreen() {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLanguage();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return Colors.light.success;
      case "intermediate":
        return Colors.light.warning;
      case "advanced":
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return t("beginner");
      case "intermediate":
        return t("intermediate");
      case "advanced":
        return t("advanced");
      default:
        return difficulty;
    }
  };

  const handleScenarioPress = (scenario: Scenario) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("TrainingSession", {
      scenarioId: scenario.id,
      scenarioTitle: t(scenario.titleKey),
      customerType: scenario.customerType,
    });
  };

  const flexDirection = isRTL ? "row-reverse" : "row";

  const renderScenario = ({ item }: { item: Scenario }) => (
    <Pressable
      onPress={() => handleScenarioPress(item)}
      style={({ pressed }) => [
        styles.scenarioCard,
        { backgroundColor: theme.backgroundDefault, flexDirection },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: Colors.light.primary },
        ]}
      >
        <Feather
          name={getCategoryIcon(item.categoryKey)}
          size={20}
          color={Colors.light.accent}
        />
      </View>
      <View style={[styles.cardContent, isRTL && styles.cardContentRTL]}>
        <View style={styles.cardHeaderText}>
          <ThemedText style={[styles.scenarioTitle, { color: theme.text }, isRTL && styles.rtlText]}>
            {t(item.titleKey)}
          </ThemedText>
          <ThemedText style={[styles.categoryLabel, { color: theme.textSecondary }, isRTL && styles.rtlText]}>
            {t(item.categoryKey)}
          </ThemedText>
        </View>

        <ThemedText
          style={[styles.description, { color: theme.textSecondary }, isRTL && styles.rtlText]}
          numberOfLines={2}
        >
          {isRTL ? item.descriptionAr : item.descriptionEn}
        </ThemedText>

        <View style={[styles.cardFooter, { flexDirection }]}>
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
              {getDifficultyLabel(item.difficulty)}
            </ThemedText>
          </View>
          <View style={[styles.metaInfo, { flexDirection }]}>
            <Feather name="clock" size={12} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {item.duration} {isRTL ? "دقيقة" : "min"}
            </ThemedText>
          </View>
          <View style={[styles.metaInfo, { flexDirection }]}>
            <Feather name="target" size={12} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {isRTL ? item.focusAreaAr : item.focusAreaEn}
            </ThemedText>
          </View>
        </View>
      </View>
      <Feather
        name={isRTL ? "chevron-left" : "chevron-right"}
        size={24}
        color={theme.textSecondary}
      />
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
          <ThemedText style={[styles.headerTitle, { color: theme.text }, isRTL && styles.rtlText]}>
            {t("chooseYourChallenge")}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }, isRTL && styles.rtlText]}>
            {t("masterDifferent")}
          </ThemedText>
        </View>
      }
      ListFooterComponent={
        <View style={[styles.tipCard, { backgroundColor: Colors.light.feedbackBg }]}>
          <View style={[styles.tipHeader, { flexDirection }]}>
            <Image
              source={require("../../assets/images/joe-avatar.png")}
              style={styles.tipAvatar}
              resizeMode="cover"
            />
            <ThemedText style={[styles.tipName, { color: Colors.light.primary }]}>
              {isRTL ? "نصيحة جو" : "Joe's Tip"}
            </ThemedText>
          </View>
          <ThemedText style={[styles.tipText, { color: Colors.light.primary }, isRTL && styles.rtlText]}>
            "{t("quote2")}"
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
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
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
    alignItems: "flex-start",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardContentRTL: {
    alignItems: "flex-end",
  },
  cardHeaderText: {
    marginBottom: Spacing.sm,
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
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  tipCard: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.accent,
    alignItems: "center",
  },
  tipHeader: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.light.accent,
  },
  tipName: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
  },
  tipText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
  },
});
