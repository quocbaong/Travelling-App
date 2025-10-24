import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../constants/theme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + SIZES.sm },
        transparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={transparent ? COLORS.white : COLORS.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        {title && (
          <Text
            style={[
              styles.title,
              transparent && styles.titleTransparent,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        {rightIcon && onRightPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={transparent ? COLORS.white : COLORS.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  titleTransparent: {
    color: COLORS.white,
  },
});


