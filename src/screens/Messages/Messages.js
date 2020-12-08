'use strict';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import styles from './styles';
import { useNavigation } from 'react-navigation-hooks';
import { ProgressDialog } from 'react-native-simple-dialogs';

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
  ProfileEndpoint,
  CreateThreadEndpoint,
  GetGroupsEndpoint,
  GetThreadMessage,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
  ProfileImage,
} from '../../components';

const Messages = () => {
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
      imageTitile: '',
      profilePic: '',
    }),
    [switchValue, setSwitchValue] = useState(false),
    [switchValue2, setSwitchValue2] = useState(false),
    [token, setToken] = useState(''),
    [userData, setUserData] = useState([]),
    [groupData, setGroupData] = useState([]),
    [userName, setUserName] = useState(''),
    [userId, setUserId] = useState(''),
    [showLoading, setShowLoading] = useState(false),
    [searchText, setSearchText] = useState(''),
    [profileImage, setProfileImage] = useState(
      'http://res.cloudinary.com/https-cyberve-com/image/upload/v1584886506/pre61jvaz0nrrmoudwxr.jpg'
    );
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    let userDetails = await getUserDetails();
    let profile = await getProfile();
    let image = await getProfileImage();
    if (typeof userDetails !== 'undefined') {
      let access_token = profile.access_token;
      let id = userDetails.data.id;
      setToken(access_token);
      console.log(image.image);
      setProfileImage(image.image);
      setUserId(id);
      setUserName(`${userDetails.data.fName} ${userDetails.data.lName}`);
      await handleGetAllRequest(access_token);
    }
  };

  const showLoadingDialogue = () => {
    setShowLoading(true);
  };

  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  const handleGetAllRequest = async (token) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };
    const allGroup = fetch(GetThreadMessage, header),
      allUser = fetch(ProfileEndpoint, header);

    Promise.all([allGroup, allUser])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const groupAPIResp = finalResps[0],
          allUserAPIResp = finalResps[1];
        getThread(groupAPIResp);
        getAllUsers(allUserAPIResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
      });
  };

  const getThread = async (groupRes) => {
    try {
      if (groupRes) {
        hideLoadingDialogue();
        const groupToArray = Object.values(groupRes.data);
        let data = groupToArray.filter((item) => {
          if (
            item.secondParticipantId === null ||
            item.secondParticipantId === userId
          ) {
            return false;
          }
          return true;
        });
        console.log('hello checking mesage', data);
        return setUserData(data);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const getAllUsers = async (userRes) => {
    try {
      if (userRes) {
        hideLoadingDialogue();
        const usersToArray = Object.values(userRes.data);
        // setUserData(usersToArray)
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const toggleDrawers = async () => {
    await navigation.toggleDrawer();
  };
  const toggleSwitch1 = (value) => {
    setSwitchValue(value);
  };
  const toggleSwitch2 = (value) => {
    setSwitchValue2(value);
  };
  const selectUserorGroup = async (item) => {
    const body = JSON.stringify({
      userId: item.secondParticipantId,
    });
    await handleChat(body, item);

    // const body = JSON.stringify({
    //   'userId': item.id
    // })
    // await handleChat(body, item)
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
    let image = ''
    if (item.secondParticipantProfilepic.split(':')[0] === 'http') {
      let secure_url = 'https:' + item.secondParticipantProfilepic.split(':')[1]
      image = secure_url;
    } else {
      image = item.secondParticipantProfilepic
    }
    return setShowAlert({
      showAlert: true,
      showSuccessAlert: false,
      profilePic: image,
      imageTitile: item.secondParticipantfName,
    });
  };

  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  const renderRow = ({ item }) => {
    let image = ''
    if (item.secondParticipantProfilepic.split(':')[0] === 'http') {
      let secure_url = 'https:' + item.secondParticipantProfilepic.split(':')[1]
      image = secure_url;
    } else {
      image = item.secondParticipantProfilepic
    }
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
            source={{
              uri: image,
            }}
            style={StyleSheet.flatten(styles.profileIcon)}
          />
          <View>
            <DisplayText
              onPress={() => selectUserorGroup(item)}
              styles={StyleSheet.flatten(styles.name)}
              text={item.secondParticipantfName}
            />
            {/* <DisplayText
              onPress={() => selectUserorGroup(item.id)}
              styles={StyleSheet.flatten(styles.messageTxt)}
              text={'hello are you there'}
            /> */}
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
        <TouchableOpacity style={{ padding: 8 }} onPress={toggleDrawers}>
          <Image
            onPress={toggleDrawers}
            source={require('../../assets/images/menu.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <DisplayText
          styles={StyleSheet.flatten(styles.headerText)}
          text={'Messages'}
        />
      </View>
      <View style={{ flex: 1 }}>
        {/* <FlatList
          data={groupData.map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
          }
          renderItem={renderRow} Random Flatlist
          keyExtractor={data => data.name || data.fName}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        /> */}
        {/* <ScrollView> */}
        {/* <FlatList
            data={groupData}
            renderItem={renderRow}
            keyExtractor={data => data.name || data.fName}
            showsHorizontalScrollIndicator={false}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
          /> */}
        <FlatList
          data={userData}
          renderItem={renderRow}
          keyExtractor={(data) => data.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          ListHeaderComponent={renderuserHeader}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        />
        {/* </ScrollView> */}
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

export default Messages;
