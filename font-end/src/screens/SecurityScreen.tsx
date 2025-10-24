import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [securitySettings, setSecuritySettings] = useState({
    biometricLogin: true,
    autoLock: false,
    loginNotifications: true,
    twoFactorAuth: false,
  });

  const handleToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const securityOptions = [
    {
      id: 'changePassword',
      title: 'Đổi mật khẩu',
      subtitle: 'Thay đổi mật khẩu tài khoản',
      icon: 'key-outline',
    },
    {
      id: 'twoFactorAuth',
      title: 'Xác thực 2 yếu tố',
      subtitle: 'Bảo vệ tài khoản bằng 2FA',
      icon: 'shield-checkmark-outline',
      isToggle: true,
      value: securitySettings.twoFactorAuth,
    },
    {
      id: 'biometricLogin',
      title: 'Đăng nhập sinh trắc học',
      subtitle: 'Sử dụng vân tay hoặc khuôn mặt',
      icon: 'finger-print-outline',
      isToggle: true,
      value: securitySettings.biometricLogin,
    },
    {
      id: 'autoLock',
      title: 'Tự động khóa',
      subtitle: 'Khóa app khi không sử dụng',
      icon: 'lock-closed-outline',
      isToggle: true,
      value: securitySettings.autoLock,
    },
    {
      id: 'loginNotifications',
      title: 'Thông báo đăng nhập',
      subtitle: 'Nhận thông báo khi có đăng nhập mới',
      icon: 'notifications-outline',
      isToggle: true,
      value: securitySettings.loginNotifications,
    },
  ];

  const deviceOptions = [
    {
      id: 'device1',
      title: 'iPhone 14 Pro',
      subtitle: 'Đang sử dụng • iOS 17.0',
      icon: 'phone-portrait-outline',
      isCurrent: true,
    },
    {
      id: 'device2',
      title: 'Samsung Galaxy S23',
      subtitle: 'Đã đăng nhập • Android 13',
      icon: 'phone-portrait-outline',
      isCurrent: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Bảo mật</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Security Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt bảo mật</Text>
          
          <View style={styles.settingsCard}>
            {securityOptions.map((item, index) => (
              <View key={item.id}>
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {item.isToggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={() => handleToggle(item.id as keyof typeof securitySettings)}
                      trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                      thumbColor={item.value ? COLORS.primary : COLORS.gray}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
                  )}
                </View>
                {index < securityOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Device Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý thiết bị</Text>
          
          <View style={styles.deviceCard}>
            {deviceOptions.map((device, index) => (
              <View key={device.id}>
                <View style={styles.deviceItem}>
                  <View style={styles.deviceItemLeft}>
                    <View style={styles.deviceIcon}>
                      <Ionicons name={device.icon as any} size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceTitle}>{device.title}</Text>
                      <Text style={styles.deviceSubtitle}>{device.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.deviceRight}>
                    {device.isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Hiện tại</Text>
                      </View>
                    )}
                    {!device.isCurrent && (
                      <TouchableOpacity style={styles.removeButton}>
                        <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {index < deviceOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt riêng tư</Text>
          
          <View style={styles.privacyCard}>
            <View style={styles.privacyItem}>
              <View style={styles.privacyItemLeft}>
                <View style={styles.privacyIcon}>
                  <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.privacyInfo}>
                  <Text style={styles.privacyTitle}>Chế độ riêng tư</Text>
                  <Text style={styles.privacySubtitle}>Ẩn thông tin cá nhân khỏi người khác</Text>
                </View>
              </View>
              <Switch
                value={true}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={COLORS.primary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.privacyItem}>
              <View style={styles.privacyItemLeft}>
                <View style={styles.privacyIcon}>
                  <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.privacyInfo}>
                  <Text style={styles.privacyTitle}>Chia sẻ dữ liệu</Text>
                  <Text style={styles.privacySubtitle}>Cho phép thu thập dữ liệu để cải thiện dịch vụ</Text>
                </View>
              </View>
              <Switch
                value={false}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={COLORS.gray}
              />
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.lg,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.veryLightGray,
    marginHorizontal: SIZES.sm,
  },
  deviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  deviceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 2,
  },
  deviceSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  deviceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  currentBadgeText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightError,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  privacyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 2,
  },
  privacySubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
});

export default SecurityScreen;