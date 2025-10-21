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

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { PLACEHOLDER_IMAGES, CATEGORY_ICONS } from '../constants/images';
import { RootStackParamList, Destination, DestinationCategory } from '../types';
import { destinationService, userService } from '../api';
import { DestinationCard, CategoryCard, Loading, NotificationModal } from '../components';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, isGuest, userFavorites, addFavorite, removeFavorite } = useAuth();
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Tour sắp khởi hành',
      message: 'Tour "Hạ Long Bay" của bạn sẽ khởi hành vào ngày mai. Vui lòng chuẩn bị sẵn sàng!',
      time: '2 giờ trước',
      type: 'warning' as const,
      isRead: false,
    },
    {
      id: '2',
      title: 'Đặt chỗ thành công',
      message: 'Đơn đặt chỗ #12345 đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!',
      time: '1 ngày trước',
      type: 'success' as const,
      isRead: false,
    },
    {
      id: '3',
      title: 'Khuyến mãi đặc biệt',
      message: 'Giảm giá 30% cho tất cả tour mùa hè. Đặt ngay để không bỏ lỡ cơ hội!',
      time: '3 ngày trước',
      type: 'promotion' as const,
      isRead: true,
    },
  ]);

  const categories: DestinationCategory[] = [
    'beach',
    'mountain',
    'city',
    'adventure',
    'cultural',
    'nature',
    'luxury',
  ];

  const loadData = async () => {
    try {
      // Lấy tất cả destinations để filter theo rating
      const allDestinations = await destinationService.getAllDestinations();
      
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
        removeFavorite(destinationId);
      } else {
        // Find the destination to add
        const destination = [...featuredDestinations, ...popularDestinations].find(dest => dest.id === destinationId);
        if (destination) {
          addFavorite(destination);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCategoryPress = async (category: DestinationCategory) => {
    if (category === selectedCategory) {
      // Nếu đã chọn danh mục này rồi, bỏ chọn - load lại data theo logic rating
      setSelectedCategory(null);
      await loadData();
    } else {
      // Chọn danh mục mới - filter theo category và áp dụng logic rating
      setSelectedCategory(category);
      const allDestinations = await destinationService.getAllDestinations();
      const featuredIds = featuredDestinations.map(dest => dest.id);
      
      const filtered = allDestinations
        .filter(dest => dest.category === category && dest.rating >= 4.6 && !featuredIds.includes(dest.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      setPopularDestinations(filtered);
    }
  };

  const handleNotificationPress = () => {
    setShowNotificationModal(true);
  };

  const handleNotificationRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };


  // Bỏ loading spinner, hiển thị nội dung ngay lập tức

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
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
                {isGuest ? 'Hello, Guest!' : `Hello, ${user?.fullName || 'User'}!`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color={COLORS.gray} />
            <Text style={styles.searchPlaceholder}>
              Tìm kiếm điểm đến...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
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
                          {destination.rating}
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

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationRead={handleNotificationRead}
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
    marginBottom: SIZES.sm,
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
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: SIZES.sm,
    flexShrink: 0,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  searchSection: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    height: 50,
    gap: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchPlaceholder: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
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


