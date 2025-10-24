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

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest, logout, userBookings, userFavorites, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (isGuest) {
      navigation.replace('Login');
      return;
    }
    
    // Debug user data
    console.log('🔍 ProfileScreen - User data:', user);
    console.log('🔍 ProfileScreen - User name:', user?.name);
    console.log('🔍 ProfileScreen - User email:', user?.email);
  }, [isGuest, navigation, user]);

  // Show loading if still loading user data
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // Don't render if guest
  if (isGuest) {
    return null;
  }

  const menuItems = [
    {
      id: 'personal',
      title: 'Thông tin cá nhân',
      icon: 'person-outline',
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: 'payment',
      title: 'Phương thức thanh toán',
      icon: 'card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'security',
      title: 'Bảo mật',
      icon: 'shield-checkmark-outline',
      onPress: () => navigation.navigate('Security'),
    },
    {
      id: 'language',
      title: 'Ngôn ngữ',
      icon: 'language-outline',
      value: 'Tiếng Việt',
      onPress: () => console.log('Language'),
    },
  ];

  const supportItems = [
    {
      id: 'help',
      title: 'Trung tâm trợ giúp',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'terms',
      title: 'Điều khoản dịch vụ',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('TermsOfService'),
    },
    {
      id: 'privacy',
      title: 'Chính sách bảo mật',
      icon: 'lock-closed-outline',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 'about',
      title: 'Về chúng tôi',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('AboutUs'),
    },
  ];

  const handleLogout = () => {
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
            source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name || user?.fullName || user?.firstName || 'User'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('PersonalInfo')}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Bookings')}
          >
            <Text style={styles.statValue}>{userBookings.length}</Text>
            <Text style={styles.statLabel}>Chuyến đi</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.statValue}>{userFavorites.length}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          
          <View style={styles.menuCard}>
            {/* Notifications Toggle */}
            <View style={styles.menuItemContainer}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={COLORS.primary}
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
                    name="moon-outline"
                    size={20}
                    color={COLORS.primary}
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
                        color={COLORS.primary}
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
                      color={COLORS.gray}
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
                        color={COLORS.primary}
                      />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>

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
    color: COLORS.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.veryLightGray,
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
    color: COLORS.textSecondary,
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
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
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
    color: COLORS.textSecondary,
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
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  versionText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textLight,
  },
});

export default ProfileScreen;