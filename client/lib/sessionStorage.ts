import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SessionMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SessionScores {
  buildingRapport: number;
  buildingTrust: number;
  activeListening: number;
  handlingObjections: number;
  focusOnService: number;
  overall: number;
}

export interface TrainingSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  customerType: string;
  messages: SessionMessage[];
  scores: SessionScores;
  feedback: string;
  keyStrengths: string[];
  areasToImprove: string[];
  trustPointsEarned: number;
  duration: number; // in seconds
  createdAt: string;
}

export interface SessionAnalytics {
  totalSessions: number;
  averageScore: number;
  totalTrustPoints: number;
  bestCategory: string;
  worstCategory: string;
  recentTrend: "improving" | "declining" | "stable";
  scoresByCategory: {
    buildingRapport: number;
    buildingTrust: number;
    activeListening: number;
    handlingObjections: number;
    focusOnService: number;
  };
  sessionsThisWeek: number;
  streakDays: number;
}

const SESSIONS_KEY = "training_sessions";
const ANALYTICS_KEY = "session_analytics";

export async function saveSession(session: TrainingSession): Promise<void> {
  try {
    const existing = await getSessions();
    const updated = [session, ...existing];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    await updateAnalytics(updated);
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

export async function getSessions(): Promise<TrainingSession[]> {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading sessions:", error);
    return [];
  }
}

export async function getSession(id: string): Promise<TrainingSession | null> {
  try {
    const sessions = await getSessions();
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    console.error("Error loading session:", error);
    return null;
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const sessions = await getSessions();
    const updated = sessions.filter((s) => s.id !== id);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    await updateAnalytics(updated);
  } catch (error) {
    console.error("Error deleting session:", error);
  }
}

async function updateAnalytics(sessions: TrainingSession[]): Promise<void> {
  if (sessions.length === 0) {
    await AsyncStorage.removeItem(ANALYTICS_KEY);
    return;
  }

  const categoryTotals = {
    buildingRapport: 0,
    buildingTrust: 0,
    activeListening: 0,
    handlingObjections: 0,
    focusOnService: 0,
  };

  let totalScore = 0;
  let totalTrustPoints = 0;

  sessions.forEach((s) => {
    categoryTotals.buildingRapport += s.scores.buildingRapport;
    categoryTotals.buildingTrust += s.scores.buildingTrust;
    categoryTotals.activeListening += s.scores.activeListening;
    categoryTotals.handlingObjections += s.scores.handlingObjections;
    categoryTotals.focusOnService += s.scores.focusOnService;
    totalScore += s.scores.overall;
    totalTrustPoints += s.trustPointsEarned;
  });

  const count = sessions.length;
  const scoresByCategory = {
    buildingRapport: Math.round(categoryTotals.buildingRapport / count),
    buildingTrust: Math.round(categoryTotals.buildingTrust / count),
    activeListening: Math.round(categoryTotals.activeListening / count),
    handlingObjections: Math.round(categoryTotals.handlingObjections / count),
    focusOnService: Math.round(categoryTotals.focusOnService / count),
  };

  const categoryNames = {
    buildingRapport: "buildingRapport",
    buildingTrust: "buildingTrust",
    activeListening: "activeListening",
    handlingObjections: "handlingObjections",
    focusOnService: "focusOnService",
  };

  const entries = Object.entries(scoresByCategory);
  const bestEntry = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
  const worstEntry = entries.reduce((a, b) => (a[1] < b[1] ? a : b));

  // Calculate trend based on last 5 sessions
  let trend: "improving" | "declining" | "stable" = "stable";
  if (sessions.length >= 3) {
    const recent = sessions.slice(0, 3);
    const older = sessions.slice(3, 6);
    if (older.length > 0) {
      const recentAvg = recent.reduce((sum, s) => sum + s.scores.overall, 0) / recent.length;
      const olderAvg = older.reduce((sum, s) => sum + s.scores.overall, 0) / older.length;
      if (recentAvg > olderAvg + 5) trend = "improving";
      else if (recentAvg < olderAvg - 5) trend = "declining";
    }
  }

  // Sessions this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.createdAt) > weekAgo
  ).length;

  // Calculate streak
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i <= 30; i++) {
    const checkDate = new Date(today.getTime() - i * dayMs);
    const hasSession = sessions.some((s) => {
      const sessionDate = new Date(s.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === checkDate.getTime();
    });
    if (hasSession) {
      streakDays++;
    } else if (i > 0) {
      break;
    }
  }

  const analytics: SessionAnalytics = {
    totalSessions: count,
    averageScore: Math.round(totalScore / count),
    totalTrustPoints,
    bestCategory: bestEntry[0],
    worstCategory: worstEntry[0],
    recentTrend: trend,
    scoresByCategory,
    sessionsThisWeek,
    streakDays,
  };

  await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export async function getAnalytics(): Promise<SessionAnalytics | null> {
  try {
    const data = await AsyncStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading analytics:", error);
    return null;
  }
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
