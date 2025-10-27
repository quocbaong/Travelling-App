import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { COLORS, SIZES, FONTS, SHADOWS, DEFAULT_AVATAR } from '../constants/theme';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PersonalInfoScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, userBookings, userFavorites, updateUserAvatar, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    avatar: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('🔍 PersonalInfoScreen - User data:', user);
      console.log('🔍 PersonalInfoScreen - User name:', user.name);
      console.log('🔍 PersonalInfoScreen - User email:', user.email);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: (user as any).dateOfBirth || '',
        gender: (user as any).gender || '',
        address: (user as any).address || '',
        avatar: user.avatar || '',
      });
      
      console.log('🔍 PersonalInfoScreen - FormData after set:', {
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleImagePicker = async () => {
    try {
      Alert.alert(
        'Chọn ảnh',
        'Chọn cách lấy ảnh',
        [
          {
            text: 'Thư viện',
            onPress: async () => {
              try {
                // Request permission trước khi mở
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh để thay đổi avatar');
                  return;
                }

                console.log('Opening image library...');
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: false,
                  quality: 0.8,
                });

                console.log('Image picker result:', result);

                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const newAvatarUrl = result.assets[0].uri;
                  console.log('Selected image URI:', newAvatarUrl);
                  
                  setFormData(prev => ({
                    ...prev,
                    avatar: newAvatarUrl,
                  }));
                  updateUserAvatar(newAvatarUrl);
                  
                  Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật');
                } else {
                  console.log('User canceled or no image selected');
                }
              } catch (error) {
                console.error('Error opening image library:', error);
                Alert.alert('Lỗi', 'Không thể mở thư viện ảnh: ' + (error as any).message);
              }
            }
          },
          {
            text: 'Camera',
            onPress: async () => {
              try {
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraStatus !== 'granted') {
                  Alert.alert('Lỗi', 'Cần quyền truy cập camera');
                  return;
                }

                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: false,
                  quality: 0.8,
                });

                if (!result.canceled && result.assets && result.assets[0]) {
                  const newAvatarUrl = result.assets[0].uri;
                  console.log('Captured image URI:', newAvatarUrl);
                  
                  setFormData(prev => ({
                    ...prev,
                    avatar: newAvatarUrl,
                  }));
                  updateUserAvatar(newAvatarUrl);
                  
                  Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật');
                }
              } catch (error) {
                console.error('Error opening camera:', error);
                Alert.alert('Lỗi', 'Không thể mở camera: ' + (error as any).message);
              }
            }
          },
          { text: 'Hủy', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    updateUserInfo({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      avatar: formData.avatar,
    } as any);
    
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: (user as any).dateOfBirth || '',
        gender: (user as any).gender || '',
        address: (user as any).address || '',
        avatar: user.avatar || '',
      });
    }
    setIsEditing(false);
  };

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
          <Text style={styles.title}>Thông tin cá nhân</Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "close" : "create-outline"} 
              size={20} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: formData.avatar || user?.avatar || DEFAULT_AVATAR }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{formData.name || user?.name || 'User'}</Text>
        </View>


        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          
          <View style={styles.infoCard}>
            {/* Name */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Họ và tên</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={formData.name}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                      placeholder="Nhập họ và tên"
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {formData.name || user?.name || 'Chưa cập nhật'}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={formData.email}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                      placeholder="Nhập email"
                      placeholderTextColor={COLORS.textSecondary}
                      keyboardType="email-address"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{formData.email || 'Chưa cập nhật'}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Phone */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Số điện thoại</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={formData.phone}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={COLORS.textSecondary}
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{formData.phone || 'Chưa cập nhật'}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Date of Birth */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày sinh</Text>
                  {isEditing ? (
                    <TouchableOpacity 
                      style={styles.editInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.editInputText}>
                        {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'Chọn ngày sinh'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.infoValue}>
                      {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'Chưa cập nhật'}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Gender */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="male-female-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Giới tính</Text>
                  {isEditing ? (
                    <View style={styles.genderOptions}>
                      <TouchableOpacity 
                        style={[
                          styles.genderOption,
                          formData.gender === 'Nam' && styles.genderOptionSelected
                        ]}
                        onPress={() => handleGenderSelect('Nam')}
                      >
                        <Text style={[
                          styles.genderOptionText,
                          formData.gender === 'Nam' && styles.genderOptionTextSelected
                        ]}>Nam</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.genderOption,
                          formData.gender === 'Nữ' && styles.genderOptionSelected
                        ]}
                        onPress={() => handleGenderSelect('Nữ')}
                      >
                        <Text style={[
                          styles.genderOptionText,
                          formData.gender === 'Nữ' && styles.genderOptionTextSelected
                        ]}>Nữ</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.genderOption,
                          formData.gender === 'Khác' && styles.genderOptionSelected
                        ]}
                        onPress={() => handleGenderSelect('Khác')}
                      >
                        <Text style={[
                          styles.genderOptionText,
                          formData.gender === 'Khác' && styles.genderOptionTextSelected
                        ]}>Khác</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.infoValue}>{formData.gender || 'Chưa cập nhật'}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Address */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemLeft}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.editInput, styles.textArea]}
                      value={formData.address}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                      placeholder="Nhập địa chỉ"
                      placeholderTextColor={COLORS.textSecondary}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{formData.address || 'Chưa cập nhật'}</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.md,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.light,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SIZES.sm,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.md,
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
    marginTop: SIZES.lg,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  infoItem: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  infoValue: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  editInput: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editInputText: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.veryLightGray,
    marginHorizontal: SIZES.sm,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    gap: SIZES.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.gray,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  cancelButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.gray,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  saveButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.white,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  genderOption: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderOptionText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  genderOptionTextSelected: {
    color: COLORS.white,
  },
});

export default PersonalInfoScreen;
