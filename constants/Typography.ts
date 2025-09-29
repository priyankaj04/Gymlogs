import { StyleSheet } from 'react-native';
import { Fonts, FontSizes, LineHeights } from './Fonts';

/**
 * Typography Styles for Gym Logs App
 * 
 * Usage Examples:
 * <Text style={Typography.h1}>Main Title</Text>
 * <Text style={Typography.body}>General text</Text>
 * <Text style={Typography.description}>Exercise description</Text>
 */

export const Typography = StyleSheet.create({
  // HEADINGS (Using Poppins)
  h1: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes['5xl'],
    lineHeight: LineHeights['5xl'],
    fontWeight: '700',
  },
  h2: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes['4xl'],
    lineHeight: LineHeights['4xl'],
    fontWeight: '700',
  },
  h3: {
    fontFamily: Fonts.headingMedium,
    fontSize: FontSizes['3xl'],
    lineHeight: LineHeights['3xl'],
    fontWeight: '600',
  },
  h4: {
    fontFamily: Fonts.headingMedium,
    fontSize: FontSizes['2xl'],
    lineHeight: LineHeights['2xl'],
    fontWeight: '600',
  },
  h5: {
    fontFamily: Fonts.headingLight,
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.xl,
    fontWeight: '500',
  },
  h6: {
    fontFamily: Fonts.headingLight,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
    fontWeight: '500',
  },

  // GENERAL UI TEXT (Using Alan Sans)
  body: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
  },
  bodyLarge: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
  },
  bodySmall: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
  },
  bodyMedium: {
    fontFamily: Fonts.primaryMedium,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '500',
  },
  bodySemiBold: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '600',
  },
  bodyBold: {
    fontFamily: Fonts.primaryBold,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '700',
  },

  // DESCRIPTIONS & PARAGRAPHS (Using Montserrat)
  description: {
    fontFamily: Fonts.description,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
  },
  descriptionLarge: {
    fontFamily: Fonts.description,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
  },
  descriptionSmall: {
    fontFamily: Fonts.description,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
  },
  descriptionMedium: {
    fontFamily: Fonts.descriptionMedium,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '500',
  },
  descriptionSemiBold: {
    fontFamily: Fonts.descriptionSemiBold,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '600',
  },

  // SPECIAL PURPOSE STYLES
  button: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: FontSizes.base,
    lineHeight: LineHeights.base,
    fontWeight: '600',
  },
  buttonSmall: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontWeight: '600',
  },
  buttonLarge: {
    fontFamily: Fonts.primaryBold,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
    fontWeight: '700',
  },
  
  // Navigation and tabs
  tabLabel: {
    fontFamily: Fonts.primaryMedium,
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.xs,
    fontWeight: '500',
  },
  
  // Numbers and stats
  numbers: {
    fontFamily: Fonts.primaryBold,
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.xl,
    fontWeight: '700',
  },
  numbersLarge: {
    fontFamily: Fonts.primaryBold,
    fontSize: FontSizes['3xl'],
    lineHeight: LineHeights['3xl'],
    fontWeight: '700',
  },
  
  // Labels and captions
  label: {
    fontFamily: Fonts.primaryMedium,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontWeight: '500',
  },
  caption: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.xs,
  },
  
  // Exercise specific
  exerciseName: {
    fontFamily: Fonts.headingMedium,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
    fontWeight: '600',
  },
  exerciseDescription: {
    fontFamily: Fonts.description,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
  },
  workoutPlanName: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.xl,
    fontWeight: '700',
  },
  workoutPlanDescription: {
    fontFamily: Fonts.descriptionMedium,
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontWeight: '500',
  },
});