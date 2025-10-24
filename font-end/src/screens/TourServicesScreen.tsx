import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList, Destination } from '../types';
import { Header, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';

type RouteProps = RouteProp<RootStackParamList, 'TourServices'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TourService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  included: string[];
  optional: string[];
}

const TourServicesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { destination } = route.params;
  const { isGuest } = useAuth();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(destination.price);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [participants, setParticipants] = useState<number>(1);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(new Date());
  const [selectedReturnDate, setSelectedReturnDate] = useState(new Date());

  const tourServices: TourService[] = [
    {
      id: '1',
      name: 'Gói Cơ Bản',
      description: 'Dịch vụ cơ bản cho chuyến đi',
      price: 0,
      duration: 'Bao gồm',
      icon: 'checkmark-circle',
      included: [
        'Khách sạn 3 sao',
        'Bữa sáng',
        'Hướng dẫn viên',
        'Xe đưa đón sân bay',
      ],
      optional: [],
    },
    {
      id: '2',
      name: 'Gói Nâng Cao',
      description: 'Dịch vụ cao cấp với nhiều tiện ích',
      price: 200,
      duration: '',
      icon: 'star',
      included: [
        'Khách sạn 4 sao',
        'Bữa sáng + tối',
        'Hướng dẫn viên chuyên nghiệp',
        'Xe đưa đón VIP',
        'Bảo hiểm du lịch',
      ],
      optional: [],
    },
    {
      id: '3',
      name: 'Gói Luxury',
      description: 'Trải nghiệm cao cấp nhất',
      price: 500,
      duration: '',
      icon: 'diamond',
      included: [
        'Khách sạn 5 sao',
        'Tất cả bữa ăn',
        'Hướng dẫn viên riêng',
        'Xe limousine',
        'Bảo hiểm cao cấp',
        'Spa & massage',
      ],
      optional: [],
    },
    {
      id: '4',
      name: 'Chụp ảnh kỷ niệm',
      description: 'Dịch vụ chụp ảnh chuyên nghiệp',
      price: 50,
      duration: '+$50',
      icon: 'camera',
      included: [
        'Chụp ảnh chuyên nghiệp',
        'Chỉnh sửa ảnh',
        'Album kỹ thuật số',
      ],
      optional: [],
    },
  ];

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedServices, participants]);

  const calculateTotalPrice = () => {
    let total = destination.price * participants;
    selectedServices.forEach(serviceId => {
      const service = tourServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price * participants;
      }
    });
    setTotalPrice(total);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      // Nếu là gói chính (1, 2, 3), chỉ cho chọn 1 gói
      if (['1', '2', '3'].includes(serviceId)) {
        if (prev.includes(serviceId)) {
          return prev.filter(id => !['1', '2', '3'].includes(id));
        } else {
          return [...prev.filter(id => !['1', '2', '3'].includes(id)), serviceId];
        }
      } else {
        // Nếu là dịch vụ bổ sung, cho chọn nhiều
        if (prev.includes(serviceId)) {
          return prev.filter(id => id !== serviceId);
        } else {
          return [...prev, serviceId];
        }
      }
    });
  };

  const handleContinue = () => {
    if (isGuest) {
      navigation.navigate('Login');
      return;
    }
    
    // Kiểm tra đã chọn ngày khởi hành
    if (!departureDate) {
      alert('Vui lòng chọn ngày khởi hành');
      return;
    }
    
    // Kiểm tra đã chọn ngày kết thúc
    if (!returnDate) {
      alert('Vui lòng chọn ngày kết thúc');
      return;
    }
    
    // Kiểm tra đã chọn ít nhất 1 gói chính
    const hasMainPackage = selectedServices.some(id => ['1', '2', '3'].includes(id));
    if (!hasMainPackage) {
      alert('Vui lòng chọn ít nhất 1 gói dịch vụ chính');
      return;
    }
    
    navigation.navigate('Payment', { 
      destination, 
      services: selectedServices,
      departureDate,
      returnDate,
      participants,
      totalPrice
    });
  };

  // Date picker handlers
  const onDepartureDateChange = (event: any, selectedDate?: Date) => {
    setShowDeparturePicker(false);
    if (selectedDate) {
      setSelectedDepartureDate(selectedDate);
      setDepartureDate(selectedDate.toLocaleDateString('vi-VN'));
    }
  };

  const onReturnDateChange = (event: any, selectedDate?: Date) => {
    setShowReturnPicker(false);
    if (selectedDate) {
      setSelectedReturnDate(selectedDate);
      setReturnDate(selectedDate.toLocaleDateString('vi-VN'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Dịch vụ tour" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Destination Header */}
        <View style={styles.destinationHeader}>
          <Image
            source={{ uri: destination.imageUrl }}
            style={styles.destinationImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.destinationGradient}
          />
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>{destination.name}</Text>
            <View style={styles.destinationDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color={COLORS.white} />
                <Text style={styles.detailText}>{destination.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={COLORS.white} />
                <Text style={styles.detailText}>Tối đa 8 người</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date and Participants Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Thông tin đặt tour</Text>
          
          {/* Departure Date */}
          <View style={styles.selectionRow}>
            <View style={styles.selectionLabel}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.selectionLabelText}>Ngày khởi hành</Text>
            </View>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDeparturePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {departureDate || 'Chọn ngày'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          {/* Return Date */}
          <View style={styles.selectionRow}>
            <View style={styles.selectionLabel}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.selectionLabelText}>Ngày kết thúc</Text>
            </View>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                if (!departureDate) {
                  Alert.alert('Lỗi', 'Vui lòng chọn ngày khởi hành trước');
                  return;
                }
                setShowReturnPicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {returnDate || 'Chọn ngày'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          {/* Participants */}
          <View style={styles.selectionRow}>
            <View style={styles.selectionLabel}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
              <Text style={styles.selectionLabelText}>Số lượng thành viên</Text>
            </View>
            <View style={styles.participantsContainer}>
              <TouchableOpacity
                style={styles.participantButton}
                onPress={() => setParticipants(Math.max(1, participants - 1))}
              >
                <Ionicons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.participantCount}>{participants}</Text>
              <TouchableOpacity
                style={styles.participantButton}
                onPress={() => setParticipants(Math.min(8, participants + 1))}
              >
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Main Packages */}
          <View animation="fadeInUp" delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>Gói dịch vụ chính</Text>
            <Text style={styles.sectionSubtitle}>
              Chọn 1 gói dịch vụ chính (bắt buộc)
            </Text>

            {tourServices.filter(service => ['1', '2', '3'].includes(service.id)).map((service, index) => (
              <View
                key={service.id}
                animation="fadeInUp"
                delay={300 + index * 100}
              >
                <TouchableOpacity
                  style={[
                    styles.serviceCard,
                    selectedServices.includes(service.id) && styles.serviceCardSelected,
                  ]}
                  onPress={() => toggleService(service.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons
                          name={service.icon as any}
                          size={24}
                          color={selectedServices.includes(service.id) ? COLORS.primary : COLORS.gray}
                        />
                      </View>
                      <View style={styles.serviceDetails}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDescription}>{service.description}</Text>
                      </View>
                    </View>
                    <View style={styles.servicePrice}>
                      <Text style={styles.priceText}>
                        {service.price === 0 ? 'Miễn phí' : `$${service.price}`}
                      </Text>
                      {service.price > 0 && service.duration && (
                        <Text style={styles.durationText}>{service.duration}</Text>
                      )}
                    </View>
                  </View>

                  {service.included.length > 0 && (
                    <View style={styles.includedSection}>
                      <Text style={styles.includedTitle}>Bao gồm:</Text>
                      {service.included.map((item, idx) => (
                        <View key={idx} style={styles.includedItem}>
                          <Ionicons name="checkmark" size={16} color={COLORS.success} />
                          <Text style={styles.includedText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {service.optional.length > 0 && (
                    <View style={styles.optionalSection}>
                      <Text style={styles.optionalTitle}>Tùy chọn:</Text>
                      {service.optional.map((item, idx) => (
                        <View key={idx} style={styles.optionalItem}>
                          <Ionicons name="ellipse-outline" size={16} color={COLORS.gray} />
                          <Text style={styles.optionalText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add-on Services */}
          <View animation="fadeInUp" delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>Dịch vụ bổ sung</Text>
            <Text style={styles.sectionSubtitle}>
              Chọn thêm các dịch vụ bổ sung (tùy chọn)
            </Text>

            {tourServices.filter(service => !['1', '2', '3'].includes(service.id)).map((service, index) => (
              <View
                key={service.id}
                animation="fadeInUp"
                delay={500 + index * 100}
              >
                <TouchableOpacity
                  style={[
                    styles.serviceCard,
                    selectedServices.includes(service.id) && styles.serviceCardSelected,
                  ]}
                  onPress={() => toggleService(service.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons
                          name={service.icon as any}
                          size={24}
                          color={selectedServices.includes(service.id) ? COLORS.primary : COLORS.gray}
                        />
                      </View>
                      <View style={styles.serviceDetails}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDescription}>{service.description}</Text>
                      </View>
                    </View>
                    <View style={styles.servicePrice}>
                      {service.price === 0 ? (
                        <Text style={styles.freeText}>Miễn phí</Text>
                      ) : (
                        <Text style={styles.priceText}>${service.price}</Text>
                      )}
                    </View>
                  </View>

                  {service.included.length > 0 && (
                    <View style={styles.includedSection}>
                      <Text style={styles.includedTitle}>Bao gồm:</Text>
                      {service.included.map((item, idx) => (
                        <View key={idx} style={styles.includedItem}>
                          <Ionicons name="checkmark" size={16} color={COLORS.success} />
                          <Text style={styles.includedText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.serviceCheckbox}>
                    <View style={[
                      styles.checkbox,
                      selectedServices.includes(service.id) && styles.checkboxSelected,
                    ]}>
                      {selectedServices.includes(service.id) && (
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View animation="fadeInUp" delay={700} style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Giá tour cơ bản</Text>
              <Text style={styles.summaryValue}>${destination.price}</Text>
            </View>

            {selectedServices.map(serviceId => {
              const service = tourServices.find(s => s.id === serviceId);
              return service ? (
                <View key={serviceId} style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{service.name}</Text>
                  <Text style={styles.summaryValue}>
                    {service.price === 0 ? 'Miễn phí' : `+$${service.price}`}
                  </Text>
                </View>
              ) : null;
            })}

            <View style={styles.summaryDivider} />

            <View style={styles.summaryTotal}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>${totalPrice}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View animation="fadeInUp" style={styles.bottomAction}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tổng cộng</Text>
          <Text style={styles.priceValue}>${totalPrice}</Text>
        </View>
        <Button
          title="Tiếp tục"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>

      {/* Date Pickers */}
      {showDeparturePicker && (
        <DateTimePicker
          value={selectedDepartureDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDepartureDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showReturnPicker && (
        <DateTimePicker
          value={selectedReturnDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onReturnDateChange}
          minimumDate={departureDate ? new Date(departureDate.split('/').reverse().join('-')) : new Date()}
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
  destinationHeader: {
    height: 200,
    position: 'relative',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  destinationInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.md,
  },
  destinationName: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  destinationDetails: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
  content: {
    padding: SIZES.md,
  },
  selectionSection: {
    backgroundColor: COLORS.white,
    margin: SIZES.md,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.light,
  },
  selectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  selectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  selectionLabelText: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.veryLightGray,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dateButtonText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  participantButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantCount: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  sectionSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.light,
  },
  serviceCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.veryLightGray,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.veryLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceDescription: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  servicePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.primary,
  },
  freeText: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.success,
  },
  durationText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  includedSection: {
    marginTop: SIZES.sm,
  },
  includedTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginBottom: 4,
  },
  includedText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  optionalSection: {
    marginTop: SIZES.sm,
  },
  optionalTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  optionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginBottom: 4,
  },
  optionalText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    ...SHADOWS.light,
  },
  summaryTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  summaryLabel: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.sm,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
  },
  totalValue: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.primary,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    ...SHADOWS.heavy,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
  priceValue: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.primary,
  },
  continueButton: {
    flex: 1,
    marginLeft: SIZES.md,
  },
});

export default TourServicesScreen;
