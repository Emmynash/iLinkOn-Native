'use strict';
import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { NavigationActions, StackActions } from 'react-navigation';
import { ProgressDialog } from 'react-native-simple-dialogs';
import styles from './styles';
import moment from 'moment';
import {
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {
  getUserDetails,
  saveProfileImage,
  GetEventDetails,
  getProfile,
  GetAttendEvent,
  CreateCommentEndpoint,
} from '../Utils/Utils';
import {
  DisplayText,
  ErrorAlert,
  InputField,
  SubmitButton,
  CustomModal,
} from '../../components';
import { NavigationEvents } from 'react-navigation';

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      profileImage: null,
      name: '',
      groupName: '',
      showLoading: false,
      groupDescription: '',
      isGroupNameValid: false,
      isGroupDescriptionValid: false,
      date: 'new Date(1598051730000)',
      mode: 'date',
      show: false,
      count: [],
      memberData: [],
      commenData: [],
      customModal: false,
      eventDetail: [],
      eventDate: '2020-11-01T06:00:00.519Z',
      token: '',
      eventId: '',
      comment: '',
      errorMessage: '',
      showAlert: false,
      activeEvent: false,
    };
  }

  async componentDidMount() {
    await this.checkToken();
  }
  checkToken = async () => {
    const eventId = this.props.navigation.getParam('eventId');
    let profile = await getProfile();
    let details = await getUserDetails();
    if (typeof profile.access_token !== 'undefined') {
      let access_token = profile.access_token;
      this.setState({
        token: access_token,
        eventId: eventId,
        name: details.data.fName,
      });
      return this.handleGetAllRequest(access_token, eventId);
    }
  };
  resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'GroupDetail',
        }),
      ],
    });
    return this.props.navigation.dispatch(resetAction);
  };

  getPermissionAsync = async () => {
    const { translations } = this.props;
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert(translations.permission);
        return false;
      } else {
        return this.pickImage();
      }
    } else {
      return this.pickImage();
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.cancelled) {
      this.hadnleSaveProfileImage(result.base64);
      await this.handleUploadImage();
    }
  };

  handleSaveProfileImage = (base64Image) => {
    saveProfileImage(base64Image);
    return this.setState({
      profileImage: base64Image,
    });
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

  resetEventNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({
          routeName: 'EventDetail',
        }),
      ],
    });
    return this.props.navigation.dispatch(resetAction);
  };
  handleCloseModal = () => {
    return setShowAlert({
      showAlert: false,
    });
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

  handleGetAllRequest = async (token, eventId) => {
    this.showLoadingDialogue();
    let header = {
      headers: {
        Accept: 'application/json',
        Authorization: `${token}`,
      },
    };
    const eventDetail = fetch(`${GetEventDetails}${eventId}`, header),
      attendEvent = fetch(`${GetAttendEvent}${eventId}/rsvp`, header);

    Promise.all([eventDetail, attendEvent])
      .then((value) => Promise.all(value.map((value) => value.json())))
      .then((finalResps) => {
        const eventDetailAPIResp = finalResps[0],
          attendMembersAPIResp = finalResps[1];

        this.getEventDetails(eventDetailAPIResp);
        this.getAttendingMembers(attendMembersAPIResp);
      })
      .catch((error) => {
        this.hideLoadingDialogue();
      });
  };

  getEventDetails = async (groupRes) => {
    try {
      if (groupRes) {
        this.hideLoadingDialogue();
        console.log('Event details', groupRes.data.dates[0].startDate);
        return this.setState({
          eventDetail: groupRes.data,
          eventDate: groupRes.data.dates[0].startDate,
          commenData: groupRes.data.comments,
          activeEvent: groupRes.data.isActive,
        });
      } else {
        this.hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      this.hideLoadingDialogue();
      console.log({ error: error });
    }
  };

  getAttendingMembers = async (memberRes) => {
    try {
      if (memberRes) {
        this.hideLoadingDialogue();
        memberRes.data.slice(0, 3);
        let member = memberRes.data.slice(0, 3);
        return this.setState({
          memberData: member,
          count: memberRes.data,
        });
      } else {
        this.hideLoadingDialogue();
        alert('Failed to retrieve ');
      }
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };

  handleCreateGroup = () => {
    return this.props.navigation.navigate('CreateGroup');
  };

  handleGroupNameChange = (groupName) => {
    if (groupName.length > 0) {
      this.setState({
        isGroupNameValid: true,
        groupName: groupName,
      });
    } else {
      if (groupName.length < 1) {
        this.setState({
          isGroupNamevalid: false,
          groupName: '',
        });
      }
    }
  };

  handleGroupDescriptionChange = (groupDescription) => {
    if (groupDescription.length > 0) {
      this.setState({
        isGroupDescriptionValid: true,
        groupDescription: groupDescription,
      });
    } else {
      if (groupDescription.length < 1) {
        this.setState({
          isGroupDescriptionvalid: false,
          groupDescription: '',
        });
      }
    }
  };

  handleOnbackPress = () => {
    return this.props.navigation.goBack();
  };

  handleAttendEvent = async () => {
    this.showLoadingDialogue();
    const body = {};
    try {
      this.attendEvent(body);
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };

  attendEvent = async (body) => {
    const { eventId, token, name } = this.state;
    this.showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body,
    };
    let endpoint = `${GetAttendEvent}${eventId}/rsvp`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (res.meta.status >= 300) {
      this.hideLoadingDialogue();
      this.setState({
        showAlert: true,
        errorMessage: res.meta.message.toString(),
      });
    } else if (res.meta.status === 200 || res.meta.status < 300) {
      this.hideLoadingDialogue();
      this.closeCustomModal();
      return this.setState({
        showAlert: true,
        errorMessage: `${name} will be attending`,
      });
    } else {
      this.hideLoadingDialogue();
      this.setState({
        showAlert: true,
        errorMessage: res.meta.message.toString(),
      });
    }
  };

  handlePostComment = () => {
    const { comment } = this.state;
    if (comment === '') {
      return this.setState({
        showAlert: true,
        errorMessage: 'Comment field is empty',
      });
    }
    this.showLoadingDialogue();
    const body = JSON.stringify({
      comment: comment,
    });
    try {
      this.comment(body);
    } catch (error) {
      this.hideLoadingDialogue();
    }
  };
  comment = async (body) => {
    const { eventId, token } = this.state;
    this.showLoadingDialogue();
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body,
    };
    let endpoint = `${CreateCommentEndpoint}${eventId}/comments`;

    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (res.meta.status >= 300) {
      this.hideLoadingDialogue();
      this.setState({
        showAlert: true,
        errorMessage: res.meta.message,
      });
    } else if (res.meta.status >= 200 || res.meta.status < 300) {
      this.closeCustomModal();
      return this.handleGetAllRequest(token, eventId);
    } else {
      if (res.meta.message) {
        this.hideLoadingDialogue();
        this.setState({
          showAlert: true,
          errorMessage: res.meta.message,
        });
      }
    }
  };

  onCommentChange = (text) => {
    if (text.length > 0) {
      return this.setState({
        comment: text,
      });
    } else {
      if (text.length < 1) {
        return this.setState({
          comment: '',
        });
      }
    }
  };

  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
    });
  };

  renderMember = ({ item }) => {
    return (
      <View style={styles.imagesView}>
        {item.user.profilePhoto === null ? (
          <Image
            onPress={this.handleOnbackPress}
            style={styles.noIimage}
            source={require('../../assets/images/user.png')}
          />
        ) : (
          <Image
            source={{ uri: item.user.profilePhoto }}
            style={StyleSheet.flatten(styles.circleView)}
          />
        )}
      </View>
    );
  };

  renderComments = ({ item }) => {
    return (
      <View style={styles.commentView}>
        {item.profilePhoto === null ? (
          <Image
            onPress={this.handleOnbackPress}
            style={styles.noIimage}
            source={require('../../assets/images/user.png')}
          />
        ) : (
          <Image
            source={{ uri: item.profilePhoto }}
            style={StyleSheet.flatten(styles.circleView)}
          />
        )}
        <View style={styles.commentDetail}>
          <DisplayText styles={styles.commentText} text={item.comment.trim()} />
          <DisplayText
            styles={styles.commentTimeTxt}
            text={moment(item.createdAt).format('h:mm: a')}
          />
        </View>
      </View>
    );
  };
  toggleButtonState = () => {
    const { activeEvent } = this.state;
    if (activeEvent) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    const {
      memberData,
      showAlert,
      eventDetail,
      showLoading,
      count,
      eventDate,
      errorMessage,
      activeEvent,
    } = this.state;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headView}>
          <TouchableOpacity onPress={this.handleOnbackPress}>
            <Image
              style={styles.backLogo}
              source={require('../../assets/images/left-arrow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.menu}
              source={require('../../assets/images/notification.png')}
            />
            {activeEvent === false ? (
              <TouchableOpacity style={styles.badge}></TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.badgeGreen}></TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.flatListView}>
            <TouchableOpacity style={styles.cardView}>
              <View style={styles.div}>
                <View style={styles.cardImgView}>
                  <DisplayText
                    styles={styles.cardImgTxt}
                    text={moment(eventDate).format('Do MMM')}
                  />
                  <DisplayText
                    styles={styles.timeTxt}
                    text={moment(eventDate).format('h:mm: a')}
                  />
                </View>
              </View>
              <View style={styles.divide}>
                <DisplayText
                  styles={styles.divideTxt}
                  text={eventDetail.name}
                />

                <TouchableOpacity style={styles.divideTxtView}>
                  <Image
                    source={require('../../assets/images/group.png')}
                    style={StyleSheet.flatten(styles.divideIcon)}
                  />
                  <View>
                    <DisplayText
                      styles={styles.divideOneTxt}
                      text={eventDetail.venue}
                    />
                    <DisplayText
                      styles={styles.divideOneTxt}
                      text={`Posted: ${moment(eventDetail.createdAt).format(
                        'Do MMM YY'
                      )}`}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {activeEvent === false ? null : (
            <SubmitButton
              onPress={() => {
                this.handleAttendEvent();
              }}
              title={'Attend Event'}
              btnStyle={styles.modalBtn}
              titleStyle={StyleSheet.flatten(styles.modalTxt)}
              disabled={!this.toggleButtonState}
            />
          )}

          <View>
            <View style={styles.descriptionView}>
              <Image
                source={require('../../assets/images/student.png')}
                style={StyleSheet.flatten(styles.descImage)}
              />
              <DisplayText
                styles={styles.descEvent}
                text={'Event Description'}
              />
            </View>
            <View style={styles.eventDetails}>
              <DisplayText
                styles={styles.descText}
                text={eventDetail.description}
                numberOfLines={4}
              />
            </View>
          </View>

          <View>
            <View style={styles.descriptionView}>
              <Image
                source={require('../../assets/images/group.png')}
                style={StyleSheet.flatten(styles.descImage)}
              />
              <DisplayText
                styles={styles.descEvent}
                text={'Attending Members'}
              />
            </View>
            <View style={styles.descDetails}>
              <FlatList
                style={{ paddingHorizontal: 16 }}
                data={memberData}
                renderItem={this.renderMember}
                keyExtractor={(data) => data.id}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                // contentContainerStyle={{ marginRight: 10 }}
              />
              {count < 3 ? (
                <DisplayText
                  text={this.state.count.length.toString()}
                  styles={StyleSheet.flatten(styles.more)}
                />
              ) : (
                <DisplayText
                  text={`${this.state.count.length}${' Link(s)'}`}
                  styles={StyleSheet.flatten(styles.more)}
                />
              )}
            </View>
          </View>
          <View>
            <View style={styles.descriptionView}>
              <Image
                source={require('../../assets/images/speech-bubble.png')}
                style={StyleSheet.flatten(styles.descImage)}
              />
              <DisplayText styles={styles.descEvent} text={'Comments '} />
            </View>
            <View style={styles.commentListView}>
              <FlatList
                style={{ paddingHorizontal: 16 }}
                data={this.state.commenData}
                renderItem={this.renderComments}
                keyExtractor={(data) => data.id.toString()}
                showsVerticalScrollIndicator={false}
                horizontal={false}
              />
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={this.showCustomeModal}
          style={styles.joinBtn}
        >
          <Image
            onPress={this.showCustomeModal}
            source={require('../../assets/images/speech-bubble.png')}
            style={StyleSheet.flatten(styles.msgImage)}
          />
        </TouchableOpacity>
        <ProgressDialog
          visible={showLoading}
          title='Progress Dialog'
          message='Please, wait...'
        />
        <CustomModal
          onPress={() => {
            this.closeCustomModal();
          }}
          visible={this.state.customModal}
          modalStyle={styles.modal}
          handleCloseModal={this.handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                this.closeCustomModal();
              }}
              style={styles.textBtny}
            >
              <DisplayText
                styles={styles.closeTxt}
                text={'Close'}
                onPress={() => {
                  this.closeCustomModal();
                }}
              />
            </TouchableOpacity>

            <View style={styles.textInputView}>
              <TextInput
                style={styles.input}
                placeholder={'Drop your comments'}
                numberOfLines={6}
                returnKeyType={'done'}
                onChangeText={this.onCommentChange}
                value={this.state.comment}
                multiline={true}
              />
            </View>
            <View style={styles.buttonsView}>
              <SubmitButton
                onPress={() => {
                  this.handlePostComment();
                }}
                title={'Send'}
                btnStyle={styles.commentBtn}
                titleStyle={StyleSheet.flatten(styles.commentTxt)}
              />
            </View>
          </View>
          <ProgressDialog
            visible={showLoading}
            title='Progress Dialog'
            message='Please, wait...'
          />
          <ErrorAlert
            title={'Error!'}
            message={errorMessage}
            handleCloseNotification={this.handleCloseNotification}
            visible={this.state.showAlert}
          />
        </CustomModal>
        <ErrorAlert
          title={'Alert!'}
          message={errorMessage}
          handleCloseNotification={this.handleCloseNotification}
          visible={this.state.showAlert}
        />
      </SafeAreaView>
    );
  }
}

export default EventDetail;
