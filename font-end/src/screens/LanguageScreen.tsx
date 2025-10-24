import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LanguageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState('vi');

  const languages = [
    {
      id: 'vi',
      name: 'Tiếng Việt',
      nativeName: 'Tiếng Việt',
      flag: '🇻🇳',
      isSelected: selectedLanguage === 'vi',
    },
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isSelected: selectedLanguage === 'en',
    },
    {
      id: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      isSelected: selectedLanguage === 'fr',
    },
    {
      id: 'zh',
      name: '中文',
      nativeName: '中文 (简体)',
      flag: '🇨🇳',
      isSelected: selectedLanguage === 'zh',
    },
  ];

  const handleSelectLanguage = (languageId: string) => {
    setSelectedLanguage(languageId);
    // In real app, save language preference and reload app
    console.log('Selected language:', languageId);
  };

  const getLanguageInfo = (languageId: string) => {
    switch (languageId) {
      case 'vi':
        return {
          title: 'Chào mừng!',
          description: 'Ứng dụng đã được chuyển sang tiếng Việt',
        };
      case 'en':
        return {
          title: 'Welcome!',
          description: 'App has been switched to English',
        };
      case 'fr':
        return {
          title: 'Bienvenue!',
          description: "L'application a été basculée en français",
        };
      case 'zh':
        return {
          title: '欢迎！',
          description: '应用程序已切换为中文',
        };
      default:
        return {
          title: 'Welcome!',
          description: 'Language has been changed',
        };
    }
  };

  const currentLanguageInfo = getLanguageInfo(selectedLanguage);

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
          <Text style={styles.title}>Ngôn ngữ</Text>
          <View style={styles.placeholder} />
        </View>
        {/* Current Language Preview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ngôn ngữ hiện tại</Text>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>{currentLanguageInfo.title}</Text>
            <Text style={styles.previewDescription}>{currentLanguageInfo.description}</Text>
          </View>
        </View>

        {/* Language Options */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chọn ngôn ngữ</Text>
          <Text style={styles.sectionDescription}>
            Chọn ngôn ngữ bạn muốn sử dụng
          </Text>
          
          {languages.map((language, index) => (
            <View key={language.id}>
              <TouchableOpacity 
                style={[
                  styles.languageItem,
                  language.isSelected && styles.selectedLanguageItem
                ]} 
                onPress={() => handleSelectLanguage(language.id)}
              >
                <View style={styles.languageLeft}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      language.isSelected && styles.selectedLanguageName
                    ]}>
                      {language.name}
                    </Text>
                    <Text style={styles.languageNativeName}>
                      {language.nativeName}
                    </Text>
                  </View>
                </View>
                {language.isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Language Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin ngôn ngữ</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Hỗ trợ đa ngôn ngữ</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="sync-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Cập nhật real-time</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cloud-done-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Đồng bộ trên tất cả thiết bị</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {
            // In real app, save language preference and reload
            console.log('Language saved:', selectedLanguage);
            navigation.goBack();
          }}
        >
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: SIZES.xs,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  sectionDescription: {
    ...FONTS.body2,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  previewContainer: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    alignItems: 'center',
  },
  previewTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  previewDescription: {
    ...FONTS.body2,
    color: COLORS.text,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.xs / 2,
  },
  selectedLanguageItem: {
    backgroundColor: COLORS.lightPrimary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: SIZES.base,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SIZES.xs / 2,
  },
  selectedLanguageName: {
    color: COLORS.primary,
  },
  languageNativeName: {
    ...FONTS.body2,
    color: COLORS.gray,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginLeft: 56,
  },
  infoContainer: {
    marginTop: SIZES.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  infoText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SIZES.xs,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    alignItems: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  saveButtonText: {
    ...FONTS.semiBold,
    color: COLORS.white,
    fontSize: SIZES.body1,
  },
});

export default LanguageScreen;
