import {
  AnimatedBadge,
  AnimatedButton,
  AnimatedCard,
  FadeInView,
  SlideInView
} from '@/components/ui/AnimatedComponents';
import { BorderRadius, Colors, Layout, Spacing } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { WorkoutPlan } from '@/types/gym';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Mock data for workout plans
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps focused workout',
    exercises: [],
    estimatedDuration: 60,
    difficulty: 'intermediate',
    tags: ['strength', 'upper-body'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Pull Day',
    description: 'Back and biceps focused workout',
    exercises: [],
    estimatedDuration: 55,
    difficulty: 'intermediate',
    tags: ['strength', 'upper-body'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    exercises: [],
    estimatedDuration: 75,
    difficulty: 'advanced',
    tags: ['strength', 'lower-body'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Cardio & Core',
    description: 'Cardio and core strengthening routine',
    exercises: [],
    estimatedDuration: 30,
    difficulty: 'beginner',
    tags: ['cardio', 'core'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function WorkoutPlansScreen() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = workoutPlans.filter((plan) => {
    return (
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handlePlanPress = (planId: string) => {
    Alert.alert('Workout Plan', `Viewing plan ${planId}`);
  };

  const handleEditPress = (planId: string) => {
    Alert.alert('Edit Plan', `Editing plan ${planId}`);
  };

  const handleAddPress = () => {
    Alert.alert('Add Plan', 'Add new workout plan functionality coming soon!');
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
    <View style={styles.container}>
      {/* Header */}
      <FadeInView style={styles.header}>
        <Text style={Typography.h3}>Workout Plans</Text>
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
            placeholder="Search workout plans..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SlideInView>

      {/* Workout Plans List */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutPlanItem}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  listContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.md,
  },
  planCard: {
    marginBottom: Spacing.md,
    minHeight: 140,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfo: {
    flex: 1,
  },
  planMetrics: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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