import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { PLACEHOLDER_IMAGES, CATEGORY_ICONS } from '../constants/images';
import { RootStackParamList, Destination, DestinationCategory } from '../types';
import { destinationService, userService } from '../api';
import { DestinationCard, CategoryCard, Loading, NotificationModal } from '../components';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { 
    user, 
    isGuest, 
    userFavorites, 
    addFavorite, 
    removeFavorite,
    userNotifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    loadNotifications,
  } = useAuth();
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const categories: DestinationCategory[] = [
    'Beach',
    'Nature',
    'Cultural',
    'Entertainment',
    'Luxury',
  ];

  const loadData = async () => {
    try {
      // Lấy tất cả destinations để filter theo rating
      const allDestinations = await destinationService.getAllDestinations();
      
      console.log(`📊 LoadData - Total destinations: ${allDestinations?.length || 0}`);
      console.log(`📊 LoadData - Sample destinations:`, allDestinations?.slice(0, 3).map(d => ({ name: d.name, category: d.category })));
      
      if (allDestinations && allDestinations.length > 0) {
        // Destinations nổi bật: rating >= 4.8, hiển thị 4-5 cái
        const featured = allDestinations
          .filter(dest => dest.rating >= 4.8)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        
        setFeaturedDestinations(featured);
        
        // Destinations phổ biến: rating >= 4.6, loại bỏ những cái đã hiển thị ở nổi bật, tối đa 8 cái
        const featuredIds = featured.map(dest => dest.id);
        const popular = allDestinations
          .filter(dest => dest.rating >= 4.6 && !featuredIds.includes(dest.id))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        
        setPopularDestinations(popular);
      } else {
        console.log('No destinations loaded from backend');
        setFeaturedDestinations([]);
        setPopularDestinations([]);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays on error
      setFeaturedDestinations([]);
      setPopularDestinations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when screen comes into focus (e.g., after submitting a review)
  useFocusEffect(
    React.useCallback(() => {
      if (!loading) {
        loadData();
      }
    }, [loading])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleFavoritePress = async (destinationId: string) => {
    if (isGuest) {
      navigation.navigate('Login');
      return;
    }

    try {
      const isCurrentlyFavorite = userFavorites.some(fav => fav.id === destinationId);
      if (isCurrentlyFavorite) {
        await removeFavorite(destinationId);
      } else {
        // Find the destination to add
        const destination = [...featuredDestinations, ...popularDestinations].find(dest => dest.id === destinationId);
        if (destination) {
          // Double check to avoid duplicate
          const alreadyExists = userFavorites.some(fav => fav.id === destinationId);
          if (!alreadyExists) {
            await addFavorite(destination);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Silently handle the error - the UI will update when state syncs
    }
  };

  const handleCategoryPress = async (category: DestinationCategory) => {
    console.log(`🎯 Category pressed: ${category}`);
    console.log(`🎯 Current selected category: ${selectedCategory}`);
    
    if (category === selectedCategory) {
      // Nếu đã chọn danh mục này rồi, bỏ chọn - load lại data theo logic rating
      console.log(`🔄 Deselecting category: ${category}`);
      setSelectedCategory(null);
      await loadData();
    } else {
      // Chọn danh mục mới - filter theo category và áp dụng logic rating
      console.log(`✅ Selecting new category: ${category}`);
      setSelectedCategory(category);
      const allDestinations = await destinationService.getAllDestinations();
      const featuredIds = featuredDestinations.map(dest => dest.id);
      
      console.log(`📊 All destinations sample:`, allDestinations.slice(0, 3).map(d => ({ name: d.name, category: d.category })));
      
      const filtered = allDestinations
        .filter(dest => dest.category === category && !featuredIds.includes(dest.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      console.log(`🔍 Filtering by category: ${category}`);
      console.log(`📊 Total destinations: ${allDestinations.length}`);
      console.log(`📊 Filtered results: ${filtered.length}`);
      console.log(`📊 Featured IDs: ${featuredIds.length}`);
      console.log(`📊 Filtered destinations:`, filtered.map(d => ({ name: d.name, category: d.category })));
      
      setPopularDestinations(filtered);
    }
  };

  const handleNotificationPress = async () => {
    setShowNotificationModal(true);
    // Reload notifications when modal opens
    if (!isGuest) {
      await loadNotifications();
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };


  // Bỏ loading spinner, hiển thị nội dung ngay lập tức

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - Cố định */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
            activeOpacity={0.7}
          >
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {isGuest ? 'Hello, Guest!' : `Hello, ${user?.name || 'User'}!`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationPress}
        >
          <Ionicons name="notifications" size={24} color="#0077B6" />
          {unreadNotificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar - Cố định */}
      <View style={styles.searchSection}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color={COLORS.black} />
          <Text style={styles.searchPlaceholder}>
            Tìm kiếm điểm đến...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Section - ScrollView */}
      <View style={styles.contentSection}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {marginLeft: SIZES.md, marginBottom: SIZES.sm}]}>Danh mục</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={`${category}-${selectedCategory === category ? 'selected' : 'unselected'}`}
                category={category}
                imageUrl={PLACEHOLDER_IMAGES.categories[category]}
                onPress={() => handleCategoryPress(category)}
                isSelected={selectedCategory === category}
                index={index}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nổi bật</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
          >
            {featuredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onPress={() =>
                  navigation.navigate('DestinationDetail', { destination })
                }
                onFavoritePress={() => handleFavoritePress(destination.id)}
                isFavorite={userFavorites.some(fav => fav.id === destination.id)}
                index={index}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory ? 'Kết quả lọc' : 'Phổ biến'}
            </Text>
            {selectedCategory ? (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  loadData(); // Sử dụng loadData để áp dụng logic rating
                }}
              >
                <Text style={styles.clearFilter}>Xóa lọc</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' })}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.gridContainer}>
            {popularDestinations.map((destination, index) => (
              <View
                key={destination.id}
                style={styles.gridItem}
              >
                <TouchableOpacity
                  style={styles.popularCard}
                  onPress={() =>
                    navigation.navigate('DestinationDetail', { destination })
                  }
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: destination.images?.[0] || destination.imageUrl }}
                    style={styles.popularImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.popularGradient}
                  />
                  <TouchableOpacity
                    style={styles.popularFavorite}
                    onPress={() => handleFavoritePress(destination.id)}
                  >
                    <Ionicons
                      name={userFavorites.some(fav => fav.id === destination.id) ? 'heart' : 'heart-outline'}
                      size={20}
                      color={userFavorites.some(fav => fav.id === destination.id) ? '#FF0000' : COLORS.white}
                    />
                  </TouchableOpacity>
                  <View style={styles.popularInfo}>
                    <Text style={styles.popularName} numberOfLines={1}>
                      {destination.name}
                    </Text>
                    <View style={styles.popularBottom}>
                      <View style={styles.popularRating}>
                        <Ionicons name="star" size={12} color={COLORS.rating} />
                        <Text style={styles.popularRatingText}>
                          {destination.rating || 0}
                        </Text>
                      </View>
                      <Text style={styles.popularPrice}>${destination.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

          {/* Bottom Spacing */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={userNotifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationRead={handleNotificationRead}
        onDeleteNotification={handleDeleteNotification}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    paddingTop: SIZES.md,
    marginBottom: SIZES.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '80%',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  greetingContainer: {
    flex: 1,
    marginLeft: SIZES.sm,
    marginRight: SIZES.sm,
  },
  greeting: {
    ...FONTS.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: SIZES.sm,
    flexShrink: 0,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.xs,
    marginBottom: SIZES.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    height: 48,
    gap: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    ...SHADOWS.light,
  },
  searchPlaceholder: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  contentSection: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
  },
  seeAll: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  clearFilter: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.error,
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.md,
  },
  destinationsContainer: {
    paddingHorizontal: SIZES.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.md - 4,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  popularCard: {
    height: 200,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  popularFavorite: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.sm,
  },
  popularName: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.white,
    marginBottom: 4,
  },
  popularBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  popularRatingText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  popularPrice: {
    ...FONTS.bold,
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
});

export default HomeScreen;


