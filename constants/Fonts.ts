/**
 * Font Configuration for Gym Logs App using Google Expo Fonts
 * 
 * Font Usage:
 * - Poppins: Headings, titles, main navigation
 * - Inter: General UI elements, buttons, labels, body text (replacing Alan Sans)
 * - Montserrat: Descriptions, paragraphs, detailed content
 */

export const Fonts = {
  // Poppins - For Headings (using the exact names from @expo-google-fonts)
  heading: 'Montserrat_700Bold',
  headingMedium: 'Montserrat_600SemiBold',
  headingLight: 'Montserrat_500Medium',
  headingRegular: 'Montserrat_400Regular',

  // Inter - For General UI (excellent alternative to Alan Sans)
  primary: 'Montserrat_400Regular',
  primaryMedium: 'Montserrat_500Medium',
  primarySemiBold: 'Montserrat_600SemiBold',
  primaryBold: 'Montserrat_700Bold',

  // Montserrat - For Descriptions/Paragraphs
  description: 'Montserrat_400Regular',
  descriptionMedium: 'Montserrat_500Medium', 
  descriptionSemiBold: 'Montserrat_600SemiBold',
  
  // Fallbacks (in case some fonts aren't available)
  fallback: 'System',
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 42,
};

export const LineHeights = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 26,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 44,
  '6xl': 50,
};

/**
 * Google Expo Fonts Configuration
 * 
 * IMPORTANT: Make sure you have installed the font packages:
 * npm install @expo-google-fonts/poppins @expo-google-fonts/inter @expo-google-fonts/montserrat
 */

// Import Google Expo Fonts
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold
} from '@expo-google-fonts/montserrat';

export const FontAssets = {
  // Poppins fonts (for headings)
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  
  // Inter fonts (for general UI - great replacement for Alan Sans)
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  
  // Montserrat fonts (for descriptions)
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
};