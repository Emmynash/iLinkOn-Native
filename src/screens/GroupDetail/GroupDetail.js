'use strict';
import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { NavigationActions, StackActions } from 'react-navigation';
import moment from 'moment';
import styles from './styles';
import {
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GetGroupMember,
  GetGroupEvent,
  GetGroupDetails,
  LeaveGroupEndpoint,
  getProfile,
  getUserDetails,
  CreateThreadEndpoint,
  GetEventDetails,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  SuccessAlert,
  CustomModal,
} from '../../components';
import { NavigationEvents } from 'react-navigation';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      groupName: '',
      groupDescription: '',
      groupMember: '',
      imageLink:
        'https://gravatar.com/avatar/02bf38fddbfe9f82b94203336f9ebc41?s=200&d=retro',
      memberData: [],
      customModal: false,
      token: '',
      userid: '',
      showAlert: '',
      groupId: '',
      eventData: [],
      displayPhoto: '',
      activeEvent: false,
    };
  }

  async componentDidMount() {
    await this.checkToken();
  }

  checkToken = async () => {
    const groupId = this.props.navigation.getParam('groupId');
    const name = this.props.navigation.getParam('name');

    let userDetail = await getUserDetails();
    let profile = await getProfile();
    // console.log("checking group id group detail....", userDetail);

    if (typeof userDetail.data !== 'undefined') {
      let token = profile.access_token;
      this.setState({
        userId: userDetail.data.id,
        token: token,
        groupId: groupId,
        groupName: name,
      });
      return this.handleGetAllRequest(token, groupId);
    }
  };
  resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'Navigations',
        }),
      ],
    });
    return this.props.navigation.dispatch(resetAction);
  };

  handleGetAllRequest = async (token, id) => {
    this.showLoadingDialogue();
    let header = {
      headers: {
        Accept: 'application/json',
        Authorization: `${token}`,
      },
    };
    const groupDetail = fetch(`${GetGroupDetails}${id}`, header),
      allMember = fetch(`${GetGroupMember}${id}${'/members'}`, header),
      allEvent = fetch(`${GetGroupEvent}${id}${'/events'}`, header);

    Promise.all([groupDetail, allMember, allEvent])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const groupAPIResp = finalResps[0],
          allMemberAPIResp = finalResps[1],
          groupEventAPIResp = finalResps[2];

        this.getGroupById(groupAPIResp);
        this.getAllMembers(allMemberAPIResp);
        this.getGroupEvent(groupEventAPIResp);
      })
      .catch((error) => {
        this.hideLoadingDialogue();
        console.log(error);
      });
  };

  getGroupById = async (groupRes) => {
    try {
      if (groupRes) {
        this.hideLoadingDialogue();
        let image = ''
        if (groupRes.data.displayPhoto.split(':')[0] === 'http' ) {
          let secure_url = 'https:' + groupRes.data.displayPhoto.split(':')[1]
          image = secure_url;
        } else {
          image = groupRes.data.displayPhoto;
        }
        return this.setState({
          groupName: groupRes.data.name,
          groupDescription: groupRes.data.description,
          imageLink: image,
        });
      } else {
        this.hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };
  getAllMembers = async (memberRes) => {
    try {
      if (memberRes) {
        this.hideLoadingDialogue();
        // console.log('dfdfdfdfdfdfdfd', memberRes)
        let member = memberRes.data.slice(0, 3);
        return this.setState({
          groupMember: memberRes.data.length,
          memberData: member,
        });
      } else {
        this.hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };
  getGroupEvent = async (eventRes) => {
    try {
      if (eventRes) {
        this.hideLoadingDialogue();

        eventRes.data.map((data) => {
          const currentDate = new Date().toISOString();
          const endDate = data.dates[0].endDate;
          let isActive = false;

          if (endDate > currentDate) {
            isActive = true;
          }

          this.setState({
            eventData: eventRes.data,
            activeEvent: isActive,
          });

          // console.log(this.state.activeEvent);
        });
      } else {
        this.hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };

  hideLoadingDialogue = () => {
    return this.setState({
      showLoading: false,
    });
  };

  showLoadingDialogue() {
    return this.setState({
      showLoading: true,
    });
  }
  handleGoBack = () => {
    return this.resetNavigation();
    // this.props.navigation.goBack();
  };
  handleShowMenuModal = () => {
    alert('cooming soon');
  };
  handleNotification = () => {
    alert('hello no alert');
  };

  showCustomeModal = () => {
    this.setState({
      customModal: !this.state.customModal,
    });
  };

  closeCustomModal = () => {
    return this.setState({
      customModal: false,
    });
  };

  handleCloseModal = () => {
    return this.setState({
      showAlert: false,
    });
  };

  leaveGroup = async () => {
    const { groupId, token } = this.state;
    this.showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    let endpoint = `${LeaveGroupEndpoint}${groupId}${'/leave'}`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (typeof res.meta.status >= 300) {
      this.hideLoadingDialogue();
      this.setState({
        showAlert: true,
        message: res.meta.message.toString(),
      });
    } else if (res.meta.status == 200 || res.meta.status < 300) {
      this.hideLoadingDialogue();
      this.resetNavigation();
    } else {
      if (res.meta.message) {
        this.hideLoadingDialogue();
        this.setState({
          showAlert: true,
          message: res.meta.message.toString(),
        });
      }
    }
  };

  handleCreateEvent = () => {
    return this.props.navigation.navigate('CreateEvent', {
      groupId: this.state.groupId,
    });
  };

  handleEventDetails = (item) => {
    return this.props.navigation.navigate('EventDetail', {
      eventId: item.id,
    });
  };

  renderGroupEvents = ({ item }) => {
    return (
      <View style={styles.flatListView}>
        <TouchableOpacity
          onPress={() => this.handleEventDetails(item)}
          style={styles.cardView}
        >
          <View style={styles.div}>
            <View style={styles.cardImgView}>
              <DisplayText
                styles={styles.cardImgTxt}
                onPress={() => this.handleEventDetails(item)}
                text={moment(item.dates[0].startDate).format('Do MMM')}
              />
              <DisplayText
                styles={styles.timeTxt}
                onPress={() => this.handleEventDetails(item)}
                text={moment(item.dates[0].startDate).format('h:mm: a')}
              />
            </View>
          </View>
          <View style={styles.divide}>
            <DisplayText
              onPress={() => this.handleEventDetails(item)}
              styles={styles.divideTxt}
              text={item.name}
            />
            <TouchableOpacity style={styles.divideTxtView}>
              <Image
                source={require('../../assets/images/group.png')}
                style={StyleSheet.flatten(styles.divideIcon)}
              />
              <View>
                <DisplayText
                  styles={styles.divideOneTxt}
                  text={item.venue}
                  numberOfLines={2}
                  onPress={() => this.handleEventDetails(item)}
                />
                <DisplayText
                  styles={
                    Constants.platform.ios
                      ? { width: '65%', marginLeft: 5, fontSize: '10px' }
                      : styles.divideOneTxt
                  }
                  onPress={() => this.handleEventDetails(item)}
                  text={`Posted: ${moment(item.createdAt).format('Do MMM YY')}`}
                />
              </View>
              <TouchableOpacity>
                {item.isActive ? (
                  <DisplayText styles={styles.activeText} text={'ACTIVE'} />
                ) : (
                  <DisplayText style={styles.menu} text={''} />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // renderGroupEvents = ({ item }) => {
  //   return (
  //     <View style={styles.flatListView}>
  //       <TouchableOpacity onPress={this.handleEventDetails} style={styles.cardView}>
  //         <View style={styles.div}>
  //           <View style={styles.cardImgView}>
  //             <DisplayText styles={styles.cardImgTxt} text={'15th Jan'} />
  //             <DisplayText styles={styles.timeTxt} text={'10:00 am'} />
  //           </View>
  //         </View>
  //         <View style={styles.divide}>
  //           <DisplayText
  //             styles={styles.divideTxt}
  //             text={'Computer Appreciation Seminar'}
  //           />

  //           <View style={styles.divideTxtView}>
  //             <Image
  //               source={require('../../assets/images/group.png')}
  //               style={StyleSheet.flatten(styles.divideIcon)}
  //             />
  //             <View>
  //               <DisplayText
  //                 styles={styles.divideOneTxt}
  //                 text={'Multipurpose Hall'}
  //               />
  //               <DisplayText
  //                 styles={styles.divideOneTxt}
  //                 text={'Posted: 10th jan,2020'}
  //               />
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  selectUser = async (item) => {
    let image = ''
    if (item.member.profilePhoto.split(':')[0] === 'http') {
      let secure_url = 'https:' + item.member.profilePhoto.split(':')[1]
      image = secure_url;
    } else {
      image = item.member.profilePhoto;
    }
    const items = {
      name: item.member.fName,
      displayPhoto: image,
    };
    const body = JSON.stringify({
      userId: item.memberId,
    });
    await this.handleChat(body, items);
  };
  handleGroupChat = async () => {
    const { groupId, groupName, imageLink } = this.state;
    const items = {
      name: groupName,
      displayPhoto: imageLink,
    };
    const body = JSON.stringify({
      groupId: groupId,
    });
    await this.handleChat(body, items);
  };

  handleChat = async (body, item) => {
    const { token } = this.state;
    this.showLoadingDialogue();
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
      this.hideLoadingDialogue();
      this.setState({
        showAlert: true,
        message: res.meta.message.toString(),
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      this.hideLoadingDialogue();
      return this.props.navigation.navigate('Chat', {
        data: res.data,
        item: item,
      });
    } else {
      if (res.meta.message) {
        this.hideLoadingDialogue();
        this.setState({
          showAlert: true,
          message: res.meta.message.toString(),
        });
      }
    }
  };

  handleAllMembers = () => {
    return this.props.navigation.navigate('GroupMembers', {
      groupId: this.state.groupId,
    });
  };

  renderMember = ({ item }) => {
    let image = ''
    if (item.profilePhoto.split(':')[0] === 'http') {
      let secure_url = 'https:' + item.profilePhoto.split(':')[1]
      image = secure_url;
    } else {
      image = item.profilePhoto;
    }
    return (
      <View>
        {item.profilePhoto == null ? (
          <TouchableOpacity
            onPress={() => this.selectUser(item)}
            style={styles.imagesView}
          >
            <Image
              source={require('../../assets/images/user.png')}
              style={StyleSheet.flatten(styles.memberImage)}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.imagesView}
            onPress={() => this.selectUser(item)}
          >
            <Image
              source={{ uri: image }}
              style={StyleSheet.flatten(styles.circleView)}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    const {
      showLoading,
      imageLink,
      groupName,
      groupDescription,
      groupMember,
      memberData,
      eventData,
      customModal,
      showAlert,
    } = this.state;

    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headView}>
          <TouchableOpacity style={styles.backTp} onPress={this.handleGoBack}>
            <Image
              style={styles.backLogo}
              source={require('../../assets/images/left-arrow.png')}
            />
          </TouchableOpacity>
          <View style={styles.headerIconView}>
            <TouchableOpacity
              onPress={() => this.handleGroupChat()}
              style={styles.left}
            >
              <Image
                style={styles.menu}
                source={require('../../assets/images/chat.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.showCustomeModal()}
              style={styles.leftView}
            >
              <Image
                onPress={() => this.showCustomeModal()}
                style={styles.menu}
                source={require('../../assets/images/overflow.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textView}>
            <Image
              source={{ uri: imageLink }}
              style={StyleSheet.flatten(styles.csView)}
              // source={require('../../assets/images/flower.jpg')}
            />
            <View style={styles.gpDetailHeader}>
              <DisplayText
                text={groupName}
                numberOfLines={2}
                styles={StyleSheet.flatten(styles.userProfileText)}
                numberOfLines={2}
              />
              <DisplayText
                onPress={this.handleEditProfile}
                text={groupDescription}
                numberOfLines={2}
                styles={StyleSheet.flatten(styles.editProText)}
              />
              <View style={styles.memberView}>
                <Image
                  source={require('../../assets/images/group.png')}
                  style={StyleSheet.flatten(styles.memberIcon)}
                />
                {
                  <DisplayText
                    styles={StyleSheet.flatten(styles.memberText)}
                    text={`${groupMember}${' Members'}`}
                  />
                }
              </View>
            </View>
          </View>
          <View style={styles.holder}>
            <View style={styles.secondView}>
              <DisplayText
                text={'Members'}
                styles={StyleSheet.flatten(styles.secondViewTxt)}
              />
              <View style={styles.flatlist}>
                <FlatList
                  data={memberData}
                  renderItem={this.renderMember}
                  keyExtractor={(data) => data.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                />
                {groupMember < 3 ? (
                  <DisplayText
                    onPress={this.handleAllMembers}
                    text={'more'}
                    styles={StyleSheet.flatten(styles.more)}
                  />
                ) : (
                  <DisplayText
                    onPress={this.handleAllMembers}
                    text={`${'+ '}${groupMember - 3}${' more'}`}
                    styles={StyleSheet.flatten(styles.more)}
                  />
                )}
              </View>
              <View style={styles.listView}>
                {/* Groups Designs */}
                <View style={styles.flatlistView}>
                  <View style={styles.otherCategoryHeader}>
                    <DisplayText
                      styles={StyleSheet.flatten(styles.secondViewTxt)}
                      text={'Group Events'}
                    />
                    <DisplayText
                      styles={StyleSheet.flatten(styles.groupSubText)}
                      text={'Events you should know about'}
                    />
                  </View>
                  <FlatList
                    data={eventData}
                    renderItem={this.renderGroupEvents}
                    keyExtractor={(data) => data.id.toString()}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={this.handleCreateEvent}
          style={styles.joinBtn}
        >
          <Text onPress={this.handleCreateEvent} style={styles.joinTxt}>
            {'+'}
          </Text>
        </TouchableOpacity>
        <ProgressDialog
          visible={showLoading}
          title='Progress Dialog'
          message='Please, wait...'
        />
        <CustomModal
          onPress={() => {
            closeCustomModal();
          }}
          visible={this.state.customModal}
          modalStyle={styles.modal}
          handleCloseModal={this.closeCustomModal}
        >
          <TouchableOpacity
            onPress={this.closeCustomModal}
            style={styles.modalContainer}
          >
            <View style={styles.joinGropView}>
              {/* <SubmitButton
                onPress={() => {
                  this.closeCustomModal();
                }}
                title={'Remove Group'}
                btnStyle={styles.modalBtn}
                titleStyle={StyleSheet.flatten(styles.modalTxt)}
              /> */}
              <SubmitButton
                onPress={() => {
                  this.leaveGroup();
                }}
                title={'Exit Group'}
                btnStyle={styles.modalBtn}
                titleStyle={StyleSheet.flatten(styles.modalTxt)}
              />
            </View>
          </TouchableOpacity>
          <ProgressDialog
            visible={showLoading}
            title='Processing'
            message='Please wait...'
          />
        </CustomModal>
      </SafeAreaView>
    );
  }
}

export default GroupDetail;
