import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  style?: any;
  index?: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onPress,
  onFavoritePress,
  isFavorite = false,
  style,
  index = 0,
}) => {
  return (
    <View
      style={[styles.container, style]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: destination.images?.[0] || 
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavoritePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF0000' : COLORS.white}
              />
            </TouchableOpacity>
          )}

          {destination.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={14} color={COLORS.rating} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={COLORS.white} />
              <Text style={styles.locationText}>{destination.country}</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {destination.name}
            </Text>
            
            <View style={styles.bottomRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={COLORS.rating} />
                <Text style={styles.rating}>{destination.rating}</Text>
                <Text style={styles.reviews}>({destination.reviews})</Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>From</Text>
                <Text style={styles.price}>${destination.price}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SIZES.md,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.heavy,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  featuredBadge: {
    position: 'absolute',
    top: SIZES.md,
    left: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
  },
  featuredText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  name: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
  reviews: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.lightGray,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    color: COLORS.lightGray,
  },
  price: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.white,
  },
});


