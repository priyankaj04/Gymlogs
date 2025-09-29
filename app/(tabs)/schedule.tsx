import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DailySchedule, DayOfWeek, WorkoutPlan } from '@/types/gym';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Mock data
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps',
    exercises: [],
    estimatedDuration: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Pull Day',
    description: 'Back and biceps',
    exercises: [],
    estimatedDuration: 55,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Leg Day',
    description: 'Complete lower body',
    exercises: [],
    estimatedDuration: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockDailySchedule: DailySchedule[] = [
  {
    id: '1',
    dayOfWeek: 'monday',
    workoutPlanId: '1',
    workoutPlan: mockWorkoutPlans[0],
    isRestDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    dayOfWeek: 'tuesday',
    workoutPlanId: '2',
    workoutPlan: mockWorkoutPlans[1],
    isRestDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    dayOfWeek: 'wednesday',
    isRestDay: true,
    notes: 'Active recovery - light stretching',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    dayOfWeek: 'thursday',
    workoutPlanId: '3',
    workoutPlan: mockWorkoutPlans[2],
    isRestDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    dayOfWeek: 'friday',
    workoutPlanId: '1',
    workoutPlan: mockWorkoutPlans[0],
    isRestDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    dayOfWeek: 'saturday',
    isRestDay: true,
    notes: 'Complete rest day',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    dayOfWeek: 'sunday',
    workoutPlanId: '2',
    workoutPlan: mockWorkoutPlans[1],
    isRestDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState<DailySchedule[]>(mockDailySchedule);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleDayPress = (daySchedule: DailySchedule) => {
    if (daySchedule.isRestDay) {
      Alert.alert('Rest Day', daySchedule.notes || 'Take a rest today!');
    } else {
      Alert.alert(
        'Workout Day', 
        `${daySchedule.workoutPlan?.name}\n${daySchedule.workoutPlan?.description}`
      );
    }
  };

  const handleEditPress = (daySchedule: DailySchedule) => {
    Alert.alert('Edit Schedule', `Edit ${daySchedule.dayOfWeek} schedule`);
  };

  const getCurrentDay = (): DayOfWeek => {
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const formatDayName = (day: DayOfWeek): string => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const renderScheduleItem = ({ item }: { item: DailySchedule }) => {
    const isToday = item.dayOfWeek === getCurrentDay();
    
    return (
      <TouchableOpacity
        style={[
          styles.scheduleCard,
          { backgroundColor: colors.card },
          isToday && { borderColor: colors.tint, borderWidth: 2 }
        ]}
        onPress={() => handleDayPress(item)}
      >
        <View style={styles.scheduleHeader}>
          <View style={styles.dayInfo}>
            <View style={styles.dayTitleContainer}>
              <ThemedText style={[
                styles.dayName,
                isToday && { color: colors.tint }
              ]}>
                {formatDayName(item.dayOfWeek)}
              </ThemedText>
              {isToday && (
                <View style={[styles.todayBadge, { backgroundColor: colors.tint }]}>
                  <Text style={styles.todayText}>TODAY</Text>
                </View>
              )}
            </View>
            
            {item.isRestDay ? (
              <View style={styles.restDayContainer}>
                <Ionicons name="bed-outline" size={20} color="#10B981" />
                <Text style={[styles.restDayText, { color: '#10B981' }]}>Rest Day</Text>
              </View>
            ) : (
              <View style={styles.workoutInfo}>
                <ThemedText style={styles.workoutName}>
                  {item.workoutPlan?.name}
                </ThemedText>
                {item.workoutPlan?.description && (
                  <ThemedText style={styles.workoutDescription}>
                    {item.workoutPlan.description}
                  </ThemedText>
                )}
                {item.workoutPlan?.estimatedDuration && (
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={16} color={colors.icon} />
                    <Text style={[styles.durationText, { color: colors.icon }]}>
                      {item.workoutPlan.estimatedDuration} min
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {item.notes && (
              <ThemedText style={styles.notes}>
                {item.notes}
              </ThemedText>
            )}
          </View>
          
          <TouchableOpacity
            onPress={() => handleEditPress(item)}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const todaySchedule = schedule.find(s => s.dayOfWeek === getCurrentDay());

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Weekly Schedule</ThemedText>
      </View>

      {todaySchedule && (
        <View style={styles.todaySection}>
          <ThemedText style={styles.todaySectionTitle}>Today's Workout</ThemedText>
          <View style={[styles.todayCard, { backgroundColor: colors.card }]}>
            {todaySchedule.isRestDay ? (
              <View style={styles.todayRestContainer}>
                <Ionicons name="bed-outline" size={32} color="#10B981" />
                <ThemedText style={styles.todayRestTitle}>Rest Day</ThemedText>
                <ThemedText style={styles.todayRestSubtitle}>
                  {todaySchedule.notes || 'Take a well-deserved break'}
                </ThemedText>
              </View>
            ) : (
              <View style={styles.todayWorkoutContainer}>
                <Ionicons name="fitness-outline" size={32} color={colors.tint} />
                <ThemedText style={styles.todayWorkoutTitle}>
                  {todaySchedule.workoutPlan?.name}
                </ThemedText>
                <ThemedText style={styles.todayWorkoutSubtitle}>
                  {todaySchedule.workoutPlan?.description}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.startWorkoutButton, { backgroundColor: colors.tint }]}
                  onPress={() => Alert.alert('Start Workout', 'Starting workout session...')}
                >
                  <Ionicons name="play" size={20} color="white" />
                  <Text style={styles.startWorkoutText}>Start Workout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.weeklySection}>
        <ThemedText style={styles.weeklySectionTitle}>Weekly Overview</ThemedText>
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          renderItem={renderScheduleItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  todaySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  todaySectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  todayCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  todayRestContainer: {
    alignItems: 'center',
  },
  todayRestTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
    color: '#10B981',
  },
  todayRestSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },
  todayWorkoutContainer: {
    alignItems: 'center',
  },
  todayWorkoutTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  todayWorkoutSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  startWorkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  weeklySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  weeklySectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayInfo: {
    flex: 1,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  restDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restDayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  workoutInfo: {
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 6,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 14,
  },
  notes: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  editButton: {
    padding: 8,
  },
});