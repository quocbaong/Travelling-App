import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList, Booking } from '../types';
import { bookingService, userService } from '../api';
import { Loading } from '../components';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest, userBookings, setPendingScreenAccess, removeBooking, userReviews } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    if (isGuest) {
      setPendingScreenAccess('Bookings');
      navigation.navigate('Login');
      return;
    }
    console.log('🔄 BookingsScreen: useEffect triggered');
    console.log('🔄 userBookings from context:', userBookings.length);
    loadBookings();
  }, [activeTab, isGuest, userBookings]);

  // Auto refresh every minute to update status based on real-time
  useEffect(() => {
    const interval = setInterval(() => {
      loadBookings();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [userBookings]);

  const loadBookings = async () => {
    try {
      // Chỉ sử dụng userBookings từ context, không load từ API
      const now = new Date();
      
      // Log để debug
      console.log('📋 Total bookings:', userBookings.length);
      if (userBookings.length > 0) {
        console.log('📋 First booking:', {
          id: userBookings[0].id,
          destination: userBookings[0].destination?.name,
          imageUrl: userBookings[0].destination?.imageUrl,
          images: userBookings[0].destination?.images
        });
      }
      
      if (activeTab === 'upcoming') {
        // Sắp tới: chỉ tour active (confirmed/pending) và chưa qua ngày khởi hành
        const upcoming = userBookings.filter(booking => {
          const depDate = new Date(booking.departureDate.split('/').reverse().join('-'));
          return depDate > now && (booking.status === 'confirmed' || booking.status === 'pending');
        });
        setBookings(upcoming);
      } else {
        // Lịch sử: bao gồm completed, cancelled (trong vòng 7 ngày), và các tour đã qua ngày
        const history = userBookings.filter(booking => {
          const depDate = new Date(booking.departureDate.split('/').reverse().join('-'));
          
          // Nếu tour bị hủy, chỉ hiển thị trong vòng 7 ngày kể từ ngày tạo booking
          if (booking.status === 'cancelled') {
            const createdDate = new Date(booking.createdAt);
            const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            // Chỉ hiển thị tour đã hủy trong vòng 7 ngày
            return daysSinceCreated <= 7;
          }
          
          // Các tour khác (completed hoặc đã qua ngày)
          return depDate <= now || booking.status === 'completed';
        });
        setBookings(history);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const getStatusColor = (status: string, departureDate: string) => {
    const now = new Date();
    // Convert departureDate from "dd/mm/yyyy" to Date
    const departure = new Date(departureDate.split('/').reverse().join('-'));
    
    // Kiểm tra status trước
    if (status === 'cancelled') {
      return COLORS.error;
    }
    
    if (status === 'completed') {
      return COLORS.info;
    }
    
    // Nếu tour đã qua thời gian khởi hành
    if (departure <= now) {
      return COLORS.info; // Màu xanh cho "Đã hoàn thành"
    }
    
    // Nếu tour chưa tới thời gian khởi hành (sắp tới)
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status: string, departureDate: string) => {
    const now = new Date();
    // Convert departureDate from "dd/mm/yyyy" to Date
    const departure = new Date(departureDate.split('/').reverse().join('-'));
    
    // Kiểm tra status trước
    if (status === 'cancelled') {
      return 'Đã hủy';
    }
    
    if (status === 'completed') {
      return 'Đã hoàn thành';
    }
    
    // Nếu tour đã qua thời gian khởi hành
    if (departure <= now) {
      return 'Đã hoàn thành';
    }
    
    // Nếu tour chưa tới thời gian khởi hành (sắp tới)
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const formatBookingDate = (departureDate: string, returnDate: string, createdAt?: string, isHistory: boolean = false) => {
    try {
      if (isHistory && createdAt) {
        // For history tab, show booking date (createdAt)
        const date = new Date(createdAt);
        const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                       'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${day} ${month}, ${year}, ${displayHours}:${minutes} ${ampm}`;
      } else {
        // For upcoming tab, show travel dates
        const formatDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split('/');
          return new Date(`${year}-${month}-${day}`);
        };

        const depDate = formatDate(departureDate);
        const retDate = formatDate(returnDate);
        
        const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                       'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        
        const depDay = depDate.getDate();
        const depMonth = months[depDate.getMonth()];
        const depYear = depDate.getFullYear();
        
        const retDay = retDate.getDate();
        const retMonth = months[retDate.getMonth()];
        const retYear = retDate.getFullYear();
        
        if (depMonth === retMonth && depYear === retYear) {
          return `${depDay} - ${retDay} ${depMonth}, ${depYear}`;
        } else {
          return `${depDay} ${depMonth}, ${depYear} - ${retDay} ${retMonth}, ${retYear}`;
        }
      }
    } catch (error) {
      return isHistory ? createdAt || '' : `${departureDate} - ${returnDate}`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color="#FFD700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#FFD700" />
        );
      }
    }
    return stars;
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Hủy đặt chỗ',
      'Bạn có chắc chắn muốn hủy đặt chỗ này? Hành động này không thể hoàn tác.',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đặt chỗ',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await bookingService.cancelBooking(booking.id);
              if (success) {
                // Remove booking from context
                removeBooking(booking.id);
                Alert.alert('Thành công', 'Đặt chỗ đã được hủy thành công.');
              } else {
                Alert.alert('Lỗi', 'Không thể hủy đặt chỗ. Vui lòng thử lại sau.');
              }
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Lỗi', 'Không thể hủy đặt chỗ. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  const hasReviewed = (destinationId: string) => {
    return userReviews.some(
      review => review.destinationId === destinationId && review.userId === user?.id
    );
  };

  const handleWriteReview = (booking: Booking) => {
    navigation.navigate('TourReview', { booking } as any);
  };

  const handleBookAgain = (booking: Booking) => {
    navigation.navigate('DestinationDetail', { destination: booking.destination });
  };

  if (loading) {
    return <Loading fullScreen />;
  }


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Đặt chỗ của tôi</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Sắp tới
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={COLORS.gray}
            />
            <Text style={styles.emptyTitle}>Chưa có đặt chỗ nào</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming'
                ? 'Bắt đầu khám phá và đặt chuyến đi của bạn!'
                : 'Bạn chưa có chuyến đi nào trong quá khứ'}
            </Text>
          </View>
        ) : (
          <View style={styles.bookingsContainer}>
            {bookings.map((booking, index) => (
              <View key={booking.id} style={styles.bookingCard}>
                {/* Booking ID and Date */}
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingId}>Mã đặt chỗ: {booking.id.slice(-8)}</Text>
                  <Text style={styles.bookingDate}>
                    {activeTab === 'history' ? 'Ngày đặt: ' : 'Ngày đi: '}
                    {formatBookingDate(booking.departureDate, booking.returnDate, booking.createdAt, activeTab === 'history')}
                  </Text>
                </View>

                {/* Property/Tour Details */}
                <View style={styles.bookingContent}>
                  {/* Image */}
                  <Image
                    source={{
                      uri:
                        booking.destination?.imageUrl ||
                        booking.destination?.images?.[0] ||
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    }}
                    style={styles.bookingImage}
                  />

                  {/* Details */}
                  <View style={styles.bookingDetails}>
                    {/* Name */}
                    <Text style={styles.destinationName} numberOfLines={1}>
                      {booking.destination?.name || 'Không có tên'}
                    </Text>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                      <Ionicons name="location" size={14} color={COLORS.black} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {booking.destination?.country || 'Không xác định'}
                      </Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                      <View style={styles.starsContainer}>
                        {renderStars(booking.destination?.rating || 0)}
                      </View>
                      <Text style={styles.ratingText}>
                        {booking.destination?.rating?.toFixed(1) || '0.0'}
                      </Text>
                    </View>
                    <Text style={styles.reviewsText}>
                      ({booking.destination?.reviews || 0} đánh giá)
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  {activeTab === 'upcoming' ? (
                    <>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelBooking(booking)}
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                      >
                        <Text
                          style={[
                            styles.cancelButtonText,
                            (booking.status === 'cancelled' || booking.status === 'completed') &&
                              styles.disabledButtonText,
                          ]}
                        >
                          Hủy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => navigation.navigate('BookingDetail', { booking })}
                      >
                        <Text style={styles.viewDetailsButtonText}>Xem chi tiết</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() => handleWriteReview(booking)}
                        disabled={
                          hasReviewed(booking.destination?.id || '') || 
                          booking.status === 'cancelled'
                        }
                      >
                        <Text
                          style={[
                            styles.reviewButtonText,
                            (hasReviewed(booking.destination?.id || '') || booking.status === 'cancelled') &&
                              styles.disabledButtonText,
                          ]}
                        >
                          Viết đánh giá
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.bookAgainButton}
                        onPress={() => handleBookAgain(booking)}
                      >
                        <Text style={styles.bookAgainButtonText}>Đặt lại</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.veryLightGray,
  },
  header: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radiusMd,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.light,
  },
  tabText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.black,
  },
  activeTabText: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bookingsContainer: {
    paddingHorizontal: SIZES.md,
    gap: SIZES.md,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.medium,
    marginBottom: SIZES.md,
  },
  bookingHeader: {
    marginBottom: SIZES.md,
  },
  bookingId: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: 4,
  },
  bookingDate: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  bookingContent: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
  },
  bookingImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    marginRight: SIZES.md,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: SIZES.xs,
  },
  ratingText: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  reviewsText: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.black,
    marginBottom: SIZES.xs,
  },
  destinationName: {
    ...FONTS.bold,
    fontSize: SIZES.h4+3,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...FONTS.regular,
    fontSize: SIZES.body1+1,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginTop: SIZES.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
  reviewButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  bookAgainButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAgainButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
    marginTop: SIZES.xxl,
  },
  emptyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
    marginTop: SIZES.md,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: SIZES.sm,
    textAlign: 'center',
    paddingHorizontal: SIZES.xl,
  },
});

export default BookingsScreen;


