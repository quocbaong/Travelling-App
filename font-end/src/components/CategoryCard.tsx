import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { DestinationCategory } from '../types';

interface CategoryCardProps {
  category: DestinationCategory;
  imageUrl: string;
  onPress: () => void;
  isSelected?: boolean;
  index?: number;
}

const CATEGORY_NAMES: Record<DestinationCategory, string> = {
  Beach: 'Beach',
  Nature: 'Nature',
  Cultural: 'Cultural',
  Entertainment: 'Entertainment',
  Luxury: 'Luxury',
};

// Fallback images for each category - using more reliable URLs
const FALLBACK_IMAGES: Record<DestinationCategory, string> = {
  Beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  Nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  Cultural: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  Luxury: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  imageUrl,
  onPress,
  isSelected = false,
  index = 0,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when imageUrl changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  // Force re-render when selection changes
  React.useEffect(() => {
    console.log(`🔄 CategoryCard ${category} selection changed:`, isSelected);
  }, [isSelected]);

  const handleImageError = () => {
    console.log(`❌ CategoryCard image error for ${category}:`, imageUrl);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ CategoryCard image loaded for ${category}:`, imageUrl);
    setImageLoaded(true);
  };

  // Use fallback if error or no imageUrl
  const currentImageUrl = imageError || !imageUrl ? FALLBACK_IMAGES[category] : imageUrl;

  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: currentImageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <Text style={styles.text}>{CATEGORY_NAMES[category]}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SIZES.sm,
  },
  card: {
    width: 120,
    height: 80,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.medium,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.white,
    textAlign: 'center',
    padding: SIZES.sm,
  },
});


