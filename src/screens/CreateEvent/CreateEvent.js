'use strict';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import AndroidImagePicker from 'react-native-image-picker';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import { Platform } from 'react-native';
import moment from 'moment';
import { useNavigation } from 'react-navigation-hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
  Text,
  Alert,
  View,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {
  getProfileImage,
  saveProfileImage,
  getUserDetails,
  getProfile,
  CreateEventEndpoint,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  CustomModal,
  SuccessAlert,
} from '../../components';

function CreateEvent({ navigation }) {
  const [date, setDate] = useState([]),
    [endDate, setEndDate] = useState([]),
    [groupId, setGroupId] = useState(''),
    [time, setTime] = useState(''),
    [eventName, setEventName] = useState({
      eventName: '',
      isEventNameValid: false,
    }),
    [eventDescription, setEventDescription] = useState({
      eventDescription: '',
      isEventDescriptionValid: false,
    }),
    [eventLocation, setEventLocation] = useState({
      eventLocation: '',
      isEventLocationValid: false,
    }),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [profileImage, setProfileImage] = useState(null),
    [token, setToken] = useState(''),
    [isDatePickerVisible, setDatePickerVisibility] = useState(false),
    [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false),
    [currentDate, setCurrentDate] = useState('');
  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);
  // Getting curren date and time
  useEffect(() => {
    var date = moment().utcOffset('+01:00').toISOString();
    setCurrentDate(date);
  }, []);

  const checkToken = async () => {
    const eventId = navigation.getParam('groupId');
    const profile = await getProfile(),
      token = profile.access_token;
    setToken(token);
    setGroupId(eventId);
    return setGroupId(eventId);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const showTimepicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };
  const handleConfirm = (date) => {
    let dates = moment(date).toISOString();
    if (dates > currentDate) {
      console.log('A date has been picked: ', dates);
      setDate(date);
      hideDatePicker();
    } else {
      hideDatePicker();
    }
    // setDate(date);
  };

  const handleEndDateConfirm = (endDate) => {
    let dates = moment(endDate).toISOString();

    let eventDate = date;
    var isafter = moment(dates).isAfter(eventDate);
    if (isafter) {
      setEndDate(dates);
      hideEndDatePicker();
      console.log('A date has been picked: ', eventDate);
    } else {
      hideEndDatePicker();
      setEndDate(null);
      console.log('A bad date: ', dates);
    }
    // console.warn('A date has been picked: ', dates)
    // setEndDate(dates)
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
        console.log('immmmaaaageeeee:', dataUrl);
        // setGroupPhoto(dataUrl.url);
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
    // await saveProfileImage(base64Image);
    setProfileImage(base64Image);
  };

  const handleGoBack = () => {
    // resetNavigation()
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
  const handleEventNameChange = (eventName) => {
    if (eventName.length > 0) {
      setEventName({
        isEventNameValid: true,
        eventName: eventName,
      });
    } else {
      if (eventName.length < 1) {
        setEventName({
          isEventNameValid: false,
          eventName: '',
        });
      }
    }
  };
  const handleEventLocation = (eventLocation) => {
    if (eventLocation.length > 0) {
      setEventLocation({
        isEventLocationValid: true,
        eventLocation: eventLocation,
      });
    } else {
      if (eventLocation.length < 1) {
        setEventLocation({
          isEventNameValid: false,
          eventLocation: '',
        });
      }
    }
  };
  const handleEventDescChange = (eventDescription) => {
    if (eventDescription.length > 0) {
      setEventDescription({
        isEventDescriptionValid: true,
        eventDescription: eventDescription,
      });
    } else {
      if (eventDescription.length < 1) {
        setEventDescription({
          isEventDescriptionValid: false,
          eventDescription: '',
        });
      }
    }
  };
  const showLoadingDialogue = () => {
    setShowLoading(true);
  };
  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };
  const handleCreateEvent = async () => {
    if (
      profileImage === '' ||
      profileImage === null ||
      profileImage === undefined
    ) {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Upload Event Image',
      });
    } else if (eventName.eventName.trim() == '') {
      return setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Event Name',
      });
    } else if (eventLocation.eventLocation == '') {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Event Location',
      });
    } else if (eventDescription.eventDescription == '') {
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: 'Enter Event Description',
      });
    } else {
      showLoadingDialogue();
      const body = JSON.stringify({
        displayPhoto: profileImage,
        name: eventName.eventName,
        description: eventDescription.eventDescription,
        venue: eventLocation.eventLocation,
        dates: [
          {
            startDate: moment(date).toISOString(),
            endDate: moment(endDate).toISOString(),
          },
        ],
      });
      try {
        await createEvent(body);
      } catch (error) {
        console.log('errors', error);
        hideLoadingDialogue();
      }
    }
  };

  const createEvent = async (body) => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: body,
    };
    let Endpoint = `${CreateEventEndpoint}${groupId}/events`;
    const response = await fetch(Endpoint, settings);
    const res = await response.json();
    console.log('hehehehe', Endpoint);
    if (res.meta.status >= 300) {
      console.log('Log statussss', res);
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        showSuccessAlert: false,
        message: res.meta.message,
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      console.log(" '''''''''''''' ", res);
      hideLoadingDialogue();
      return resetNavigation();
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          showSuccessAlert: false,
          message: res.meta.message,
        });
        hideLoadingDialogue();
        console.log({ responses: res.meta.message });
      }
    }
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
      <KeyboardAvoidingView
        style={styles.KeyAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textView}>
            <DisplayText
              text={'New Event'}
              styles={StyleSheet.flatten(styles.userProfileText)}
            />
            <DisplayText
              text={'Create a new event'}
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
                placeholder={'Event Name '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'text'}
                keyboardType={'text'}
                onChangeText={handleEventNameChange}
                autoCapitalize={'words'}
                height={52}
                width={'80%'}
                blurOnSubmit={false}
                blurOnSubmit={false}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
              <Image
                source={require('../../assets/images/happy.png')}
                style={StyleSheet.flatten(styles.iconForm)}
              />
            </View>
            <View style={styles.textInputView}>
              <InputField
                placeholder={'Event Location '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'text'}
                keyboardType={'text'}
                onChangeText={handleEventLocation}
                autoCapitalize={'words'}
                height={52}
                width={'80%'}
                blurOnSubmit={false}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View style={styles.textInputView}>
              <InputField
                placeholder={'Event Description '}
                placeholderTextColor={colors.darkText}
                textColor={colors.blackShade}
                inputType={'text'}
                keyboardType={'text'}
                onChangeText={handleEventDescChange}
                value={eventDescription.eventDescription}
                numberOfLines={4}
                maxLength={200}
                autoCapitalize='none'
                height={52}
                width={'80%'}
                blurOnSubmit={false}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View style={styles.dateView}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[styles.dateTimeView, { flexDirection: 'column' }]}
              >
                <DisplayText
                  onPress={showDatePicker}
                  text={'Select Start Date'}
                  styles={StyleSheet.flatten(styles.headerDateText)}
                />
                <DisplayText
                  onPress={showDatePicker}
                  text={moment(date).format('')}
                  styles={StyleSheet.flatten(styles.dateText)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showEndDatePicker}
                style={[styles.dateTimeView, { flexDirection: 'column' }]}
              >
                <DisplayText
                  onPress={showEndDatePicker}
                  text={'Select End Date'}
                  styles={StyleSheet.flatten(styles.headerDateText)}
                />
                <DisplayText
                  onPress={showEndDatePicker}
                  text={moment(endDate).format('')}
                  styles={StyleSheet.flatten(styles.dateText)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='datetime'
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        style={{
          color: 'black',
          ios_backgroundColor: 'white',
          backgroundColor: '#00000055',
        }}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode='datetime'
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
        style={{
          color: 'black',
          ios_backgroundColor: 'white',
          backgroundColor: '#00000055',
        }}
      />

      <View style={styles.btnView}>
        <SubmitButton
          title={'Create Event'}
          onPress={handleCreateEvent}
          btnStyle={styles.buttonWithImage}
          imgStyle={StyleSheet.flatten(styles.iconDoor)}
          titleStyle={StyleSheet.flatten(styles.brnText)}
        />
      </View>
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

export default CreateEvent;
