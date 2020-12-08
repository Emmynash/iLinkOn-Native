'use strict';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AndroidImagePicker from 'react-native-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import { useNavigation } from 'react-navigation-hooks';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { NavigationActions, StackActions } from 'react-navigation';

import styles from './styles';
import {
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Keyboard,
  View,
  KeyboardAvoidingView,
} from 'react-native';

import {
  CreateGroupEndpoint,
  getUserDetails,
  saveProfileImage,
  GetSchoolsEndpoint,
  getProfile,
  imageUpload,
} from '../Utils/Utils';

import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
} from '../../components';

function CreateGroup({ navigation }) {
  const [groupName, setGroupName] = useState({
      groupName: '',
      isGroupNameValid: false,
    }),
    [groupDescription, setGroupDescription] = useState({
      groupDescription: '',
      isGroupDescriptionValid: false,
    }),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [profileImage, setProfileImage] = useState(null),
    [GroupPhoto, setGroupPhoto] = useState(''),
    [hasCameraPermission, setHasCameraPermission] = useState(null),
    [token, setToken] = useState(''),
    [schoolId, setSchoolId] = useState(''),
    [schoolsData, setSchools] = useState([]),
    [successMessage, setSuccessMessage] = useState('');
  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    let profile = await getProfile();
    let userDetails = await getUserDetails();
    if (typeof profile.access_token !== 'undefined') {
      let access_token = profile.access_token;
      setSchoolId(userDetails.data.school);
      setToken(access_token);
      await handleGetAllRequest(access_token);
    }
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
  const handleGetAllRequest = async (token) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };
    const school = fetch(GetSchoolsEndpoint, header);
    // interest = fetch(GetInterestEndpoint, header);
    Promise.all([school])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const schoolApiResp = finalResps[0];
        // interestApiResp = finalResps[1];
        getSchool(schoolApiResp);
        // getInterest(interestApiResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
        console.log(error);
      });
  };

  const getSchool = async (schoolRes) => {
    console.log('schoollsss..... ', schoolRes);
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
  // const selectSch = (item) => {
  //   return setSchoolId(item)
  // }
  // const getInterest = async interestRes => {
  //   try {
  //     if (interestRes) {
  //       hideLoadingDialogue();
  //       const intToArray = Object.values(interestRes.data)
  //       intToArray.map((item) => {
  //         const data = {
  //           'label': item.name,
  //           'value': item.id
  //         }
  //         console.log(' schoolll data.......', data)
  //         return setInterest(interest => [...interest, data]);
  //       })
  //     } else {
  //       hideLoadingDialogue();
  //       alert('Failed to retrieve ');
  //     }
  //   } catch (error) {
  //     console.log({ error: error });
  //     hideLoadingDialogue();
  //   }
  // };

  const handleUploadImage = (base64Image) => {
    showLoadingDialogue();
    let CLOUDINARY_URL = imageUpload;
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
        console.log('immmmaaaageeeee:', dataUrl);
        setGroupPhoto(dataUrl.url);
        handleSaveProfileImage(dataUrl.secure_url);
        hideLoadingDialogue();
      })
      .catch((err) => {
        hideLoadingDialogue();
        console.log(err);
      });
  };
  const handleSaveProfileImage = async (base64Image) => {
    console.log('base64imageeeee:', base64Image);
    setProfileImage(base64Image);
  };
  const handleGroupNameChange = (group) => {
    if (group.length > 0) {
      setGroupName({
        groupName: group,
        isGroupNameValid: true,
      });
    } else {
      if (groupName.length < 1) {
        setGroupName({
          groupName: '',
          isGroupNameValid: false,
        });
      }
    }
  };
  const handleGroupDescriptionChange = (groupDesc) => {
    if (groupDesc.length > 0) {
      setGroupDescription({
        isGroupDescriptionValid: true,
        groupDescription: groupDesc,
      });
    } else {
      if (groupDesc.length < 1) {
        setGroupDescription({
          isGroupDescriptionValid: false,
          groupDescription: '',
        });
      }
    }
  };

  const handleGoBack = () => {
    return goBack();
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

  const handleCreateGroup = async () => {
    if (
      groupName.groupName.trim() == '' ||
      groupName.groupName.trim() == 'undefined'
    ) {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Group Name',
      });
    } else if (groupDescription.groupDescription == '') {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Group Decription',
      });
    } else if (profileImage == null) {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Upload Group Image',
      });
    } else if (schoolId === '' || schoolId === null) {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Select Your School',
      });
    } else {
      showLoadingDialogue();
      const body = {
        displayPhoto: profileImage,
        name: groupName.groupName,
        description: groupDescription.groupDescription,
        interests: [1],
        school: schoolId,
      };
      try {
        await createGroup(body);
      } catch (error) {
        hideLoadingDialogue();
      }
    }
  };

  const createGroup = async (body) => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(CreateGroupEndpoint, settings);
    const res = await response.json();
    console.log(" '''''''''''''' ", settings);
    if (typeof res.meta.status >= 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: res.meta.message.toString(),
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      hideLoadingDialogue();
      return resetNavigation();
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          showSuccessAlert: false,
          message: res.meta.message.toString(),
        });
        console.log({ responses: res.meta.message });
      }
    }
  };

  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headView}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            onPress={handleGoBack}
            style={styles.backLogo}
            source={require('../../assets/images/left-arrow.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 50 }}>
          <View style={styles.textView}>
            <DisplayText
              text={'New Group'}
              styles={StyleSheet.flatten(styles.userProfileText)}
            />
            <DisplayText
              text={'Create a new group'}
              styles={StyleSheet.flatten(styles.editProText)}
            />
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageView}>
              <View style={styles.imageView}>
                <View style={styles.profileView}>
                  {profileImage ? (
                    <Image
                      onPress={getPermissionAsync}
                      source={{ uri: profileImage }}
                      style={StyleSheet.flatten(styles.profileImage)}
                    />
                  ) : (
                    <Image
                      onPress={getPermissionAsync}
                      source={require('../../assets/images/profileimage.png')}
                      style={StyleSheet.flatten(styles.profilePlaceHolder)}
                    />
                  )}
                  <TouchableOpacity
                    onPress={getPermissionAsync}
                    style={styles.cameraCont}
                  >
                    <Image
                      onPress={getPermissionAsync}
                      source={require('../../assets/images/camera.png')}
                      style={StyleSheet.flatten(styles.camera)}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputFieldView}>
            <View style={styles.textInputView}>
              <InputField
                placeholder={'Group Name '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'text'}
                keyboardType={'text'}
                onChangeText={handleGroupNameChange}
                autoCapitalize='none'
                height={52}
                width={'80%'}
                blurOnSubmit={false}
                returnKeyType={'done'}
                blurOnSubmit={false}
              />
              <Image
                source={require('../../assets/images/happy.png')}
                style={StyleSheet.flatten(styles.iconForm)}
              />
            </View>
            <View style={styles.textInputView}>
              <InputField
                placeholder={'Group Description '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'text'}
                keyboardType={'text'}
                onChangeText={handleGroupDescriptionChange}
                autoCapitalize='none'
                height={52}
                width={'80%'}
                blurOnSubmit={false}
                returnKeyType={'done'}
              />
            </View>
            {/* <View style={styles.langDropDowm}>
              <Dropdown
                data={schoolsData}
                label={'School'}
                labelFontSize={16}
                dropdownPosition={4}
                value={'Select School'}
                fontSize={15}
                itemPadding={10}
                onChangeText={item => selectSch(item)}
                textColor={theme.primaryTextColor}
                baseColor={colors.darkText}
              />
            </View> */}
            <SubmitButton
              title={'Create Group'}
              onPress={handleCreateGroup}
              btnStyle={styles.buttonWithImage}
              imgStyle={StyleSheet.flatten(styles.iconDoor)}
              titleStyle={StyleSheet.flatten(styles.brnText)}
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
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateGroup;
