import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList } from '../types';
import { userService, destinationService } from '../api';
import { Button } from '../components';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'DestinationDetail'>;

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.5;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DestinationDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { destination } = route.params;
  const { isGuest, user, addFavorite, removeFavorite, setPendingTour, userReviews } = useAuth();

  const [isFavorite, setIsFavorite] = useState(
    user?.favorites?.includes(destination.id) || false
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Update favorite status when user favorites change
  useEffect(() => {
    setIsFavorite(user?.favorites?.includes(destination.id) || false);
  }, [user?.favorites, destination.id]);

  // Calculate real-time rating and reviews
  const getRealTimeRating = () => {
    const destinationReviews = userReviews.filter(review => 
      review.destinationId === destination.id
    );
    
    if (destinationReviews.length === 0) {
      return destination.rating;
    }
    
    const totalRating = destinationReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / destinationReviews.length;
    
    // Combine with original rating (weighted average)
    const combinedRating = (destination.rating * destination.reviews + averageRating * destinationReviews.length) / 
                          (destination.reviews + destinationReviews.length);
    
    return Math.round(combinedRating * 10) / 10; // Round to 1 decimal place
  };

  const getRealTimeReviewsCount = () => {
    const destinationReviews = userReviews.filter(review => 
      review.destinationId === destination.id
    );
    return destination.reviews + destinationReviews.length;
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const handleFavoritePress = async () => {
    if (isGuest) {
      navigation.navigate('Login');
      return;
    }

    try {
      if (isFavorite) {
        removeFavorite(destination.id);
      } else {
        addFavorite(destination.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBookNow = () => {
    if (isGuest) {
      setPendingTour(destination);
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('TourServices', { destination });
  };

  return (
    <View style={styles.container}>
      {/* Animated Header Image */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Animated.Image
          source={{
            uri: destination.images?.[selectedImageIndex] || destination.imageUrl,
          }}
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Fixed Header with Back Button */}
      <SafeAreaView style={styles.fixedHeader} edges={['top']}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.headerTitle,
              {
                opacity: titleOpacity,
              },
            ]}
            numberOfLines={1}
          >
            {destination.name}
          </Animated.Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF0000' : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Spacer for header */}
        <View style={{ height: HEADER_MAX_HEIGHT }} />

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Image Gallery */}
          {destination.images && destination.images.length > 1 && (
            <View style={styles.gallerySection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              >
                {destination.images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImageIndex(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: image }}
                      style={[
                        styles.galleryImage,
                        selectedImageIndex === index && styles.galleryImageSelected,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Title and Location */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <Text style={styles.name}>{destination.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={COLORS.primary} />
                  <Text style={styles.location}>{destination.country}</Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color={COLORS.rating} />
                <Text style={styles.ratingText}>{getRealTimeRating()}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statText}>{destination.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statText}>{getRealTimeReviewsCount()} reviews</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statText}>${destination.price}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{destination.description}</Text>
          </View>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
              {destination.highlights.map((highlight, index) => (
                <View
                  key={index}
                  animation="fadeInLeft"
                  delay={index * 50}
                  style={styles.highlightItem}
                >
                  <View style={styles.highlightBullet}>
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  </View>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Amenities */}
          {destination.amenities && destination.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tiện ích</Text>
              <View style={styles.amenitiesContainer}>
                {destination.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    animation="zoomIn"
                    delay={index * 50}
                    style={styles.amenityChip}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Đánh giá</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Reviews', { destinationId: destination.id })}
              >
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewSummary}>
              <View style={styles.reviewScore}>
                <Text style={styles.reviewScoreText}>{getRealTimeRating()}</Text>
                <Ionicons name="star" size={24} color={COLORS.rating} />
              </View>
              <Text style={styles.reviewCount}>
                Dựa trên {getRealTimeReviewsCount()} đánh giá
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Chỉ từ</Text>
          <Text style={styles.priceValue}>${destination.price}</Text>
          <Text style={styles.priceUnit}>/ người</Text>
        </View>
        <Button
          title="Đặt ngay"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SIZES.sm,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    paddingTop: SIZES.lg,
  },
  gallerySection: {
    marginBottom: SIZES.lg,
  },
  galleryContainer: {
    paddingHorizontal: SIZES.md,
    gap: SIZES.sm,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    marginRight: SIZES.sm,
    opacity: 0.6,
  },
  galleryImageSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  titleSection: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  titleLeft: {
    flex: 1,
  },
  name: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
  },
  ratingText: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.veryLightGray,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
    gap: SIZES.sm,
  },
  highlightBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
  },
  amenityText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  seeAll: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.primary,
  },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  reviewScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
  },
  reviewScoreText: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
  },
  reviewCount: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    ...SHADOWS.heavy,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  priceValue: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.primary,
  },
  priceUnit: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  bookButton: {
    flex: 1,
    marginLeft: SIZES.md,
  },
});

export default DestinationDetailScreen;


