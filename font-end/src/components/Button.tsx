import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import * as Animatable from 'react-native-animatable';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[`${size}Button`],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <Animatable.View animation="fadeIn">
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'outline' ? COLORS.primary : COLORS.white}
          />
        ) : (
          <>
            {icon && icon}
            <Text style={textStyleCombined}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.lg,
    gap: SIZES.sm,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.medium,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  // Sizes
  smallButton: {
    height: SIZES.buttonHeightSm,
    paddingHorizontal: SIZES.md,
  },
  mediumButton: {
    height: SIZES.buttonHeight,
  },
  largeButton: {
    height: SIZES.buttonHeightLg,
  },
  // Text styles
  buttonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textText: {
    color: COLORS.primary,
  },
  smallText: {
    fontSize: SIZES.body2,
  },
  mediumText: {
    fontSize: SIZES.body1,
  },
  largeText: {
    fontSize: SIZES.h5,
  },
  disabled: {
    opacity: 0.5,
  },
});


