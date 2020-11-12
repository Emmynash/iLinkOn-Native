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
  Text,
} from 'react-native';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
} from '../../components';
import { GetOTPEndpoint } from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { useNavigation } from 'react-navigation-hooks';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';

const Register = ({ navigation }) => {
  const { navigate, popToTop } = useNavigation();
  const [phone, setPhone] = useState({
      phone: '',
      isPhoneValid: false,
    }),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [successMessage, setSuccessMessage] = useState('');
  // const testing = () => {
  //   return navigate('Profile');
  // };
  const handleForgetPassword = () => {
    return navigate('ForgetPassword');
  };
  const gotoSignUp = () => {
    return navigate('Login');
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

  const handlePhoneChange = (phone) => {
    if (phone.length === 11) {
      let code = '+234';
      let phoneNumber = phone.split('').slice(1).join('');
      setPhone({
        isPhoneValid: true,
        phone: `${code}${phoneNumber}`,
      });
    } else {
      if (phone.length < 1) {
        setPhone({
          isPhoneValid: false,
          phone: '',
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
      showSuccessAlert: false,
    });
  };

  const handleRegister = async () => {
    if (phone.phone.trim() == '' || phone.phone.trim() == 'undefined') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Invalid Phone Number!',
      });
    } else {
      showLoadingDialogue();
      const body = JSON.stringify({
        phone: phone.phone,
      });
      try {
        await getOTP(body);
      } catch (error) {
        console.log('errors', error);
        hideLoadingDialogue();
      }
    }
  };

  const getOTP = async (body) => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    };

    const response = await fetch(GetOTPEndpoint, settings);
    const res = await response.json();
    if (typeof res.meta.status >= 300) {
      console.log('Login statussss', res.meta.status);
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message.toString(),
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      console.log(" '''''''''''''' ", res);
      hideLoadingDialogue();
      const token = '',
        data = res.user;
      // saveToLocalStorage(data, token);
      return navigation.navigate('VerifyOtp', {
        phone: body.phone,
      });
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          message: res.meta.message.toString(),
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
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <View style={styles.wrapper}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backBtnView}
          >
            <Image
              style={styles.backImage}
              onPress={handleBackPress}
              // source={require('../../assets/images/back.png')}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={gotoSignUp} style={styles.linkView}>
            <DisplayText
              onPress={gotoSignUp}
              text={'Sign Up'}
              styles={StyleSheet.flatten(styles.Signup)}
            />
          </TouchableOpacity> */}
        </View>
        <DisplayText
          text={'iLinkOn'}
          styles={StyleSheet.flatten(styles.SignupTxt)}
        />
        <DisplayText
          text={'Register'}
          styles={StyleSheet.flatten(styles.LoginTxt)}
        />

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
              // borderColor={theme.colorAccent}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                handleRegister();
              }}
            />
            <Image
              source={require('../../assets/images/user.png')}
              style={StyleSheet.flatten(styles.iconForm)}
            />
          </View>
          <SubmitButton
            onPress={() => {
              handleRegister();
            }}
            title={'Get Otp'}
            btnStyle={styles.buttonSignUp}
            titleStyle={StyleSheet.flatten(styles.loginTxt)}
            disabled={!toggleButtonState}
          />
          <ProgressDialog
            visible={showLoading}
            title='Processing'
            message='Please wait...'
          />
          <ErrorAlert
            title={'Error!'}
            message={showAlert.message}
            handleCloseNotification={handleCloseNotification}
            visible={showAlert.showAlert}
          />
        </View>
      </View>
      {/* <DisplayText
        onPress={handleForgetPassword}
        text={'Forgot Password?'}
        styles={StyleSheet.flatten(styles.txtForgot)}
      /> */}

      <View style={styles.socialButtonView}>
        {/* <SubmitButton
          title={'Not a member? Register'}
          onPress={handleSignIn}
          btnStyle={styles.buttonFacebook}
          titleStyle={StyleSheet.flatten(styles.buttonTxt)}
          imgSrc={require('../../assets/images/back.png')}
          imgStyle={StyleSheet.flatten(styles.iconBtn)}
        /> */}
        {/* <DisplayText
          text={'Not a member?'}
          styles={StyleSheet.flatten(styles.lastTxt)}
        /> */}
        <View style={styles.socialImage}>
          <TouchableOpacity onPress={social}>
            <Image
              style={styles.iconDoor}
              source={require('../../assets/images/facebook.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={social}>
            <Image
              style={styles.iconDoor}
              source={require('../../assets/images/twitter.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.lastTxt}>
          {'Already a member?'}
          <Text onPress={gotoSignUp} style={styles.nextTxt}>
            {' Login'}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Register;
