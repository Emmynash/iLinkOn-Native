'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Keyboard,
  Animated,
  Dimensions,
  UIManager,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AutogrowInput from 'react-native-autogrow-input';
// import { AudioRecorder, AudioUtils } from 'react-native-audio';
// import Sound from 'react-native-sound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { ProgressDialog } from 'react-native-simple-dialogs';
import DropdownAlert from 'react-native-dropdownalert';
import NavigationBar from 'react-native-navbar';
import colors from '../../assets/colors';
import styles from './styles';
import { DisplayText, KeyboardAvoid } from '../../components';
import {
  CreateThreadEndpoint,
  getUserDetails,
  GetAllMessageEndPoint,
  getRouteToken,
  WebSocketEndpoint,
  getProfile,
} from '../Utils/Utils';
import moment from 'moment';
const { State: TextInputState } = TextInput;

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputBarText: '',
      id: '',
      userid: '',
      chaterId: '',
      status: '',
      token: '',
      message: '',
      title: '',
      time: '',
      name: '',
      image: '',
      responseMessage: '',
      adminTime: '',
      showAlert: false,
      showLoading: false,
      displayPhoto: '',
      threadId: '',
      connection: null,
      profilePhoto:
        'https://gravatar.com/avatar/02bf38fddbfe9f82b94203336f9ebc41?s=200&d=retro',
      secondUsername: '',
      shift: new Animated.Value(0),
      audioState: {
        haveRecordingPermissions: false,
        isLoading: false,
        isPlaybackAllowed: false,
        muted: false,
        soundPosition: null,
        soundDuration: null,
        recordingDuration: null,
        shouldPlay: false,
        isPlaying: false,
        isRecording: false,
        fontLoaded: false,
        shouldCorrectPitch: true,
        volume: 1.0,
        rate: 1.0,
      },
    };

    this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
  }
  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  UNSAFE_componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    this.state.connection.close();
  }

  //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  keyboardDidShow(e) {
    this.scrollView.scrollToEnd();
  }

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  keyboardDidHide(e) {
    this.scrollView.scrollToEnd();
  }
  async componentDidMount() {
    await this.connect();
    this.mounted = true;
    const { navigation } = this.props,
      data = navigation.getParam('data'),
      item = navigation.getParam('item');
    let profile = await getProfile();
    let userDetails = await getUserDetails();
    console.log('readItem', item);
    const token = profile.access_token,
      name = userDetails.fName,
      id = userDetails.id;

    this.setState({
      token: token,
      userid: id,
      name: name,
      threadId: data.id,
      secondUsername:
        item.secondParticipantfName || item.name || item.member.fName,
      profilePhoto:
        item.secondParticipantProfilepic ||
        item.displayPhoto ||
        item.profilePhoto,
    });
    await this.handleGetAllMessage();
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  checkAudioPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      if (status !== 'granted') {
        alert(translations.permission);
        return false;
      } else {
        this.setState({
          audioState: {
            haveRecordingPermissions: true,
          },
        });
        return this._onRecordPressed;
      }
    } else {
      this.setState({
        audioState: {
          haveRecordingPermissions: true,
        },
      });
      return this._onRecordPressed;
    }
  };

  _updateScreenForSoundStatus = (status = AVPlaybackStatus) => {
    if (status.isLoaded) {
      this.setState({
        audioState: {
          soundDuration: status.durationMillis ?? null,
          soundPosition: status.positionMillis,
          shouldPlay: status.shouldPlay,
          isPlaying: status.isPlaying,
          rate: status.rate,
          muted: status.isMuted,
          volume: status.volume,
          shouldCorrectPitch: status.shouldCorrectPitch,
          isPlaybackAllowed: true,
        },
      });
    } else {
      this.setState({
        audioState: {
          soundDuration: null,
          soundPosition: null,
          isPlaybackAllowed: false,
        },
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = (status = Audio.RecordingStatus) => {
    if (status.canRecord) {
      this.setState({
        audioState: {
          isRecording: status.isRecording,
          recordingDuration: status.durationMillis,
        },
      });
    } else if (status.isDoneRecording) {
      this.setState({
        audioState: {
          isRecording: false,
          recordingDuration: status.durationMillis,
        },
      });
      if (!this.state.audioState.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  _stopPlaybackAndBeginRecording = async () => {
    this.setState({
      audioState: { isLoading: true },
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      audioState: { isLoading: false },
    });
  };

  _stopRecordingAndEnablePlayback = async () => {
    this.setState({
      audioState: { isLoading: true },
    });
    if (!this.recording) {
      return;
    }
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI() || '');
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      audioState: { isLoading: false },
    });
  };

  _onRecordPressed = () => {
    console.log('onPress');
    if (this.state.audioState.isRecording) {
      console.log('Enable playback');
      return this._stopRecordingAndEnablePlayback();
    } else {
      console.log('Begin recording');
      return this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.audioState.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  getPermissionAsync = async () => {
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
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      return this.handleAddPicture(base64Img);
    }
  };

  handleAddPicture = (base64Img) => {
    let CLOUDINARY_URL =
      'https://api.cloudinary.com/v1_1/https-cyberve-com/image/upload';
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify({
        file: base64Img,
        upload_preset: 'kvdcspfl',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (res) => {
        let dataUrl = await res.json();
        console.log(dataUrl.url);
        this.handleSaveData(dataUrl.url);
        this.hideLoadingDialogue();
      })
      .catch((err) => {
        this.hideLoadingDialogue();
        console.log(err);
      });
  };

  checkDocPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert(translations.permission);
        return false;
      } else {
        return this.pickDocument();
      }
    } else {
      return this.pickDocument();
    }
  };

  pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (!result.cancelled) {
      let base64Doc = `data:application/pdf;base64,${result.uri}`;
      // console.log(base64Doc);
      return this.handleDocument(base64Doc);
    }
  };

  handleDocument = async (base64Doc) => {
    let CLOUDINARY_URL =
      'https://res.cloudinary.com/https-cyberve-com/image/upload';
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify({
        file: base64Doc,
        upload_preset: 'kvdcspfl',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (res) => {
        let dataUrl = await res.json();
        console.log('Data', res);

        this.handleSaveData(dataUrl.url);
        this.hideLoadingDialogue();
      })
      .catch((err) => {
        this.hideLoadingDialogue();
        console.log('Error:', err);
      });
  };

  handleSaveData = (data) => {
    // console.log('base64Data:', data);
    this.setState({
      message: [...this.state.message, data],
    });
  };

  renderAndroidMicrophone() {
    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity
          onPress={this.checkPermission}
          // style={styles.headerImage}
        >
          <Ionicons
            name='ios-mic'
            size={35}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            color={this.state.startAudio ? 'red' : 'black'}
            style={{
              bottom: 50,
              right: Dimensions.get('window').width / 2,
              position: 'absolute',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              zIndex: 2,
              backgroundColor: 'transparent',
            }}
            onPress={this.handleAudio}
          />
        </TouchableOpacity>
      );
    }
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }
  _onInputSizeChange() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd({ animated: false });
      }.bind(this)
    );
  }
  showLoadingDialogue = () => {
    this.setState({
      showLoading: true,
    });
  };
  // Hide Loading Spinner
  hideLoadingDialogue = () => {
    this.setState({
      showLoading: false,
    });
  };

  showNotification = (type, title, message) => {
    this.hideLoadingDialogue();
    return this.dropDownAlertRef.alertWithType(type, title, message);
  };

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = async () => {
    const { messages } = this.state;
    let profile = await getProfile();
    const token = profile.access_token;
    var endpoint = `wss://ilinkon.herokuapp.com/?token=${token}`;
    // var endpoint = `wss://echo.websocket.org`
    var connection = new WebSocket(endpoint);
    let that = this;
    let connectInterval;

    // websocket onopen event listener
    connection.onopen = () => {
      this.setState({ connection: connection });
      console.log(
        'connected websocket main component.........',
        connection.readyState
      );
      that.timeout = 250; // reset timer to 250 on open of websocket
      clearTimeout(connectInterval); // clear Interval onOpen of websocket
    };
    connection.onmessage = (e) => {
      // console.log('i am here', e.data)
      const messageResponse = JSON.parse(e.data);
      this.onMessageData(messageResponse);
    };

    // websocket onclose event listener
    connection.onclose = (e) => {
      console.log(
        `Socket is closed. attempt reconnecting in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e
      );
      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    connection.onerror = (err) => {
      console.log();
      'WebSocket encountered error: ', err, 'Closing socket';
      connection.close();
    };
  };

  /**
   * @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { connection } = this.state;
    if (!connection || connection.readyState == WebSocket.CLOSED)
      this.connect();
  };

  _sendMessage = () => {
    const { threadId, connection, inputBarText, messages } = this.state;
    let inputMessage = inputBarText.toString();
    let time = moment().utcOffset('+01:00').format('hh:mm:a');
    let body = `${inputMessage}\n${time}`;
    messages.push({ direction: 'right', text: body });
    let data = JSON.stringify({
      threadId: threadId,
      text: inputMessage,
    });
    this.setState({
      messages: this.state.messages,
      inputBarText: '',
    });
    try {
      connection.send(data); //send data to the server
    } catch (error) {
      console.log(error);
    }
  };

  handleGetAllMessage = async () => {
    const { token, id, threadId } = this.state;
    this.setState({
      showLoading: true,
    });
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    let endpoint = `${GetAllMessageEndPoint}/${threadId}?page=1&pageSize=1`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (res.meta.status >= 300) {
      this.setState({
        showAlert: true,
        showLoading: false,
        message: res.meta.message,
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      const dataResponse = res.data.messages;
      this.handleConvertData(dataResponse);
      this.setState({
        showLoading: false,
        responseMessage: dataResponse,
      });
    } else {
      if (res.meta.message) {
        this.setState({
          showAlert: true,
          message: res.meta.message,
          showLoading: false,
        });
      }
    }
  };
  handleConvertData = async (dataResponse) => {
    const { messages } = this.state;

    let userDetails = await getUserDetails();
    let userid = userDetails.data.id;
    dataResponse.forEach((data) => {
      const message = data.text,
        time = data.createdAt,
        name = data.sender.fName,
        newDate = moment(time).startOf('minute').fromNow();
      if (data.sender.id == userid) {
        let body = `${message}\n${newDate}`;
        return messages.push({ direction: 'right', text: body });
      } else {
        let body = `${message}\n${newDate}\n${name}`;
        return messages.push({ direction: 'left', text: body });
      }
    });
  };
  onMessageData = async (msg) => {
    const { messages, userid } = this.state;
    const time = msg.message.createdAt,
      newDate = moment(time).startOf('second').fromNow(),
      sender_id = msg.message.sender.id,
      sendersName = msg.message.sender.fName;

    try {
      if (sender_id === userid) {
        let sender = `${msg.message.text}\n${newDate}`;
        messages.push({ direction: 'right', text: sender });
      } else if (sender_id !== userid) {
        let receiver = `${msg.message.text}\n${newDate}\n${sendersName}`;
        return messages.push({
          direction: 'left',
          text: receiver,
          senderId: sender_id,
        });
      }
    } catch (error) {}
  };

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text,
    });
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  //This is to navigate back to the supportdesk
  handleBackPress = () => {
    return this.props.navigation.goBack();
  };
  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
    });
  };

  render() {
    const { showLoading, time, shift, messages, userid } = this.state;
    var newMessages = [];
    messages.forEach(function (message, index) {
      newMessages.push(
        <MessageBubble
          key={index}
          direction={message.direction}
          text={`${message.text} ${time}`}
        />
      );
    });
    // console.log('messag chckeeee', messages)
    //   if (Object.keys(messages).includes('senderId') && messages.senderId === userid) {
    //     return null
    //   }

    return (
      <SafeAreaView style={styles.outer}>
        <StatusBar barStyle={'dark-content'} />

        {/* <DropdownAlert ref={ref => this.dropDownAlertRef = ref} /> */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={this.handleBackPress}
            style={styles.headerImage}
          >
            <Image
              onPress={this.handleBackPress}
              source={require('../../assets/images/back.png')}
              style={StyleSheet.flatten(styles.headerIcon)}
            />
          </TouchableOpacity>
          <View style={styles.nameView}>
            <Image
              source={{ uri: this.state.profilePhoto }}
              style={StyleSheet.flatten(styles.profileIcon)}
            />
            <DisplayText
              styles={StyleSheet.flatten(styles.txtHeader)}
              text={this.state.secondUsername}
            />
            <TouchableOpacity onPress={this.checkDocPermission}>
              <Image
                source={require('../../assets/images/paper-clip.png')}
                style={styles.AttachIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.getPermissionAsync}>
              <Image
                source={require('../../assets/images/camera_1.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'ios' ? (
          <View style={styles.inputContainer}>
            <ScrollView
              ref={(ref) => {
                this.scrollView = ref;
              }}
              style={styles.messagesBubble}
            >
              {newMessages}
            </ScrollView>
            {/* <InputBar onSendPressed={() => this._sendMessage()}
            onSizeChange={() => this._onInputSizeChange()}
            onChangeText={(text) => this._onChangeInputBarText(text)}
            text={this.state.inputBarText} /> */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textBox}
                placeholder='Enter message here'
                multiline={true}
                onChangeText={(text) => this._onChangeInputBarText(text)}
                value={this.state.inputBarText}
              />
              <TouchableHighlight
                style={styles.sendButton}
                onPress={() => this._sendMessage()}
              >
                <Image
                  source={require('../../assets/images/send_button.png')}
                  style={styles.sendIcon}
                />
              </TouchableHighlight>
            </View>
            <KeyboardSpacer />
          </View>
        ) : (
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateY: shift }] },
            ]}
          >
            <ScrollView
              ref={(ref) => {
                this.scrollView = ref;
              }}
              style={styles.messagesBubble}
            >
              {newMessages}
            </ScrollView>
            {/* <InputBar onSendPressed={() => this._sendMessage()}
          onSizeChange={() => this._onInputSizeChange()}
          onChangeText={(text) => this._onChangeInputBarText(text)}
        text={this.state.inputBarText} /> */}
            <View style={styles.inputBar}>
              {/* {this.renderAndroidMicrophone()} */}
              <TextInput
                style={styles.textBox}
                placeholder='Enter message here'
                multiline={true}
                onChangeText={(text) => this._onChangeInputBarText(text)}
                value={this.state.inputBarText}
              />

              <TouchableOpacity
                onPress={this.checkAudioPermission}
                disabled={this.state.isLoading}
              >
                <Image
                  source={require('../../assets/images/microphone-button.png')}
                  style={styles.micIcon}
                  onPress={this.handleAddPicture}
                />
              </TouchableOpacity>

              <TouchableHighlight
                style={styles.sendButton}
                onPress={() => this._sendMessage()}
              >
                <Image
                  source={require('../../assets/images/send_button_1.png')}
                  style={styles.sendIcon}
                />
              </TouchableHighlight>
            </View>
          </Animated.View>
        )}

        <ProgressDialog
          visible={showLoading}
          title='Processing'
          message='Please wait...'
        />
      </SafeAreaView>
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends Component {
  render() {
    //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
    let leftSpacer =
      this.props.direction === 'left' ? null : <View style={{ width: 140 }} />;
    let rightSpacer =
      this.props.direction === 'left' ? <View style={{ width: 140 }} /> : null;

    let bubbleStyles =
      this.props.direction === 'left'
        ? [styles.messageBubble, styles.messageBubbleLeft]
        : [styles.messageBubble, styles.messageBubbleRight];

    let bubbleTextStyle =
      this.props.direction === 'left'
        ? styles.messageBubbleTextLeft
        : styles.messageBubbleTextRight;

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginBottom: 14,
        }}
      >
        <StatusBar barStyle={'dark-content'} />

        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}
