import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Font Test Component - Use this to verify your fonts are working correctly
 * 
 * This component demonstrates all typography styles with your custom fonts:
 * - Poppins for headings
 * - Alan Sans for general UI
 * - Montserrat for descriptions
 */

export default function FontTest() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[Typography.h2, { color: colors.text, marginBottom: 20 }]}>
          Font Test - Gym Logs App
        </Text>

        {/* Poppins - Headings */}
        <View style={styles.fontSection}>
          <Text style={[Typography.h4, { color: colors.tint, marginBottom: 10 }]}>
            Poppins - Headings
          </Text>
          <Text style={[Typography.h1, { color: colors.text }]}>
            H1 - Main Title
          </Text>
          <Text style={[Typography.h2, { color: colors.text }]}>
            H2 - Section Header
          </Text>
          <Text style={[Typography.h3, { color: colors.text }]}>
            H3 - Subsection
          </Text>
          <Text style={[Typography.exerciseName, { color: colors.text }]}>
            Exercise Name Style
          </Text>
          <Text style={[Typography.workoutPlanName, { color: colors.text }]}>
            Workout Plan Name
          </Text>
        </View>

        {/* Alan Sans - General UI */}
        <View style={styles.fontSection}>
          <Text style={[Typography.h4, { color: colors.tint, marginBottom: 10 }]}>
            Alan Sans - General UI
          </Text>
          <Text style={[Typography.body, { color: colors.text }]}>
            Regular body text for general content
          </Text>
          <Text style={[Typography.bodyMedium, { color: colors.text }]}>
            Medium weight for emphasized text
          </Text>
          <Text style={[Typography.bodySemiBold, { color: colors.text }]}>
            Semi-bold for labels and important info
          </Text>
          <Text style={[Typography.bodyBold, { color: colors.text }]}>
            Bold for strong emphasis
          </Text>
          <Text style={[Typography.button, { color: colors.tint }]}>
            Button Text Style
          </Text>
          <Text style={[Typography.numbers, { color: colors.tint }]}>
            150 lbs - Numbers & Stats
          </Text>
        </View>

        {/* Montserrat - Descriptions */}
        <View style={styles.fontSection}>
          <Text style={[Typography.h4, { color: colors.tint, marginBottom: 10 }]}>
            Montserrat - Descriptions
          </Text>
          <Text style={[Typography.description, { color: colors.text }]}>
            Regular description text for exercise details and longer content. This font is perfect for paragraphs and detailed explanations that users need to read carefully.
          </Text>
          <Text style={[Typography.descriptionMedium, { color: colors.text }]}>
            Medium weight description for slightly emphasized content.
          </Text>
          <Text style={[Typography.exerciseDescription, { color: colors.text }]}>
            Exercise description: A compound exercise that primarily targets the chest, shoulders, and triceps. Perfect for building upper body strength.
          </Text>
          <Text style={[Typography.workoutPlanDescription, { color: colors.text }]}>
            Workout plan description with medium weight styling.
          </Text>
        </View>

        {/* Usage Examples */}
        <View style={styles.fontSection}>
          <Text style={[Typography.h4, { color: colors.tint, marginBottom: 10 }]}>
            Real Usage Examples
          </Text>
          
          {/* Exercise Card Example */}
          <View style={[styles.exampleCard, { backgroundColor: colors.card }]}>
            <Text style={[Typography.exerciseName, { color: colors.text }]}>
              Bench Press
            </Text>
            <Text style={[Typography.bodySmall, { color: colors.icon, marginVertical: 4 }]}>
              Compound • Chest • Intermediate
            </Text>
            <Text style={[Typography.exerciseDescription, { color: colors.text }]}>
              A compound exercise that primarily targets the chest, shoulders, and triceps. Great for building upper body strength and mass.
            </Text>
            <View style={styles.statsRow}>
              <Text style={[Typography.numbers, { color: colors.tint }]}>4</Text>
              <Text style={[Typography.caption, { color: colors.icon }]}>sets</Text>
              <Text style={[Typography.numbers, { color: colors.tint, marginLeft: 20 }]}>8-12</Text>
              <Text style={[Typography.caption, { color: colors.icon }]}>reps</Text>
            </View>
          </View>

          {/* Workout Plan Example */}
          <View style={[styles.exampleCard, { backgroundColor: colors.card }]}>
            <Text style={[Typography.workoutPlanName, { color: colors.text }]}>
              Push Day
            </Text>
            <Text style={[Typography.workoutPlanDescription, { color: colors.text, marginVertical: 4 }]}>
              Chest, shoulders, and triceps focused workout
            </Text>
            <View style={styles.statsRow}>
              <Text style={[Typography.bodyMedium, { color: colors.icon }]}>
                Duration: 
              </Text>
              <Text style={[Typography.bodyBold, { color: colors.text }]}>
                60 min
              </Text>
              <Text style={[Typography.bodyMedium, { color: colors.icon, marginLeft: 20 }]}>
                Exercises: 
              </Text>
              <Text style={[Typography.bodyBold, { color: colors.text }]}>
                8
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  fontSection: {
    marginBottom: 30,
  },
  exampleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});