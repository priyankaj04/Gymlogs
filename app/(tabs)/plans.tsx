import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WorkoutPlan } from '@/types/gym';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  const renderWorkoutPlanItem = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity
      style={[styles.planCard, { backgroundColor: colors.card }]}
      onPress={() => handlePlanPress(item.id)}
    >
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <ThemedText style={styles.planName}>{item.name}</ThemedText>
          {item.description && (
            <ThemedText style={styles.planDescription} numberOfLines={2}>
              {item.description}
            </ThemedText>
          )}
          
          <View style={styles.planMetrics}>
            {item.estimatedDuration && (
              <View style={styles.metricItem}>
                <Ionicons name="time-outline" size={16} color={colors.icon} />
                <Text style={[styles.metricText, { color: colors.icon }]}>
                  {item.estimatedDuration} min
                </Text>
              </View>
            )}
            
            <View style={styles.metricItem}>
              <Ionicons name="fitness-outline" size={16} color={colors.icon} />
              <Text style={[styles.metricText, { color: colors.icon }]}>
                {item.exercises.length} exercises
              </Text>
            </View>
          </View>

          <View style={styles.badgeContainer}>
            {item.difficulty && (
              <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.badgeText}>{item.difficulty}</Text>
              </View>
            )}
            {item.tags?.map((tag, index) => (
              <View key={index} style={[styles.badge, styles.tagBadge]}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => handleEditPress(item.id)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Workout Plans</ThemedText>
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
            placeholder="Search workout plans..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutPlanItem}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  planCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  planDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  planMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagBadge: {
    backgroundColor: '#6366F1',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  editButton: {
    padding: 8,
  },
});