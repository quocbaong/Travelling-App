import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, Destination, Review } from '../types';
import { authService, userService, bookingService, reviewService } from '../api';
import { biometricService } from '../services/biometricService';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  clearAsyncStorage: () => void;
  requireAuth: () => boolean;
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
  addFavorite: (destination: Destination) => void;
  removeFavorite: (destinationId: string) => void;
  userBookings: Booking[];
  userFavorites: Destination[];
  pendingTourBooking: Destination | null;
  setPendingTour: (destination: Destination) => void;
  clearPendingTour: () => void;
  pendingScreen: string | null;
  setPendingScreenAccess: (screenName: string) => void;
  clearPendingScreen: () => void;
  updateUserAvatar: (avatarUrl: string) => void;
  updateUserInfo: (updatedInfo: Partial<User>) => void;
  refreshUserData: () => void;
  userReviews: Review[];
  addReview: (review: Review) => void;
  biometricLogin: () => Promise<boolean>;
  isBiometricAvailable: boolean;
  biometricType: string;
}

const prefersContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(prefersContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userFavorites, setUserFavorites] = useState<Destination[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [pendingTourBooking, setPendingTourBooking] = useState<Destination | null>(null);
  const [pendingScreen, setPendingScreen] = useState<string | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');

  useEffect(() => {
    checkAuthStatus();
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await biometricService.isAvailable();
      setIsBiometricAvailable(available);

      if (available) {
        const supportedTypes = await biometricService.getSupportedTypes();
        if (supportedTypes.length > 0) {
          // Get primary biometric type with priority
          const primaryType = biometricService.getPrimaryBiometricType(supportedTypes);
          setBiometricType(primaryType);
          
          // Log all supported types for debugging
          const allTypes = biometricService.getSupportedBiometricTypes(supportedTypes);
          console.log('🔍 Supported biometric types:', allTypes);
          console.log('🔍 Primary biometric type:', primaryType);
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      // Check if user is logged in
      if (await authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          console.log('🔄 Current user from local:', currentUser);
          console.log('🔄 User ID:', currentUser.id);
          console.log('🔄 Fetching fresh user data from server...');
          // Always fetch fresh user data from server to get latest avatar
          const freshUserData = await userService.getCurrentUser(currentUser.id);
          console.log('✅ Fresh user data from server:', freshUserData);
          console.log('✅ Avatar comparison - Local:', currentUser.avatar, 'Server:', freshUserData.avatar);
          setUser(freshUserData);
          // Load user data
          await loadUserData(freshUserData.id);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // User not logged in, continue as guest
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load bookings, favorites, and reviews
      const [bookings, favorites, reviews] = await Promise.all([
        bookingService.getUserBookings(userId).catch(() => []),
        userService.getFavorites(userId).catch(() => []),
        reviewService.getUserReviews(userId).catch(() => [])
      ]);

      setUserBookings(bookings);
      setUserReviews(reviews);
      
      // Note: userFavorites will be loaded when needed since it requires destination data
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      await loadUserData(response.user.id);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register({
        email: userData.email || '',
        password: 'defaultPassword123', // TODO: Get from registration form
        fullName: userData.name || '',
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address
      });
      
      setUser(response.user);
      await loadUserData(response.user.id);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserBookings([]);
    setUserFavorites([]);
    setUserReviews([]);
  };

  const clearAsyncStorage = async () => {
    await authService.clearAsyncStorage();
    setUser(null);
    setUserBookings([]);
    setUserFavorites([]);
    setUserReviews([]);
  };

  const requireAuth = (): boolean => {
    if (!user) {
      return false; // Need to show login screen
    }
    return true; // User is authenticated
  };

  const addBooking = async (booking: Booking) => {
    setUserBookings(prev => [...prev, booking]);
    
    // Also update backend if user is logged in
    if (user) {
      try {
        await bookingService.createBooking(
          booking.destination,
          user.id,
          booking.startDate,
          booking.endDate,
          booking.guests,
          booking.specialRequests
        );
      } catch (error) {
        console.error('Failed to sync booking to backend:', error);
      }
    }
  };

  const removeBooking = (bookingId: string) => {
    setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
    
    // Also update backend if user is logged in
    if (user) {
      bookingService.cancelBooking(bookingId).catch(error => {
        console.error('Failed to cancel booking on backend:', error);
      });
    }
  };

  const addFavorite = async (destination: Destination) => {
    // Update UI immediately
    setUserFavorites(prev => {
      const exists = prev.some(fav => fav.id === destination.id);
      if (!exists) {
        return [...prev, destination];
      }
      return prev;
    });
    
    // Update backend if user is logged in
    if (user) {
      try {
        await userService.addToFavorites(user.id, destination.id);
      } catch (error) {
        console.error('Failed to add favorite to backend:', error);
      }
    }
  };

  const removeFavorite = async (destinationId: string) => {
    // Update UI immediately
    setUserFavorites(prev => prev.filter(fav => fav.id !== destinationId));
    
    // Update backend if user is logged in
    if (user) {
      try {
        await userService.removeFromFavorites(user.id, destinationId);
      } catch (error) {
        console.error('Failed to remove favorite from backend:', error);
      }
    }
  };

  const setPendingTour = (destination: Destination) => {
    setPendingTourBooking(destination);
  };

  const clearPendingTour = () => {
    setPendingTourBooking(null);
  };

  const setPendingScreenAccess = (screenName: string) => {
    setPendingScreen(screenName);
  };

  const clearPendingScreen = () => {
    setPendingScreen(null);
  };

  const addReview = async (review: Review) => {
    setUserReviews(prev => [...prev, review]);
    
    // Also update backend if user is logged in
    if (user) {
      try {
        await reviewService.createReview({
          destinationId: review.destinationId,
          rating: review.rating,
          comment: review.comment,
          images: review.images
        });
        
        // Trigger data refresh to update ratings
        loadUserData();
      } catch (error) {
        console.error('Failed to sync review to backend:', error);
      }
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (user) {
      let finalAvatarUrl = avatarUrl;
      
      // If it's a local file path, convert to base64
      if (avatarUrl.startsWith('file://')) {
        try {
          console.log('🔄 Converting local file to base64...');
          const response = await fetch(avatarUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          finalAvatarUrl = base64;
          console.log('✅ Converted to base64, length:', base64.length);
        } catch (error) {
          console.error('Failed to convert file to base64:', error);
          return;
        }
      }
      
      setUser(prev => prev ? { ...prev, avatar: finalAvatarUrl } : null);
      
      // Update backend
      try {
        await userService.updateUser(user.id, { avatar: finalAvatarUrl });
        console.log('✅ Avatar updated on backend:', finalAvatarUrl.substring(0, 50) + '...');
      } catch (error) {
        console.error('Failed to update avatar on backend:', error);
      }
    }
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        console.log('🔄 Force refreshing user data...');
        const freshUserData = await userService.getCurrentUser(user.id);
        console.log('✅ Refreshed user data:', freshUserData);
        setUser(freshUserData);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const biometricLogin = async (): Promise<boolean> => {
    try {
      const result = await biometricService.authenticate(
        `Đăng nhập bằng ${biometricType}`
      );

      if (result.success) {
        // Get saved credentials
        const credentials = await biometricService.getBiometricCredentials();
        if (credentials) {
          // Auto login with saved credentials
          const loginResult = await authService.login(credentials.email, '');
          if (loginResult) {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              await loadUserData(currentUser.id);
              return true;
            }
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric login error:', error);
      return false;
    }
  };

  const updateUserInfo = async (updatedInfo: Partial<User>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updatedInfo } : null);
      
      // Update backend
      try {
        await userService.updateUser(user.id, updatedInfo);
      } catch (error) {
        console.error('Failed to update user info on backend:', error);
      }
    }
  };

  const isGuest = !user;

  const value: AuthContextType = {
    user,
    isGuest,
    isLoading,
    login,
    register,
    logout,
    clearAsyncStorage,
    requireAuth,
    addBooking,
    removeBooking,
    addFavorite,
    removeFavorite,
    userBookings,
    userFavorites,
    pendingTourBooking,
    setPendingTour,
    clearPendingTour,
    pendingScreen,
    setPendingScreenAccess,
    clearPendingScreen,
    updateUserAvatar,
    updateUserInfo,
    refreshUserData,
    userReviews,
    addReview,
    biometricLogin,
    isBiometricAvailable,
    biometricType,
  };

  return (
    <prefersContext.Provider value={value}>
      {children}
    </prefersContext.Provider>
  );
};
