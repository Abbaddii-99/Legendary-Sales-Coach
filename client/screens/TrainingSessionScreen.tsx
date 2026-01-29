import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { apiRequest, getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "TrainingSession">;

interface Message {
  id: string;
  role: "user" | "customer" | "joe";
  content: string;
  timestamp: Date;
}

const CUSTOMER_PERSONAS: Record<string, { name: string; personality: string }> = {
  hesitant: { name: "The Hesitant Buyer", personality: "nervous and indecisive" },
  "price-focused": { name: "The Price Shopper", personality: "analytical and price-conscious" },
  angry: { name: "The Angry Return", personality: "frustrated and upset" },
  nervous: { name: "The First-Timer", personality: "excited but overwhelmed" },
  analytical: { name: "The Analyst", personality: "detail-oriented and skeptical" },
  bargain: { name: "The Bargain Hunter", personality: "deal-seeking and persistent" },
  random: { name: "Mystery Customer", personality: "varied" },
};

export default function TrainingSessionScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { scenarioId, scenarioTitle, customerType } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const persona = CUSTOMER_PERSONAS[customerType] || CUSTOMER_PERSONAS.random;

  useEffect(() => {
    startSession();
    timerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(new URL("/api/training/start", getApiUrl()).href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          customerType,
        }),
      });
      const data = await response.json();
      
      setMessages([
        {
          id: "1",
          role: "customer",
          content: data.greeting || "Hi, I'm looking around today...",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error starting session:", error);
      setMessages([
        {
          id: "1",
          role: "customer",
          content: "Hi there, I'm just browsing today. What do you have?",
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(new URL("/api/training/respond", getApiUrl()).href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          customerType,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();

      // Add Joe's feedback
      if (data.feedback) {
        setMessages((prev) => [
          ...prev,
          {
            id: `joe-${Date.now()}`,
            role: "joe",
            content: data.feedback,
            timestamp: new Date(),
          },
        ]);
      }

      // Add customer response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `customer-${Date.now()}`,
            role: "customer",
            content: data.response || "I see...",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `customer-${Date.now()}`,
          role: "customer",
          content: "Hmm, let me think about that...",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Calculate score based on session
    const score = Math.min(100, Math.floor(50 + messages.filter((m) => m.role === "user").length * 10));
    
    // Save session
    const session = {
      id: Date.now().toString(),
      scenarioId,
      scenarioTitle,
      score,
      duration: sessionTime,
      messages: messages.length,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("sessions");
      const sessions = existing ? JSON.parse(existing) : [];
      sessions.unshift(session);
      await AsyncStorage.setItem("sessions", JSON.stringify(sessions.slice(0, 50)));

      // Update stats
      const statsData = await AsyncStorage.getItem("userStats");
      const stats = statsData ? JSON.parse(statsData) : {
        totalSessions: 0,
        trustPoints: 0,
        connections: 0,
        level: "Newcomer",
      };
      stats.totalSessions += 1;
      stats.trustPoints += Math.floor(score / 10);
      
      if (stats.trustPoints >= 500) stats.level = "Master Closer";
      else if (stats.trustPoints >= 200) stats.level = "Certified Dealer";
      else if (stats.trustPoints >= 50) stats.level = "Apprentice";
      
      await AsyncStorage.setItem("userStats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving session:", error);
    }

    navigation.replace("SessionSummary", {
      sessionId: session.id,
      score,
      feedback: "Great job building rapport with the customer! Keep focusing on active listening.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.role === "joe") {
      return (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[styles.feedbackCard, { backgroundColor: Colors.light.feedbackBg }]}
        >
          <View style={styles.feedbackHeader}>
            <Image
              source={require("../../assets/images/joe-avatar.png")}
              style={styles.joeSmallAvatar}
              resizeMode="cover"
            />
            <ThemedText style={styles.feedbackTitle}>Joe's Feedback</ThemedText>
          </View>
          <ThemedText style={[styles.feedbackText, { color: Colors.light.primary }]}>
            {item.content}
          </ThemedText>
        </Animated.View>
      );
    }

    const isUser = item.role === "user";

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.customerBubble,
          {
            backgroundColor: isUser
              ? Colors.light.primary
              : Colors.light.customerMessage,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.messageText,
            { color: isUser ? "#FFFFFF" : Colors.light.primary },
          ]}
        >
          {item.content}
        </ThemedText>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
            {persona.name}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {scenarioTitle}
          </ThemedText>
        </View>
        <View style={styles.timerContainer}>
          <Feather name="clock" size={14} color={Colors.light.accent} />
          <ThemedText style={[styles.timerText, { color: Colors.light.accent }]}>
            {formatTime(sessionTime)}
          </ThemedText>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.typingIndicator}>
                <ThemedText style={{ color: theme.textSecondary }}>
                  Customer is typing...
                </ThemedText>
              </View>
            ) : null
          }
        />

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: insets.bottom + Spacing.sm,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundSecondary,
                color: theme.text,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Your response..."
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? Colors.light.accent
                  : theme.backgroundSecondary,
              },
            ]}
            disabled={!inputText.trim() || isLoading}
          >
            <Feather
              name="send"
              size={20}
              color={inputText.trim() ? Colors.light.primary : theme.textSecondary}
            />
          </Pressable>
        </View>

        {/* End Session Button */}
        {messages.filter((m) => m.role === "user").length >= 3 ? (
          <Pressable
            onPress={handleEndSession}
            style={[
              styles.endSessionButton,
              { bottom: insets.bottom + 80 },
            ]}
          >
            <Feather name="check-circle" size={16} color="#FFFFFF" />
            <ThemedText style={styles.endSessionText}>End Session</ThemedText>
          </Pressable>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
  },
  headerSubtitle: {
    fontSize: 12,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    borderRadius: BorderRadius.full,
  },
  timerText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: Spacing.xs,
  },
  customerBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: Spacing.xs,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  feedbackCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.accent,
    marginVertical: Spacing.sm,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  joeSmallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  feedbackTitle: {
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
    color: Colors.light.accent,
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
  typingIndicator: {
    paddingVertical: Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  endSessionButton: {
    position: "absolute",
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.light.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  endSessionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
  },
});
