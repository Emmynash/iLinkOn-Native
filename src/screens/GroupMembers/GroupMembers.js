'use strict';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';
import { useNavigation } from 'react-navigation-hooks';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ImageView from 'react-native-image-view';

import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  FlatList,
  Switch,
  StatusBar,
} from 'react-native';
import {
  getProfileImage,
  getUserDetails,
  getProfile,
  GetGroupMember,
  CreateThreadEndpoint,
  GetGroupsEndpoint,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
  ProfileImage,
} from '../../components';

const GroupMembers = () => {
  const navigation = useNavigation();
  const { navigate, goBack } = useNavigation();
  const [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      imageTitile: '',
      profilePic: '',
    }),
    [switchValue, setSwitchValue] = useState(false),
    [switchValue2, setSwitchValue2] = useState(false),
    [token, setToken] = useState(''),
    [userData, setUserData] = useState([]),
    [userName, setUserName] = useState(),
    [showLoading, setShowLoading] = useState(false),
    [searchText, setSearchText] = useState(''),
    [profileImage, setProfileImage] = useState(
      'http://res.cloudinary.com/https-cyberve-com/image/upload/v1584886506/pre61jvaz0nrrmoudwxr.jpg'
    );
  useEffect(() => {
    checkToken();
  }, []);

  const [visible, setIsVisible] = useState(false);

  const checkToken = async () => {
    const groupId = navigation.getParam('groupId');

    let userDetails = await getUserDetails();
    let profile = await getProfile();
    let image = await getProfileImage();
    if (typeof userDetails !== 'undefined') {
      if (typeof profile.access_token !== 'undefined') {
        let access_token = profile.access_token;
        setToken(access_token);
        setProfileImage(image.image);
        setUserName(`${userDetails.data.fName} ${userDetails.data.lName}`);
        await handleGetAllRequest(access_token, groupId);
      }
    }
  };

  const showLoadingDialogue = () => {
    setShowLoading(true);
  };

  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  const handleGetAllRequest = async (token, id) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };

    const allMember = fetch(`${GetGroupMember}${id}${'/members'}`, header);

    Promise.all([allMember])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const allMemberAPIResp = finalResps[0];
        getAllMembers(allMemberAPIResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
      });
  };

  const getAllMembers = async (memberRes) => {
    try {
      if (memberRes) {
        hideLoadingDialogue();
        setUserData(memberRes.data);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const handleBackPress = async () => {
    return goBack();
  };

  const selectUserorGroup = async (item) => {
    console.log('item', item);
    const body = JSON.stringify({
      userId: item.member.id,
    });
    await handleChat(body, item);
  };

  const handleChat = async (body, item) => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: body,
    };
    const response = await fetch(CreateThreadEndpoint, settings);
    const res = await response.json();
    console.log('hellloooooo', settings);
    if (res.meta.status >= 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message,
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      hideLoadingDialogue();
      return navigate('Chat', {
        data: res.data,
        item: item,
      });
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          message: res.meta.message,
        });
        hideLoadingDialogue();
      }
    }
  };

  const handleImageView = (item) => {
    return setShowAlert({
      showAlert: true,
      showSuccessAlert: false,
      profilePic: item.profilePhoto,
      imageTitile: item.member.fName,
    });
  };

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => selectUserorGroup(item)}
        style={styles.cardView}
      >
        <TouchableOpacity
          style={styles.headerView}
          onPress={() => handleImageView(item)}
        >
          <Image
            onPress={() => handleImageView(item)}
            source={{ uri: item.profilePhoto }}
            style={StyleSheet.flatten(styles.profileIcon)}
          />
          <View>
            <DisplayText
              onPress={() => selectUserorGroup(item)}
              styles={StyleSheet.flatten(styles.name)}
              text={`${item.member.fName} ${item.member.lName}`}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectUserorGroup(item)}
          style={styles.headerView}
        >
          <Image
            onPress={(item) => selectUserorGroup(item)}
            source={require('../../assets/images/arrow_forward.png')}
            style={StyleSheet.flatten(styles.playIcon)}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const renderuserHeader = () => {
    return userData.length > 0 ? (
      <View style={styles.userHeader}>
        <DisplayText
          styles={StyleSheet.flatten(styles.headerText)}
          text={'Users'}
        />
      </View>
    ) : null;
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <View style={styles.searchView}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image
            source={require('../../assets/images/back.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <DisplayText
          styles={StyleSheet.flatten(styles.headerText)}
          text={'Group Members'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={userData}
          renderItem={renderRow}
          keyExtractor={(data) => data.member.id}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          // ListHeaderComponent={renderuserHeader}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        />
      </View>
      <ProgressDialog
        visible={showLoading}
        title='Processing'
        message='Please wait...'
      />
      <ProfileImage
        image={showAlert.profilePic}
        title={showAlert.imageTitile}
        handleCloseNotification={handleCloseNotification}
        visible={showAlert.showAlert}
      />
      {/* <ErrorAlert
            title={'Error!'}
            message={showAlert.message}
            handleCloseNotification={handleCloseNotification}
            visible={showAlert.showAlert}
          /> */}
    </SafeAreaView>
  );
};

export default GroupMembers;
