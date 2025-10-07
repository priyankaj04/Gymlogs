import { CreateWorkoutPlanRequest, WorkoutPlanFilters, WorkoutPlansAPI } from '@/api/workoutPlans';
import {
  AnimatedBadge,
  AnimatedCard,
  FadeInView
} from '@/components/ui/AnimatedComponents';
import { Colors, Spacing } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { WorkoutPlan } from '@/types/gym';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutPlansScreen() {
  // State management
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingPlan, setAddingPlan] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<WorkoutPlan | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Form states
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimatedDuration: 60,
    muscleTypes: [] as string[],
    isPublic: false,
  });
  
  const [editPlan, setEditPlan] = useState({
    name: '',
    description: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimatedDuration: 60,
    muscleTypes: [] as string[],
    isPublic: false,
  });

  // Available muscle types
  const muscleTypes = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 
    'glutes', 'core', 'calves', 'forearms', 'full-body'
  ];

  // Load workout plans from API
  const loadWorkoutPlans = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }

      const filters: WorkoutPlanFilters = {
        difficulty: selectedDifficulty,
        search: searchQuery || undefined,
        page,
        limit: 20,
      };

      const response = await WorkoutPlansAPI.getWorkoutPlans(filters);
      
      if (append) {
        setWorkoutPlans(prev => [...prev, ...response.plans]);
      } else {
        setWorkoutPlans(response.plans);
      }
      
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setHasMore(response.pagination.page < response.pagination.totalPages);
      
    } catch (error) {
      console.error('Error loading workout plans:', error);
      Alert.alert(
        'Error',
        'Failed to load workout plans. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDifficulty, searchQuery]);

  // Refresh workout plans
  const refreshWorkoutPlans = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadWorkoutPlans(1, false);
  }, [loadWorkoutPlans]);

  // Load more workout plans (pagination)
  const loadMoreWorkoutPlans = useCallback(async () => {
    if (hasMore && !loading) {
      await loadWorkoutPlans(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadWorkoutPlans]);

  // Initial load and when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadWorkoutPlans(1, false);
  }, [selectedDifficulty, searchQuery]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1);
        loadWorkoutPlans(1, false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredPlans = workoutPlans;

  const handlePlanPress = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId);
    if (plan) {
      setViewingPlan(plan);
      setShowViewModal(true);
    }
  };

  const handleEditPress = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId);
    if (plan) {
      setEditingPlan(plan);
      setEditPlan({
        name: plan.name,
        description: plan.description || '',
        difficulty: plan.difficulty || 'beginner',
        estimatedDuration: plan.estimatedDuration || 60,
        muscleTypes: plan.tags || [],
        isPublic: false, // This would come from API
      });
      setShowEditModal(true);
    }
  };

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  const handleAddWorkoutPlan = async () => {
    if (!newPlan.name.trim()) {
      Alert.alert('Error', 'Workout plan name is required.');
      return;
    }

    try {
      setAddingPlan(true);
      
      const planData: CreateWorkoutPlanRequest = {
        name: newPlan.name.trim(),
        description: newPlan.description.trim(),
        muscleTypes: newPlan.muscleTypes,
        difficulty: newPlan.difficulty,
        estimatedDuration: newPlan.estimatedDuration,
        isPublic: newPlan.isPublic,
      };

      await WorkoutPlansAPI.createWorkoutPlan(planData);
      
      // Reset form
      setNewPlan({
        name: '',
        description: '',
        difficulty: 'beginner',
        estimatedDuration: 60,
        muscleTypes: [],
        isPublic: false,
      });
      
      setShowAddModal(false);
      
      // Refresh plans list
      await refreshWorkoutPlans();
      
      Alert.alert('Success', 'Workout plan created successfully!');
      
    } catch (error) {
      console.error('Error adding workout plan:', error);
      Alert.alert('Error', 'Failed to create workout plan. Please try again.');
    } finally {
      setAddingPlan(false);
    }
  };

  const handleUpdateWorkoutPlan = async () => {
    if (!editingPlan || !editPlan.name.trim()) {
      Alert.alert('Error', 'Workout plan name is required.');
      return;
    }

    try {
      setUpdatingPlan(true);

      const updates = {
        name: editPlan.name.trim(),
        description: editPlan.description.trim(),
        muscleTypes: editPlan.muscleTypes,
        difficulty: editPlan.difficulty,
        estimatedDuration: editPlan.estimatedDuration,
        isPublic: editPlan.isPublic,
      };

      await WorkoutPlansAPI.updateWorkoutPlan(editingPlan.id, updates);

      setShowEditModal(false);
      setEditingPlan(null);
      
      // Refresh plans list
      await refreshWorkoutPlans();
      
      Alert.alert('Success', 'Workout plan updated successfully!');
      
    } catch (error) {
      console.error('Error updating workout plan:', error);
      Alert.alert('Error', 'Failed to update workout plan. Please try again.');
    } finally {
      setUpdatingPlan(false);
    }
  };

  const handleDeleteWorkoutPlan = async (planId: string) => {
    Alert.alert(
      'Delete Workout Plan',
      'Are you sure you want to delete this workout plan? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await WorkoutPlansAPI.deleteWorkoutPlan(planId);
              await refreshWorkoutPlans();
              Alert.alert('Success', 'Workout plan deleted successfully!');
            } catch (error) {
              console.error('Error deleting workout plan:', error);
              Alert.alert('Error', 'Failed to delete workout plan. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10B981';
      case 'intermediate':
        return '#F59E0B';
      case 'advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderWorkoutPlanItem = ({ item, index }: { item: WorkoutPlan; index: number }) => (
    <FadeInView delay={index * 100}>
      <AnimatedCard
        onPress={() => handlePlanPress(item.id)}
        style={styles.planCard}
        elevation="md"
        padding="lg"
      >
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text style={Typography.h5}>{item.name}</Text>
            {item.description && (
              <Text style={[Typography.description, { marginTop: Spacing.xs }]} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            
            <View style={styles.planMetrics}>
              {item.estimatedDuration && (
                <View style={styles.metricItem}>
                  <Ionicons name="time-outline" size={16} color={Colors.gray500} />
                  <Text style={[Typography.caption, { color: Colors.gray500 }]}>
                    {item.estimatedDuration} min
                  </Text>
                </View>
              )}
              
              <View style={styles.metricItem}>
                <Ionicons name="fitness-outline" size={16} color={Colors.gray500} />
                <Text style={[Typography.caption, { color: Colors.gray500 }]}>
                  {item.exercises.length} exercises
                </Text>
              </View>
            </View>

            <View style={styles.badgeContainer}>
              {item.difficulty && (
                <AnimatedBadge
                  text={item.difficulty}
                  variant={item.difficulty === 'beginner' ? 'success' : item.difficulty === 'intermediate' ? 'warning' : 'error'}
                  size="small"
                />
              )}
              {item.tags?.map((tag, index) => (
                <AnimatedBadge
                  key={index}
                  text={tag}
                  variant="secondary"
                  size="small"
                />
              ))}
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
      </AnimatedCard>
    </FadeInView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#FB923C", "#F97316"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Workout Plans</Text>
            <Text style={styles.headerCount}>
              {filteredPlans.length} available
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

      {/* Search & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workout plans..."
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
            {selectedDifficulty !== 'all' && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout Plans List */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutPlanItem}
        contentContainerStyle={[
          styles.listContainer,
          filteredPlans.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshWorkoutPlans}
        onEndReached={loadMoreWorkoutPlans}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="barbell" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Workout Plans Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedDifficulty !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Start by creating your first workout plan'
                }
              </Text>
              {(!searchQuery && selectedDifficulty === 'all') && (
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  onPress={handleAddPress}
                >
                  <LinearGradient
                    colors={['#FB923C', '#F97316']}
                    style={styles.emptyActionGradient}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.emptyActionText}>Create Plan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        )}
        ListFooterComponent={() => (
          loading && workoutPlans.length > 0 ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#FB923C" />
              <Text style={styles.loadingText}>Loading more plans...</Text>
            </View>
          ) : null
        )}
      />

      {/* Loading Overlay */}
      {loading && workoutPlans.length === 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FB923C" />
            <Text style={styles.loadingOverlayText}>Loading workout plans...</Text>
          </View>
        </View>
      )}

      {/* TODO: Add modals for Add, Edit, View, and Filters */}
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
  // Plan card styles
  planCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planInfo: {
    flex: 1,
  },
  planMetrics: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});