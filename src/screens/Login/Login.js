'use strict';
import React, { useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
} from '../../components';
import { GetOTPEndpoint } from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { useNavigation } from 'react-navigation-hooks';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';

const Login = ({ navigation }) => {
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

  const { navigate, popToTop } = useNavigation();
  // const testing = () => {
  //   return navigate('Profile');
  // };
  const handleForgetPassword = () => {
    return navigate('ForgetPassword');
  };
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

  const handlePhoneChange = (phone) => {
    if (phone.length === 11) {
      let code = '+234';
      let phoneNumber = phone.split('').slice(1).join('');
      console.log(phoneNumber);
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
      return navigation.navigate('VerifyOtp', {
        phone: phone.phone,
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

  // const saveToLocalStorage = async token => {
  //   await saveProfile(token);
  //   return  navigate('VerifyOtp');
  // };
  const handleBackPress = () => {
    return popToTop();
  };
  const social = () => {
    return alert('This page is coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/OTP-vector.png')}
        style={styles.wrapper_bg_image}
      ></Image>
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
          text={'Login '}
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
            title={'Get OTP'}
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
    </SafeAreaView>
  );
};

export default Login;
