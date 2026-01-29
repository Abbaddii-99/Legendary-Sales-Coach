import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { saveSession, TrainingSession } from "@/lib/sessionStorage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "SessionSummary">;

interface ScoreCategory {
  nameKey: string;
  score: number;
  maxScore: number;
  icon: keyof typeof Feather.glyphMap;
}

export default function SessionSummaryScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const {
    sessionId,
    scenarioId,
    scenarioTitle,
    customerType,
    score,
    feedback,
    scores,
    messages,
    keyStrengths,
    areasToImprove,
    duration,
    trustPointsEarned,
  } = route.params;

  const [clientName, setClientName] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [showCRMForm, setShowCRMForm] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    // Save session on mount
    if (!sessionSaved) {
      saveSessionData();
    }
  }, []);

  const saveSessionData = async () => {
    const session: TrainingSession = {
      id: sessionId,
      scenarioId,
      scenarioTitle,
      customerType,
      messages,
      scores,
      feedback,
      keyStrengths,
      areasToImprove,
      trustPointsEarned,
      duration,
      createdAt: new Date().toISOString(),
    };

    await saveSession(session);
    setSessionSaved(true);
  };

  const categories: ScoreCategory[] = [
    { nameKey: "buildingRapport", score: scores.buildingRapport, maxScore: 100, icon: "heart" },
    { nameKey: "trustCredibility", score: scores.buildingTrust, maxScore: 100, icon: "shield" },
    { nameKey: "activeListening", score: scores.activeListening, maxScore: 100, icon: "headphones" },
    { nameKey: "objectionHandling", score: scores.handlingObjections, maxScore: 100, icon: "zap" },
    { nameKey: "serviceFocus", score: scores.focusOnService, maxScore: 100, icon: "star" },
  ];

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.popToTop();
  };

  const handleSaveClient = async () => {
    if (!clientName.trim()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const client = {
      id: Date.now().toString(),
      name: clientName.trim(),
      personalNote: personalNote.trim() || (isRTL ? "التقيت أثناء جلسة التدريب" : "Met during training session"),
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

    navigation.popToTop();
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return Colors.light.success;
    if (percentage >= 60) return Colors.light.accent;
    return Colors.light.warning;
  };

  const flexDirection = isRTL ? "row-reverse" : "row";

  const renderScoreBar = (category: ScoreCategory) => {
    const percentage = (category.score / category.maxScore) * 100;
    return (
      <View key={category.nameKey} style={styles.scoreItem}>
        <View style={[styles.scoreHeader, { flexDirection }]}>
          <View style={[styles.scoreLabelContainer, { flexDirection }]}>
            <Feather name={category.icon} size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.scoreLabel, { color: theme.text }]}>
              {t(category.nameKey as any)}
            </ThemedText>
          </View>
          <ThemedText style={[styles.scoreValue, { color: theme.textSecondary }]}>
            {category.score}%
          </ThemedText>
        </View>
        <View style={[styles.scoreBarBg, { backgroundColor: theme.backgroundSecondary }]}>
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={[
              styles.scoreBarFill,
              {
                backgroundColor: getScoreColor(percentage),
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: insets.top + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Image */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        style={styles.successContainer}
      >
        <Image
          source={require("../../assets/images/session-success.png")}
          style={styles.successImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Score Overview */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        style={styles.scoreOverview}
      >
        <ThemedText style={[styles.totalScoreLabel, { color: theme.textSecondary }]}>
          {t("yourScore")}
        </ThemedText>
        <ThemedText style={[styles.totalScore, { color: getScoreColor(score) }]}>
          {score}
        </ThemedText>
        <ThemedText style={[styles.outOf, { color: theme.textSecondary }]}>
          {t("outOf")}
        </ThemedText>
        <View style={[styles.trustPointsBadge, { flexDirection }]}>
          <Feather name="star" size={16} color={Colors.light.accent} />
          <ThemedText style={[styles.trustPointsText, { color: Colors.light.accent }]}>
            +{trustPointsEarned} {t("trustPoints")}
          </ThemedText>
        </View>
      </Animated.View>

      {/* Score Breakdown */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
      >
        <ThemedText style={[styles.cardTitle, { color: theme.text }, isRTL && styles.rtlText]}>
          {t("performanceBreakdown")}
        </ThemedText>
        {categories.map(renderScoreBar)}
      </Animated.View>

      {/* Joe's Feedback */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(500)}
        style={[styles.feedbackCard, { backgroundColor: Colors.light.feedbackBg }]}
      >
        <View style={[styles.feedbackHeader, { flexDirection }]}>
          <Image
            source={require("../../assets/images/joe-avatar.png")}
            style={styles.joeAvatar}
            resizeMode="cover"
          />
          <View style={isRTL ? styles.feedbackTextContainerRTL : undefined}>
            <ThemedText style={styles.feedbackTitle}>{t("joesAssessment")}</ThemedText>
            <ThemedText style={styles.feedbackSubtitle}>{t("yourCoachSays")}</ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.feedbackText, { color: Colors.light.primary }, isRTL && styles.rtlText]}>
          "{feedback}"
        </ThemedText>
      </Animated.View>

      {/* Strengths & Improvements */}
      {(keyStrengths.length > 0 || areasToImprove.length > 0) ? (
        <Animated.View
          entering={FadeInUp.delay(450).duration(500)}
          style={[styles.insightsRow, { flexDirection }]}
        >
          {keyStrengths.length > 0 ? (
            <View
              style={[
                styles.insightCard,
                { backgroundColor: `${Colors.light.success}15` },
              ]}
            >
              <Feather name="thumbs-up" size={20} color={Colors.light.success} />
              <ThemedText
                style={[styles.insightTitle, { color: Colors.light.success }]}
              >
                {t("tipStrength")}
              </ThemedText>
              {keyStrengths.slice(0, 2).map((s, i) => (
                <ThemedText
                  key={i}
                  style={[styles.insightItem, { color: theme.text }, isRTL && styles.rtlText]}
                >
                  • {s}
                </ThemedText>
              ))}
            </View>
          ) : null}

          {areasToImprove.length > 0 ? (
            <View
              style={[
                styles.insightCard,
                { backgroundColor: `${Colors.light.warning}15` },
              ]}
            >
              <Feather name="target" size={20} color={Colors.light.warning} />
              <ThemedText
                style={[styles.insightTitle, { color: Colors.light.warning }]}
              >
                {t("tipPractice")}
              </ThemedText>
              {areasToImprove.slice(0, 2).map((s, i) => (
                <ThemedText
                  key={i}
                  style={[styles.insightItem, { color: theme.text }, isRTL && styles.rtlText]}
                >
                  • {s}
                </ThemedText>
              ))}
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {/* CRM Section */}
      {showCRMForm ? (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        >
          <ThemedText style={[styles.cardTitle, { color: theme.text }, isRTL && styles.rtlText]}>
            {t("saveToCRM")}
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
            value={clientName}
            onChangeText={setClientName}
            placeholder={t("clientName")}
            placeholderTextColor={theme.textSecondary}
          />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
            value={personalNote}
            onChangeText={setPersonalNote}
            placeholder={t("addDetails")}
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
          />
          <View style={[styles.buttonRow, { flexDirection }]}>
            <Pressable
              onPress={() => setShowCRMForm(false)}
              style={[styles.secondaryButton, { borderColor: theme.textSecondary }]}
            >
              <ThemedText style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>
                {t("cancel")}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSaveClient}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: clientName.trim()
                    ? Colors.light.accent
                    : theme.backgroundSecondary,
                },
              ]}
              disabled={!clientName.trim()}
            >
              <Feather
                name="save"
                size={16}
                color={clientName.trim() ? Colors.light.primary : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.primaryButtonText,
                  { color: clientName.trim() ? Colors.light.primary : theme.textSecondary },
                ]}
              >
                {t("saveClient")}
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      ) : (
        <View style={[styles.buttonRow, { flexDirection }]}>
          <Pressable
            onPress={() => setShowCRMForm(true)}
            style={[styles.outlineButton, { borderColor: Colors.light.accent }]}
          >
            <Feather name="user-plus" size={18} color={Colors.light.accent} />
            <ThemedText style={[styles.outlineButtonText, { color: Colors.light.accent }]}>
              {t("saveToCRM")}
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={handleDismiss}
            style={[styles.primaryButton, { backgroundColor: Colors.light.primary }]}
          >
            <ThemedText style={styles.primaryButtonText}>{t("done")}</ThemedText>
          </Pressable>
        </View>
      )}
    </ScrollView>
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
  successContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  successImage: {
    width: 150,
    height: 150,
  },
  scoreOverview: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  totalScoreLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  totalScore: {
    fontSize: 64,
    fontFamily: "Montserrat_700Bold",
  },
  outOf: {
    fontSize: 14,
  },
  trustPointsBadge: {
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: BorderRadius.full,
  },
  trustPointsText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.lg,
  },
  scoreItem: {
    marginBottom: Spacing.md,
  },
  scoreHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  scoreLabelContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  scoreLabel: {
    fontSize: 13,
  },
  scoreValue: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
  scoreBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  feedbackCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  feedbackHeader: {
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  feedbackTextContainerRTL: {
    alignItems: "flex-end",
  },
  joeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.light.accent,
  },
  feedbackTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
    color: Colors.light.primary,
  },
  feedbackSubtitle: {
    fontSize: 11,
    color: Colors.light.primary,
    opacity: 0.7,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  insightsRow: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  insightCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  insightTitle: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },
  insightItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    gap: Spacing.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  outlineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
  },
  outlineButtonText: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
});
