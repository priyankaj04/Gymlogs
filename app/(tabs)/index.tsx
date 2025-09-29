import FontTest from "@/components/FontTest";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "start-workout":
        router.push("/schedule");
        break;
      case "add-exercise":
        router.push("/exercises");
        break;
      case "view-plans":
        router.push("/plans");
        break;
    }
  };

  const quickActions = [
    {
      id: "start-workout",
      title: "Start Today's Workout",
      subtitle: "Push Day - 60 min",
      icon: "play-circle",
      color: colors.tint,
    },
    {
      id: "add-exercise",
      title: "Add Exercise",
      subtitle: "Create new exercise",
      icon: "add-circle",
      color: "#10B981",
    },
    {
      id: "view-plans",
      title: "Workout Plans",
      subtitle: "4 plans created",
      icon: "list",
      color: "#6366F1",
    },
    {
      id: "view-stats",
      title: "View Progress",
      subtitle: "Check your stats",
      icon: "stats-chart",
      color: "#F59E0B",
    },
  ];

  const stats = [
    { label: "Total Exercises", value: "24", icon: "fitness" },
    { label: "Workout Plans", value: "4", icon: "list-circle" },
    { label: "This Week", value: "3/5", icon: "calendar" },
    { label: "Streak", value: "7 days", icon: "flame" },
  ];

  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[Typography.h1, { color: Colors.dark.text }]}>
                Gym Logs App
              </Text>

              <ThemedText style={styles.greeting}>Good morning!</ThemedText>
              <ThemedText style={styles.subtitle}>
                Ready for your workout?
              </ThemedText>
            </View>
            <View style={styles.profileIcon}>
              <Ionicons name="person-circle" size={40} color={colors.icon} />
            </View>
          </View>

          <View style={styles.statsContainer}>
            <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View
                  key={index}
                  style={[styles.statCard, { backgroundColor: colors.card }]}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={24}
                    color={colors.tint}
                  />
                  <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                  <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.quickActionsContainer}>
            <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, { backgroundColor: colors.card }]}
                  onPress={() => handleQuickAction(action.id)}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.actionContent}>
                    <ThemedText style={styles.actionTitle}>
                      {action.title}
                    </ThemedText>
                    <ThemedText style={styles.actionSubtitle}>
                      {action.subtitle}
                    </ThemedText>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <FontTest />

          <View style={styles.recentActivity}>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <View
              style={[styles.activityCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: colors.tint },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <ThemedText style={styles.activityTitle}>
                    Completed Push Day
                  </ThemedText>
                  <ThemedText style={styles.activityTime}>
                    Yesterday, 6:30 PM
                  </ThemedText>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View
                  style={[styles.activityIcon, { backgroundColor: "#10B981" }]}
                >
                  <Ionicons name="add" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <ThemedText style={styles.activityTitle}>
                    Added new exercise
                  </ThemedText>
                  <ThemedText style={styles.activityTime}>
                    2 days ago
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  profileIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
});
