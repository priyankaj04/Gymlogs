import { ExerciseAPI } from '@/api/exercise';
import { WorkoutPlansAPI } from '@/api/workoutPlans';
import { Colors } from '@/constants/theme';
import { Exercise, WorkoutPlan, WorkoutPlanExercise } from '@/types/gym';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface WorkoutPlanDetailProps {
  plan: WorkoutPlan;
  onPlanUpdated: (updatedPlan: WorkoutPlan) => void;
  onClose: () => void;
}

// Helper functions to handle type conversions
const repsToNumber = (reps: string): number => {
  if (!reps) return 1;
  if (reps.includes('-')) {
    return parseInt(reps.split('-')[0]) || 1;
  }
  const parsed = parseInt(reps);
  return isNaN(parsed) ? 1 : parsed;
};

const numberToReps = (reps: number): string => {
  return reps.toString();
};

export default function WorkoutPlanDetail({ plan: initialPlan, onPlanUpdated, onClose }: WorkoutPlanDetailProps) {
  const [plan, setPlan] = useState<WorkoutPlan>(initialPlan);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Edit plan modal states
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [editPlanName, setEditPlanName] = useState(plan.name);
  const [editPlanDescription, setEditPlanDescription] = useState(plan.description || '');
  const [editPlanDifficulty, setEditPlanDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(plan.difficulty || 'beginner');
  const [editPlanTags, setEditPlanTags] = useState((plan.tags || []).join(', '));

  // Add exercise modal states
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseParams, setExerciseParams] = useState({
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 60,
    notes: '',
  });

  // Edit exercise modal states
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<WorkoutPlanExercise | null>(null);

  const colors = {
    background: Colors.background,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    cardBackground: Colors.surface,
    error: Colors.error,
  };

  useEffect(() => {
    loadAvailableExercises();
  }, []);

  const loadAvailableExercises = async () => {
    try {
      const exercisesResponse = await ExerciseAPI.getExercises();
      setAvailableExercises(exercisesResponse.data);
    } catch (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('Error', 'Failed to load available exercises');
    }
  };

  const handleUpdatePlan = async () => {
    try {
      setSaving(true);
      const updateData = {
        name: editPlanName,
        description: editPlanDescription,
        difficulty: editPlanDifficulty,
        // Convert tags string back to array
        muscleTypes: editPlanTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      const updatedPlan = await WorkoutPlansAPI.updateWorkoutPlan(plan.id, updateData);
      setPlan(updatedPlan);
      onPlanUpdated(updatedPlan);
      setShowEditPlanModal(false);
      Alert.alert('Success', 'Workout plan updated successfully!');
    } catch (error) {
      console.error('Error updating plan:', error);
      Alert.alert('Error', 'Failed to update workout plan');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExercise = async () => {
    if (!selectedExercise) {
      Alert.alert('Error', 'Please select an exercise');
      return;
    }

    try {
      setSaving(true);
      const exerciseData = {
        exerciseId: selectedExercise.id,
        sets: exerciseParams.sets,
        reps: exerciseParams.reps,
        weight: exerciseParams.weight > 0 ? exerciseParams.weight : undefined,
        restTime: exerciseParams.restTime,
        notes: exerciseParams.notes,
        orderIndex: plan.exercises.length,
      };

      // Add exercise to plan
      await WorkoutPlansAPI.addExerciseToWorkoutPlan(plan.id, exerciseData);
      
      // Refresh the plan
      const refreshedPlan = await WorkoutPlansAPI.getWorkoutPlan(plan.id);
      setPlan(refreshedPlan);
      onPlanUpdated(refreshedPlan);
      
      setShowAddExerciseModal(false);
      setSelectedExercise(null);
      setExerciseParams({ sets: 3, reps: 10, weight: 0, restTime: 60, notes: '' });
      Alert.alert('Success', 'Exercise added to workout plan!');
    } catch (error) {
      console.error('Error adding exercise:', error);
      Alert.alert('Error', 'Failed to add exercise to workout plan');
    } finally {
      setSaving(false);
    }
  };

  const handleEditExercise = async () => {
    if (!editingExercise) return;

    try {
      setSaving(true);
      const updateData = {
        sets: editingExercise.sets,
        reps: repsToNumber(editingExercise.reps || '1'),
        weight: editingExercise.weight,
        restTime: editingExercise.restTime,
        notes: editingExercise.notes,
      };

      await WorkoutPlansAPI.updateExerciseInWorkoutPlan(plan.id, editingExercise.exerciseId, updateData);
      
      // Refresh the plan
      const refreshedPlan = await WorkoutPlansAPI.getWorkoutPlan(plan.id);
      setPlan(refreshedPlan);
      onPlanUpdated(refreshedPlan);
      
      setShowEditExerciseModal(false);
      setEditingExercise(null);
      Alert.alert('Success', 'Exercise updated successfully!');
    } catch (error) {
      console.error('Error updating exercise:', error);
      Alert.alert('Error', 'Failed to update exercise');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from the workout plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await WorkoutPlansAPI.removeExerciseFromWorkoutPlan(plan.id, exerciseId);
              
              // Refresh the plan
              const refreshedPlan = await WorkoutPlansAPI.getWorkoutPlan(plan.id);
              setPlan(refreshedPlan);
              onPlanUpdated(refreshedPlan);
              
              Alert.alert('Success', 'Exercise removed from workout plan');
            } catch (error) {
              console.error('Error removing exercise:', error);
              Alert.alert('Error', 'Failed to remove exercise');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const estimateWorkoutDuration = () => {
    if (!plan.exercises.length) return 0;
    
    return plan.exercises.reduce((total, exercise) => {
      const sets = exercise.sets || 3;
      const repsNum = repsToNumber(exercise.reps || '10');
      const restTime = exercise.restTime || 60;
      // Estimate 3 seconds per rep + rest time between sets
      const exerciseTime = sets * (repsNum * 3 + restTime);
      return total + exerciseTime;
    }, 0) / 60; // Convert to minutes
  };

  const renderExerciseItem = ({ item }: { item: WorkoutPlanExercise }) => (
    <View style={[styles.exerciseItem, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, { color: colors.text }]}>{item.exercise?.name}</Text>
          <Text style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
            {item.sets || 3} sets × {item.reps || '10'} reps
            {item.weight ? ` @ ${item.weight}kg` : ''}
          </Text>
          {item.restTime && (
            <Text style={[styles.exerciseRest, { color: colors.textSecondary }]}>
              Rest: {item.restTime}s
            </Text>
          )}
          {item.notes && (
            <Text style={[styles.exerciseNotes, { color: colors.textSecondary }]}>
              {item.notes}
            </Text>
          )}
        </View>
        <View style={styles.exerciseActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setEditingExercise(item);
              setShowEditExerciseModal(true);
            }}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={() => handleRemoveExercise(item.exerciseId)}
          >
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAvailableExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[
        styles.availableExerciseItem,
        { backgroundColor: colors.cardBackground },
        selectedExercise?.id === item.id && { backgroundColor: colors.primaryLight }
      ]}
      onPress={() => setSelectedExercise(item)}
    >
      <View style={styles.availableExerciseInfo}>
        <Text style={[styles.availableExerciseName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.availableExerciseBodyPart, { color: colors.textSecondary }]}>
          {item.bodyPart}
        </Text>
      </View>
      {selectedExercise?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{plan.name}</Text>
        <TouchableOpacity
          onPress={() => setShowEditPlanModal(true)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Plan Info */}
        <View style={[styles.planInfo, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
          {plan.description && (
            <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
              {plan.description}
            </Text>
          )}
          <View style={styles.planMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="barbell" size={16} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {plan.exercises.length} exercises
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                ~{Math.round(estimateWorkoutDuration())} min
              </Text>
            </View>
            {plan.difficulty && (
              <View style={styles.metaItem}>
                <Ionicons name="trending-up" size={16} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {plan.difficulty}
                </Text>
              </View>
            )}
          </View>
          {plan.tags && plan.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {plan.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Exercises Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddExerciseModal(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
          {console.log("plan.exercises", plan.exercises)}

          {plan.exercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No exercises added yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                Tap "Add Exercise" to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={plan.exercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.exerciseId}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Edit Plan Modal */}
      <Modal
        visible={showEditPlanModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity onPress={() => setShowEditPlanModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Plan</Text>
            <TouchableOpacity onPress={handleUpdatePlan} disabled={saving}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Plan Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={editPlanName}
                onChangeText={setEditPlanName}
                placeholder="Enter plan name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={editPlanDescription}
                onChangeText={setEditPlanDescription}
                placeholder="Enter plan description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyButton,
                      { backgroundColor: colors.cardBackground },
                      editPlanDifficulty === difficulty && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setEditPlanDifficulty(difficulty)}
                  >
                    <Text
                      style={[
                        styles.difficultyButtonText,
                        { color: colors.text },
                        editPlanDifficulty === difficulty && { color: 'white' }
                      ]}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Tags (comma-separated)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={editPlanTags}
                onChangeText={setEditPlanTags}
                placeholder="e.g., strength, upper-body, mass-building"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity onPress={() => setShowAddExerciseModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Exercise</Text>
            <TouchableOpacity onPress={handleAddExercise} disabled={!selectedExercise || saving}>
              <Text style={[styles.modalSave, { color: selectedExercise ? colors.primary : colors.textSecondary }]}>
                {saving ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Exercise Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Select Exercise</Text>
              <FlatList
                data={availableExercises}
                renderItem={renderAvailableExerciseItem}
                keyExtractor={(item) => item.id}
                style={styles.exerciseList}
                scrollEnabled={false}
              />
            </View>

            {/* Exercise Parameters */}
            {selectedExercise && (
              <>
                <View style={styles.parametersSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercise Parameters</Text>
                  
                  <View style={styles.parameterRow}>
                    <View style={styles.parameterItem}>
                      <Text style={[styles.parameterLabel, { color: colors.text }]}>Sets</Text>
                      <TextInput
                        style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                        value={exerciseParams.sets.toString()}
                        onChangeText={(text) => setExerciseParams(prev => ({ ...prev, sets: parseInt(text) || 1 }))}
                        keyboardType="numeric"
                        placeholder="3"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                    
                    <View style={styles.parameterItem}>
                      <Text style={[styles.parameterLabel, { color: colors.text }]}>Reps</Text>
                      <TextInput
                        style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                        value={exerciseParams.reps.toString()}
                        onChangeText={(text) => setExerciseParams(prev => ({ ...prev, reps: parseInt(text) || 1 }))}
                        keyboardType="numeric"
                        placeholder="10"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  </View>

                  <View style={styles.parameterRow}>
                    <View style={styles.parameterItem}>
                      <Text style={[styles.parameterLabel, { color: colors.text }]}>Weight (kg)</Text>
                      <TextInput
                        style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                        value={exerciseParams.weight.toString()}
                        onChangeText={(text) => setExerciseParams(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                    
                    <View style={styles.parameterItem}>
                      <Text style={[styles.parameterLabel, { color: colors.text }]}>Rest (s)</Text>
                      <TextInput
                        style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                        value={exerciseParams.restTime.toString()}
                        onChangeText={(text) => setExerciseParams(prev => ({ ...prev, restTime: parseInt(text) || 60 }))}
                        keyboardType="numeric"
                        placeholder="60"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Notes (optional)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                      value={exerciseParams.notes}
                      onChangeText={(text) => setExerciseParams(prev => ({ ...prev, notes: text }))}
                      placeholder="Add any notes..."
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Exercise Modal */}
      <Modal
        visible={showEditExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity onPress={() => setShowEditExerciseModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Exercise</Text>
            <TouchableOpacity onPress={handleEditExercise} disabled={saving}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {editingExercise && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Exercise</Text>
                <Text style={[styles.exerciseNameDisplay, { color: colors.text }]}>
                  {editingExercise.exercise.name}
                </Text>
              </View>

              <View style={styles.parameterRow}>
                <View style={styles.parameterItem}>
                  <Text style={[styles.parameterLabel, { color: colors.text }]}>Sets</Text>
                  <TextInput
                    style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                    value={(editingExercise.sets || 3).toString()}
                    onChangeText={(text) => setEditingExercise(prev => prev ? ({ 
                      ...prev, 
                      sets: parseInt(text) || 1 
                    }) : null)}
                    keyboardType="numeric"
                    placeholder="3"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                
                <View style={styles.parameterItem}>
                  <Text style={[styles.parameterLabel, { color: colors.text }]}>Reps</Text>
                  <TextInput
                    style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                    value={(editingExercise.reps || '10').toString()}
                    onChangeText={(text) => setEditingExercise(prev => prev ? ({ 
                      ...prev, 
                      reps: text || '1'
                    }) : null)}
                    placeholder="10"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.parameterRow}>
                <View style={styles.parameterItem}>
                  <Text style={[styles.parameterLabel, { color: colors.text }]}>Weight (kg)</Text>
                  <TextInput
                    style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                    value={(editingExercise.weight || 0).toString()}
                    onChangeText={(text) => setEditingExercise(prev => prev ? ({ 
                      ...prev, 
                      weight: parseFloat(text) || 0 
                    }) : null)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                
                <View style={styles.parameterItem}>
                  <Text style={[styles.parameterLabel, { color: colors.text }]}>Rest (s)</Text>
                  <TextInput
                    style={[styles.parameterInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                    value={(editingExercise.restTime || 60).toString()}
                    onChangeText={(text) => setEditingExercise(prev => prev ? ({ 
                      ...prev, 
                      restTime: parseInt(text) || 60 
                    }) : null)}
                    keyboardType="numeric"
                    placeholder="60"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Notes</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  value={editingExercise.notes || ''}
                  onChangeText={(text) => setEditingExercise(prev => prev ? ({ 
                    ...prev, 
                    notes: text 
                  }) : null)}
                  placeholder="Add any notes..."
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  planInfo: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  planMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
  },
  exerciseItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  exerciseRest: {
    fontSize: 12,
    marginBottom: 2,
  },
  exerciseNotes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancel: {
    fontSize: 16,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  textArea: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseList: {
    maxHeight: 300,
  },
  availableExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  availableExerciseInfo: {
    flex: 1,
  },
  availableExerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  availableExerciseBodyPart: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  parametersSection: {
    marginTop: 20,
  },
  parameterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  parameterItem: {
    flex: 1,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  parameterInput: {
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  exerciseNameDisplay: {
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});