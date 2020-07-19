'use strict';
import React, { useState, useEffect } from 'react'
import {
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  Text
} from 'react-native'
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert
} from '../../components'
import {
  LoginEndpoint,
  postRoute,
  saveUserDetail,
  saveProfile
} from '../Utils/Utils'
import { ProgressDialog } from 'react-native-simple-dialogs'
import { useNavigation } from 'react-navigation-hooks'
import colors from '../../assets/colors'
import theme from '../../assets/theme'
import styles from './styles'
import { NavigationActions, StackActions } from 'react-navigation'


const VerifyOtp = ({ navigation }) => {
  const [phone, setPhone] = useState({
    phone: '',
    isPhoneValid: false
  }),
    [otp, setOtp] = useState({
      otp: '',
      isOtpValid: false
    }),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: ''
    }),
    [successMessage, setSuccessMessage] = useState('')
  const { navigate, popToTop } = useNavigation()

  useEffect(() => {
    _getChatMessages()
  }, [])

  const _getChatMessages = async () => {
    const phone = navigation.getParam('phone')
    console.log('to be sure', phone)
    setPhone({
      isPhoneValid: true,
      phone: phone,
    });
  }
  const gotoSignUp = () => {
    return navigate('Register')
  };
  const showLoadingDialogue = () => {
    setShowLoading(true)
  };
  const hideLoadingDialogue = () => {
    setShowLoading(false)
  };
  const showNotification = (type, title, message) => {
    hideLoadingDialogue()
    return dropDownAlertRef.alertWithType(type, title, message);
  };

  const handlePhoneChange = phone => {
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
          phone: ''
        });
      }
    }
  };
  const handlePasswordChange = password => {
    if (password.length > 0) {
      setOtp({
        isOtpValid: true,
        otp: password
      });
    } else {
      if (password.length < 1) {
        setOtp({
          isOtpValid: false,
          otp: ''
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
    } else if (otp.otp == '') {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Valid OTP'
      });
    } else {
      showLoadingDialogue();

      const body = JSON.stringify({
        phone: phone.phone,
        otp: otp.otp
      });
      try {
        console.log('boooooooody', body);
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
        'Content-Type': 'application/json'
      },
      body
    }

    const response = await fetch(LoginEndpoint, settings)
    const res = await response.json()
    console.log('checking varification responses:', res)
    if (res.meta.status > 300) {
      hideLoadingDialogue()
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: res.meta.message.toString()
      });
    } else if (res.meta.status >= 200 || res.meta.status < 300) {
      const token = res.data.token
      if (res.data.new_user == true) {
        hideLoadingDialogue()
        let token = res.data.token
        await saveProfile(token)
        return navigate('Profile')
      } else {
        let data = {
          email: res.data.user.email,
          fName: res.data.user.fName,
          lName: res.data.user.lName,
          mName: res.data.user.mName,
          id: res.data.user.id,
          phone: res.data.user.phone,
          profilePhoto: res.data.user.profilePhoto,
          school: res.data.user.school.id,

        }
        hideLoadingDialogue()
        await saveProfile(token)
        await saveUserDetail(data)
        return navigate('Navigations')
      }
    } else {
      if (res.meta.message) {
        hideLoadingDialogue()
        setShowAlert({
          showAlert: true,
          showSuccessAlert: false,
          message: res.meta.message.toString()
        });
        console.log({ responses: res.meta.message })
      }
    }

    // const resetNavigation = () => {
    //   const resetAction = StackActions.reset({
    //     index: 0,
    //     key: null,
    //     actions: [
    //       NavigationActions.navigate({
    //         routeName: 'Profile',
    //       })
    //     ]
    //   });
    //   return navigation.dispatch(resetAction);
    // }

    // showLoadingDialogue();
    // await postRoute(LoginEndpoint, body).then(res => {
    //   console.log('Login statussss', res);

    //   if (typeof res.status > 200 && res.status < 300) {
    //     // let token = res.access_token;
    //     // saveToLocalStorage(token);
    //   } else if (typeof res.message !== 'undefined') {
    //     hideLoadingDialogue();
    //     setShowAlert({
    //       showAlert: true,
    //       errorMessage: res.message.toString()
    //     });
    //   } else if (res.message) {
    //     console.log({ responses: res.message });
    //     hideLoadingDialogue();
    //     setShowAlert({
    //       showAlert: true,
    //       errorMessage: res.message.constraints.toString()
    //     });
    //   }
    // });
  };
  // const saveToLocalStorage = async token => {
  //   await saveProfile(token); 
  //   return await navigate('Navigations');
  // };
  const handleBackPress = () => {
    return popToTop();
  };
  const social = () => {
    return alert('This page is coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
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
          text={'VERIFY OTP'}
          styles={StyleSheet.flatten(styles.LoginTxt)}
        />

        <View style={styles.inputField}>
          <View style={styles.textInputView}>
            <InputField
              placeholder={'Phone'}
              defaultValue={phone.phone}
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
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            <Image
              source={require('../../assets/images/phone.png')}
              style={StyleSheet.flatten(styles.iconForm)}
            />
          </View>
          <View style={styles.textInputView}>
            <InputField
              placeholder={'Password'}
              placeholderTextColor={colors.gray}
              textColor={colors.black}
              inputType={'password'}
              onChangeText={handlePasswordChange}
              autoCapitalize='none'
              height={50}
              width={'98%'}
              // borderWidth={0}
              // borderColor={colors.white}
              // refs={(input) => {
              //   passwordRef = input;
              // }}
              returnKeyType={'done'}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                handleSignIn();
              }}
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


      {/* <View style={styles.socialButtonView}>
        <Image
          style={styles.loginImg}
          source={require('../../assets/images/editted.png')}
        />


      </View> */}
    </SafeAreaView>
  );
};

export default VerifyOtp;
