import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  TrainingSession,
  SessionAnalytics,
  getSessions,
  getAnalytics,
  deleteSession,
} from "@/lib/sessionStorage";
import { TranslationKey } from "@/lib/i18n";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SessionHistoryScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [sessionsData, analyticsData] = await Promise.all([
      getSessions(),
      getAnalytics(),
    ]);
    setSessions(sessionsData);
    setAnalytics(analyticsData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteSession = (session: TrainingSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t("deleteSession"),
      isRTL
        ? `هل تريد حذف جلسة "${session.scenarioTitle}"?`
        : `Delete session "${session.scenarioTitle}"?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            await deleteSession(session.id);
            await loadData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleViewSession = (session: TrainingSession) => {
    Haptics.selectionAsync();
    navigation.navigate("SessionDetail", { sessionId: session.id });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} ${t("minutes")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.light.success;
    if (score >= 60) return Colors.light.warning;
    return Colors.light.error;
  };

  const getCategoryLabel = (key: string): string => {
    const categoryMap: Record<string, TranslationKey> = {
      buildingRapport: "buildingRapport",
      buildingTrust: "trustCredibility",
      activeListening: "activeListening",
      handlingObjections: "objectionHandling",
      focusOnService: "serviceFocus",
    };
    return t(categoryMap[key] || "buildingRapport");
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return "trending-up";
      case "declining":
        return "trending-down";
      default:
        return "minus";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return Colors.light.success;
      case "declining":
        return Colors.light.error;
      default:
        return Colors.light.warning;
    }
  };

  const flexDirection = isRTL ? "row-reverse" : "row";

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        <ThemedText
          style={[styles.sectionTitle, { color: theme.text }, isRTL && styles.rtlText]}
        >
          {t("analytics")}
        </ThemedText>

        {/* Stats Grid */}
        <View style={[styles.statsGrid, { flexDirection }]}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="bar-chart-2" size={24} color={Colors.light.accent} />
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {analytics.totalSessions}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t("totalSessions")}
            </ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="target" size={24} color={Colors.light.accent} />
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {analytics.averageScore}%
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t("averageScore")}
            </ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="calendar" size={24} color={Colors.light.accent} />
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {analytics.sessionsThisWeek}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t("weeklyProgress")}
            </ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="zap" size={24} color={Colors.light.accent} />
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {analytics.streakDays}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t("streak")}
            </ThemedText>
          </View>
        </View>

        {/* Trend Card */}
        <View
          style={[
            styles.trendCard,
            { backgroundColor: theme.backgroundDefault, flexDirection },
          ]}
        >
          <View style={[styles.trendInfo, isRTL && styles.trendInfoRTL]}>
            <ThemedText
              style={[styles.trendLabel, { color: theme.textSecondary }, isRTL && styles.rtlText]}
            >
              {t("performanceTrend")}
            </ThemedText>
            <ThemedText
              style={[
                styles.trendValue,
                { color: getTrendColor(analytics.recentTrend) },
                isRTL && styles.rtlText,
              ]}
            >
              {t(analytics.recentTrend as TranslationKey)}
            </ThemedText>
          </View>
          <View
            style={[
              styles.trendIconContainer,
              { backgroundColor: `${getTrendColor(analytics.recentTrend)}20` },
            ]}
          >
            <Feather
              name={getTrendIcon(analytics.recentTrend) as any}
              size={24}
              color={getTrendColor(analytics.recentTrend)}
            />
          </View>
        </View>

        {/* Best & Worst Categories */}
        <View style={[styles.categoriesRow, { flexDirection }]}>
          <View
            style={[
              styles.categoryCard,
              { backgroundColor: `${Colors.light.success}15` },
            ]}
          >
            <Feather name="award" size={20} color={Colors.light.success} />
            <ThemedText
              style={[styles.categoryLabel, { color: theme.textSecondary }, isRTL && styles.rtlText]}
            >
              {t("bestCategory")}
            </ThemedText>
            <ThemedText
              style={[styles.categoryValue, { color: Colors.light.success }, isRTL && styles.rtlText]}
            >
              {getCategoryLabel(analytics.bestCategory)}
            </ThemedText>
          </View>

          <View
            style={[
              styles.categoryCard,
              { backgroundColor: `${Colors.light.warning}15` },
            ]}
          >
            <Feather name="alert-circle" size={20} color={Colors.light.warning} />
            <ThemedText
              style={[styles.categoryLabel, { color: theme.textSecondary }, isRTL && styles.rtlText]}
            >
              {t("needsWork")}
            </ThemedText>
            <ThemedText
              style={[styles.categoryValue, { color: Colors.light.warning }, isRTL && styles.rtlText]}
            >
              {getCategoryLabel(analytics.worstCategory)}
            </ThemedText>
          </View>
        </View>

        {/* Score Breakdown */}
        <View style={[styles.breakdownCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText
            style={[styles.breakdownTitle, { color: theme.text }, isRTL && styles.rtlText]}
          >
            {t("scoreBreakdown")}
          </ThemedText>
          {Object.entries(analytics.scoresByCategory).map(([key, value]) => (
            <View key={key} style={styles.breakdownRow}>
              <View style={[styles.breakdownLabelRow, { flexDirection }]}>
                <ThemedText
                  style={[styles.breakdownLabel, { color: theme.textSecondary }]}
                >
                  {getCategoryLabel(key)}
                </ThemedText>
                <ThemedText style={[styles.breakdownValue, { color: theme.text }]}>
                  {value}%
                </ThemedText>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.backgroundRoot }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${value}%`,
                      backgroundColor: getScoreColor(value),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderSession = ({ item, index }: { item: TrainingSession; index: number }) => (
    <Animated.View entering={FadeInDown.delay(100 + index * 50).duration(300)}>
      <Pressable
        onPress={() => handleViewSession(item)}
        onLongPress={() => handleDeleteSession(item)}
        style={({ pressed }) => [
          styles.sessionCard,
          { backgroundColor: theme.backgroundDefault },
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.sessionHeader, { flexDirection }]}>
          <View
            style={[
              styles.scoreCircle,
              { backgroundColor: `${getScoreColor(item.scores.overall)}20` },
            ]}
          >
            <ThemedText
              style={[styles.scoreText, { color: getScoreColor(item.scores.overall) }]}
            >
              {item.scores.overall}
            </ThemedText>
          </View>
          <View style={[styles.sessionInfo, isRTL && styles.sessionInfoRTL]}>
            <ThemedText
              style={[styles.sessionTitle, { color: theme.text }, isRTL && styles.rtlText]}
            >
              {item.scenarioTitle}
            </ThemedText>
            <ThemedText
              style={[styles.sessionDate, { color: theme.textSecondary }, isRTL && styles.rtlText]}
            >
              {formatDate(item.createdAt)}
            </ThemedText>
          </View>
          <Feather
            name={isRTL ? "chevron-left" : "chevron-right"}
            size={20}
            color={theme.textSecondary}
          />
        </View>

        <View style={[styles.sessionMeta, { flexDirection }]}>
          <View style={[styles.metaItem, { flexDirection }]}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {formatDuration(item.duration)}
            </ThemedText>
          </View>
          <View style={[styles.metaItem, { flexDirection }]}>
            <Feather name="star" size={14} color={Colors.light.accent} />
            <ThemedText style={[styles.metaText, { color: Colors.light.accent }]}>
              +{item.trustPointsEarned} {t("trustPoints")}
            </ThemedText>
          </View>
        </View>

        {item.keyStrengths.length > 0 ? (
          <View style={[styles.strengthsRow, { flexDirection }]}>
            {item.keyStrengths.slice(0, 2).map((strength, i) => (
              <View
                key={i}
                style={[styles.strengthBadge, { backgroundColor: `${Colors.light.success}15` }]}
              >
                <ThemedText style={[styles.strengthText, { color: Colors.light.success }]}>
                  {strength}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={64} color={theme.textSecondary} />
      <ThemedText
        style={[styles.emptyTitle, { color: theme.text }, isRTL && styles.rtlText]}
      >
        {t("noSessionsYet")}
      </ThemedText>
      <ThemedText
        style={[styles.emptyText, { color: theme.textSecondary }, isRTL && styles.rtlText]}
      >
        {t("startTraining")}
      </ThemedText>
    </View>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
        flexGrow: sessions.length === 0 ? 1 : undefined,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={sessions}
      keyExtractor={(item) => item.id}
      renderItem={renderSession}
      ListHeaderComponent={analytics ? renderAnalytics() : null}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: "48%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  trendCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  trendInfo: {
    flex: 1,
  },
  trendInfoRTL: {
    alignItems: "flex-end",
  },
  trendLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  trendValue: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  trendIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.xs,
  },
  categoryLabel: {
    fontSize: 11,
  },
  categoryValue: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  breakdownCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  breakdownTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: Spacing.md,
  },
  breakdownRow: {
    marginBottom: Spacing.md,
  },
  breakdownLabelRow: {
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  breakdownLabel: {
    fontSize: 13,
  },
  breakdownValue: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  sessionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  sessionHeader: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.md,
  },
  scoreText: {
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionInfoRTL: {
    alignItems: "flex-end",
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 12,
  },
  sessionMeta: {
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  strengthsRow: {
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  strengthBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  strengthText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
