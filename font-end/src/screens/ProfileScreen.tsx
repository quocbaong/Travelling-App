import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SIZES, FONTS, SHADOWS, DEFAULT_AVATAR } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest, logout, userBookings, userFavorites, isLoading, setPendingScreenAccess } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Show loading if still loading user data
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Function to check auth before navigating
  const handleNavigateWithAuth = (screen: string, screenName: string) => {
    if (isGuest) {
      setPendingScreenAccess(screenName);
      navigation.navigate('Login');
      return;
    }
    navigation.navigate(screen as any);
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'Thông tin cá nhân',
      icon: 'person',
      onPress: () => handleNavigateWithAuth('PersonalInfo', 'Profile'),
      requireAuth: true,
    },
    {
      id: 'payment',
      title: 'Phương thức thanh toán',
      icon: 'card',
      onPress: () => handleNavigateWithAuth('PaymentMethodsProfile', 'Profile'),
      requireAuth: true,
    },
    {
      id: 'security',
      title: 'Bảo mật',
      icon: 'shield-checkmark',
      onPress: () => handleNavigateWithAuth('Security', 'Profile'),
      requireAuth: true,
    },
    {
      id: 'language',
      title: 'Ngôn ngữ',
      icon: 'language',
      value: 'Tiếng Việt',
      onPress: () => navigation.navigate('Language'),
      requireAuth: false,
    },
  ];

  const supportItems = [
    {
      id: 'help',
      title: 'Trung tâm trợ giúp',
      icon: 'help-circle',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'terms',
      title: 'Điều khoản dịch vụ',
      icon: 'document-text',
      onPress: () => navigation.navigate('TermsOfService'),
    },
    {
      id: 'privacy',
      title: 'Chính sách bảo mật',
      icon: 'lock-closed',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 'about',
      title: 'Về chúng tôi',
      icon: 'information-circle',
      onPress: () => navigation.navigate('AboutUs'),
    },
  ];

  const handleLogout = () => {
    if (isGuest) {
      navigation.navigate('Login');
      return;
    }
    
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          }
        },
      ]
    );
  };
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hồ sơ</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={{ uri: isGuest ? DEFAULT_AVATAR : (user?.avatar || DEFAULT_AVATAR) }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {isGuest ? 'Guest' : (user?.name || 'User')}
            </Text>
            <Text style={styles.userEmail}>
              {isGuest ? 'Đăng nhập để trải nghiệm đầy đủ' : (user?.email || 'user@example.com')}
            </Text>
          </View>
          {!isGuest && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handleNavigateWithAuth('PersonalInfo', 'Profile')}
            >
              <Ionicons name="create" size={20} color="#0077B6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Login Button for Guest */}
        {isGuest && (
          <View style={styles.loginPrompt}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats */}
        {!isGuest && (() => {
          // Tính số chuyến đi "sắp tới" (chỉ tour active và chưa qua ngày khởi hành)
          const now = new Date();
          const upcomingBookings = userBookings.filter(booking => {
            try {
              const depDate = new Date(booking.departureDate.split('/').reverse().join('-'));
              return depDate > now && (booking.status === 'confirmed' || booking.status === 'pending');
            } catch (error) {
              return false;
            }
          });
          
          return (
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => handleNavigateWithAuth('Bookings', 'Bookings')}
              >
                <Text style={styles.statValue}>{upcomingBookings.length}</Text>
                <Text style={styles.statLabel}>Chuyến đi</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => handleNavigateWithAuth('Favorites', 'Favorites')}
              >
                <Text style={styles.statValue}>{userFavorites.length}</Text>
                <Text style={styles.statLabel}>Yêu thích</Text>
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.menuCard}>
            {/* Notifications Toggle */}
            <View style={styles.menuItemContainer}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="notifications"
                    size={20}
                    color="#0077B6"
                  />
                </View>
                <Text style={styles.menuItemText}>Thông báo</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={notificationsEnabled ? COLORS.primary : COLORS.gray}
              />
            </View>

            <View style={styles.divider} />

            {/* Dark Mode Toggle */}
            <View style={styles.menuItemContainer}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="moon"
                    size={20}
                    color="#0077B6"
                  />
                </View>
                <Text style={styles.menuItemText}>Chế độ tối</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={darkModeEnabled ? COLORS.primary : COLORS.gray}
              />
            </View>

            <View style={styles.divider} />

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.menuItemContainer}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="#0077B6"
                      />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value && (
                      <Text style={styles.menuItemValue}>{item.value}</Text>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.text}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          
          <View style={styles.menuCard}>
            {supportItems.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.menuItemContainer}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="#0077B6"
                      />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        {!isGuest && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Ionicons 
                name="log-out-outline" 
                size={20} 
                color={COLORS.error} 
              />
              <Text style={styles.logoutText}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
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
    textAlign: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.md,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: SIZES.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.lg,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.light,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.sm,
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
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  menuItemText: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  menuItemTextContainer: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  menuItemSubtext: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  menuItemValue: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.veryLightGray,
    marginHorizontal: SIZES.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.error,
  },
  loginText: {
    color: COLORS.primary,
  },
  loginPrompt: {
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loginButtonText: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
});

export default ProfileScreen;