'use strict';
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';
import {
  ErrorAlert,
  CustomModal,
  SuccessAlert,
  InputField,
} from '../../components';
import moment from 'moment';
import { useNavigation } from 'react-navigation-hooks';
import { SubmitButton, DisplayText } from '../../components';
import { ProgressDialog } from 'react-native-simple-dialogs';
import styles from './styles';
import theme from '../../assets/theme';
import colors from '../../assets/colors';

import {
  GetGroupsEndpoint,
  YourGroupEndpoint,
  getUserDetails,
  JoinGroup,
  getProfile,
  GetGroupByID,
} from '../Utils/Utils';
function Groups({ navigation }) {
  const { navigate } = useNavigation();
  const [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [yourGroupData, setYourGroupData] = useState([]),
    [groupData, setGroupData] = useState([]),
    [otherGroupData, setOtherGroupData] = useState([]),
    [createdGroupData, setCreatedGroupData] = useState([]),
    [token, setToken] = useState(''),
    [customModal, setShowCustomModal] = useState(false),
    [successMessage, setSuccessMessage] = useState(''),
    [userID, setUserId] = useState(),
    [refreshing, setRefresh] = useState(false),
    [schId, setSchoolID] = useState(''),
    [groupDetails, setGroupName] = useState({
      groupName: '',
      date: '',
      description: '',
      interest: '',
      groupId: '',
      members: 0,
    }),
    [searchText, setSearchText] = useState('');

  useEffect(() => {
    checkToken();
  }, []);
  useEffect(() => {}, [otherGroupData]);

  const checkToken = async () => {
    let profile = await getProfile();
    let userDetails = await getUserDetails();
    console.log('user iiddddd', userDetails);
    if (userDetails !== 'undefined') {
      let userId = userDetails.data.id;
      let schoolID = userDetails.data.school;
      let access_token = profile.access_token;
      setToken(access_token);
      setUserId(userId);
      setSchoolID(schoolID);
      return handleGetAllRequest(access_token, schoolID);
    }
  };

  const _onRefresh = async () => {
    let profile = await getProfile();
    let token = profile.access_token;
    let schoolID = schId;
    setRefresh(true);
    handleGetAllRequest(token, schoolID).then(() => {
      setRefresh(false);
    });
  };

  const openYourGroup = () => {
    return navigate('GroupDetail');
  };
  const showLoadingDialogue = () => {
    setShowLoading(true);
  };
  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  const handleGetAllRequest = async (token, schoolID) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    let endpoint = `${GetGroupByID}${schoolID}`;
    const yourGroup = fetch(endpoint, header);
    const latestGroup = fetch(endpoint, header);
    const createdGroup = fetch(endpoint, header);
    Promise.all([yourGroup, latestGroup, createdGroup])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const groupAPIResp = finalResps[0],
          yourGroupAPIResp = finalResps[1],
          createdGroupApiResp = finalResps[2];

        getLatestGroups(groupAPIResp);
        getYourGroup(yourGroupAPIResp);
        getCreatedGroups(createdGroupApiResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
      });
  };

  const getLatestGroups = async (groupRes) => {
    try {
      if (groupRes) {
        hideLoadingDialogue();
        const groupsToArray = Object.values(groupRes.data);
        // result = groupsToArray.filter((groupsToArray) => groupsToArray)
        setGroupData(groupsToArray);
        return setOtherGroupData(groupsToArray);
      } else {
        hideLoadingDialogue();
        console.log('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const getYourGroup = async (yourGroupRes) => {
    try {
      if (yourGroupRes) {
        const yourGroupToArray = Object.values(yourGroupRes.data);
        let groupByMember = yourGroupToArray.filter((item) => {
          if (item.isMember && item.isMember === true) {
            return true;
          }
          return false;
        });
        setYourGroupData(groupByMember);
        return hideLoadingDialogue();
      } else {
        hideLoadingDialogue();
        // return alert('Create Your Group to view Group ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const getCreatedGroups = async (createdGroupRes) => {
    try {
      if (createdGroupRes) {
        // const createdGroupToArray = Object.values(createdGroupRes);
        let data = createdGroupRes.data.filter((item) => {
          if (item.role === 'admin') {
            return true;
          }
          return false;
        });
        setCreatedGroupData(data);
        // let data = createdGroupToArray.filter((item) => {
        //   let createdGroup = item.members.findIndex((index) => {
        //     return index.memberId == userID && index.role == 'admin'
        //   })
        //   return createdGroup !== -1
        // })
        return hideLoadingDialogue();
      } else {
        hideLoadingDialogue();
        return alert('Create Your Group to view Group ');
      }
    } catch (error) {
      //console.log({ error: error });
      hideLoadingDialogue();
    }
  };

  const toggleDrawers = async () => {
    await navigation.toggleDrawer();
  };

  const showCustomeModal = async (item) => {
    const memberLength = item.members.length;
    if (item.isMember === true) {
      setGroupName({
        groupName: item.name,
        date: item.createdAt,
        description: item.description,
        groupId: item.id,
        members: memberLength,
        // interest: item.interest
      });
      navigation.navigate('GroupDetail', {
        groupId: item.id,
      });
    } else {
      setShowCustomModal(!customModal);
      return setGroupName({
        groupName: item.name,
        date: item.createdAt,
        description: item.description,
        groupId: item.id,
        members: memberLength,

        // interest: item.interest
      });
    }
  };
  const handleCloseModal = () => {
    setShowCustomModal(false);
    return setShowAlert({
      showAlert: false,
    });
  };
  const closeCustomModal = () => {
    return setShowCustomModal(false);
  };

  const handleCloseNotification = () => {
    setShowCustomModal(false);
    return setShowAlert({
      showAlert: false,
      showSuccessAlert: false,
    });
  };
  const handleJoinGroup = async (id) => {
    try {
      showLoadingDialogue();
      await joinGroup(id);
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const joinGroup = async (id) => {
    showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    let endpoint = `${JoinGroup}${id}${'/join'}`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (typeof res.meta.status >= 300) {
      // console.log('join group statussss', res.meta.status);
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message.toString(),
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      hideLoadingDialogue();
      closeCustomModal();
      return navigation.navigate('GroupDetail', {
        groupId: id,
      });
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          message: res.meta.message.toString(),
        });
      }
    }
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyView}>
        <SvgAnimatedLinearGradient height={'100%'}>
          {/* <Circle cx="30" cy="40" r="30"/> */}
          <Rect x='0' y='0' rx='5' ry='5' width='100%' height='100%' />
        </SvgAnimatedLinearGradient>
      </View>
    );
  };
  const renderRow = ({ item }) => {
    return (
      <View style={styles.renderRowView}>
        <View style={styles.flatlistGroup}>
          <TouchableOpacity
            onPress={() => showCustomeModal(item)}
            style={styles.itemImage}
          >
            <Image
              onPress={() => showCustomeModal(item)}
              style={styles.faceImage}
              source={{ uri: item.displayPhoto }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showCustomeModal(item)}
            style={styles.itemDetails}
          >
            <DisplayText
              text={item.name}
              onPress={() => showCustomeModal(item)}
              styles={StyleSheet.flatten(styles.titleText)}
            />
            <DisplayText
              onPress={() => showCustomeModal(item)}
              text={item.description}
              styles={StyleSheet.flatten(styles.itemType)}
              numberOfLines={1}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCreatedGroup = ({ item }) => {
    return (
      <View style={styles.renderRowView}>
        <View style={styles.flatlistGroup}>
          <TouchableOpacity
            onPress={() => showCustomeModal(item)}
            style={styles.itemImage}
          >
            <Image
              onPress={() => showCustomeModal(item)}
              style={styles.faceImage}
              source={{ uri: item.displayPhoto }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showCustomeModal(item)}
            style={styles.itemDetails}
          >
            <DisplayText
              text={item.name}
              onPress={() => showCustomeModal(item)}
              styles={StyleSheet.flatten(styles.titleText)}
            />
            <DisplayText
              onPress={() => showCustomeModal(item)}
              text={item.description}
              styles={StyleSheet.flatten(styles.itemType)}
              numberOfLines={1}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOtherGroups = ({ item }) => {
    return (
      <View style={styles.flatListView}>
        <TouchableOpacity
          onPress={() => showCustomeModal(item)}
          style={styles.itemImage}
        >
          <Image
            onPress={() => showCustomeModal(item)}
            style={styles.faceImage}
            source={{ uri: item.displayPhoto }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showCustomeModal(item)}
          style={styles.itemDetails}
        >
          <DisplayText
            text={item.name}
            onPress={() => showCustomeModal(item)}
            styles={StyleSheet.flatten(styles.titleText)}
            numberOfLines={1}
          />

          <DisplayText
            onPress={() => showCustomeModal(item)}
            text={item.description}
            styles={StyleSheet.flatten(styles.itemType)}
            numberOfLines={1}
          />
        </TouchableOpacity>
      </View>
    );
  };
  // search filter

  const searchFilterFunction = (text) => {
    console.log('other group data', otherGroupData);
    setSearchText(text);
    const newData = otherGroupData.filter((item) => {
      const itemData = `${item.name.toUpperCase()} ${item.description.toUpperCase()}`;
      const textData = text.toUpperCase();
      console.log('text...', itemData);
      return itemData.indexOf(textData) > -1;
    });
    setGroupData(newData);
  };

  const handleCreateButton = () => {
    return navigate('CreateGroup');
  };
  // search filter

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.searchView}>
        <TouchableOpacity style={{ padding: 8 }} onPress={toggleDrawers}>
          <Image
            onPress={toggleDrawers}
            source={require('../../assets/images/menu.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <View style={styles.search}>
          <InputField
            placeholder={'Search Group'}
            placeholderTextColor={theme.secondaryTextColor}
            textColor={theme.primaryTextColor}
            inputType={'name'}
            keyboardType={'default'}
            onChangeText={searchFilterFunction}
            autoCorrect={false}
            height={40}
            width={'80%'}
            borderBottomWidth={0}
            paddingLeft={8}
          />
        </View>
      </View>
      <View style={styles.wrapper}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <View style={styles.listView}>
            <View style={styles.categoryHeader}>
              <DisplayText
                styles={StyleSheet.flatten(styles.groupText)}
                text={'Joined Groups'}
              />
              <DisplayText
                styles={StyleSheet.flatten(styles.groupSubText)}
                text={'View joined groups'}
              />
            </View>
            <FlatList
              data={yourGroupData}
              renderItem={renderRow}
              keyExtractor={(data) => data.id}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ paddingLeft: 16 }}
              ListEmptyComponent={renderEmpty}
            />
          </View>

          <View style={styles.listView}>
            <View style={styles.flatlistView}>
              <View style={styles.categoryHeader}>
                <DisplayText
                  styles={StyleSheet.flatten(styles.groupText)}
                  text={'Created Groups'}
                />
                <DisplayText
                  styles={StyleSheet.flatten(styles.groupSubText)}
                  text={'Groups created by you'}
                />
              </View>
              <FlatList
                data={createdGroupData}
                renderItem={renderCreatedGroup}
                keyExtractor={(data) => data.id}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={{ paddingLeft: 16 }}
              />
            </View>
          </View>

          <View style={styles.listView2}>
            <View style={styles.flatlistView}>
              <View style={styles.otherCategoryHeader}>
                <DisplayText
                  styles={StyleSheet.flatten(styles.groupText)}
                  text={'Other Groups'}
                />
                <DisplayText
                  styles={StyleSheet.flatten(styles.groupSubText)}
                  text={'View all groups'}
                />
              </View>
              <FlatList
                data={groupData}
                renderItem={renderOtherGroups}
                keyExtractor={(data) => data.id}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                numColumns={2}
                extraData={groupData}
                columnWrapperStyle={styles.row} // space them out evenly
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.btnView}>
          <SubmitButton
            onPress={() => {
              handleCreateButton();
            }}
            title={'+'}
            btnStyle={styles.btnStyle}
            titleStyle={StyleSheet.flatten(styles.btnText)}
          />
        </View>
      </View>
      <CustomModal
        onPress={() => {
          closeCustomModal();
        }}
        visible={customModal}
        modalStyle={styles.modal}
        handleCloseModal={handleCloseModal}
      >
        <View onPress={closeCustomModal} style={styles.modalContainer}>
          <View style={styles.joinGropView}>
            <View style={styles.imageView}>
              <Image
                source={require('../../assets/images/groupschool.jpeg')}
                style={StyleSheet.flatten(styles.modalImage)}
              />
            </View>
            <View style={styles.joinView}>
              <View style={styles.groupDetailView}>
                <View style={styles.groupName}>
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupText)}
                    text={groupDetails.groupName}
                    numberOfLines={1}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupSubText)}
                    text={`${'Created On'} ${moment(groupDetails.date).format(
                      'MMMM Do YYYY'
                    )}`}
                  />
                </View>

                <View style={styles.groupInterest}>
                  <Image
                    source={require('../../assets/images/user.png')}
                    style={StyleSheet.flatten(styles.interestIcon)}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.interestText)}
                    text={` ${groupDetails.members}`}
                  />
                </View>
              </View>
              <View style={styles.groupDescription}>
                <DisplayText
                  styles={StyleSheet.flatten(styles.descHeader)}
                  text={'Description'}
                />
                <DisplayText
                  styles={StyleSheet.flatten(styles.description)}
                  text={groupDetails.description}
                  numberOfLines={2}
                />
              </View>
              <View style={styles.buttonsView}>
                <SubmitButton
                  onPress={() => {
                    closeCustomModal();
                  }}
                  title={'Cancel'}
                  btnStyle={styles.cancelBtn}
                  titleStyle={StyleSheet.flatten(styles.cancelTxt)}
                />
                <SubmitButton
                  onPress={() => {
                    handleJoinGroup(groupDetails.groupId);
                  }}
                  title={'JOIN'}
                  btnStyle={styles.joinBtn}
                  titleStyle={StyleSheet.flatten(styles.joinTxt)}
                />
              </View>
            </View>
          </View>
        </View>
        <ProgressDialog
          visible={showLoading}
          title='Processing'
          message='Please wait...'
        />
      </CustomModal>
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
    </SafeAreaView>
  );
}

export default Groups;
