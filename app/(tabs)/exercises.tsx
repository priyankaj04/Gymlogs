import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BodyPart, Exercise, ExerciseType } from "@/types/gym";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "all">(
    "all"
  );
  const [selectedType, setSelectedType] = useState<ExerciseType | "all">("all");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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
    // For now, just show an alert - we'll create proper pages later
    Alert.alert("Exercise Details", `Viewing exercise ${exerciseId}`);
  };

  const handleEditPress = (exerciseId: string) => {
    Alert.alert("Edit Exercise", `Editing exercise ${exerciseId}`);
  };

  const handleAddPress = () => {
    Alert.alert("Add Exercise", "Add new exercise functionality coming soon!");
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[styles.exerciseCard, { backgroundColor: colors.card }]}
      onPress={() => handleExercisePress(item.id)}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.bodyPartBadge]}>
              <Text style={styles.badgeText}>{item.bodyPart}</Text>
            </View>
            <View style={[styles.badge, styles.typeBadge]}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
            {item.difficulty && (
              <View style={[styles.badge, styles.difficultyBadge]}>
                <Text style={styles.badgeText}>{item.difficulty}</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleEditPress(item.id)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.exerciseDescription} numberOfLines={2}>
        {item.description}
      </ThemedText>
    </TouchableOpacity>
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Exercises</ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.icon} />
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={bodyParts}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                { borderColor: colors.border },
                selectedBodyPart === item && { backgroundColor: colors.tint },
              ]}
              onPress={() => setSelectedBodyPart(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedBodyPart === item ? "white" : colors.text },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={exerciseTypes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                { borderColor: colors.border },
                selectedType === item && { backgroundColor: colors.tint },
              ]}
              onPress={() => setSelectedType(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedType === item ? "white" : colors.text },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bodyPartBadge: {
    backgroundColor: "#3B82F6",
  },
  typeBadge: {
    backgroundColor: "#10B981",
  },
  difficultyBadge: {
    backgroundColor: "#F59E0B",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  editButton: {
    padding: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
});
