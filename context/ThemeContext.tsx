import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  surfaceVariant: string;

  // Glass effects
  glassBackground: string;
  glassBorder: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Interactive elements
  primary: string;
  primaryVariant: string;
  secondary: string;
  accent: string;

  // States
  success: string;
  warning: string;
  error: string;

  // Shadows
  shadowColor: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

// Warm, friendly color palettes
const lightColors: ThemeColors = {
  // Warm cream and soft backgrounds
  background: "#fef7f0",
  surface: "#ffffff",
  surfaceVariant: "#f8f4f0",

  // Glass effects with warm tones
  glassBackground: "rgba(255, 248, 235, 0.8)",
  glassBorder: "rgba(209, 157, 89, 0.2)",

  // Rich text colors
  text: "#2d2926",
  textSecondary: "#5c5650",
  textTertiary: "#8a8278",

  // Warm, inviting interactive colors
  primary: "#d19d59", // Warm golden
  primaryVariant: "#e6b470",
  secondary: "#8fbc8f", // Sage green
  accent: "#ff8a80", // Coral

  // States
  success: "#66bb6a",
  warning: "#ffb74d",
  error: "#ef5350",

  shadowColor: "#d19d59",
};

const darkColors: ThemeColors = {
  // Deep, cozy backgrounds
  background: "#1a1614",
  surface: "#2a2420",
  surfaceVariant: "#332e28",

  // Glass effects with warm undertones
  glassBackground: "rgba(42, 36, 32, 0.8)",
  glassBorder: "rgba(209, 157, 89, 0.3)",

  // Warm text colors
  text: "#f5f1eb",
  textSecondary: "#d4cfc4",
  textTertiary: "#a8a299",

  // Warm interactive colors for dark mode
  primary: "#e6b470", // Lighter golden
  primaryVariant: "#f2c88a",
  secondary: "#a8d5a8", // Light sage
  accent: "#ffab91", // Warm coral

  // States
  success: "#81c784",
  warning: "#ffcc02",
  error: "#ff7043",

  shadowColor: "#000000",
};

const themes: Record<ThemeMode, Theme> = {
  light: {
    mode: "light",
    colors: lightColors,
  },
  dark: {
    mode: "dark",
    colors: darkColors,
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    // Initialize with system theme preference
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme) {
      setThemeMode(colorScheme);
    }

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setThemeMode(colorScheme);
      }
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const theme = themes[themeMode];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
