'use strict';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { SubmitButton } from '../../components';
import styles from './styles';
import { getProfile, saveProfile } from '../Utils/Utils';

const SplashScreen = () => {
  const { navigate } = useNavigation(),
    [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      let profile = await getProfile();
      if (typeof profile !== 'undefined') {
        return navigate('Navigations');
      } else {
        return setRestoring(false);
      }
    };
    checkLogin();
  }, []);

  const handleGetStarted = () => {
    navigate('BoardingScreen');
  };
  return restoring === true ? (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.splasBg}
        source={require('../../assets/images/Login-Register-vector.png')}
      />
    </View>
  ) : (
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode='cover'
        blurRadius={0.3}
        source={require('../../assets/images/Login-Register-vector.png')}
      >
        <View style={styles.newView}>
          {/* <Image
          style={styles.logo}
          source={require('../../assets/images/twitter.png')}
        /> */}
          <SubmitButton
            title={'Get Started'}
            onPress={handleGetStarted}
            btnStyle={styles.buttonWithImage}
            titleStyle={StyleSheet.flatten(styles.buttonTxt)}
          // imgSrc={require('../../assets/images/loginIcon.png')}
          // imgStyle={StyleSheet.flatten(styles.iconDoor)}
          />
        </View>
      </ImageBackground>
    );
};

export default SplashScreen;
