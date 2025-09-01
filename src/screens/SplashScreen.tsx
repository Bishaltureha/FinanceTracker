import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/svg/Logo';
import {height, width} from '../utils/responsive';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Logo width={200} height={200} />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#59a69f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width(200),
    height: height(200),
  },
});
