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
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList, Booking } from '../types';
import { bookingService, userService } from '../api';
import { Loading } from '../components';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest, userBookings, setPendingScreenAccess } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (isGuest) {
      setPendingScreenAccess('Bookings');
      navigation.navigate('Login');
      return;
    }
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
      
      if (activeTab === 'upcoming') {
        const upcoming = userBookings.filter(booking => {
          // Convert departureDate from "dd/mm/yyyy" to Date
          const depDate = new Date(booking.departureDate.split('/').reverse().join('-'));
          return depDate > now;
        });
        setBookings(upcoming);
      } else {
        const past = userBookings.filter(booking => {
          // Convert departureDate from "dd/mm/yyyy" to Date
          const depDate = new Date(booking.departureDate.split('/').reverse().join('-'));
          return depDate <= now;
        });
        setBookings(past);
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
    
    // Nếu tour đã qua thời gian khởi hành
    if (departure <= now) {
      if (status === 'cancelled') {
        return COLORS.error;
      } else {
        return COLORS.info; // Màu xanh cho "Đã hoàn thành"
      }
    }
    
    // Nếu tour chưa tới thời gian khởi hành
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status: string, departureDate: string) => {
    const now = new Date();
    // Convert departureDate from "dd/mm/yyyy" to Date
    const departure = new Date(departureDate.split('/').reverse().join('-'));
    
    // Nếu tour đã qua thời gian khởi hành
    if (departure <= now) {
      if (status === 'cancelled') {
        return 'Đã hủy';
      } else {
        return 'Đã hoàn thành';
      }
    }
    
    // Nếu tour chưa tới thời gian khởi hành
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
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
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}
          >
            Đã qua
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
              <View
                key={booking.id}
              >
                <TouchableOpacity
                  style={styles.bookingCard}
                  onPress={() =>
                    navigation.navigate('BookingDetail', { booking })
                  }
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: booking.destination.imageUrl }}
                    style={styles.bookingImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.bookingGradient}
                  />
                  
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(booking.status, booking.departureDate) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(booking.status, booking.departureDate)}
                    </Text>
                  </View>

                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingName} numberOfLines={1}>
                      {booking.destination.name}
                    </Text>
                    <View style={styles.bookingDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={COLORS.white}
                        />
                        <Text style={styles.detailText}>
                          {booking.departureDate} - {booking.returnDate}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={COLORS.white}
                        />
                        <Text style={styles.detailText}>
                          {booking.guests} khách
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bookingBottom}>
                      <Text style={styles.bookingPrice}>
                        ${booking.totalPrice}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={COLORS.white}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
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
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.veryLightGray,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    borderRadius: SIZES.radiusMd,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  tabText: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    ...FONTS.semiBold,
    color: COLORS.text,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bookingsContainer: {
    paddingHorizontal: SIZES.md,
    gap: SIZES.md,
  },
  bookingCard: {
    height: 200,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  bookingImage: {
    width: '100%',
    height: '100%',
  },
  bookingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  statusBadge: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  bookingInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.md,
  },
  bookingName: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  bookingDetails: {
    gap: 4,
    marginBottom: SIZES.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  bookingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
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


