import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { ErrorAlert } from '../../components';
import styles from './styles';
import { useNavigation } from 'react-navigation-hooks';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { AppLoading } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { getProfile, saveExpoToken } from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';

const BoardingScreen = () => {
  const { navigate } = useNavigation();
  const [restoring, setRestoring] = useState(true),
    [showRealApp, setShowRealApp] = useState(false),
    [setExpoToken] = useState('');

  useEffect(() => {
    async function useEffect() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }

      _registerForPushNotificationsAsync();
      checkLogin();
    }
    useEffect();
  }, []);

  const checkLogin = async () => {
    let profile = await getProfile();
    if (profile !== false && profile.access_token !== false) {
      navigate('Navigations');
      return SplashScreen.hideAsync();
    } else {
      return setRestoring(false);
    }
  };

  const _registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return saveExpoToken('denied');
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    await saveExpoToken(token);
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const _renderNextButton = () => {
    return (
      <View style={styles.nextBtn}>
        <Text style={styles.nextBtnText}>{'Next'}</Text>
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <View style={styles.doneBtn}>
        <Text style={styles.nextBtnText}>{'Get Started'}</Text>
      </View>
    );
  };
  const _renderSkipButton = () => {
    return (
      <View style={styles.skipBtn}>
        <Text style={styles.skipBtnText}>{'Skip'}</Text>
      </View>
    );
  };
  const _onDone = () => {
    setShowRealApp(true);
  };
  const _onSkip = () => {
    setShowRealApp(true);
  };
  const _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: item.backgroundColor,
          alignItems: 'center',
          // justifyContent: 'space-evenly',
          // paddingBottom: 100
        }}
      >
        <Image style={styles.image} source={item.image} />
        {/* <View style={styles.textView}> */}
        <Text style={styles.sliderTitle}>{item.title}</Text>
        <Text style={styles.sliderText}>{item.text}</Text>
        {/* </View> */}
      </View>
    );
  };
  return restoring ? (
    <AppLoading
      onFinish={setRestoring(false)}
      onError={console.warn}
      autoHideSplash={false}
    />
  ) : (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <AppIntroSlider
        slides={slides}
        renderItem={_renderItem}
        onDone={_onDone}
        renderDoneButton={_renderDoneButton}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
        showSkipButton={false}
        showNextButton={false}
        onSkip={() => navigate('Login')}
        onDone={() => navigate('Login')}
        dotStyle={styles.sliderDots}
        activeDotStyle={styles.activeDotStyle}
      />
    </View>
  );
};

const slides = [
  {
    backgroundColor: '#FFFFFF',
    image: require('../../assets/images/boarding1.png'),
    key: 's1',
    title: 'Connect With Others \n& Solve Challenges',
    text:
      'Link up with other students in your \ninstitution right on your device. ',
  },
  {
    backgroundColor: '#FFFFFF',
    image: require('../../assets/images/boarding2.png'),
    key: 's2',
    title: 'Balance Your Social \n& Educational Life',
    text:
      'Keep in touch with your social life \n without compromising your education',
  },
  {
    backgroundColor: '#FFFFFF',
    image: require('../../assets/images/boarding3.png'),
    key: 's3',
    title: 'Enrich Your Lifestyle \n On The Go ',
    text: 'Be a better and smarter student \non the go',
  },
];

export default BoardingScreen;
