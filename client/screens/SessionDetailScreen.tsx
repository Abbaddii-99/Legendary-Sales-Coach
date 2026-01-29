import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { TrainingSession, getSession, deleteSession } from "@/lib/sessionStorage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SessionDetailRouteProp = RouteProp<RootStackParamList, "SessionDetail">;

export default function SessionDetailScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SessionDetailRouteProp>();
  const [session, setSession] = useState<TrainingSession | null>(null);

  useEffect(() => {
    loadSession();
  }, [route.params.sessionId]);

  const loadSession = async () => {
    const data = await getSession(route.params.sessionId);
    setSession(data);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t("deleteSession"),
      isRTL ? "هل تريد حذف هذه الجلسة؟" : "Delete this session?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            if (session) {
              await deleteSession(session.id);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar" : "en", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.light.success;
    if (score >= 60) return Colors.light.warning;
    return Colors.light.error;
  };

  const flexDirection = isRTL ? "row-reverse" : "row";

  if (!session) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText style={{ color: theme.textSecondary }}>{t("loading")}</ThemedText>
      </View>
    );
  }

  const scoreCategories = [
    { key: "buildingRapport", value: session.scores.buildingRapport, label: t("buildingRapport") },
    { key: "buildingTrust", value: session.scores.buildingTrust, label: t("trustCredibility") },
    { key: "activeListening", value: session.scores.activeListening, label: t("activeListening") },
    { key: "handlingObjections", value: session.scores.handlingObjections, label: t("objectionHandling") },
    { key: "focusOnService", value: session.scores.focusOnService, label: t("serviceFocus") },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.headerCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <View
          style={[
            styles.scoreCircle,
            { backgroundColor: `${getScoreColor(session.scores.overall)}20` },
          ]}
        >
          <ThemedText
            style={[styles.scoreText, { color: getScoreColor(session.scores.overall) }]}
          >
            {session.scores.overall}
          </ThemedText>
          <ThemedText style={[styles.scoreLabel, { color: theme.textSecondary }]}>
            {t("outOf")}
          </ThemedText>
        </View>

        <ThemedText
          style={[styles.scenarioTitle, { color: theme.text }, isRTL && styles.rtlText]}
        >
          {session.scenarioTitle}
        </ThemedText>

        <ThemedText
          style={[styles.dateText, { color: theme.textSecondary }, isRTL && styles.rtlText]}
        >
          {formatDate(session.createdAt)}
        </ThemedText>

        <View style={[styles.metaRow, { flexDirection }]}>
          <View style={[styles.metaItem, { flexDirection }]}>
            <Feather name="clock" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {formatDuration(session.duration)}
            </ThemedText>
          </View>
          <View style={[styles.metaItem, { flexDirection }]}>
            <Feather name="star" size={16} color={Colors.light.accent} />
            <ThemedText style={[styles.metaText, { color: Colors.light.accent }]}>
              +{session.trustPointsEarned} {t("trustPoints")}
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Score Breakdown */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
      >
        <ThemedText
          style={[styles.sectionTitle, { color: theme.text }, isRTL && styles.rtlText]}
        >
          {t("performanceBreakdown")}
        </ThemedText>

        {scoreCategories.map((cat) => (
          <View key={cat.key} style={styles.scoreRow}>
            <View style={[styles.scoreLabelRow, { flexDirection }]}>
              <ThemedText style={[styles.categoryLabel, { color: theme.textSecondary }]}>
                {cat.label}
              </ThemedText>
              <ThemedText
                style={[styles.categoryScore, { color: getScoreColor(cat.value) }]}
              >
                {cat.value}%
              </ThemedText>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.backgroundRoot }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${cat.value}%`, backgroundColor: getScoreColor(cat.value) },
                ]}
              />
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Feedback */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={[styles.section, { backgroundColor: Colors.light.feedbackBg }]}
      >
        <View style={[styles.feedbackHeader, { flexDirection }]}>
          <Feather name="message-circle" size={20} color={Colors.light.accent} />
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>
            {t("joesAssessment")}
          </ThemedText>
        </View>
        <ThemedText
          style={[styles.feedbackText, { color: Colors.light.primary }, isRTL && styles.rtlText]}
        >
          {session.feedback}
        </ThemedText>
      </Animated.View>

      {/* Strengths & Improvements */}
      {(session.keyStrengths.length > 0 || session.areasToImprove.length > 0) ? (
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[styles.insightsRow, { flexDirection }]}
        >
          {session.keyStrengths.length > 0 ? (
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
              {session.keyStrengths.map((s, i) => (
                <ThemedText
                  key={i}
                  style={[styles.insightItem, { color: theme.text }, isRTL && styles.rtlText]}
                >
                  • {s}
                </ThemedText>
              ))}
            </View>
          ) : null}

          {session.areasToImprove.length > 0 ? (
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
              {session.areasToImprove.map((s, i) => (
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

      {/* Conversation History */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={[styles.section, { backgroundColor: theme.backgroundDefault }]}
      >
        <ThemedText
          style={[styles.sectionTitle, { color: theme.text }, isRTL && styles.rtlText]}
        >
          {t("conversationHistory")}
        </ThemedText>

        {session.messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageRow,
              msg.role === "user" ? styles.userMessage : styles.assistantMessage,
              { flexDirection: msg.role === "user" ? (isRTL ? "row" : "row-reverse") : flexDirection },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.role === "user"
                  ? { backgroundColor: Colors.light.accent }
                  : { backgroundColor: theme.backgroundRoot },
              ]}
            >
              <ThemedText
                style={[
                  styles.messageText,
                  {
                    color: msg.role === "user" ? Colors.light.primary : theme.text,
                  },
                  isRTL && styles.rtlText,
                ]}
              >
                {msg.content}
              </ThemedText>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Delete Button */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)}>
        <Pressable
          onPress={handleDelete}
          style={[styles.deleteButton, { borderColor: Colors.light.error }]}
        >
          <Feather name="trash-2" size={18} color={Colors.light.error} />
          <ThemedText style={[styles.deleteButtonText, { color: Colors.light.error }]}>
            {t("deleteSession")}
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  headerCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  scoreText: {
    fontSize: 28,
    fontFamily: "Montserrat_700Bold",
  },
  scoreLabel: {
    fontSize: 12,
  },
  scenarioTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  metaRow: {
    gap: Spacing.xl,
  },
  metaItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 14,
  },
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: Spacing.md,
  },
  scoreRow: {
    marginBottom: Spacing.md,
  },
  scoreLabelRow: {
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categoryScore: {
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
  feedbackHeader: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
  messageRow: {
    marginBottom: Spacing.sm,
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  assistantMessage: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
});
