import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { biometricService } from '../services/biometricService';
import { authService } from '../api/authService';
import { userService } from '../api/userService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isBiometricAvailable, biometricType } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setShowChangePasswordModal(true);
  };

  const handleChangePasswordSubmit = async () => {
    // Validation
    if (!currentPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setPasswordLoading(true);
    try {
      // Try to login with current password to verify it's correct
      try {
        await authService.login({
          email: user?.email || '',
          password: currentPassword
        });
      } catch (loginError) {
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng');
        setPasswordLoading(false);
        return;
      }

      // Change password using existing update endpoint
      await userService.updateUser(user?.id || '', { 
        password: newPassword 
      } as any);
      
      Alert.alert(
        'Thành công',
        'Mật khẩu đã được thay đổi thành công',
        [
                 {
                   text: 'OK',
                   onPress: () => {
                     setShowChangePasswordModal(false);
                     setCurrentPassword('');
                     setNewPassword('');
                     setConfirmPassword('');
                     setShowCurrentPassword(false);
                     setShowNewPassword(false);
                     setShowConfirmPassword(false);
                   }
                 }
        ]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Lỗi', 'Không thể thay đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelChangePassword = () => {
    setShowChangePasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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

      {/* Change Password Modal */}
      <Modal
        visible={showChangePasswordModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelChangePassword}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancelChangePassword}
        >
          <TouchableOpacity 
            style={styles.modalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCancelChangePassword}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                   <View style={styles.formGroup}>
                     <Text style={styles.label}>Mật khẩu hiện tại</Text>
                     <View style={styles.passwordInputContainer}>
                       <TextInput
                         style={styles.passwordInput}
                         value={currentPassword}
                         onChangeText={setCurrentPassword}
                         placeholder="Nhập mật khẩu hiện tại"
                         placeholderTextColor={COLORS.textSecondary}
                         secureTextEntry={!showCurrentPassword}
                         autoCapitalize="none"
                       />
                       <TouchableOpacity
                         style={styles.passwordToggle}
                         onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                         activeOpacity={0.7}
                       >
                         <Ionicons
                           name={showCurrentPassword ? "eye-off" : "eye"}
                           size={20}
                           color={COLORS.textSecondary}
                         />
                       </TouchableOpacity>
                     </View>
                   </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
              <Text style={styles.requirementItem}>• Ít nhất 6 ký tự</Text>
              <Text style={styles.requirementItem}>• Khác mật khẩu hiện tại</Text>
            </View> */}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelChangePassword}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, passwordLoading && styles.submitButtonDisabled]}
                onPress={handleChangePasswordSubmit}
                activeOpacity={0.7}
                disabled={passwordLoading}
              >
                <Text style={styles.submitButtonText}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: COLORS.primaryLight,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    width: '100%',
    maxHeight: '80%',
    ...SHADOWS.heavy,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalCloseButton: {
    padding: SIZES.xs,
  },
  modalTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
  },
  modalContent: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  formGroup: {
    marginBottom: SIZES.md,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: SIZES.body1,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  passwordToggle: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
        passwordRequirements: {
          backgroundColor: COLORS.primaryLight,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.lg,
  },
  requirementsTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  requirementItem: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  submitButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
});

export default SecurityScreen;