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

const PaymentMethodsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    debitCard: false,
    paypal: true,
    applePay: false,
    googlePay: false,
    bankTransfer: false,
  });

  const handleToggle = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const paymentOptions = [
    {
      id: 'creditCard',
      title: 'Thẻ tín dụng',
      subtitle: 'Visa, Mastercard, American Express',
      icon: 'card-outline',
    },
    {
      id: 'debitCard',
      title: 'Thẻ ghi nợ',
      subtitle: 'Thẻ ATM, thẻ ghi nợ',
      icon: 'card-outline',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      subtitle: 'Thanh toán qua PayPal',
      icon: 'logo-paypal',
    },
    {
      id: 'applePay',
      title: 'Apple Pay',
      subtitle: 'Thanh toán qua Apple Pay',
      icon: 'logo-apple',
    },
    {
      id: 'googlePay',
      title: 'Google Pay',
      subtitle: 'Thanh toán qua Google Pay',
      icon: 'logo-google',
    },
    {
      id: 'bankTransfer',
      title: 'Chuyển khoản ngân hàng',
      subtitle: 'Chuyển khoản trực tiếp',
      icon: 'business-outline',
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
          <Text style={styles.title}>Phương thức thanh toán</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          
          <View style={styles.paymentCard}>
            {paymentOptions.map((item, index) => (
              <View key={item.id}>
                <View style={styles.paymentItem}>
                  <View style={styles.paymentItemLeft}>
                    <View style={styles.paymentIcon}>
                      <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentTitle}>{item.title}</Text>
                      <Text style={styles.paymentSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <Switch
                    value={paymentMethods[item.id as keyof typeof paymentMethods]}
                    onValueChange={() => handleToggle(item.id as keyof typeof paymentMethods)}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={paymentMethods[item.id as keyof typeof paymentMethods] ? COLORS.primary : COLORS.gray}
                  />
                </View>
                {index < paymentOptions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo mật</Text>
          
          <View style={styles.securityCard}>
            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <View style={styles.securityIcon}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>Bảo mật cao</Text>
                  <Text style={styles.securityDescription}>
                    Tất cả giao dịch được mã hóa và bảo vệ bởi công nghệ bảo mật tiên tiến
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <View style={styles.securityIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>Mã hóa SSL 256-bit</Text>
                  <Text style={styles.securityDescription}>
                    Thông tin được bảo vệ bằng mã hóa tiên tiến
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <View style={styles.securityIcon}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.securityInfo}>
                  <Text style={styles.securityTitle}>PCI DSS Compliant</Text>
                  <Text style={styles.securityDescription}>
                    Tuân thủ các tiêu chuẩn bảo mật quốc tế
                  </Text>
                </View>
              </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
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
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  paymentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 2,
  },
  paymentSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.veryLightGray,
    marginHorizontal: SIZES.sm,
  },
  securityCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.sm,
    ...SHADOWS.light,
  },
  securityItem: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.sm,
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginBottom: 2,
  },
  securityDescription: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
});

export default PaymentMethodsScreen;