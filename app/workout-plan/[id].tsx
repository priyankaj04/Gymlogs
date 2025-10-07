import { WorkoutPlansAPI } from '@/api/workoutPlans';
import WorkoutPlanDetail from '@/components/WorkoutPlanDetail';
import { Colors } from '@/constants/theme';
import { WorkoutPlan } from '@/types/gym';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function WorkoutPlanDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching workout plan with id:", id);
    if (id) {
      loadWorkoutPlan();
    }
  }, [id]);

  const loadWorkoutPlan = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const workoutPlan = await WorkoutPlansAPI.getWorkoutPlan(id);
      setPlan(workoutPlan);
    } catch (error) {
      console.error('Error loading workout plan:', error);
      setError('Failed to load workout plan');
      Alert.alert(
        'Error',
        'Failed to load workout plan. Please try again.',
        [
          { text: 'Go Back', onPress: () => router.back() },
          { text: 'Retry', onPress: loadWorkoutPlan }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpdated = (updatedPlan: WorkoutPlan) => {
    setPlan(updatedPlan);
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading workout plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Workout plan not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <WorkoutPlanDetail
      plan={plan}
      onPlanUpdated={handlePlanUpdated}
      onClose={handleClose}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '500',
  },
});