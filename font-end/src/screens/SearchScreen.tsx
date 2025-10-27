import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { RootStackParamList, Destination } from '../types';
import { destinationService, userService } from '../api';
import { SearchBar, Header } from '../components';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, userFavorites, addFavorite, removeFavorite } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Destination[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Load recent searches from AsyncStorage
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem('recent_searches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  // Chỉ clear results khi search query thực sự empty và không phải từ recent search
  useEffect(() => {
    if (searchQuery.length === 0 && !searching) {
      setSearchResults([]);
    }
  }, [searchQuery, searching]);


  const removeRecentSearch = async (searchTerm: string) => {
    const newSearches = recentSearches.filter(term => term !== searchTerm);
    setRecentSearches(newSearches);
    await saveRecentSearches(newSearches);
  };

  const clearAllRecentSearches = async () => {
    setRecentSearches([]);
    await saveRecentSearches([]);
  };

  const performSearch = async () => {
    setSearching(true);
    try {
      const results = await destinationService.searchDestinations({
        searchQuery,
      });
      
      // Debug logging
      console.log(`🔍 Search results for "${searchQuery}":`, results.length);
      console.log(`📊 Sample search results:`, results.slice(0, 3).map(d => ({ 
        name: d.name, 
        images: d.images?.length || 0, 
        imageUrl: d.imageUrl 
      })));
      
      setSearchResults(results);
      
      // Chỉ lưu tìm kiếm khi thực sự tìm kiếm (không phải khi gõ từng ký tự)
      if (searchQuery.trim() && searchQuery.trim() !== lastSearchQuery && !recentSearches.includes(searchQuery.trim())) {
        const newSearches = [searchQuery.trim(), ...recentSearches.slice(0, 9)]; // Giữ tối đa 10 tìm kiếm
        setRecentSearches(newSearches);
        await saveRecentSearches(newSearches);
        setLastSearchQuery(searchQuery.trim());
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleRecentSearch = async (query: string) => {
    setSearchQuery(query);
    // Khi click vào tìm kiếm gần đây, thực hiện tìm kiếm ngay với query được truyền vào
    setSearching(true);
    try {
      const results = await destinationService.searchDestinations({
        searchQuery: query,
      });
      setSearchResults(results);
      setLastSearchQuery(query);
    } catch (error) {
      console.error('Error performing recent search:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    // Khi người dùng nhấn Enter hoặc click tìm kiếm
    if (searchQuery.trim()) {
      performSearch();
    }
  };


  const handleFavoritePress = async (destinationId: string) => {
    try {
      const isCurrentlyFavorite = userFavorites.some(fav => fav.id === destinationId);
      if (isCurrentlyFavorite) {
        removeFavorite(destinationId);
      } else {
        // Find the destination to add
        const destination = searchResults.find(dest => dest.id === destinationId);
        if (destination) {
          addFavorite(destination);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Tìm kiếm"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Tìm kiếm điểm đến..."
          autoFocus
        />
      </View>


      <ScrollView showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 && (
          <View animation="fadeIn" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={clearAllRecentSearches}>
                  <Text style={styles.clearAllText}>Xóa tất cả</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.recentContainer}>
              {recentSearches.map((search, index) => (
                <View
                  key={index}
                  animation="fadeInRight"
                  delay={index * 50}
                >
                  <TouchableOpacity
                    style={styles.recentItem}
                    onPress={() => handleRecentSearch(search)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={COLORS.gray}
                    />
                    <Text style={styles.recentText}>{search}</Text>
                    <TouchableOpacity
                      onPress={() => removeRecentSearch(search)}
                      style={styles.removeButton}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {searchQuery.length > 0 && searchResults.length === 0 && !searching && (
          <View animation="fadeIn" style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>
              {searchQuery.length < 3
                ? 'Nhập ít nhất 3 ký tự'
                : 'Không tìm thấy kết quả'}
            </Text>
            <Text style={styles.emptyText}>
              Thử tìm kiếm với từ khóa khác
            </Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View animation="fadeIn" style={styles.section}>
            <Text style={styles.sectionTitle}>
              Kết quả ({searchResults.length})
            </Text>
            <View style={styles.resultsContainer}>
              {searchResults.map((destination, index) => (
                <View
                  key={destination.id}
                  animation="fadeInUp"
                  delay={index * 50}
                  style={styles.resultItem}
                >
                  <TouchableOpacity
                    style={styles.resultCard}
                    onPress={() => {
                      navigation.navigate('DestinationDetail', { destination });
                    }}
                    activeOpacity={0.9}
                  >
                    <Image
                      source={{ 
                        uri: destination.images?.[0] || 
                        destination.imageUrl || 
                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                      }}
                      style={styles.resultImage}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.resultGradient}
                    />
                    
                    {!isGuest && (
                      <TouchableOpacity
                        style={styles.resultFavorite}
                        onPress={() => handleFavoritePress(destination.id)}
                      >
                        <Ionicons
                          name={
                          userFavorites.some(fav => fav.id === destination.id)
                            ? 'heart'
                            : 'heart-outline'
                        }
                        size={20}
                        color={
                          userFavorites.some(fav => fav.id === destination.id)
                            ? '#FF0000'
                            : COLORS.white
                        }
                        />
                      </TouchableOpacity>
                    )}

                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName} numberOfLines={1}>
                        {destination.name}
                      </Text>
                      <View style={styles.resultBottom}>
                        <View style={styles.ratingContainer}>
                          <Ionicons
                            name="star"
                            size={12}
                            color="#FFD700"
                          />
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    paddingHorizontal: SIZES.md,
    marginVertical: SIZES.md,
  },
  section: {
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.text,
  },
  clearAllText: {
    ...FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.error,
  },
  recentContainer: {
    gap: SIZES.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.veryLightGray,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    gap: SIZES.sm,
  },
  recentText: {
    flex: 1,
    ...FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  removeButton: {
    padding: 4,
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  resultItem: {
    width: '50%',
    padding: 4,
  },
  resultCard: {
    height: 220,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  resultFavorite: {
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
  resultInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.sm,
  },
  resultName: {
    ...FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.white,
    marginBottom: 4,
  },
  resultBottom: {
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
    marginTop: SIZES.xxl,
  },
  emptyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h4,
    color: COLORS.text,
    marginTop: SIZES.md,
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: SIZES.sm,
  },
});

export default SearchScreen;


