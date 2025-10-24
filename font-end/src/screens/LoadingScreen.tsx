import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/home.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />

      <View
        style={styles.content}
      >
        <Image
          source={require('../img/home2.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Travelling App</Text>
        <Text style={styles.subtitle}>Khám phá thế giới cùng chúng tôi</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SIZES.xl,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default LoadingScreen;
