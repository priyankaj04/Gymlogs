/**
 * Comprehensive Theme System for Gym Logs App
 * 
 * A beautiful, cohesive design system using:
 * - White, Black, and Orange color palette
 * - Smooth animations and transitions
 * - Professional typography
 * - Consistent spacing and shadows
 */

// Export custom font and typography configurations
export { Fonts as CustomFonts, FontSizes, LineHeights } from './Fonts';
export { Typography } from './Typography';

// Color Palette
export const Colors = {
  // Primary colors
  primary: '#FF6B35', // Vibrant orange - main accent color
  primaryLight: '#FF8A65', // Light orange for hover states
  primaryDark: '#E64A19', // Dark orange for active states
  primaryOpacity: 'rgba(255, 107, 53, 0.1)', // Orange with opacity for backgrounds

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays for text and UI elements
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Background variations
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceElevated: '#FFFFFF',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#616161',
  textTertiary: '#9E9E9E',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
};

// Spacing system (based on 4px grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};

// Border radius system
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadow system for depth and elevation
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  // Special shadow for primary elements
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation and transition constants
export const Animations = {
  // Timing
  timing: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  
  // Easing curves
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'spring',
  },
  
  // Scale animations
  scale: {
    press: 0.95,
    hover: 1.02,
    active: 0.98,
  },
  
  // Opacity animations
  opacity: {
    hidden: 0,
    visible: 1,
    pressed: 0.7,
  },
};

// Component-specific theme constants
export const Components = {
  // Card styling
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  
  // Button styling
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      ...Shadows.sm,
    },
    secondary: {
      backgroundColor: Colors.gray100,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.gray300,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.primary,
    },
  },
  
  // Input styling
  input: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    fontSize: 16,
  },
  
  // Badge styling
  badge: {
    backgroundColor: Colors.primaryOpacity,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
};

// Layout constants
export const Layout = {
  // Screen padding
  screenPadding: Spacing.md,
  
  // Header heights
  headerHeight: 56,
  tabBarHeight: 64,
  
  // Container max widths
  maxWidth: 400,
  
  // Grid system
  grid: {
    columns: 12,
    gutter: Spacing.md,
  },
};

// Export the complete theme object
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  components: Components,
  layout: Layout,
};
