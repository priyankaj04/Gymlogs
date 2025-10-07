import { ExerciseAPI, ExerciseFilters } from "@/api/exercise";
import { FadeInView } from "@/components/ui/AnimatedComponents";
import { Spacing } from "@/constants/theme";
import { BodyPart, Exercise, ExerciseType } from "@/types/gym";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// API-based exercise management

const { width, height } = Dimensions.get("window");

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false);
  const [updatingExercise, setUpdatingExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "all">(
    "all"
  );
  const [selectedType, setSelectedType] = useState<ExerciseType | "all">("all");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load exercises from API
  const loadExercises = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (!append) {
          setLoading(true);
        }

        const filters: ExerciseFilters = {
          bodyPart: selectedBodyPart,
          exerciseType: selectedType,
          search: searchQuery || undefined,
        };

        const response = await ExerciseAPI.getExercises(filters);

        console.log("response", response)

        if (append) {
          setExercises((prev) => [...prev, ...response.data]);
        } else {
          setExercises(response.data);
        }
      } catch (error) {
        console.error("Error loading exercises:", error);
        Alert.alert(
          "Error",
          "Failed to load exercises. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedBodyPart, selectedType, searchQuery]
  );

  // Refresh exercises
  const refreshExercises = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadExercises(1, false);
  }, [loadExercises]);

  // Load more exercises (pagination)
  const loadMoreExercises = useCallback(async () => {
    if (hasMore && !loading) {
      await loadExercises(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadExercises]);

  // Initial load and when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadExercises(1, false);
  }, [selectedBodyPart, selectedType, searchQuery]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1);
        loadExercises(1, false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Dropdown states for add exercise modal
  const [showBodyPartDropdown, setShowBodyPartDropdown] = useState(false);
  const [showExerciseTypeDropdown, setShowExerciseTypeDropdown] =
    useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);

  // Dropdown states for edit exercise modal
  const [showEditBodyPartDropdown, setShowEditBodyPartDropdown] =
    useState(false);
  const [showEditExerciseTypeDropdown, setShowEditExerciseTypeDropdown] =
    useState(false);
  const [showEditDifficultyDropdown, setShowEditDifficultyDropdown] =
    useState(false);

  // Add exercise form state
  const [newExercise, setNewExercise] = useState({
    name: "",
    bodyPart: "chest" as BodyPart,
    type: "compound" as ExerciseType,
    description: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    equipment: "",
  });

  // Edit exercise form state
  const [editExercise, setEditExercise] = useState({
    name: "",
    bodyPart: "chest" as BodyPart,
    type: "compound" as ExerciseType,
    description: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    equipment: "",
  });

  // Exercises are already filtered by the API
  const filteredExercises = exercises;

  const handleExercisePress = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (exercise) {
      setViewingExercise(exercise);
      setShowViewModal(true);
    }
  };

  const handleEditPress = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (exercise) {
      setEditingExercise(exercise);
      setEditExercise({
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        type: exercise.type,
        description: exercise.description,
        difficulty: exercise.difficulty || "beginner",
        equipment: exercise.equipment?.join(", ") || "",
      });
      setShowEditModal(true);
    }
  };

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  const closeAllDropdowns = () => {
    setShowBodyPartDropdown(false);
    setShowExerciseTypeDropdown(false);
    setShowDifficultyDropdown(false);
  };

  const closeAllEditDropdowns = () => {
    setShowEditBodyPartDropdown(false);
    setShowEditExerciseTypeDropdown(false);
    setShowEditDifficultyDropdown(false);
  };

  const handleAddExercise = async () => {
    if (!newExercise.name.trim()) {
      Alert.alert("Error", "Exercise name is required.");
      return;
    }

    try {
      setAddingExercise(true);

      const exerciseData: Omit<Exercise, "createdAt" | "updatedAt"> = {
        id: `ex_${Date.now()}`,
        name: newExercise.name.trim(),
        bodyPart: newExercise.bodyPart,
        type: newExercise.type,
        description: newExercise.description.trim(),
        difficulty: newExercise.difficulty,
        equipment: newExercise.equipment
          ? newExercise.equipment
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
      };

      await ExerciseAPI.createExercise(exerciseData);

      // Reset form
      setNewExercise({
        name: "",
        bodyPart: "chest",
        type: "compound",
        description: "",
        difficulty: "beginner",
        equipment: "",
      });

      setShowAddModal(false);
      closeAllDropdowns();

      // Refresh exercises list
      await refreshExercises();

      Alert.alert("Success", "Exercise added successfully!");
    } catch (error) {
      console.error("Error adding exercise:", error);
      Alert.alert("Error", "Failed to add exercise. Please try again.");
    } finally {
      setAddingExercise(false);
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise || !editExercise.name.trim()) {
      Alert.alert("Error", "Exercise name is required.");
      return;
    }

    try {
      setUpdatingExercise(true);

      const updates = {
        name: editExercise.name.trim(),
        bodyPart: editExercise.bodyPart,
        type: editExercise.type,
        description: editExercise.description.trim(),
        difficulty: editExercise.difficulty,
        equipment: editExercise.equipment
          ? editExercise.equipment
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
      };

      await ExerciseAPI.updateExercise(editingExercise.id, updates);

      setShowEditModal(false);
      setEditingExercise(null);
      closeAllEditDropdowns();

      // Refresh exercises list
      await refreshExercises();

      Alert.alert("Success", "Exercise updated successfully!");
    } catch (error) {
      console.error("Error updating exercise:", error);
      Alert.alert("Error", "Failed to update exercise. Please try again.");
    } finally {
      setUpdatingExercise(false);
    }
  };

  const clearFilters = () => {
    setSelectedBodyPart("all");
    setSelectedType("all");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedBodyPart !== "all") count++;
    if (selectedType !== "all") count++;
    return count;
  };

  const getDifficultyColor = (difficulty: string): [string, string] => {
    switch (difficulty) {
      case "beginner":
        return ["#10B981", "#059669"];
      case "intermediate":
        return ["#F59E0B", "#D97706"];
      case "advanced":
        return ["#EF4444", "#DC2626"];
      default:
        return ["#6B7280", "#4B5563"];
    }
  };

  const getBodyPartImage = (bodyPart: string, type: string = '') => {

    if(['cardio', 'calisthenics', 'endurance'].includes(type)){
      const typeImageMap: { [key: string]: any } = {
        cardio: require("@/assets/images/bodyparts/cardio.png"),
        calisthenics: require("@/assets/images/bodyparts/calithenics.png"),
        endurance: require("@/assets/images/bodyparts/endurance.png"),
      }
      return typeImageMap[type];
    }
    const imageMap: { [key: string]: any } = {
      chest: require("@/assets/images/bodyparts/chest.png"),
      lowerback: require("@/assets/images/bodyparts/lowerback.png"),
      shoulders: require("@/assets/images/bodyparts/sholders.png"),
      biceps: require("@/assets/images/bodyparts/biceps.png"),
      triceps: require("@/assets/images/bodyparts/triceps.png"),
      legs: require("@/assets/images/bodyparts/middlequads.png"),
      glutes: require("@/assets/images/bodyparts/glutes.png"),
      core: require("@/assets/images/bodyparts/abs.png"),
      calves: require("@/assets/images/bodyparts/calves.png"),
      forearms: require("@/assets/images/bodyparts/forearms.png"),
      "full-body": require("@/assets/images/bodyparts/abs.png"),
      upperabs: require("@/assets/images/bodyparts/upperabs.png"),
      reardelts: require("@/assets/images/bodyparts/reardelts.png"),
      lats: require("@/assets/images/bodyparts/lats.png"),
      back: require("@/assets/images/bodyparts/lats.png"),
      innerquads: require("@/assets/images/bodyparts/innerquads.png"),
      traps: require("@/assets/images/bodyparts/traps.png"),
      hamstrings: require("@/assets/images/bodyparts/hamstrings.png"),
      frontcalves: require("@/assets/images/bodyparts/frontcalves.png"),
      middlequads: require("@/assets/images/bodyparts/middlequads.png"),
      sideabs: require("@/assets/images/bodyparts/sideabs.png"),
    };
    return imageMap[bodyPart] || require("@/assets/images/bodyparts/chest.png");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderExerciseItem = ({
    item,
    index,
  }: {
    item: Exercise;
    index: number;
  }) => (
    <FadeInView delay={index * 50}>
      <TouchableOpacity
        onPress={() => handleExercisePress(item.id)}
        style={styles.exerciseCard}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={["#FFFFFF", "#F8FAFC"]}
          style={styles.cardGradient}
        >
          <View style={styles.exerciseHeader}>
            <View style={styles.iconContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={getBodyPartImage(item.bodyPart, item.type)}
                  style={styles.bodyPartImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.exerciseContent}>
              <View style={styles.titleRow}>
                <Text style={styles.exerciseTitle}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleEditPress(item.id)}
                  style={styles.editButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={14} color="#FB923C" />
                </TouchableOpacity>
              </View>

              <Text style={styles.exerciseDescription} numberOfLines={1}>
                {item.description}
              </Text>

              <View style={styles.badgeRow}>
                <View style={styles.bodyPartBadge}>
                  <Text style={styles.bodyPartText}>{item.bodyPart}</Text>
                </View>

                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>

                <LinearGradient
                  colors={getDifficultyColor(item?.difficulty ?? "")}
                  style={styles.difficultyBadge}
                >
                  <Text style={styles.difficultyText}>{item.difficulty}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </FadeInView>
  );

  const bodyParts: (BodyPart | "all")[] = [
    "all",
    "chest",
    "lowerback",
    "back",
    "shoulders",
    "upperabs",
    "sideabs",
    "biceps",
    "triceps",
    "legs",
    "middlequads",
    "innerquads",
    "hamstrings",
    "glutes",
    "core",
    "calves",
    "frontcalves",
    "forearms",
    "lats",
    "traps",
    "reardelts",
    "full-body",
  ];

  const exerciseTypes: (ExerciseType | "all")[] = [
    "all",
    "cardio",
    "compound",
    "isolated",
    "mobility",
    "calisthenics",
    "endurance",
  ];

  const difficulties = ["beginner", "intermediate", "advanced"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FB923C" />

      {/* Compact Header */}
      <LinearGradient
        colors={["#FB923C", "#F97316"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Exercises</Text>
            <Text style={styles.headerCount}>
              {filteredExercises?.length} available
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddPress}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Compact Search & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFiltersModal(true)}
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <Ionicons name="options" size={16} color="#FB923C" />
            {getActiveFiltersCount() > 0 && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={[
          styles.listContainer,
          filteredExercises?.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={refreshExercises}
        ListEmptyComponent={() =>
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Exercises Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ||
                selectedBodyPart !== "all" ||
                selectedType !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Start by adding your first exercise"}
              </Text>
              {!searchQuery &&
                selectedBodyPart === "all" &&
                selectedType === "all" && (
                  <TouchableOpacity
                    style={styles.emptyActionButton}
                    onPress={handleAddPress}
                  >
                    <LinearGradient
                      colors={["#FB923C", "#F97316"]}
                      style={styles.emptyActionGradient}
                    >
                      <Ionicons name="add" size={20} color="#FFFFFF" />
                      <Text style={styles.emptyActionText}>Add Exercise</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
            </View>
          ) : null
        }
        ListFooterComponent={() =>
          loading && exercises.length > 0 ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#FB923C" />
              <Text style={styles.loadingText}>Loading more exercises...</Text>
            </View>
          ) : null
        }
      />

      {/* Filters Modal */}
      <Modal
        visible={showFiltersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFiltersModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            {/* Body Parts */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Body Parts</Text>
              <View style={styles.chipGrid}>
                {bodyParts.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setSelectedBodyPart(item)}
                    style={[
                      styles.filterChip,
                      selectedBodyPart === item && styles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedBodyPart === item && styles.activeChipText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Exercise Types */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Types</Text>
              <View style={styles.chipGrid}>
                {exerciseTypes.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setSelectedType(item)}
                    style={[
                      styles.filterChip,
                      selectedType === item && styles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedType === item && styles.activeChipText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowFiltersModal(false)}
              style={styles.applyButton}
            >
              <LinearGradient
                colors={["#FB923C", "#F97316"]}
                style={styles.applyGradient}
              >
                <Text style={styles.applyText}>Apply</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                closeAllDropdowns();
              }}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newExercise.name}
                onChangeText={(text) =>
                  setNewExercise({ ...newExercise, name: text })
                }
                placeholder="Exercise name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newExercise.description}
                onChangeText={(text) =>
                  setNewExercise({ ...newExercise, description: text })
                }
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Equipment</Text>
              <TextInput
                style={styles.input}
                value={newExercise.equipment}
                onChangeText={(text) =>
                  setNewExercise({ ...newExercise, equipment: text })
                }
                placeholder="e.g., barbell, bench"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Body Part</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllDropdowns();
                    setShowBodyPartDropdown(!showBodyPartDropdown);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {newExercise.bodyPart}
                  </Text>
                  <Ionicons
                    name={showBodyPartDropdown ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showBodyPartDropdown && (
                  <ScrollView
                    style={styles.dropdownMenu}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {bodyParts
                      .filter((part) => part !== "all")
                      .map((part, index) => (
                        <TouchableOpacity
                          key={part}
                          style={[
                            styles.dropdownItem,
                            index ===
                              bodyParts.filter((p) => p !== "all").length - 1 &&
                              styles.lastDropdownItem,
                          ]}
                          onPress={() => {
                            setNewExercise({
                              ...newExercise,
                              bodyPart: part as BodyPart,
                            });
                            setShowBodyPartDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              newExercise.bodyPart === part &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {part}
                          </Text>
                          {newExercise.bodyPart === part && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FB923C"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Exercise Type</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllDropdowns();
                    setShowExerciseTypeDropdown(!showExerciseTypeDropdown);
                  }}
                >
                  <Text style={styles.dropdownText}>{newExercise.type}</Text>
                  <Ionicons
                    name={
                      showExerciseTypeDropdown ? "chevron-up" : "chevron-down"
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showExerciseTypeDropdown && (
                  <View style={styles.dropdownMenu}>
                    {exerciseTypes
                      .filter((type) => type !== "all")
                      .map((type, index) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.dropdownItem,
                            index ===
                              exerciseTypes.filter((t) => t !== "all").length -
                                1 && styles.lastDropdownItem,
                          ]}
                          onPress={() => {
                            setNewExercise({
                              ...newExercise,
                              type: type as ExerciseType,
                            });
                            setShowExerciseTypeDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              newExercise.type === type &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {type}
                          </Text>
                          {newExercise.type === type && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FB923C"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty Level</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllDropdowns();
                    setShowDifficultyDropdown(!showDifficultyDropdown);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {newExercise.difficulty}
                  </Text>
                  <Ionicons
                    name={
                      showDifficultyDropdown ? "chevron-up" : "chevron-down"
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showDifficultyDropdown && (
                  <View style={styles.dropdownMenu}>
                    {difficulties.map((difficulty, index) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.dropdownItem,
                          index === difficulties.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                        onPress={() => {
                          setNewExercise({
                            ...newExercise,
                            difficulty: difficulty as
                              | "beginner"
                              | "intermediate"
                              | "advanced",
                          });
                          setShowDifficultyDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            newExercise.difficulty === difficulty &&
                              styles.selectedDropdownText,
                          ]}
                        >
                          {difficulty}
                        </Text>
                        {newExercise.difficulty === difficulty && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FB923C"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                closeAllDropdowns();
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddExercise}
              style={styles.applyButton}
              disabled={!newExercise.name.trim() || addingExercise}
            >
              <LinearGradient
                colors={
                  !newExercise.name.trim() || addingExercise
                    ? ["#9CA3AF", "#6B7280"]
                    : ["#FB923C", "#F97316"]
                }
                style={styles.applyGradient}
              >
                {addingExercise ? (
                  <View style={styles.loadingButtonContent}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.applyText}>Adding...</Text>
                  </View>
                ) : (
                  <Text style={styles.applyText}>Add</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Exercise Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setEditingExercise(null);
                closeAllEditDropdowns();
              }}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editExercise.name}
                onChangeText={(text) =>
                  setEditExercise({ ...editExercise, name: text })
                }
                placeholder="Exercise name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editExercise.description}
                onChangeText={(text) =>
                  setEditExercise({ ...editExercise, description: text })
                }
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Equipment</Text>
              <TextInput
                style={styles.input}
                value={editExercise.equipment}
                onChangeText={(text) =>
                  setEditExercise({ ...editExercise, equipment: text })
                }
                placeholder="e.g., barbell, bench"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Body Part</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllEditDropdowns();
                    setShowEditBodyPartDropdown(!showEditBodyPartDropdown);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {editExercise.bodyPart}
                  </Text>
                  <Ionicons
                    name={
                      showEditBodyPartDropdown ? "chevron-up" : "chevron-down"
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showEditBodyPartDropdown && (
                  <ScrollView
                    style={styles.dropdownMenu}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {bodyParts
                      .filter((part) => part !== "all")
                      .map((part, index) => (
                        <TouchableOpacity
                          key={part}
                          style={[
                            styles.dropdownItem,
                            index ===
                              bodyParts.filter((p) => p !== "all").length - 1 &&
                              styles.lastDropdownItem,
                          ]}
                          onPress={() => {
                            setEditExercise({
                              ...editExercise,
                              bodyPart: part as BodyPart,
                            });
                            setShowEditBodyPartDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              editExercise.bodyPart === part &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {part}
                          </Text>
                          {editExercise.bodyPart === part && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FB923C"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Exercise Type</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllEditDropdowns();
                    setShowEditExerciseTypeDropdown(
                      !showEditExerciseTypeDropdown
                    );
                  }}
                >
                  <Text style={styles.dropdownText}>{editExercise.type}</Text>
                  <Ionicons
                    name={
                      showEditExerciseTypeDropdown
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showEditExerciseTypeDropdown && (
                  <View style={styles.dropdownMenu}>
                    {exerciseTypes
                      .filter((type) => type !== "all")
                      .map((type, index) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.dropdownItem,
                            index ===
                              exerciseTypes.filter((t) => t !== "all").length -
                                1 && styles.lastDropdownItem,
                          ]}
                          onPress={() => {
                            setEditExercise({
                              ...editExercise,
                              type: type as ExerciseType,
                            });
                            setShowEditExerciseTypeDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              editExercise.type === type &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {type}
                          </Text>
                          {editExercise.type === type && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FB923C"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty Level</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    closeAllEditDropdowns();
                    setShowEditDifficultyDropdown(!showEditDifficultyDropdown);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {editExercise.difficulty}
                  </Text>
                  <Ionicons
                    name={
                      showEditDifficultyDropdown ? "chevron-up" : "chevron-down"
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {showEditDifficultyDropdown && (
                  <View style={styles.dropdownMenu}>
                    {difficulties.map((difficulty, index) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.dropdownItem,
                          index === difficulties.length - 1 &&
                            styles.lastDropdownItem,
                        ]}
                        onPress={() => {
                          setEditExercise({
                            ...editExercise,
                            difficulty: difficulty as
                              | "beginner"
                              | "intermediate"
                              | "advanced",
                          });
                          setShowEditDifficultyDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            editExercise.difficulty === difficulty &&
                              styles.selectedDropdownText,
                          ]}
                        >
                          {difficulty}
                        </Text>
                        {editExercise.difficulty === difficulty && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FB923C"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setEditingExercise(null);
                closeAllEditDropdowns();
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdateExercise}
              style={styles.applyButton}
              disabled={!editExercise.name.trim() || updatingExercise}
            >
              <LinearGradient
                colors={
                  !editExercise.name.trim() || updatingExercise
                    ? ["#9CA3AF", "#6B7280"]
                    : ["#FB923C", "#F97316"]
                }
                style={styles.applyGradient}
              >
                {updatingExercise ? (
                  <View style={styles.loadingButtonContent}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.applyText}>Updating...</Text>
                  </View>
                ) : (
                  <Text style={styles.applyText}>Update</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* View Exercise Modal */}
      <Modal
        visible={showViewModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            style={styles.viewModalHeader}
          >
            <View style={styles.viewModalHeaderContent}>
              <View style={styles.viewModalTitleContainer}>
                <Text style={styles.modalTitle}>{viewingExercise?.name}</Text>
                <View style={styles.viewModalBadgeRow}>
                  <View style={styles.viewBodyPartBadge}>
                    <Image
                      source={getBodyPartImage(viewingExercise?.bodyPart || "")}
                      style={styles.viewBodyPartImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.viewBodyPartText}>
                      {viewingExercise?.bodyPart}
                    </Text>
                  </View>
                  <LinearGradient
                    colors={getDifficultyColor(
                      viewingExercise?.difficulty || ""
                    )}
                    style={styles.viewDifficultyBadge}
                  >
                    <Text style={styles.viewDifficultyText}>
                      {viewingExercise?.difficulty}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={styles.viewModalActions}>
                <TouchableOpacity
                  onPress={() => {
                    setShowViewModal(false);
                    if (viewingExercise) {
                      handleEditPress(viewingExercise.id);
                    }
                  }}
                  style={styles.viewEditButton}
                >
                  <Ionicons name="pencil" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowViewModal(false);
                    setViewingExercise(null);
                  }}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.viewModalContent}
            contentContainerStyle={styles.viewModalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Exercise Type Card */}
            <View style={styles.viewCard}>
              <View style={styles.viewCardHeader}>
                <Ionicons name="barbell" size={20} color="#FB923C" />
                <Text style={styles.viewCardTitle}>Exercise Type</Text>
              </View>
              <View style={styles.viewTypeContainer}>
                <View style={styles.viewTypeBadge}>
                  <Text style={styles.viewTypeText}>
                    {viewingExercise?.type}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description Card */}
            {viewingExercise?.description && (
              <View style={styles.viewCard}>
                <View style={styles.viewCardHeader}>
                  <Ionicons name="document-text" size={20} color="#FB923C" />
                  <Text style={styles.viewCardTitle}>Description</Text>
                </View>
                <Text style={styles.viewDescriptionText}>
                  {viewingExercise.description}
                </Text>
              </View>
            )}

            {/* Equipment Card */}
            {viewingExercise?.equipment &&
              viewingExercise.equipment.length > 0 && (
                <View style={styles.viewCard}>
                  <View style={styles.viewCardHeader}>
                    <Ionicons name="hardware-chip" size={20} color="#FB923C" />
                    <Text style={styles.viewCardTitle}>Equipment</Text>
                  </View>
                  <View style={styles.viewEquipmentContainer}>
                    {viewingExercise.equipment.map((item, index) => (
                      <View key={index} style={styles.viewEquipmentChip}>
                        <Text style={styles.viewEquipmentText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Exercise Details Card */}
            <View style={styles.viewCard}>
              <View style={styles.viewCardHeader}>
                <Ionicons name="information-circle" size={20} color="#FB923C" />
                <Text style={styles.viewCardTitle}>Details</Text>
              </View>
              <View style={styles.viewDetailsContainer}>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>Created</Text>
                  <Text style={styles.viewDetailValue}>
                    {viewingExercise?.createdAt
                      ? formatDate(viewingExercise.createdAt)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>Last Updated</Text>
                  <Text style={styles.viewDetailValue}>
                    {viewingExercise?.updatedAt
                      ? formatDate(viewingExercise.updatedAt)
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailLabel}>Exercise ID</Text>
                  <Text style={styles.viewDetailValue}>
                    #{viewingExercise?.id}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.viewBottomActions}>
              <TouchableOpacity
                style={styles.viewActionButton}
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Workout logging feature will be available soon!"
                  )
                }
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.viewActionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.viewActionButtonContent}>
                    <View style={styles.viewActionButtonIconContainer}>
                      <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.viewActionButtonTextContainer}>
                      <Text style={styles.viewActionButtonTitle}>
                        Log Workout
                      </Text>
                      <Text style={styles.viewActionButtonSubtitle}>
                        Start tracking sets & reps
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewActionButton}
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Exercise history feature will be available soon!"
                  )
                }
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#3B82F6", "#1D4ED8"]}
                  style={styles.viewActionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.viewActionButtonContent}>
                    <View style={styles.viewActionButtonIconContainer}>
                      <Ionicons name="bar-chart" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.viewActionButtonTextContainer}>
                      <Text style={styles.viewActionButtonTitle}>
                        View History
                      </Text>
                      <Text style={styles.viewActionButtonSubtitle}>
                        See past performances
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Loading Overlay */}
      {loading && exercises.length === 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FB923C" />
            <Text style={styles.loadingOverlayText}>Loading exercises...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Montserrat_700Bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerCount: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: "#FED7AA",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#1F2937",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  exerciseCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardGradient: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    marginTop: 2,
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  exerciseTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F2937",
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseDescription: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bodyPartBadge: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bodyPartText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#FB923C",
    textTransform: "capitalize",
  },
  typeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#4B5563",
    textTransform: "capitalize",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F2937",
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeChip: {
    backgroundColor: "#FB923C",
    borderColor: "#FB923C",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#6B7280",
    textTransform: "capitalize",
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  clearButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    color: "#6B7280",
  },
  applyButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
  },
  applyGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: "#1F2937",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#1F2937",
    textTransform: "capitalize",
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    maxHeight: 150,
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#374151",
    textTransform: "capitalize",
  },
  selectedDropdownText: {
    color: "#FB923C",
    fontFamily: "Montserrat_500Medium",
  },
  // View Modal Styles
  viewModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  viewModalHeaderContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  viewModalTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  viewModalBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  viewBodyPartBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  viewBodyPartText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  viewDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  viewDifficultyText: {
    fontSize: 11,
    fontFamily: "Montserrat_500Medium",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  viewModalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewModalContent: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  viewModalScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  viewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  viewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  viewCardTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F2937",
  },
  viewTypeContainer: {
    flexDirection: "row",
  },
  viewTypeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewTypeText: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: "#4B5563",
    textTransform: "capitalize",
  },
  viewDescriptionText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#4B5563",
    lineHeight: 20,
  },
  viewEquipmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  viewEquipmentChip: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FB923C",
  },
  viewEquipmentText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
    color: "#FB923C",
    textTransform: "capitalize",
  },
  viewDetailsContainer: {
    gap: 12,
  },
  viewDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewDetailLabel: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    color: "#6B7280",
  },
  viewDetailValue: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "#1F2937",
  },
  viewActionCards: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  viewActionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  viewActionCardGradient: {
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  viewActionCardText: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
  },
  // Bottom Action Buttons
  viewBottomActions: {
    gap: 12,
    paddingBottom: Spacing.md,
  },
  viewActionButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewActionButtonGradient: {
    padding: 16,
  },
  viewActionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  viewActionButtonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewActionButtonTextContainer: {
    flex: 1,
  },
  viewActionButtonTitle: {
    fontSize: 16,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  viewActionButtonSubtitle: {
    fontSize: 13,
    fontFamily: "Montserrat_400Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  // Empty state and loading styles
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  emptyActionText: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#FFFFFF",
  },
  loadingFooter: {
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#6B7280",
  },
  // Loading overlay styles
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingOverlayText: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
    color: "#1F2937",
  },
  loadingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Body part image styles
  imageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#0d0d0d0d",
    borderWidth: 1,
  },
  bodyPartImage: {
    width: 32,
    height: 32,
  },
  viewBodyPartImage: {
    width: 12,
    height: 12,
    tintColor: "#FFFFFF",
  },
});
