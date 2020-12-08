'use strict';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AndroidImagePicker from 'react-native-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { useNavigation } from 'react-navigation-hooks';
import { NavigationActions, StackActions } from 'react-navigation';

import styles from './styles';
import {
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {
  getProfileImage,
  saveProfileImage,
  saveProfile,
  getUserDetails,
  getProfile,
  ProfileEndpoint,
  saveUserDetail,
  GetInterestEndpoint,
  GetSchoolsEndpoint,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
} from '../../components';
function UpdateProfile({ navigation }) {
  const [email, setEmail] = useState({
      email: '',
      isEmailValid: false,
    }),
    [midname, setMiddleName] = useState({
      midname: '',
      isMiddleNameValid: false,
    }),
    [firstname, setFirstname] = useState({
      firstname: '',
      isFirstnameValid: false,
    }),
    [lastname, setLastname] = useState({
      lastname: '',
      isLastnameValid: false,
    }),
    [interest, setInterest] = useState({
      interest: [],
      isInterestValid: false,
    }),
    [id, setId] = useState(''),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [schoolId, setSchoolId] = useState(''),
    [schoolsData, setSchools] = useState([]),
    [interestData, setInterestData] = useState([]),
    [profileImage, setProfileImage] = useState(null),
    [hasCameraPermission, setHasCameraPermission] = useState(null),
    [token, setToken] = useState(''),
    [userId, setUserId] = useState('');

  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const userDetails = await getUserDetails(),
      profile = await getProfile();
    console.log('gggggg', userDetails.data.school);
    let token = profile.access_token;
    setFirstname({ firstname: userDetails.data.fName });
    setLastname({ lastname: userDetails.data.lName });
    setMiddleName({ midname: userDetails.data.mName });
    setEmail({ email: userDetails.data.email });
    setProfileImage(userDetails.data.profilePhoto);
    setSchoolId(userDetails.data.school);
    setToken(token);
    setUserId(userDetails.data.id);
    await handleGetAllRequest(token);
  };

  const hadnleGoback = () => {
    return goBack();
  };
  const showLoadingDialogue = () => {
    setShowLoading(true);
  };
  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  const getPermissionAsync = async () => {
    // const { translations } = props;
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert(translations.permission);
        return false;
      } else {
        return pickImage();
      }
    } else {
      return pickImage();
    }
  };

  const pickImage = async () => {
    if (Constants.platform.ios) {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      return handleUploadImage(base64Img);
    }
    } else {
      const options = {
        title: 'Select Image',
        customButtons: [{ name: 'Image', title: 'Choose Photo from your storage' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        allowsEditing: true,
      };
      AndroidImagePicker.launchImageLibrary(options, (response) => {

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = 'data:image/jpeg;base64,' + response.data;
          return handleUploadImage(source);
        }
      });
    }
  };

  const handleUploadImage = (base64Image) => {
    showLoadingDialogue();
    let CLOUDINARY_URL =
      'https://api.cloudinary.com/v1_1/https-cyberve-com/image/upload';
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify({
        file: base64Image,
        upload_preset: 'kvdcspfl',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (res) => {
        let dataUrl = await res.json();
        handleSaveProfileImage(dataUrl.secure_url);
        hideLoadingDialogue();
      })
      .catch((err) => {
        hideLoadingDialogue();
        console.log(err);
      });
  };
  const handleSaveProfileImage = (base64Image) => {
    console.log('base64imageeeee:', base64Image);
    setProfileImage(base64Image);
  };
  const handleGetAllRequest = async (token) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };
    const school = fetch(GetSchoolsEndpoint, header),
      interest = fetch(GetInterestEndpoint, header);
    Promise.all([school, interest])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const schoolApiResp = finalResps[0],
          interestApiResp = finalResps[1];
        getSchool(schoolApiResp);
        getInterest(interestApiResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
        console.log(error);
      });
  };

  const getSchool = async (schoolRes) => {
    try {
      if (schoolRes) {
        hideLoadingDialogue();
        const schToArray = Object.values(schoolRes.data);
        schToArray.map((item) => {
          const data = {
            label: item.name,
            value: item.id,
          };
          return setSchools((sch) => [...sch, data]);
        });
      } else {
        alert('Failed to retrieve ');
        hideLoadingDialogue();
      }
    } catch (error) {
      hideLoadingDialogue();
      console.log({ error: error });
    }
  };

  const getInterest = async (interestRes) => {
    try {
      if (interestRes) {
        hideLoadingDialogue();
        const intToArray = Object.values(interestRes.data);
        intToArray.map((item) => {
          const data = {
            label: item.name,
            value: item.id,
          };
          return setInterest((interest) => [...interest, data]);
        });
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      console.log({ error: error });
      hideLoadingDialogue();
    }
  };

  const handleUpdateProfile = async () => {
    if (
      profileImage === '' ||
      profileImage === null ||
      profileImage === undefined
    ) {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Upload Profile Image',
      });
    } else if (firstname.firstname === '') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter first name',
      });
    } else if (lastname.lastname === '') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter last name',
      });
    } else if (email.email === '') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter email address',
      });
    } else if (schoolId === '') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Select your school',
      });
    } else {
      showLoadingDialogue();
      const body = JSON.stringify({
        profilePhoto: profileImage,
        fName: firstname.firstname,
        lName: lastname.lastname,
        mName: midname.midname,
        email: email.email,
        interests: [1],
        school: schoolId,
      });
      console.log('hoodjdhdhdhd', body);
      try {
        await updateProfile(body);
      } catch (error) {
        console.log('Network error may be', error);
        setShowAlert({
          showAlert: true,
          showSuccessAlert: false,
          message: 'Request failed try again.',
        });
        hideLoadingDialogue();
      }
    }
  };

  const updateProfile = async (body) => {
    showLoadingDialogue();
    const settings = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: body,
    };
    let endpoint = `${ProfileEndpoint}${userId}`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    console.log(' profile', settings);

    console.log('response chck for update profile', res);
    if (res.meta.status >= 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: 'Please enter complete data to update profile',
      });
    } else if (res.meta.status >= 200 && res.meta.status < 300) {
      let data = {
        email: res.data.email,
        fName: res.data.fName,
        lName: res.data.lName,
        mName: res.data.mName,
        id: res.data.id,
        phone: res.data.phone,
        profilePhoto: res.data.profilePhoto,
        school: res.data.school,
      };
      console.log('dayayayayayata', data);
      await saveProfileImage(profileImage);
      await saveUserDetail(data);
      await saveProfile(token);
      return await resetNavigation();
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          message: res.meta.message,
        });
      }
    }
  };

  const resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'Navigations',
        }),
      ],
    });
    return navigation.dispatch(resetAction);
  };

  const handleEmailChange = (email) => {
    if (email.length > 0) {
      setEmail({
        isEmailValid: true,
        email: email,
      });
    } else {
      if (email.length < 1) {
        setEmail({
          isEmailValid: false,
          email: '',
        });
      }
    }
  };
  const handleMidnameChange = (midname) => {
    if (midname.length > 0) {
      setMiddleName({
        isMiddleNameValid: true,
        midname: midname,
      });
    } else {
      if (midname.length < 1) {
        setMiddleName({
          isMiddleNameValid: false,
          midname: '',
        });
      }
    }
  };
  const handleFirstnameChange = (firstname) => {
    if (firstname.length > 0) {
      setFirstname({
        isFirstnameValid: true,
        firstname: firstname,
      });
    } else {
      if (firstname.length < 1) {
        setFirstname({
          isFirstnameValid: false,
          firstname: '',
        });
      }
    }
  };
  const handleLastnameChange = (lastname) => {
    if (lastname.length > 0) {
      setLastname({
        isLastnameValid: true,
        lastname: lastname,
      });
    } else {
      if (lastname.length < 1) {
        setLastname({
          isLastnameValid: false,
          lastname: '',
        });
      }
    }
  };
  const selectSch = (item) => {
    return setSchoolId(item);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headView}>
        <TouchableOpacity onPress={hadnleGoback}>
          <Image
            style={styles.backLogo}
            source={require('../../assets/images/left-arrow.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 50 }}>
          <View style={styles.textView}>
            <DisplayText
              text={'User Profile'}
              styles={StyleSheet.flatten(styles.userProfileText)}
            />
            <DisplayText
              // onPress={handleEditProfile}
              text={'View and edit profile'}
              styles={StyleSheet.flatten(styles.editProText)}
            />
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageView}>
              <View style={styles.imageView}>
                <TouchableOpacity
                  onPress={getPermissionAsync}
                  style={styles.profileView}
                >
                  {profileImage ? (
                    <Image
                      source={{
                        uri: `${profileImage}`,
                      }}
                      style={StyleSheet.flatten(styles.profileImage)}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/profileimage.png')}
                      style={StyleSheet.flatten(styles.profilePlaceHolder)}
                    />
                  )}
                  <TouchableOpacity
                    onPress={getPermissionAsync}
                    style={styles.cameraCont}
                  >
                    <Image
                      source={require('../../assets/images/camera.png')}
                      style={StyleSheet.flatten(styles.camera)}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View style={styles.profileDetails}></View>
            </View>
          </View>
          <View style={styles.inputFieldView}>
            {/* name View */}
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.nameTxtInputtView}>
                <InputField
                  placeholder={'Firstname'}
                  defaultValue={firstname.firstname}
                  placeholderTextColor={colors.darkText}
                  textColor={colors.blackShade}
                  inputType={'text'}
                  keyboardType={'text'}
                  onChangeText={handleFirstnameChange}
                  height={40}
                  width={'80%'}
                  // borderWidth={1}
                  blurOnSubmit={false}
                  // borderColor={theme.colorAccent}
                  // onSubmitEditing={() => {
                  //   handleSignIn();
                  // }}
                />
              </View>
              <View style={styles.nameTxtInputtView}>
                <InputField
                  placeholder={'Lastname'}
                  defaultValue={lastname.lastname}
                  placeholderTextColor={colors.darkText}
                  textColor={colors.blackShade}
                  inputType={'text'}
                  keyboardType={'text'}
                  onChangeText={handleLastnameChange}
                  height={40}
                  width={'80%'}
                  // borderWidth={1}
                  blurOnSubmit={false}
                  // borderColor={theme.colorAccent}
                  // onSubmitEditing={() => {
                  //   handleSignIn();
                  // }}
                />
              </View>
            </View>
            <View style={styles.textInputView}>
              <InputField
                placeholder={'Middle Name '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'word'}
                keyboardType={'text'}
                defaultValue={midname.midname}
                onChangeText={handleMidnameChange}
                height={52}
                width={'80%'}
              />
              <Image
                source={require('../../assets/images/user.png')}
                style={StyleSheet.flatten(styles.iconForm)}
              />
            </View>
            <View style={[styles.textInputView]}>
              <InputField
                placeholder={'Email'}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'email'}
                defaultValue={email.email}
                keyboardType={'email'}
                editable={false}
                onChangeText={handleEmailChange}
                height={52}
                width={'80%'}
                autoCapitalize='none'
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  handleUpdateProfile();
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <SubmitButton
        title={'Finish'}
        onPress={handleUpdateProfile}
        btnStyle={styles.buttonWithImage}
        imgStyle={StyleSheet.flatten(styles.iconDoor)}
        titleStyle={StyleSheet.flatten(styles.brnText)}
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
    </SafeAreaView>
  );
}

export default UpdateProfile;
