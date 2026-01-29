import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { reloadAppAsync } from "expo";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

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
  level: "newcomer",
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("Champion");
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const savedName = await AsyncStorage.getItem("userName");
      const savedStats = await AsyncStorage.getItem("userStats");
      if (savedName) setUserName(savedName);
      if (savedStats) setStats(JSON.parse(savedStats));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleEditName = () => {
    setTempName(userName);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      await AsyncStorage.setItem("userName", tempName.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsEditing(false);
  };

  const handleLanguageToggle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleLanguage();
    // Reload app to apply RTL changes
    setTimeout(() => {
      reloadAppAsync();
    }, 500);
  };

  const handleResetProgress = () => {
    Alert.alert(
      t("resetProgress"),
      t("resetProgressConfirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("reset"),
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userStats");
            await AsyncStorage.removeItem("clients");
            await AsyncStorage.removeItem("sessions");
            setStats(DEFAULT_STATS);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const getLevelName = () => {
    if (stats.trustPoints >= 500) return t("masterCloser");
    if (stats.trustPoints >= 200) return t("certifiedDealer");
    if (stats.trustPoints >= 50) return t("apprentice");
    return t("newcomer");
  };

  const flexDirection = isRTL ? "row-reverse" : "row";

  const renderStatItem = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    value: string | number
  ) => (
    <View style={[styles.statItem, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.statIcon, { backgroundColor: Colors.light.primary }]}>
        <Feather name={icon} size={20} color={Colors.light.accent} />
      </View>
      <View>
        <ThemedText style={[styles.statValue, { color: theme.text }]}>
          {value}
        </ThemedText>
        <ThemedText style={[styles.statLabel, { color: theme.textSecondary }, isRTL && styles.rtlText]}>
          {label}
        </ThemedText>
      </View>
    </View>
  );

  const renderSettingItem = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    onPress: () => void,
    danger = false
  ) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingItem,
        { backgroundColor: theme.backgroundDefault, flexDirection },
        pressed && styles.settingPressed,
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: danger ? `${Colors.light.error}20` : `${Colors.light.primary}20` },
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={danger ? Colors.light.error : Colors.light.primary}
        />
      </View>
      <ThemedText
        style={[
          styles.settingLabel,
          { color: danger ? Colors.light.error : theme.text },
          isRTL && styles.rtlText,
        ]}
      >
        {label}
      </ThemedText>
      <Feather
        name={isRTL ? "chevron-left" : "chevron-right"}
        size={20}
        color={theme.textSecondary}
      />
    </Pressable>
  );

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarLarge, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.avatarLargeText}>
            {userName.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        {isEditing ? (
          <View style={[styles.editNameContainer, { flexDirection }]}>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  textAlign: isRTL ? "right" : "center",
                },
              ]}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
              placeholder={t("enterClientName")}
              placeholderTextColor={theme.textSecondary}
            />
            <Pressable
              style={[styles.saveButton, { backgroundColor: Colors.light.accent }]}
              onPress={handleSaveName}
            >
              <Feather name="check" size={20} color={Colors.light.primary} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleEditName} style={[styles.nameContainer, { flexDirection }]}>
            <ThemedText style={[styles.userName, { color: theme.text }]}>
              {userName}
            </ThemedText>
            <Feather name="edit-2" size={16} color={theme.textSecondary} />
          </Pressable>
        )}
        <ThemedText style={[styles.levelBadge, { color: Colors.light.accent }]}>
          {getLevelName()}
        </ThemedText>
      </View>

      {/* Stats Grid */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }, isRTL && styles.rtlText]}>
        {t("yourProgress")}
      </ThemedText>
      <View style={[styles.statsGrid, { flexDirection }]}>
        {renderStatItem("activity", t("sessions"), stats.totalSessions)}
        {renderStatItem("heart", t("trustPoints"), stats.trustPoints)}
        {renderStatItem("users", t("connections"), stats.connections)}
        {renderStatItem("award", t("level"), getLevelName())}
      </View>

      {/* Settings */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }, isRTL && styles.rtlText]}>
        {t("settings")}
      </ThemedText>
      <View style={styles.settingsContainer}>
        {renderSettingItem("globe", language === "ar" ? t("switchToEnglish") : t("switchToArabic"), handleLanguageToggle)}
        {renderSettingItem("info", t("aboutApp"), () => {
          Alert.alert(t("about"), t("aboutDescription"));
        })}
        {renderSettingItem("trash-2", t("resetProgress"), handleResetProgress, true)}
      </View>

      {/* Quote */}
      <View style={[styles.quoteCard, { backgroundColor: Colors.light.feedbackBg }]}>
        <Feather name="star" size={20} color={Colors.light.accent} />
        <ThemedText style={[styles.quoteText, { color: Colors.light.primary }, isRTL && styles.rtlText]}>
          "{t("elevatorQuote")}"
        </ThemedText>
        <ThemedText style={[styles.quoteAuthor, { color: Colors.light.primary }]}>
          - {isRTL ? "جو جيرارد" : "Joe Girard"}
        </ThemedText>
      </View>
    </KeyboardAwareScrollViewCompat>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarLargeText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontFamily: "Montserrat_700Bold",
  },
  nameContainer: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
  },
  editNameContainer: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  nameInput: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    minWidth: 150,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadge: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "47%",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
  },
  statLabel: {
    fontSize: 12,
  },
  settingsContainer: {
    gap: Spacing.sm,
  },
  settingItem: {
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  settingPressed: {
    opacity: 0.8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
  },
  quoteCard: {
    marginTop: Spacing["2xl"],
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
  },
});
