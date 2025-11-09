import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
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
        await removeFavorite(destinationId);
      } else {
        // Find the destination to add
        const destination = destinations.find(dest => dest.id === destinationId);
        if (destination) {
          // Double check to avoid duplicate
          const alreadyExists = userFavorites.some(fav => fav.id === destinationId);
          if (!alreadyExists) {
            await addFavorite(destination);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Silently handle the error - the UI will update when state syncs
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // Hiển thị nửa sao nếu rating từ 4.4 đến 4.8
    const hasHalfStar = rating >= 4.4 && rating < 4.9 && rating % 1 >= 0.4;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color={COLORS.rating} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color={COLORS.rating} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color={COLORS.rating} />
        );
      }
    }
    return stars;
  };

  // Bỏ loading spinner, hiển thị nội dung ngay lập tức

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Khám phá</Text>
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          style={styles.filterButton}
        >
          <Ionicons name="options-outline" size={24} color="#0077B6" />
        </TouchableOpacity>
      </View>

      {/* Search Input Area */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search destination..."
            placeholderTextColor={COLORS.text}
          />
          <Ionicons name="search" size={20} color={COLORS.text} />
        </View>
      </View>

      {/* Results Summary */}
      {searchQuery && (
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsSummaryText}>
            We found {filteredDestinations.length} trip in '{searchQuery}'
          </Text>
        </View>
      )}

      {/* Results List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredDestinations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.text} />
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptyText}>
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.listCard}
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
                  style={styles.listImage}
                />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardTitle} numberOfLines={1}>
                    {destination.name}
                  </Text>
                  <Text style={styles.listCardPrice}>
                    ${destination.price}
                  </Text>
                  <View style={styles.listCardRating}>
                    {renderStars(destination.rating || 4.8)}
                    <Text style={styles.listCardRatingText}>
                      {destination.rating || 4.8}
                    </Text>
                  </View>
                  <Text style={styles.listCardDescription} numberOfLines={2}>
                    {destination.description || 
                     `${destination.country} is a beautiful destination known for its stunning landscapes and rich culture.`}
                  </Text>
                </View>
                {!isGuest && (
                  <TouchableOpacity
                    onPress={() => handleFavoritePress(destination.id)}
                    style={styles.favoriteIconButton}
                  >
                    <Ionicons
                      name={userFavorites.some(fav => fav.id === destination.id) ? 'heart' : 'heart-outline'}
                      size={18}
                      color={userFavorites.some(fav => fav.id === destination.id) ? '#FF0000' : COLORS.white}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.sm,
    marginBottom: SIZES.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    minHeight: 48,
  },
  searchInput: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.text,
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: 0,
    marginRight: SIZES.xs,
  },
  resultsSummary: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  resultsSummaryText: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  listContainer: {
    gap: SIZES.md,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    overflow: 'visible',
    marginBottom: SIZES.md,
    position: 'relative',
    ...SHADOWS.medium,
  },
  listImage: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radiusMd,
  },
  listCardContent: {
    flex: 1,
    padding: SIZES.md,
    paddingRight: SIZES.xl,
    justifyContent: 'space-between',
  },
  listCardTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  listCardPrice: {
    ...FONTS.bold,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginTop: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  listCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  listCardRatingText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.text,
    marginLeft: 4,
  },
  listCardDescription: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.text,
    lineHeight: 18,
  },
  favoriteIconButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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


