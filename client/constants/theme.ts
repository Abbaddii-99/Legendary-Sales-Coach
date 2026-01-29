import { Platform } from "react-native";

// Girard's Legacy Color Palette
const navyPrimary = "#1A2B4A";
const goldAccent = "#D4AF37";
const offWhiteBg = "#F8F9FA";
const surfaceWhite = "#FFFFFF";
const charcoalText = "#2C3E50";
const graySecondary = "#6C757D";
const emeraldSuccess = "#27AE60";
const amberWarning = "#F39C12";
const crimsonError = "#C0392B";

// Semantic Colors
const customerMessageBg = "#E3F2FD";
const feedbackCardBg = "#FFF9E6";
const feedbackCardBorder = "#D4AF37";

export const Colors = {
  light: {
    text: charcoalText,
    textSecondary: graySecondary,
    buttonText: "#FFFFFF",
    tabIconDefault: graySecondary,
    tabIconSelected: goldAccent,
    link: goldAccent,
    primary: navyPrimary,
    accent: goldAccent,
    success: emeraldSuccess,
    warning: amberWarning,
    error: crimsonError,
    backgroundRoot: offWhiteBg,
    backgroundDefault: surfaceWhite,
    backgroundSecondary: "#F0F1F3",
    backgroundTertiary: "#E6E7E9",
    backgroundNavy: navyPrimary,
    customerMessage: customerMessageBg,
    feedbackBg: feedbackCardBg,
    feedbackBorder: feedbackCardBorder,
    cardBorder: "#E0E0E0",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: goldAccent,
    link: goldAccent,
    primary: "#0F1A2E",
    accent: goldAccent,
    success: emeraldSuccess,
    warning: amberWarning,
    error: crimsonError,
    backgroundRoot: "#0F1A2E",
    backgroundDefault: "#1A2B4A",
    backgroundSecondary: "#243552",
    backgroundTertiary: "#2E3F5C",
    backgroundNavy: "#0F1A2E",
    customerMessage: "#1E3A5F",
    feedbackBg: "#2A2A1F",
    feedbackBorder: goldAccent,
    cardBorder: "#3A4A5A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    fontFamily: "Montserrat_700Bold",
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    fontFamily: "Montserrat_700Bold",
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  h4: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
