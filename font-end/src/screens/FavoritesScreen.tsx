import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { RootStackParamList, Destination } from '../types';
import { destinationService, userService } from '../api';
import { useAuth } from '../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest, userFavorites, removeFavorite, setPendingScreenAccess } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setPendingScreenAccess('Favorites');
      navigation.navigate('Login');
      return;
    }
  }, [isGuest]);

  const onRefresh = () => {
    setRefreshing(true);
    // No need to load favorites as they come from AuthContext
    setRefreshing(false);
  };

  const handleFavoritePress = async (destinationId: string) => {
    try {
      await userService.toggleFavorite(destinationId);
      removeFavorite(destinationId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
        <Text style={styles.subtitle}>{userFavorites.length} điểm đến</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {userFavorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Chưa có yêu thích</Text>
            <Text style={styles.emptyText}>
              Thêm các điểm đến yêu thích của bạn để dễ dàng tìm thấy sau này
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {userFavorites.map((destination, index) => (
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
                    source={{ uri: destination.imageUrl }}
                    style={styles.image}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                  />

                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleFavoritePress(destination.id)}
                  >
                    <Ionicons name="heart" size={20} color="#FF0000" />
                  </TouchableOpacity>

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {destination.name}
                    </Text>
                    <View style={styles.cardBottom}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={COLORS.rating} />
                        <Text style={styles.ratingText}>
                          {destination.rating}
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
    paddingVertical: SIZES.md,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.md - 4,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  card: {
    height: 220,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
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
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    textAlign: 'center',
    paddingHorizontal: SIZES.xl,
  },
});

export default FavoritesScreen;


