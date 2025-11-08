import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { RootStackParamList, Destination, DestinationCategory, SearchFilters } from '../types';
import { destinationService, userService } from '../api';
import { SearchBar, Loading, FilterModal } from '../components';
import { FilterOptions } from '../components/FilterModal';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, userFavorites, addFavorite, removeFavorite } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 7000000 },
    countries: [],
    ratingRange: { min: 0, max: 5 },
    category: null,
  });


  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    // Reload data khi trạng thái đăng nhập thay đổi
    loadData();
  }, [isGuest]);

  useEffect(() => {
    if (destinations.length > 0) {
      applyAdvancedFilters(currentFilters);
    }
  }, [searchQuery]);

  // Apply filters when destinations are loaded
  useEffect(() => {
    if (destinations.length > 0) {
      console.log(`📊 Destinations loaded, applying filters...`);
      applyAdvancedFilters(currentFilters);
    }
  }, [destinations]);

  const loadData = async () => {
    try {
      const allDestinations = await destinationService.getAllDestinations();
      // Hiển thị 10 destinations đầu tiên
      const firstTen = allDestinations?.slice(0, 10) || [];
      
      // Debug logging
      console.log(`📊 ExploreScreen - Loaded ${allDestinations?.length || 0} destinations`);
      console.log(`📊 ExploreScreen - Sample destinations:`, firstTen.slice(0, 3).map(d => ({
        name: d.name,
        category: d.category,
        images: d.images?.length || 0,
        imageUrl: d.imageUrl
      })));
      
      // Debug: Show all unique categories
      const allCategories = [...new Set(allDestinations?.map(dest => dest.category) || [])];
      console.log(`📊 ExploreScreen - All categories in data:`, allCategories);
      
      // Debug: Show sample destinations with categories
      console.log(`📊 ExploreScreen - Sample destinations with categories:`, 
        allDestinations?.slice(0, 5).map(d => ({ 
          name: d.name, 
          category: d.category,
          categoryType: typeof d.category
        }))
      );
      
      setDestinations(allDestinations);
      setFilteredDestinations(firstTen);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };


  const applyAdvancedFilters = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    
    // Sử dụng filters.category từ FilterModal
    const effectiveCategory = filters.category;
    
    console.log(`🔍 ApplyAdvancedFilters called with:`, {
      searchQuery,
      filtersCategory: filters.category,
      effectiveCategory,
      filters: filters
    });
    console.log(`📊 Total destinations: ${destinations.length}`);
    
    let filtered = [...destinations];

    // Nếu không có filter nào, hiển thị 10 đầu tiên
    if (!searchQuery && !effectiveCategory && 
        filters.countries.length === 0 && 
        (filters.ratingRange.min === 0 && filters.ratingRange.max === 5) && 
        filters.priceRange.min === 0 && filters.priceRange.max === 9999) {
      console.log(`📊 No filters active, showing first 10 destinations`);
      setFilteredDestinations(destinations.slice(0, 10));
      return;
    }

    // Debug: Log initial filtered count
    console.log(`📊 Initial filtered count: ${filtered.length}`);

    // Search query
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (effectiveCategory) {
      console.log(`🔍 Filtering by category: ${effectiveCategory}`);
      console.log(`📊 Before category filter: ${filtered.length} destinations`);
      
      // Debug: Show all unique categories in data
      const uniqueCategories = [...new Set(filtered.map(dest => dest.category))];
      console.log(`📊 Available categories in data:`, uniqueCategories);
      
      // Try multiple matching strategies
      filtered = filtered.filter(dest => {
        const destCategory = dest.category?.toLowerCase() || '';
        const selectedCategoryLower = effectiveCategory.toLowerCase();
        
        // Exact match
        const exactMatch = dest.category === effectiveCategory;
        // Case-insensitive match
        const caseInsensitiveMatch = destCategory === selectedCategoryLower;
        // Partial match (contains)
        const partialMatch = destCategory.includes(selectedCategoryLower) || selectedCategoryLower.includes(destCategory);
        
        const isMatch = exactMatch || caseInsensitiveMatch || partialMatch;
        
        console.log(`🔍 Checking destination: ${dest.name}, category: "${dest.category}", selected: "${effectiveCategory}", match: ${isMatch}`);
        
        return isMatch;
      });
      
      console.log(`📊 After category filter: ${filtered.length} destinations`);
      console.log(`📊 Filtered destinations:`, filtered.slice(0, 3).map(d => ({ 
        name: d.name, 
        category: d.category, 
        price: d.price,
        images: d.images?.length || 0 
      })));
    }

    // Advanced filters - chỉ áp dụng khi có filter thực sự
    console.log(`📊 Before advanced filters: ${filtered.length} destinations`);
    
    // Price filter - chỉ áp dụng khi không phải default range
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 9999) {
      console.log(`📊 Applying price filter: ${filters.priceRange.min} - ${filters.priceRange.max}`);
      filtered = filtered.filter(dest => 
        dest.price >= filters.priceRange.min && dest.price <= filters.priceRange.max
      );
      console.log(`📊 After price filter: ${filtered.length} destinations`);
    } else {
      console.log(`📊 Skipping price filter (default range)`);
    }

    if (filters.countries.length > 0) {
      console.log(`📊 Before countries filter: ${filtered.length} destinations`);
      filtered = filtered.filter(dest => filters.countries.includes(dest.country));
      console.log(`📊 After countries filter: ${filtered.length} destinations`);
    }

    if (filters.ratingRange.min > 0 || filters.ratingRange.max < 5) {
      console.log(`📊 Before rating filter: ${filtered.length} destinations`);
      filtered = filtered.filter(dest => 
        dest.rating >= filters.ratingRange.min && dest.rating <= filters.ratingRange.max
      );
      console.log(`📊 After rating filter: ${filtered.length} destinations`);
    }


    console.log(`📊 Final filtered results: ${filtered.length} destinations`);
    console.log(`📊 Final destinations:`, filtered.slice(0, 3).map(d => ({ 
      name: d.name, 
      category: d.category, 
      images: d.images?.length || 0,
      imageUrl: d.imageUrl 
    })));
    
    // Set filtered results
    console.log(`📊 Final filtered count: ${filtered.length}`);
    setFilteredDestinations(filtered);
  };


  const clearAllFilters = () => {
    setSearchQuery('');
    setCurrentFilters({
      priceRange: { min: 0, max: 9999 },
      countries: [],
      ratingRange: { min: 0, max: 5 },
      category: null,
    });
    setFilteredDestinations(destinations.slice(0, 10));
  };


  const handleNotificationPress = () => {
    Alert.alert(
      'Thông báo',
      'Bạn có 2 thông báo mới:\n• Điểm đến mới: "Núi Fansipan"\n• Khuyến mãi tour mùa hè!',
      [
        { text: 'Đóng', style: 'cancel' },
        { text: 'Xem chi tiết', onPress: () => {
          console.log('Navigate to notifications');
        }}
      ]
    );
  };

  const handleFavoritePress = async (destinationId: string) => {
    if (isGuest) {
      navigation.navigate('Login');
      return;
    }

    try {
      const isCurrentlyFavorite = userFavorites.some(fav => fav.id === destinationId);
      if (isCurrentlyFavorite) {
        removeFavorite(destinationId);
      } else {
        // Find the destination to add
        const destination = destinations.find(dest => dest.id === destinationId);
        if (destination) {
          addFavorite(destination);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Bỏ loading spinner, hiển thị nội dung ngay lập tức

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Khám phá</Text>
      </View>

      {/* 1. Thanh tìm kiếm + filter */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm điểm đến..."
          onFilterPress={() => setShowFilterModal(true)}
        />
      </View>


      {/* 3. Kết quả tìm kiếm + Các địa điểm */}
      <View style={styles.resultsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery || currentFilters.category 
              ? `Kết quả tìm kiếm (${filteredDestinations.length})` 
              : 'Các địa điểm'
            }
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredDestinations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={COLORS.black} />
              <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
              <Text style={styles.emptyText}>
                Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredDestinations.map((destination, index) => (
              <View
                key={destination.id}
                style={styles.gridItem}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('DestinationDetail', { destination })
                  }
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ 
                      uri: destination.images?.[0] || 
                      destination.imageUrl || 
                      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                    }}
                    style={styles.image}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                  />
                  
                  {!isGuest && (
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleFavoritePress(destination.id)}
                    >
                      <Ionicons
                        name={userFavorites.some(fav => fav.id === destination.id) ? 'heart' : 'heart-outline'}
                        size={20}
                        color={userFavorites.some(fav => fav.id === destination.id) ? '#FF0000' : COLORS.white}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {destination.name}
                    </Text>
                    <View style={styles.cardBottom}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={COLORS.rating} />
                        <Text style={styles.ratingText}>
                          {destination.rating || 0}
                        </Text>
                      </View>
                      <Text style={styles.price}>${destination.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={applyAdvancedFilters}
        currentFilters={currentFilters}
      />
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
    paddingVertical: SIZES.sm,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchSection: {
    paddingHorizontal: SIZES.md,
    marginVertical: SIZES.md,
  },
  categoriesSection: {
    marginBottom: SIZES.lg,
    backgroundColor: COLORS.white,
  },
  resultsSection: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionHeader: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.gray,
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  gridItem: {
    width: '48%',
    marginBottom: SIZES.lg,
    marginHorizontal: '1%',
  },
  card: {
    height: 240,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.sm,
  },
  cardName: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.white,
    marginBottom: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.white,
  },
  price: {
    ...FONTS.bold,
    fontSize: SIZES.body2,
    color: COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.lg,
  },
  emptyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.text,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SIZES.sm,
    paddingHorizontal: SIZES.xl,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
    marginTop: SIZES.sm,
    alignSelf: 'center',
  },
  clearFiltersText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.primary,
    marginLeft: SIZES.xs,
  },
});

export default ExploreScreen;


