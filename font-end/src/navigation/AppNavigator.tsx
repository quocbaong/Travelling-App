import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { RootStackParamList, MainTabParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookingsScreen from '../screens/BookingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DestinationDetailScreen from '../screens/DestinationDetailScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import SearchScreen from '../screens/SearchScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import TourServicesScreen from '../screens/TourServicesScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SupportScreen from '../screens/SupportScreen';
import DarkModeScreen from '../screens/DarkModeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TourReviewScreen from '../screens/TourReviewScreen';

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator<any>();

const MainTabs = () => {
  const { isGuest } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)',
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: COLORS.primary,
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          display: 'none', // Ẩn tên tab
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{ 
          tabBarLabel: '',
          tabBarBadge: isGuest ? '!' : undefined,
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{ 
          tabBarLabel: '',
          tabBarBadge: isGuest ? '!' : undefined,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: '',
          tabBarBadge: isGuest ? '!' : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        initialRouteName="Loading"
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="DestinationDetail" 
          component={DestinationDetailScreen}
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="BookingDetail" 
          component={BookingDetailScreen}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            animation: 'none',
          }}
        />
        <Stack.Screen 
          name="Reviews" 
          component={ReviewsScreen}
        />
        <Stack.Screen 
          name="TourServices" 
          component={TourServicesScreen}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
        />
        <Stack.Screen 
          name="PaymentSuccess" 
          component={PaymentSuccessScreen}
        />
        <Stack.Screen 
          name="PersonalInfo" 
          component={PersonalInfoScreen}
        />
        <Stack.Screen 
          name="PaymentMethods" 
          component={PaymentMethodsScreen}
        />
        <Stack.Screen 
          name="Security" 
          component={SecurityScreen}
        />
        <Stack.Screen 
          name="Support" 
          component={SupportScreen}
        />
        <Stack.Screen 
          name="DarkMode" 
          component={DarkModeScreen}
        />
        <Stack.Screen 
          name="Language" 
          component={LanguageScreen}
        />
        <Stack.Screen 
          name="TermsOfService" 
          component={TermsOfServiceScreen}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
        />
        <Stack.Screen 
          name="AboutUs" 
          component={AboutUsScreen}
        />
        <Stack.Screen 
          name="TourReview" 
          component={TourReviewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


