import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { biometricService } from '../services/biometricService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isBiometricAvailable, biometricType } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBiometricPreference();
    
    // Debug biometric info
    console.log('🔍 SecurityScreen - Biometric available:', isBiometricAvailable);
    console.log('🔍 SecurityScreen - Biometric type:', biometricType);
  }, [isBiometricAvailable, biometricType]);

  const loadBiometricPreference = async () => {
    try {
      const enabled = await biometricService.getBiometricPreference();
      setBiometricEnabled(enabled);
    } catch (error) {
      console.error('Error loading biometric preference:', error);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Enable biometric authentication
      setLoading(true);
      try {
        const result = await biometricService.authenticate(
          `Kích hoạt ${biometricType} để đăng nhập nhanh`
        );

        if (result.success) {
          await biometricService.saveBiometricPreference(true);
          if (user) {
            await biometricService.saveBiometricCredentials(user.id, user.email);
          }
          setBiometricEnabled(true);
        } else {
          Alert.alert(
            'Thất bại',
            result.error || 'Không thể kích hoạt sinh trắc học',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error enabling biometric:', error);
        Alert.alert('Lỗi', 'Không thể kích hoạt sinh trắc học');
      } finally {
        setLoading(false);
      }
    } else {
      // Disable biometric authentication
      await biometricService.saveBiometricPreference(false);
      await biometricService.clearBiometricCredentials();
      setBiometricEnabled(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Đổi mật khẩu',
      'Tính năng đổi mật khẩu sẽ được phát triển trong phiên bản tiếp theo.',
      [{ text: 'OK' }]
    );
  };

  const handleTwoFactorAuth = () => {
    Alert.alert(
      'Xác thực 2 bước',
      'Tính năng xác thực 2 bước sẽ được phát triển trong phiên bản tiếp theo.',
      [{ text: 'OK' }]
    );
  };

  const handleLoginHistory = () => {
    Alert.alert(
      'Lịch sử đăng nhập',
      'Tính năng xem lịch sử đăng nhập sẽ được phát triển trong phiên bản tiếp theo.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Bảo mật</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Bảo mật tài khoản</Text>
          </View>

          {/* Biometric Authentication */}
          {isBiometricAvailable ? (
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Đăng nhập sinh trắc học
                </Text>
                <Text style={styles.settingDescription}>
                  Sử dụng vân tây hoặc khuôn mặt để đăng nhập
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                disabled={loading}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={biometricEnabled ? COLORS.white : COLORS.gray}
              />
            </View>
          ) : (
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Đăng nhập sinh trắc học
                </Text>
                <Text style={styles.settingDescription}>
                  Thiết bị không hỗ trợ sinh trắc học
                </Text>
              </View>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.gray} />
            </View>
          )}

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Đổi mật khẩu</Text>
              <Text style={styles.settingDescription}>
                Thay đổi mật khẩu tài khoản
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleTwoFactorAuth}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Xác thực 2 bước</Text>
              <Text style={styles.settingDescription}>
                Bảo mật tài khoản với xác thực 2 bước
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLoginHistory}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Lịch sử đăng nhập</Text>
              <Text style={styles.settingDescription}>
                Xem lịch sử đăng nhập tài khoản
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
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
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  backButton: {
    padding: SIZES.xs,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.md,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginTop: SIZES.md,
    ...SHADOWS.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.h4,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: SIZES.md,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightPrimary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    marginTop: SIZES.sm,
  },
  setupButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.primary,
    marginLeft: SIZES.xs,
  },
  unavailableText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
});

export default SecurityScreen;