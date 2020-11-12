'use strict';
import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  DisplayText,
  ErrorAlert,
  SubmitButton,
  CustomModal,
} from '../../components';
import { useNavigation } from 'react-navigation-hooks';
import styles from './styles';
import moment from 'moment';
import { ProgressDialog } from 'react-native-simple-dialogs';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';
import {
  GetGroupsEndpoint,
  GetAllEvent,
  GetSimilarInterest,
  getProfile,
  getProfileImage,
  getUserDetails,
  ProfileEndpoint,
  JoinGroup,
  getExpoToken,
  NotificationEndpoint,
  GetGroupByID,
} from '../Utils/Utils';

function DashBoard({ navigation }) {
  const { navigate } = useNavigation();
  const [modalVisible, setModalVisible] = useState(false),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [successMessage, setSuccessMessage] = useState(''),
    [show, setShow] = useState(false),
    [customModal, setShowCustomModal] = useState(false),
    [newGroupData, setNewGroup] = useState([]),
    [eventsData, setEvent] = useState([]),
    [id, setId] = useState(''),
    [token, setToken] = useState(''),
    [refreshing, setRefresh] = useState(false),
    [memberLength, setMemberLength] = useState(1),
    [attendEvent, setAttendEvent] = useState([]),
    [schoolId, setSchoolId] = useState(''),
    [groupDetails, setGroupName] = useState({
      groupName: '',
      date: '',
      description: '',
      interest: '',
      groupId: '',
      members: 0,
    }),
    [expoToken, setExpoToken] = useState(''),
    [profileImage, setProfileImage] = useState(
      'http://res.cloudinary.com/https-cyberve-com/image/upload/v1584886506/pre61jvaz0nrrmoudwxr.jpg'
    ),
    [similarIntData, setSimilarInterest] = useState([]);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    let userDetails = await getUserDetails();
    let profile = await getProfile();
    console.log(userDetails);
    if (typeof userDetails.data !== 'undefined') {
      let image = userDetails.data.profilePhoto;
      let userId = userDetails.data.id;
      let access_token = profile.access_token;
      let schoolID = userDetails.data.school;
      setId(userId);
      setToken(access_token);
      setProfileImage(image);
      setSchoolId(schoolID);
      return await handleGetAllRequest(access_token, userId, schoolID);
    }
  };
  useEffect(() => {
    getUserExpoToken();
  }, []);

  const getUserExpoToken = async () => {
    let profile = await getProfile();
    let token = profile.access_token;
    let expoToken = await getExpoToken();
    if (expoToken) {
      let expoNotifyToken = expoToken;
      return postToken(expoNotifyToken, token);
    }
  };
  const postToken = async (expoToken, token) => {
    showLoadingDialogue();
    const body = JSON.stringify({
      token: expoToken,
    });
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: body,
    };

    const response = await fetch(NotificationEndpoint, settings);
    const res = await response.json();
    console.log('ExpoToken Response', res);
    if (res.meta.status > 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message,
      });
    } else if (res.meta.status > 200 && res.meta.status < 300) {
      hideLoadingDialogue();
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
  const _onRefresh = async () => {
    let profile = await getProfile();
    let token = profile.access_token;
    setRefresh(true);
    let schId = schoolId;
    handleGetAllRequest(token, id, schId).then(() => {
      setRefresh(false);
    });
  };

  const updateProfile = () => {
    return navigation.navigate('UpdateProfile');
  };
  // where are you search onchagne text event handler
  const searchOnChange = (text) => {
    if (text > 0) {
      setSearch({
        search: text,
        isSearchValid: true,
      });
    } else if (text < 1) {
      setSearch({
        isSearchValid: false,
        search: '',
      });
    }
  };

  const toggleDrawers = async () => {
    await navigation.toggleDrawer();
  };

  const showLoadingDialogue = () => {
    setShowLoading(true);
  };

  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  const handleProfile = () => {
    return navigate('Profile');
  };

  const handleGetAllRequest = async (token, userId, schoolID) => {
    showLoadingDialogue();
    let header = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };

    let groupApi = `${GetGroupByID}${schoolID}`;
    const latestGroup = fetch(groupApi, header),
      allEvent = fetch(GetAllEvent, header),
      similarInterest = fetch(GetSimilarInterest, header),
      userDetails = fetch(`${ProfileEndpoint}${userId}`, header);

    Promise.all([latestGroup, allEvent, similarInterest, userDetails])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const groupAPIResp = finalResps[0],
          allEventAPIResp = finalResps[1],
          similarInterestAPIResp = finalResps[2],
          userProfileApiResp = finalResps[3];
        getLatestGroups(groupAPIResp);
        getAttendingEvent(allEventAPIResp);
        getAllEvents(allEventAPIResp);
        getSimilarInterests(similarInterestAPIResp);
      })
      .catch((error) => {
        hideLoadingDialogue();
      });
  };

  const getLatestGroups = async (groupRes) => {
    try {
      if (groupRes) {
        hideLoadingDialogue();
        const groupToArray = Object.values(groupRes.data);
        return setNewGroup(groupToArray);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };
  // let data = createdGroupToArray.filter((item) => {
  //   let createdGroup = item.members.findIndex((index) => {
  //     return index.memberId == userID && index.role == 'admin'
  //   })
  //   return createdGroup !== -1
  // })
  const getAllEvents = async (eventRes) => {
    try {
      if (eventRes) {
        hideLoadingDialogue();
        // const eventToArray = Object.values(eventRes.data)
        let data = eventRes.data
          .filter((item) => {
            if (item.isActive === true) {
              return true;
            }
            return false;
          })
          .sort((first, second) => {
            var dateA = moment(first.dates[0].startDate).format(
              'YYYY/MM/D hh:mm'
            );
            var dateB = moment(second.dates[0].startDate).format(
              'YYYY/MM/D hh:mm'
            );
            const a = new Date(dateA).getTime();
            const b = new Date(dateB).getTime();
            return a - b;
          });
        setEvent(data);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const getSimilarInterests = async (simIntRes) => {
    try {
      if (simIntRes) {
        hideLoadingDialogue();
        const similarInterestToArray = Object.values(simIntRes.data);
        return setSimilarInterest(similarInterestToArray);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };

  const getAttendingEvent = async (attendRes) => {
    let userDetails = await getUserDetails();
    let userId = userDetails.data.id;
    try {
      if (attendRes) {
        hideLoadingDialogue();
        let data = attendRes.data
          .filter((item) => {
            if (item.isActive === true) {
              return true;
            }
            return false;
          })
          .sort((first, second) => {
            var dateA = moment(first.dates[0].startDate).format(
              'YYYY/MM/D hh:mm'
            );
            var dateB = moment(second.dates[0].startDate).format(
              'YYYY/MM/D hh:mm'
            );
            const a = new Date(dateA).getTime();
            const b = new Date(dateB).getTime();
            return a - b;
          })
          .filter((item) => {
            let attendEventMemebers = item.eventMembers.findIndex((index) => {
              return index.memberId == userId;
            });
            return attendEventMemebers !== -1;
          });
        return setAttendEvent(data);
      } else {
        hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      hideLoadingDialogue();
    }
  };
  // sorted event by start day of the event
  const sortEventArray = (eventToArray) => {
    let sortedEvent = eventToArray
      .sort((first, second) => {
        var dateA = moment(first.dates.startDate).format('YYYY/MM/D hh:mm');
        var dateB = moment(second.dates.startDate).format('YYYY/MM/D hh:mm');
        const a = new Date(dateA).getTime();
        const b = new Date(dateB).getTime();
        return a - b;
      })
      .filter((item) => {
        if (item.isActive === true) {
          return true;
        }
        return false;
      });
    return setAttendEvent(sortedEvent);
  };

  const showCustomeModal = async (item) => {
    console.log('group', item.isMember);
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
        name: item.name,
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
    return setShowCustomModal(false);
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
          <Rect x='0' y='0' rx='5' ry='5' width='100%' height='100%' />
        </SvgAnimatedLinearGradient>
      </View>
    );
  };
  const renderEmptyEvent = () => {
    return (
      <View style={styles.emptyView}>
        <SvgAnimatedLinearGradient height={'100%'}>
          <Rect x='20' y='0' rx='5' ry='5' width='100%' height='100%' />
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
      </View>
    );
  };
  const handleEventDetails = (item) => {
    return navigation.navigate('EventDetail', {
      eventId: item.id,
    });
  };
  const renderEvent = ({ item }) => {
    return (
      <View style={styles.flatListView}>
        <TouchableOpacity
          onPress={() => handleEventDetails(item)}
          style={styles.cardView}
        >
          <View style={styles.div}>
            <View style={styles.cardImgView}>
              <DisplayText
                styles={styles.cardImgTxt}
                onPress={() => handleEventDetails(item)}
                text={moment(item.dates[0].startDate).format('Do MMM')}
              />
              <DisplayText
                styles={styles.timeTxt}
                ooPress={() => handleEventDetails(item)}
                text={moment(item.dates[0].startDate).format('h:mm: a')}
              />
            </View>
          </View>
          <View style={styles.divide}>
            <DisplayText
              onPress={() => handleEventDetails(item)}
              styles={styles.divideTxt}
              text={item.name}
            />
            <View style={styles.divideTxtView}>
              <Image
                onPress={() => handleEventDetails(item)}
                source={require('../../assets/images/group.png')}
                style={StyleSheet.flatten(styles.divideIcon)}
              />
              <View>
                <DisplayText
                  onPress={() => handleEventDetails(item)}
                  styles={styles.divideOneTxt}
                  text={item.venue}
                />
                <DisplayText
                  onPress={() => handleEventDetails(item)}
                  styles={styles.divideOneTxt}
                  text={`Posted: ${moment(item.dates[0].createdAt).format(
                    'Do MMM YY'
                  )}`}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const renderAllEvent = ({ item }) => {
    return (
      <View style={styles.eventRowView}>
        <View style={styles.flatlistGroup}>
          <View style={styles.itemImageEvent}>
            <Image
              style={styles.faceImageEvent}
              source={{ uri: item.displayPhoto }}
            />
          </View>
          <View style={styles.itemDetails}>
            <DisplayText
              text={item.name}
              styles={StyleSheet.flatten(styles.titleText)}
            />
            <DisplayText
              numberOfLines={2}
              text={item.description}
              styles={StyleSheet.flatten(styles.eventDesc)}
            />
          </View>
          <View style={styles.eventDetails}>
            <Image
              source={require('../../assets/images/group.png')}
              style={StyleSheet.flatten(styles.divideIcon)}
            />
            <DisplayText styles={styles.divideOneTxt} text={item.venue} />
          </View>
          <View style={styles.dateTime}>
            <DisplayText
              styles={styles.eventCardTxt}
              text={moment(item.dates[0].startDate).format('Do MMM')}
            />
            <DisplayText
              styles={styles.eventTimeTxt}
              text={moment(item.dates[0].startDate).format('h:mm: a')}
            />
          </View>
        </View>
      </View>
    );
  };
  const renderInterest = ({ item }) => {
    return (
      <View style={styles.interestView}>
        <Image
          // onPress={}
          source={{ uri: profileImage }}
          style={StyleSheet.flatten(styles.interestImage)}
        />
        <TouchableOpacity>
          <DisplayText
            // onPress={}
            styles={StyleSheet.flatten(styles.nameText)}
            text={item.name}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <View style={styles.searchView}>
        <TouchableOpacity onPress={toggleDrawers}>
          <Image
            source={require('../../assets/images/menu.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerView} onPress={updateProfile}>
          <Image
            source={{ uri: profileImage }}
            style={StyleSheet.flatten(styles.profileIcon)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <View>
            <View style={styles.listView}>
              {/* Groups Designs */}
              <View style={styles.flatlistView}>
                <View style={styles.categoryHeader}>
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupText)}
                    text={'Latest Groups'}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupSubText)}
                    text={'Groups created in your institution'}
                  />
                </View>
                <FlatList
                  data={newGroupData}
                  renderItem={renderRow}
                  keyExtractor={(data) => data.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  ListEmptyComponent={renderEmpty}
                  contentContainerStyle={{ paddingLeft: 20 }}
                />
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
                            text={`${'Created On'} ${moment(
                              groupDetails.date
                            ).format('MMMM Do YYYY')}`}
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
            </View>
            <View style={styles.listView}>
              {/* Groups Designs */}
              <View style={styles.flatlistView}>
                <View style={styles.otherCategoryHeader}>
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupText)}
                    text={'Attending Events'}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupSubText)}
                    text={'Events you are attending'}
                  />
                </View>
                <FlatList
                  data={attendEvent}
                  renderItem={renderEvent}
                  keyExtractor={(data) => data.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  ListEmptyComponent={renderEmpty}
                  // style={styles.customStyle}
                  extraData={[attendEvent]}
                  contentContainerStyle={{ paddingLeft: 20 }}
                />
              </View>
            </View>
            {/* All Event */}
            <View style={styles.listView}>
              {/* Groups Designs */}
              <View style={styles.flatlistView}>
                <View style={styles.otherCategoryHeader}>
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupText)}
                    text={'All Group Events'}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupSubText)}
                    text={'Events you should know about'}
                  />
                </View>
                <FlatList
                  data={eventsData}
                  renderItem={renderAllEvent}
                  keyExtractor={(data) => data.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={false}
                  ListEmptyComponent={renderEmptyEvent}
                  extraData={[eventsData]}
                  // style={styles.customStyle}
                  contentContainerStyle={{
                    marginBottom: 20,
                    paddingHorizontal: 20,
                  }}
                />
              </View>
            </View>
            {/* 
            <View style={styles.interestListView}>
              <View style={styles.flatlistView}>
                <View style={styles.otherCategoryHeader}>
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupText)}
                    text={'Similar Interests'}
                  />
                  <DisplayText
                    styles={StyleSheet.flatten(styles.groupSubText)}
                    text={'People near you with similar interest'}
                  />
                </View>
                <FlatList
                  data={similarIntData}
                  renderItem={renderInterest}
                  keyExtractor={data => data.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  contentContainerStyle={{ paddingLeft: 20 }}
                />
              </View>
            </View> */}
          </View>
          {/* <Text onPress={gotoevent} style={styles.stroll}>
            {' createevent'}
          </Text> */}
          <ProgressDialog
            visible={showLoading}
            title='Processing'
            message='Please wait...'
          />
          {/* <ErrorAlert
            title={'Error!'}
            message={showAlert.message}
            handleCloseNotification={handleCloseNotification}
            visible={showAlert.showAlert}
          /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default DashBoard;
