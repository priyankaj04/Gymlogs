import {
  AnimatedBadge,
  AnimatedCard,
  FadeInView,
  SlideInView
} from "@/components/ui/AnimatedComponents";
import { BorderRadius, Colors, Layout, Shadows, Spacing } from "@/constants/theme";
import { Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const scrollY = React.useRef(new Animated.Value(0)).current;

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
      case "view-stats":
        // TODO: Navigate to stats page when created
        break;
    }
  };

  const quickActions = [
    {
      id: "start-workout",
      title: "Start Today's Workout",
      subtitle: "Push Day - 60 min",
      icon: "play-circle" as const,
      color: Colors.primary,
      gradient: [Colors.primary, Colors.primaryDark],
    },
    {
      id: "add-exercise",
      title: "Add Exercise",
      subtitle: "Create new exercise",
      icon: "add-circle" as const,
      color: Colors.success,
      gradient: [Colors.success, '#388E3C'],
    },
    {
      id: "view-plans",
      title: "Workout Plans",
      subtitle: "4 plans created",
      icon: "list" as const,
      color: Colors.info,
      gradient: [Colors.info, '#1976D2'],
    },
    {
      id: "view-stats",
      title: "View Progress",
      subtitle: "Check your stats",
      icon: "stats-chart" as const,
      color: Colors.warning,
      gradient: [Colors.warning, '#F57C00'],
    },
  ];

  const stats = [
    { label: "Total Exercises", value: "24", icon: "fitness", change: "+3" },
    { label: "Workout Plans", value: "4", icon: "list-circle", change: "+1" },
    { label: "This Week", value: "3/5", icon: "calendar", change: "60%" },
    { label: "Current Streak", value: "7 days", icon: "flame", change: "🔥" },
  ];

  const recentActivities = [
    {
      title: "Completed Push Day",
      subtitle: "60 min workout • 8 exercises",
      time: "Yesterday, 6:30 PM",
      icon: "checkmark-circle",
      color: Colors.success,
    },
    {
      title: "Added new exercise",
      subtitle: "Incline Dumbbell Press",
      time: "2 days ago",
      icon: "add-circle",
      color: Colors.primary,
    },
    {
      title: "Created Pull Day plan",
      subtitle: "12 exercises added",
      time: "3 days ago",
      icon: "create",
      color: Colors.info,
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <FadeInView style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={Typography.h2}>Good morning! 👋</Text>
              <Text style={[Typography.body, { marginTop: Spacing.xs }]}>
                Ready to crush your workout?
              </Text>
            </View>
            <View style={styles.profileIcon}>
              <Ionicons name="person-circle" size={44} color={Colors.gray400} />
            </View>
          </View>
        </FadeInView>

        {/* Stats Overview */}
        <SlideInView delay={200} style={styles.section}>
          <Text style={[Typography.h4, { marginBottom: Spacing.lg }]}>
            Your Progress
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <FadeInView key={index} delay={300 + index * 100}>
                <AnimatedCard 
                  style={styles.statCard}
                  elevation="md"
                  padding="lg"
                >
                  <View style={styles.statIconContainer}>
                    <Ionicons
                      name={stat.icon as any}
                      size={24}
                      color={Colors.primary}
                    />
                    <AnimatedBadge
                      text={stat.change}
                      variant="primary"
                      size="small"
                      style={styles.statBadge}
                    />
                  </View>
                  <Text style={[Typography.h3, { marginTop: Spacing.sm }]}>
                    {stat.value}
                  </Text>
                  <Text style={[Typography.caption, { marginTop: Spacing.xs }]}>
                    {stat.label}
                  </Text>
                </AnimatedCard>
              </FadeInView>
            ))}
          </View>
        </SlideInView>

        {/* Quick Actions */}
        <SlideInView delay={400} style={styles.section}>
          <Text style={[Typography.h4, { marginBottom: Spacing.lg }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <FadeInView key={action.id} delay={500 + index * 100}>
                <AnimatedCard
                  onPress={() => handleQuickAction(action.id)}
                  style={styles.actionCard}
                  elevation="lg"
                  padding="lg"
                >
                  <View style={styles.actionContent}>
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: action.color },
                      ]}
                    >
                      <Ionicons
                        name={action.icon}
                        size={24}
                        color={Colors.white}
                      />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={Typography.h6}>{action.title}</Text>
                      <Text style={[Typography.caption, { marginTop: Spacing.xs }]}>
                        {action.subtitle}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray400}
                    />
                  </View>
                </AnimatedCard>
              </FadeInView>
            ))}
          </View>
        </SlideInView>

        {/* Recent Activity */}
        <SlideInView delay={600} style={styles.section}>
          <Text style={[Typography.h4, { marginBottom: Spacing.lg }]}>
            Recent Activity
          </Text>
          <AnimatedCard elevation="md" padding="lg">
            {recentActivities.map((activity, index) => (
              <FadeInView key={index} delay={700 + index * 100}>
                <View style={[styles.activityItem, index < recentActivities.length - 1 && styles.activityItemBorder]}>
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: activity.color },
                    ]}
                  >
                    <Ionicons name={activity.icon as any} size={16} color={Colors.white} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={Typography.label}>{activity.title}</Text>
                    <Text style={[Typography.caption, { marginTop: 2 }]}>
                      {activity.subtitle}
                    </Text>
                    <Text style={[Typography.caption, { 
                      marginTop: Spacing.xs, 
                      color: Colors.textTertiary 
                    }]}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
              </FadeInView>
            ))}
          </AnimatedCard>
        </SlideInView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Layout.screenPadding * 2,
  },
  header: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing['2xl'],
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  profileIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray100,
  },
  section: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing['2xl'],
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    minWidth: (width - Layout.screenPadding * 2 - Spacing.md) / 2 - Spacing.md,
    maxWidth: (width - Layout.screenPadding * 2 - Spacing.md) / 2,
    alignItems: "center",
    minHeight: 120,
  },
  statIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  statBadge: {
    marginLeft: Spacing.sm,
  },
  actionsGrid: {
    gap: Spacing.md,
  },
  actionCard: {
    minHeight: 80,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
    ...Shadows.sm,
  },
  actionText: {
    flex: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
});
