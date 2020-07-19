'use strict';
import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Text
} from 'react-native';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert
} from '../../components';
import {
  ForgotPassword,
  postRoute,
  isPhoneValid,
  saveProfile
} from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { useNavigation } from 'react-navigation-hooks';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';

const ForgetPassword = () => {
  const [phone, setPhone] = useState({
      phone: '',
      isPhoneValid: false
    }),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: ''
    }),
    [successMessage, setSuccessMessage] = useState('');
  const { navigate, popToTop } = useNavigation();

  const gotoSignUp = () => {
    return navigate('Register');
  };
  const showLoadingDialogue = () => {
    setShowLoading(true);
  };
  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };
  const showNotification = (type, title, message) => {
    hideLoadingDialogue();
    return dropDownAlertRef.alertWithType(type, title, message);
  };

  const handlePhoneChange = phone => {
    if (phone.length > 0) {
      setPhone({
        isPhoneValid: true,
        phone: phone
      });
    } else {
      if (phone.length < 1) {
        setPhone({
          isPhoneValid: false,
          phone: ''
        });
      }
    }
  };

  const onBlur = () => {
    console.log(':::::: onBlur');
  };
  const toggleButtonState = () => {
    if (isEmailValid && isPasswordValid) {
      return true;
    } else {
      return false;
    }
  };

  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false
    });
  };

  const handleSignIn = async () => {
    if (phone.phone.trim() == '' || phone.phone.trim() == 'undefined') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Invalid Phone Number!'
      });
    } else {
      showLoadingDialogue();
      const body = await JSON.stringify({
        phone: phone.phone
      });
      try {
        await login(body);
      } catch (error) {
        console.log('errors', error);
        hideLoadingDialogue();
      }
    }
  };

  const login = async body => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body
    };

    const response = await fetch(ForgetPassword, settings);
    const res = await response.json();
    if (typeof res.meta.status >= 300) {
      console.log('Log statussss', res.meta.status);
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: res.meta.message.toString()
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      console.log(" '''''''''''''' ", res);
      if (res.data === true) {
        hideLoadingDialogue();
        return navigate('Login');
      }
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          showSuccessAlert: false,
          message: res.meta.message.toString()
        });
        console.log({ responses: res.meta.message });
      }
    }
  };

  const handleBackPress = () => {
    return popToTop();
  };
  const social = () => {
    return alert('This page is coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtnView}>
          <Image
            style={styles.backImage}
            onPress={handleBackPress}
            source={require('../../assets/images/back.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={gotoSignUp} style={styles.linkView}>
          <DisplayText
            onPress={gotoSignUp}
            text={'Foret Password'}
            styles={StyleSheet.flatten(styles.signup)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <DisplayText
          text={'iLinkOn'}
          styles={StyleSheet.flatten(styles.signupTxt)}
        />
        {/* <DisplayText
          text={'Send you phone number \nto reset password'}
          styles={StyleSheet.flatten(styles.loginTxt)}
        /> */}

        <View style={styles.inputField}>
          <View style={styles.textInputView}>
            <InputField
              placeholder={'Phone'}
              placeholderTextColor={colors.gray}
              textColor={colors.blackShade}
              inputType={'phone'}
              keyboardType={'phone'}
              onChangeText={handlePhoneChange}
              autoCapitalize='none'
              height={52}
              width={'80%'}
              // borderWidth={1}
              blurOnSubmit={false}
              // borderColor={theme.colorAccent}
              returnKeyType={'done'}
              blurOnSubmit={false}
              onSubmitEditing={() => {}}
            />
            <Image
              source={require('../../assets/images/phone.png')}
              style={StyleSheet.flatten(styles.iconForm)}
            />
          </View>

          <SubmitButton
            onPress={() => {
              handleSignIn();
            }}
            title={'Login'}
            btnStyle={styles.buttonSignUp}
            titleStyle={StyleSheet.flatten(styles.loginTxt)}
            disabled={!toggleButtonState}
          />
          <ProgressDialog
            visible={showLoading}
            title='Processing'
            message='Please wait...'
          />
          <SuccessAlert
            title={'Success!'}
            message={successMessage}
            handleCloseNotification={handleCloseNotification}
            visible={showAlert.showSuccessAlert}
          />
          <ErrorAlert
            title={'Error!'}
            message={showAlert.message}
            handleCloseNotification={handleCloseNotification}
            visible={showAlert.showAlert}
          />
        </View>
      </View>

      <View style={styles.socialButtonView}>
        <Image
          style={styles.loginImg}
          source={require('../../assets/images/editted.png')}
        />
        {/* 
        <Text style={styles.lastTxt}>
          {'Switching Account?'}
          <Text onPress={gotoSignUp} style={styles.nextTxt}>
            {' Get Otp'}
          </Text>
        </Text> */}
      </View>
    </SafeAreaView>
  );
};

export default ForgetPassword;
