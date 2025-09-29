import {
  AnimatedBadge,
  AnimatedButton,
  AnimatedCard,
  FadeInView,
  SlideInView
} from "@/components/ui/AnimatedComponents";
import { BorderRadius, Colors, Layout, Spacing } from "@/constants/theme";
import { Typography } from "@/constants/Typography";
import { BodyPart, Exercise, ExerciseType } from "@/types/gym";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Mock data for now - will be replaced with actual storage later
const mockExercises: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    bodyPart: "chest",
    type: "compound",
    description:
      "A compound exercise that primarily targets the chest, shoulders, and triceps.",
    difficulty: "intermediate",
    equipment: ["barbell", "bench"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Pull-ups",
    bodyPart: "back",
    type: "compound",
    description:
      "A bodyweight exercise that targets the back muscles and biceps.",
    difficulty: "intermediate",
    equipment: ["pull-up bar"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Running",
    bodyPart: "full-body",
    type: "cardio",
    description: "Cardiovascular exercise for endurance and fat burning.",
    difficulty: "beginner",
    equipment: ["treadmill"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const { width } = Dimensions.get('window');

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "all">("all");
  const [selectedType, setSelectedType] = useState<ExerciseType | "all">("all");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBodyPart =
      selectedBodyPart === "all" || exercise.bodyPart === selectedBodyPart;
    const matchesType =
      selectedType === "all" || exercise.type === selectedType;

    return matchesSearch && matchesBodyPart && matchesType;
  });

  const handleExercisePress = (exerciseId: string) => {
    Alert.alert("Exercise Details", `Viewing exercise ${exerciseId}`);
  };

  const handleEditPress = (exerciseId: string) => {
    Alert.alert("Edit Exercise", `Editing exercise ${exerciseId}`);
  };

  const handleAddPress = () => {
    Alert.alert("Add Exercise", "Add new exercise functionality coming soon!");
  };

  const getBodyPartColor = (bodyPart: string) => {
    const colors: { [key: string]: string } = {
      chest: Colors.primary,
      back: Colors.success,
      shoulders: Colors.warning,
      biceps: Colors.info,
      triceps: Colors.error,
      legs: '#9C27B0',
      glutes: '#E91E63',
      core: '#FF5722',
      calves: '#795548',
      forearms: '#607D8B',
      'full-body': Colors.gray600,
    };
    return colors[bodyPart] || Colors.gray500;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      cardio: '#F44336',
      compound: Colors.primary,
      isolated: Colors.info,
      mobility: Colors.success,
    };
    return colors[type] || Colors.gray500;
  };

  const renderExerciseItem = ({ item, index }: { item: Exercise; index: number }) => (
    <FadeInView delay={index * 100}>
      <AnimatedCard
        onPress={() => handleExercisePress(item.id)}
        style={styles.exerciseCard}
        elevation="md"
        padding="lg"
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={Typography.h6}>{item.name}</Text>
            <View style={styles.badgeContainer}>
              <AnimatedBadge
                text={item.bodyPart}
                variant="primary"
                size="small"
              />
              <AnimatedBadge
                text={item.type}
                variant="secondary"
                size="small"
              />
              {item.difficulty && (
                <AnimatedBadge
                  text={item.difficulty}
                  variant="success"
                  size="small"
                />
              )}
            </View>
          </View>
          <AnimatedCard
            onPress={() => handleEditPress(item.id)}
            style={styles.editButton}
            elevation="sm"
            padding="sm"
          >
            <Ionicons name="pencil" size={18} color={Colors.primary} />
          </AnimatedCard>
        </View>
        <Text style={[Typography.description, { marginTop: Spacing.sm }]} numberOfLines={2}>
          {item.description}
        </Text>
      </AnimatedCard>
    </FadeInView>
  );

  const bodyParts: (BodyPart | "all")[] = [
    "all",
    "chest",
    "back",
    "shoulders",
    "biceps",
    "triceps",
    "legs",
    "glutes",
    "core",
    "calves",
    "forearms",
    "full-body",
  ];

  const exerciseTypes: (ExerciseType | "all")[] = [
    "all",
    "cardio",
    "compound",
    "isolated",
    "mobility",
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <FadeInView style={styles.header}>
        <Text style={Typography.h3}>Exercises</Text>
        <AnimatedButton
          title="Add"
          onPress={handleAddPress}
          variant="primary"
          size="medium"
          style={styles.addButton}
        />
      </FadeInView>

      {/* Search Bar */}
      <SlideInView delay={100} style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={Colors.gray400} />
          <TextInput
            style={styles.textInput}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SlideInView>

      {/* Body Part Filters */}
      <SlideInView delay={200} style={styles.filtersContainer}>
        <Text style={[Typography.label, { marginBottom: Spacing.sm }]}>Body Parts</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={bodyParts}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <AnimatedCard
              onPress={() => setSelectedBodyPart(item)}
              style={selectedBodyPart === item ? styles.activeFilterChip : styles.filterChip}
              elevation={selectedBodyPart === item ? "md" : "sm"}
              padding="sm"
            >
              <Text
                style={[
                  Typography.caption,
                  { color: selectedBodyPart === item ? Colors.white : Colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </AnimatedCard>
          )}
        />
      </SlideInView>

      {/* Exercise Type Filters */}
      <SlideInView delay={300} style={styles.filtersContainer}>
        <Text style={[Typography.label, { marginBottom: Spacing.sm }]}>Exercise Types</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={exerciseTypes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <AnimatedCard
              onPress={() => setSelectedType(item)}
              style={selectedType === item ? styles.activeFilterChip : styles.filterChip}
              elevation={selectedType === item ? "md" : "sm"}
              padding="sm"
            >
              <Text
                style={[
                  Typography.caption,
                  { color: selectedType === item ? Colors.white : Colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </AnimatedCard>
          )}
        />
      </SlideInView>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.xl,
  },
  addButton: {
    minWidth: 80,
  },
  searchContainer: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textPrimary,
  },
  filtersContainer: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 60,
    alignItems: 'center',
  },
  activeFilterChip: {
    marginRight: Spacing.sm,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    minWidth: 60,
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.md,
  },
  exerciseCard: {
    marginBottom: Spacing.md,
    minHeight: 120,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
