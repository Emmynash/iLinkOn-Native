'use strict';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';
import { useNavigation } from 'react-navigation-hooks';
import Communications from 'react-native-communications';

import {
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Switch,
  StatusBar,
} from 'react-native';
import {
  getProfileImage,
  getUserDetails,
  getProfile
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert
} from '../../components';

const Settings = () => {
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const [showAlert, setShowAlert] = useState({
    showAlert: false,
    showSuccessAlert: false,
    message: ''
  }),
    [token, setToken] = useState(''),
    [userName, setUserName] = useState(),
    [profileImage, setProfileImage] = useState('http://res.cloudinary.com/https-cyberve-com/image/upload/v1584886506/pre61jvaz0nrrmoudwxr.jpg');

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    let userDetails = await getUserDetails();
    let profile = await getProfile();
    let image = await getProfileImage();
    if (typeof userDetails !== 'undefined') {
      if (typeof profile.access_token !== 'undefined') {
        let access_token = profile.access_token;
        setToken(access_token);
        setProfileImage(image.image);
        setUserName(`${userDetails.data.fName} ${userDetails.data.lName}`)
      }
    }

  };
  const updateProfile = () => {
    return navigation.navigate('UpdateProfile')
  };
  const privacy = () => {
    return navigation.navigate('PrivacyTerms', {
      'uri': 'https://ilinkon.com/privacy-policy.html',
      'name': 'Privacy'
    })
  }
  const termAndCondition = () => {
    return navigation.navigate('PrivacyTerms', {
      'uri': 'https://ilinkon.com/terms-and-conditions.html',
      'name': 'Term and Conditions'
    })
  }

  const userSupport = () => {
    return Communications.email(['support@ilinkon.com',], null, null, 'iLinkOn', '')
  }

  const toggleDrawers = async () => {
    await navigation.toggleDrawer();
  };
  // const toggleSwitch1 = (value) => {
  //   setSwitchValue(value)
  // }
  // const toggleSwitch2 = (value) => {
  //   setSwitchValue2(value)
  // }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.searchView}>
        <TouchableOpacity style={{ padding: 8 }} onPress={toggleDrawers}>
          <Image
            onPress={toggleDrawers}
            source={require('../../assets/images/menu.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <DisplayText
          styles={StyleSheet.flatten(styles.headerText)}
          text={'Settings'}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={styles.account}>
            <DisplayText
              styles={StyleSheet.flatten(styles.accountTxt)}
              text={'ACCOUNT'}
            />
            <TouchableOpacity onPress={updateProfile} style={styles.cardView}>
              <TouchableOpacity style={styles.headerView} onPress={updateProfile}>
                <Image
                  onPress={updateProfile}
                  source={{ uri: profileImage }}
                  style={StyleSheet.flatten(styles.profileIcon)}
                />
                <DisplayText
                  onPress={updateProfile}
                  styles={StyleSheet.flatten(styles.name)}
                  text={userName}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerView} >
                <Image
                  source={require('../../assets/images/arrow_forward.png')}
                  style={StyleSheet.flatten(styles.playIcon)}
                />
              </TouchableOpacity>
            </TouchableOpacity>

          </View>

          {/* <View style={styles.pushNotification}>
            <DisplayText
              styles={StyleSheet.flatten(styles.pushTxt)}
              text={'PUSH NOTIFICATION'}
            />
            <TouchableOpacity style={styles.cardView}>
              <DisplayText
                styles={StyleSheet.flatten(styles.changePwd)}
                text={'Notification'}
              />
              <Switch
                trackColor={colors.green}
                onValueChange={toggleSwitch1}
                value={switchValue} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardView2}>
              <DisplayText
                styles={StyleSheet.flatten(styles.changePwd)}
                text={'Direct Mesaage'}
              />
              <Switch
                trackColor={colors.red}
                onValueChange={toggleSwitch2}
                value={switchValue2} />
            </TouchableOpacity>
          </View> */}

          <View style={styles.pushNotification}>
            <DisplayText
              styles={StyleSheet.flatten(styles.pushTxt)}
              text={'iLinkOn'}
            />
            <TouchableOpacity
              onPress={privacy}
              style={styles.cardView}>
              <DisplayText
                onPress={privacy}
                styles={StyleSheet.flatten(styles.changePwd)}
                text={'Privacy'}
              />
              <TouchableOpacity
                onPress={privacy}
                style={styles.headerView} >
                <Image
                  source={require('../../assets/images/arrow_forward.png')}
                  style={StyleSheet.flatten(styles.playIcon)}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={termAndCondition}
              style={styles.cardView2}>
              <DisplayText
                onPress={termAndCondition}
                styles={StyleSheet.flatten(styles.changePwd)}
                text={'Terms & Conditions'}
              />
              <TouchableOpacity
                onPress={termAndCondition}
                style={styles.headerView} >
                <Image
                  onPress={termAndCondition}
                  source={require('../../assets/images/arrow_forward.png')}
                  style={StyleSheet.flatten(styles.playIcon)}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={userSupport}
              style={styles.cardView2}>
              <DisplayText
                onPress={userSupport}
                styles={StyleSheet.flatten(styles.changePwd)}
                text={'Support'}
              />
              <TouchableOpacity
                onPress={userSupport}
                style={styles.headerView} >
                <Image
                  source={require('../../assets/images/arrow_forward.png')}
                  style={StyleSheet.flatten(styles.playIcon)}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


export default Settings;
