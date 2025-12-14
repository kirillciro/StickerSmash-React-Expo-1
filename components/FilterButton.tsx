import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface FilterButtonProps {
  onApplyFilter: (filter: string) => void;
  currentFilter?: string;
}

const filters = [
  { name: "None", value: "none", icon: "clear" },
  { name: "Sepia", value: "sepia", icon: "photo-filter" },
  { name: "Blur", value: "blur", icon: "blur-on" },
  { name: "Invert", value: "invert", icon: "invert-colors" },
  { name: "Grayscale", value: "grayscale", icon: "gradient" },
];

export default function FilterButton({
  onApplyFilter,
  currentFilter = "none",
}: FilterButtonProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [showFilters, setShowFilters] = React.useState(false);

  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onApplyFilter(filter);
    setShowFilters(false);
  };

  const toggleFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      {showFilters && (
        <View
          style={[
            styles.filtersContainer,
            {
              backgroundColor: colors.glassBackground,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.value}
              style={({ pressed }) => [
                styles.filterItem,
                {
                  backgroundColor:
                    currentFilter === filter.value
                      ? colors.primary + "30"
                      : pressed
                        ? colors.primary + "20"
                        : "transparent",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={() => handleFilterPress(filter.value)}
            >
              <MaterialIcons
                name={filter.icon as any}
                size={20}
                color={
                  currentFilter === filter.value
                    ? colors.primaryVariant
                    : colors.primary
                }
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      currentFilter === filter.value
                        ? colors.primaryVariant
                        : colors.text,
                    fontWeight: currentFilter === filter.value ? "600" : "500",
                  },
                ]}
              >
                {filter.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.toggleButton,
          {
            backgroundColor: colors.glassBackground,
            borderColor: colors.glassBorder,
            shadowColor: colors.shadowColor,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
        onPress={toggleFilters}
      >
        <MaterialIcons name="tune" size={20} color={colors.primary} />
        <Text style={[styles.toggleText, { color: colors.text }]}>Filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  filtersContainer: {
    minWidth: 120,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
