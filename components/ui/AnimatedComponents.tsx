import { Animations, BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import {
    Animated,
    Pressable,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

// Animated Button Component
interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: Animations.scale.press,
        duration: Animations.timing.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: Animations.opacity.pressed,
        duration: Animations.timing.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: disabled ? 0.5 : 1,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    const sizeStyles = {
      small: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minHeight: 36,
      },
      medium: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        minHeight: 44,
      },
      large: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: Colors.primary,
        ...Shadows.sm,
      },
      secondary: {
        backgroundColor: Colors.gray100,
        borderWidth: 1,
        borderColor: Colors.gray300,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontFamily: 'Inter_600SemiBold',
      fontWeight: '600' as const,
    };

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles = {
      primary: { color: Colors.textOnPrimary },
      secondary: { color: Colors.textPrimary },
      ghost: { color: Colors.primary },
    };

    return [baseTextStyle, sizeTextStyles[size], variantTextStyles[variant]];
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          getButtonStyle(),
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
          disabled && { opacity: 0.5 },
          style,
        ]}
      >
        <Text style={[getTextStyle(), textStyle]}>
          {loading ? 'Loading...' : title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// Animated Card Component
interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: keyof typeof Spacing;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  elevation = 'md',
  padding = 'lg',
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const shadowValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: Animations.scale.active,
          duration: Animations.timing.fast,
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 1.2,
          duration: Animations.timing.fast,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: Animations.timing.normal,
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 1,
          duration: Animations.timing.normal,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const cardStyle = {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[padding],
    ...Shadows[elevation],
  };

  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      onPress={onPress}
    >
      <Animated.View
        style={[
          cardStyle,
          {
            transform: [{ scale: scaleValue }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </CardComponent>
  );
};

// Animated Badge Component
interface AnimatedBadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  text,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const getVariantStyle = () => {
    const variants = {
      primary: {
        backgroundColor: Colors.primaryOpacity,
        borderColor: Colors.primary,
      },
      secondary: {
        backgroundColor: Colors.gray100,
        borderColor: Colors.gray300,
      },
      success: {
        backgroundColor: `${Colors.success}20`,
        borderColor: Colors.success,
      },
      warning: {
        backgroundColor: `${Colors.warning}20`,
        borderColor: Colors.warning,
      },
      error: {
        backgroundColor: `${Colors.error}20`,
        borderColor: Colors.error,
      },
    };
    return variants[variant];
  };

  const getTextColor = () => {
    const colors = {
      primary: Colors.primary,
      secondary: Colors.textSecondary,
      success: Colors.success,
      warning: Colors.warning,
      error: Colors.error,
    };
    return colors[variant];
  };

  const sizeStyle = {
    small: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontSize: 12,
    },
    medium: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      fontSize: 14,
    },
  };

  return (
    <Animated.View
      style={[
        {
          borderRadius: BorderRadius.full,
          borderWidth: 1,
          alignSelf: 'flex-start',
          transform: [{ scale: scaleValue }],
        },
        getVariantStyle(),
        sizeStyle[size],
        style,
      ]}
    >
      <Text
        style={[
          {
            fontFamily: 'Inter_500Medium',
            fontWeight: '500',
            fontSize: sizeStyle[size].fontSize,
            color: getTextColor(),
            textAlign: 'center',
          },
        ]}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

// Fade In Animation Component
interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = Animations.timing.normal,
  style,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [fadeAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Slide In Animation Component
interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  style?: ViewStyle;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = Animations.timing.normal,
  distance = 50,
  style,
}) => {
  const slideAnim = React.useRef(new Animated.Value(distance)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [slideAnim, opacityAnim, delay, duration]);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: Animated.multiply(slideAnim, -1) }];
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: Animated.multiply(slideAnim, -1) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};