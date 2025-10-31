import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary colors - Cyan Blue
  // primary: '#30b7d9',
  primary: '#30b7d9',
  primaryDark: '#2397b6',
  primaryLight: '#5ac3e0',
  
  // Secondary colors - Light Cyan
  secondary: '#80d1e8',
  secondaryDark: '#61b8cf',
  secondaryLight: '#a6ddf0',
  
  // Accent colors - Bright Cyan
  accent: '#99e0f2',
  accentDark: '#7dd4e8',
  
  // Rating colors
  rating: '#FFD700', // Gold/Yellow for stars
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  dark: '#1A1A1A',
  gray: '#6B8E6B',
  lightGray: '#E8F5E8',
  veryLightGray: '#F0F8F0',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F7FBF7',
  
  // Status colors
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#D32F2F',
  info: '#1976D2',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#4A6741',
  textLight: '#6B8E6B',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Default avatar URL
export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

export const SIZES = {
  // App dimensions
  width,
  height,
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
  
  // Spacing
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radius: 8,
  radiusSm: 4,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,
  
  // Icon sizes
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,
  
  // Button sizes
  buttonHeight: 48,
  buttonHeightSm: 36,
  buttonHeightLg: 56,
  
  // Input sizes
  inputHeight: 48,
  
  // Card sizes
  cardPadding: 16,
  cardRadius: 16,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as '500',
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600' as '600',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as '700',
  },
  extraBold: {
    fontFamily: 'System',
    fontWeight: '800' as '800',
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 4,
  },
  heavy: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export default {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  ANIMATIONS,
};


