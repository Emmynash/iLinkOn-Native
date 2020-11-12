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
  Slider,
  Platform,
  Span,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { ProgressDialog } from 'react-native-simple-dialogs';
import styles from './styles';
import {
  DisplayText,
  ImageModal,
  PDFModal,
  ErrorAlert,
} from '../../components';
import {
  getUserDetails,
  GetAllMessageEndPoint,
  getProfile,
} from '../Utils/Utils';
import moment from 'moment';
import { Asset } from 'expo-asset';

const { State: TextInputState } = TextInput;

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_PLAY_BUTTON = new Icon(
  require('../../assets/images/play_button.png'),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require('../../assets/images/pause_button.png'),
  34,
  51
);
const ICON_TRACK_1 = new Icon(
  require('../../assets/images/track_1.png'),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require('../../assets/images/thumb_1.png'),
  18,
  19
);
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFF';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      messages: [],
      inputBarText: '',
      id: '',
      userid: '',
      chaterId: '',
      status: '',
      token: '',
      alertmessage: '',
      title: '',
      time: '',
      name: '',
      message: '',
      responseMessage: '',
      adminTime: '',
      showAlert: false,
      showSuccessAlert: false,
      profilePic: '',
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
        shouldCorrectPitch: true,
        volume: 1.0,
        rate: 1.0,
      },
    };
  }

  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  async UNSAFE_componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide
    );
  }

  async componentWillUnmount() {
    this.mounted = false;
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();

    let profile = await getProfile();
    const token = profile.access_token;
    var endpoint = `wss://ilinkon.herokuapp.com/?token=${token}`;

    let that = this;
    let connectInterval;

    var connection = new WebSocket(endpoint);

    connection.onopen = () => {
      this.setState({ connection: connection });
      that.timeout = 10000; // reset timer to 100 on open of websocket
      clearTimeout(connectInterval); // clear Interval onOpen of websocket
    };
    connection.onmessage = (e) => {
      // console.log('i am here', e.data)
      const messageResponse = JSON.parse(e.data);
      this.onMessageData(messageResponse);

      console.log(messageResponse);
    };

    connection.onerror = (err) => {
      console.log('WebSocket encountered error: ', err, 'Closing socket');
      connection.onopen();
    };

    await this.handleGetAllMessage();
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
    // console.log('readItem', item);
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

  _updateScreenForSoundStatus = (status) => {
    if (status.isLoaded) {
      this.setState({
        audioState: {
          soundDuration: status.durationMillis,
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

  _updateScreenForRecordingStatus = (status) => {
    if (status.canRecord) {
      this.setState({
        audioState: {
          haveRecordingPermissions: true,
          isRecording: status.isRecording,
          recordingDuration: status.durationMillis,
        },
      });
    } else if (status.isDoneRecording) {
      this.setState({
        audioState: {
          isRecording: false,
          haveRecordingPermissions: false,
          recordingDuration: status.durationMillis,
        },
      });
    }
  };

  async _stopPlaybackAndBeginRecording() {
    console.log('isRecording');
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
      staysActiveInBackground: false,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    let recordOptions = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;
    recordOptions.ios.extension = '.m4a';
    recordOptions.android.extension = '.m4a';
    recordOptions.ios.outputFormat =
      Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC;
    recordOptions = JSON.parse(JSON.stringify(recordOptions));

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(recordOptions);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;

    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      audioState: { isLoading: false },
    });
  }

  async _stopRecordingAndEnablePlayback() {
    console.log('isDoneRecording');
    this.setState({
      audioState: { isLoading: true },
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);

    const source = {
      name: info.uri.split('-')[5],
      size: info.size,
      uri: info.uri,
      type: 'audio/m4a',
    };

    var formdata = new FormData();

    formdata.append('file', source);
    formdata.append('cloud_name', 'https-cyberve-com');
    formdata.append('upload_preset', 'kvdcspfl');

    fetch('http://api.cloudinary.com/v1_1/https-cyberve-com/auto/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(async (res) => {
        let json = await res.json();
        console.log(JSON.stringify(json.secure_url));
        const { threadId, connection, messages } = this.state;
        let time = moment().utcOffset('+01:00').format('hh:mm:a');
        messages.push({
          direction: 'right',
          audio: json.secure_url,
          messageType: 'audio',
          time,
        });
        let data = JSON.stringify({
          threadId: threadId,
          audio: json.secure_url,
          messageType: 'audio',
        });

        this.setState({
          messages: this.state.messages,
        });
        try {
          connection.send(data); //send data to the server
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => console.log('error', err));

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });

    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.audioState.muted,
        volume: this.state.audioState.volume,
        rate: this.state.audioState.rate,
        shouldCorrectPitch: this.state.audioState.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );

    this.sound = sound;

    this.setState({
      audioState: { isLoading: false },
    });
  }

  _handleAudio = async () => {
    if (this.state.audioState.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (response.status === 'granted') {
        console.log(response.status);
        return this._stopPlaybackAndBeginRecording();
      }
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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        console.log('permission not granted');
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
      aspect: [4, 5],
      base64: true,
    });

    if (!result.cancelled) {
      let base64Img = `data:image/jpg;base64,${result.base64}`;
      return this._handleImageUpload(base64Img);
    }
  };

  _handleImageUpload = (base64Img) => {
    fetch('https://api.cloudinary.com/v1_1/https-cyberve-com/image/upload', {
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
        const data = await res.json();
        console.log(data.secure_url);
        this.setState({ image: data.secure_url });

        const { threadId, connection, messages } = this.state;
        let time = moment().utcOffset('+01:00').format('hh:mm:a');
        messages.push({
          direction: 'right',
          image: data.secure_url,
          messageType: 'image',
          time,
        });
        let msg = JSON.stringify({
          threadId: threadId,
          image: data.secure_url,
          messageType: 'image',
        });
        this.setState({
          messages: this.state.messages,
        });
        try {
          connection.send(msg); //send data to the server
        } catch (error) {
          console.log(error);
        }

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
        console.log('permission not granted');
        return false;
      } else {
        return this._pickDocument();
      }
    } else {
      return this._pickDocument();
    }
  };

  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (!result.cancelled) {
      const source = {
        name: result.name,
        size: result.size,
        uri: result.uri,
        type: 'application/pdf',
      };
      if (source.uri.split('.')[4] !== 'pdf') {
        return this.setState({
          showAlert: true,
          showSuccessAlert: false,
          alertmessage: 'Please select a pdf file!',
        });
      }
      console.log('picked doc', source);
      return this._handleDocument(source);
    }
  };

  _handleDocument = async (file) => {
    var formdata = new FormData();

    formdata.append('file', file);
    formdata.append('cloud_name', 'https-cyberve-com');
    formdata.append('upload_preset', 'kvdcspfl');

    fetch('http://api.cloudinary.com/v1_1/https-cyberve-com/auto/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(async (res) => {
        let json = await res.json();
        console.log(JSON.stringify(json.secure_url));
        this.setState({ fileState: { uri: json.secure_url } });
        const { threadId, connection, messages } = this.state;
        let time = moment().utcOffset('+01:00').format('hh:mm:a');
        messages.push({
          direction: 'right',
          file: json.secure_url,
          messageType: 'file',
          fileName: file.name,
          time,
        });
        let data = JSON.stringify({
          threadId: threadId,
          file: json.secure_url,
          fileName: file.name,
          messageType: 'file',
        });

        this.setState({
          messages: this.state.messages,
        });
        try {
          connection.send(data); //send data to the server
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => console.log('error', err));
  };

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
      that.timeout = 60000; // reset timer to 250 on open of websocket
      clearTimeout(connectInterval); // clear Interval onOpen of websocket
    };
    connection.onmessage = (e) => {
      // console.log('i am here', e.data)
      const messageResponse = JSON.parse(e.data);
      this.onMessageData(messageResponse);

      console.log(messageResponse);
    };

    // websocket onclose event listener
    connection.onclose = (e) => {
      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    connection.onerror = (err) => {
      // console.log('WebSocket encountered error: ', err, 'Closing socket');
      connection.onopen();
    };
  };

  /**
   * @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { connection } = this.state;
    if (!connection || connection.readyState == WebSocket.CLOSED) {
      return this.connect();
    }
  };

  _sendMessage = () => {
    const { threadId, connection, inputBarText, messages } = this.state;
    let inputMessage = inputBarText.toString();
    let time = moment().utcOffset('+01:00').format('hh:mm:a');
    let body = `${inputMessage}\n${time}`;
    messages.push({ direction: 'right', text: body, messageType: 'text' });
    let data = JSON.stringify({
      threadId: threadId,
      text: inputMessage,
      messageType: 'text',
    });
    this.setState({
      messages: this.state.messages,
      inputBarText: '',
    });
    try {
      connection.send(data); //send data to the server
    } catch (error) {
      console.log('Could not send message', error);
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
        message: res.data.messages,
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      const dataResponse = res.data.messages;

      this.handleConvertData(dataResponse);
      this.setState({
        showLoading: true,
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
    this.setState({ showLoading: true });

    let userDetails = await getUserDetails();
    let userid = userDetails.data.id;
    dataResponse.forEach((data) => {
      // console.log('Log Messages', data);
      const time = data.createdAt,
        name = data.sender.fName,
        newDate = moment(time).startOf('minute').fromNow();
      if (data.sender.id == userid) {
        if (data.messageType === 'text') {
          let body = `${data.text}\n${newDate}`;
          return messages.push({
            direction: 'right',
            messageType: 'text',
            text: body,
          });
        } else if (data.messageType === 'image') {
          return messages.push({
            direction: 'right',
            messageType: 'image',
            image: data.image,
            time: newDate,
          });
        } else if (data.messageType === 'file') {
          return messages.push({
            direction: 'right',
            messageType: 'file',
            file: data.file,
            fileName: data.fileName,
            time: newDate,
          });
        } else if (data.messageType === 'audio') {
          return messages.push({
            direction: 'right',
            messageType: 'audio',
            audio: data.audio,
            time: newDate,
          });
        }
      } else {
        if (data.messageType === 'text') {
          let body = `${data.text}\n${newDate}\n${name}`;
          return messages.push({
            direction: 'left',
            messageType: 'text',
            text: body,
          });
        } else if (data.messageType === 'image') {
          return messages.push({
            direction: 'left',
            messageType: 'image',
            image: data.image,
            time: `${name}\n${newDate}`,
          });
        } else if (data.messageType === 'file') {
          return messages.push({
            direction: 'left',
            messageType: 'file',
            file: data.file,
            fileName: data.fileName,
            time: `${name}\n${newDate}`,
          });
        } else if (data.messageType === 'audio') {
          return messages.push({
            direction: 'left',
            messageType: 'audio',
            audio: data.audio,
            time: `${name}\n${newDate}`,
          });
        }
      }
    });
    this.setState({ showLoading: false });
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
        if (msg.message.messageType === 'text') {
          return messages.push({
            direction: 'right',
            text: sender,
            messageType: 'text',
          });
        } else if (msg.message.messageType === 'image') {
          return messages.push({
            direction: 'right',
            image: msg.message.image,
            messageType: 'image',
            time: newDate,
          });
        } else if (msg.message.messageType === 'file') {
          return messages.push({
            direction: 'right',
            file: msg.message.file,
            messageType: 'file',
            time: newDate,
            fileName: msg.message.fileName,
          });
        } else if (msg.message.messageType === 'audio') {
          return messages.push({
            direction: 'right',
            audio: msg.message.audio,
            messageType: 'audio',
            time: newDate,
          });
        }
      } else if (sender_id !== userid) {
        let receiver = `${msg.message.text}\n${newDate}\n${sendersName}`;
        if (msg.message.messageType === 'text') {
          return messages.push({
            direction: 'left',
            text: receiver,
            senderId: sender_id,
            messageType: 'text',
          });
        } else if (msg.message.messageType === 'image') {
          return messages.push({
            direction: 'left',
            image: msg.message.image,
            messageType: 'image',
            time: `${sendersName}\n${newDate}`,
          });
        } else if (msg.message.messageType === 'file') {
          return messages.push({
            direction: 'left',
            file: msg.message.file,
            messageType: 'file',
            time: `${sendersName}\n${newDate}`,
            fileName: msg.message.fileName,
          });
        } else if (msg.message.messageType === 'audio') {
          return messages.push({
            direction: 'left',
            audio: msg.message.audio,
            messageType: 'audio',
            time: `${sendersName}\n${newDate}`,
          });
        }
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

  handleBackPress = () => {
    return this.props.navigation.goBack();
  };
  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  render() {
    const { showLoading, time, shift, messages } = this.state;

    var newMessages = [];
    messages.forEach(function (message, index) {
      if (message.messageType === 'text') {
        newMessages.push(
          <TextBubble
            key={index}
            direction={message.direction}
            text={`${message.text} ${time}`}
          />
        );
      } else if (message.messageType === 'image') {
        newMessages.push(
          <ImageBubble
            key={index}
            direction={message.direction}
            image={message.image}
            time={message.time}
          />
        );
      } else if (message.messageType === 'file') {
        newMessages.push(
          <FileBubble
            key={index}
            direction={message.direction}
            uri={message.file}
            name={message.fileName}
            time={message.time}
          />
        );
      } else if (message.messageType === 'audio') {
        // console.log(message.audio);
        newMessages.push(
          <AudioBubble
            key={index}
            direction={message.direction}
            uri={message.audio}
            time={message.time}
          />
        );
      }
    });
    return (
      <SafeAreaView style={styles.outer}>
        <StatusBar backgroundColor='white' barStyle={'dark-content'} />

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
              numberOfLines={1}
              text={
                this.state.secondUsername.length > 12
                  ? `${
                      Constants.platform.ios
                        ? `${this.state.secondUsername.substring(0, 12)}`
                        : ` ${this.state.secondUsername.substring(0, 8)}`
                    }...`
                  : this.state.secondUsername
              }
            />
            <>
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
            </>
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
              <TouchableOpacity
                onPress={this._handleAudio}
                disabled={this.state.audioState.isLoading}
              >
                <Image
                  source={
                    this.state.audioState.isRecording
                      ? require('../../assets/images/microphone-red-button.png')
                      : require('../../assets/images/microphone-black-button.png')
                  }
                  style={styles.micIcon}
                />
              </TouchableOpacity>

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
                onPress={this._handleAudio}
                disabled={this.state.audioState.isLoading}
              >
                <Image
                  source={
                    this.state.audioState.isRecording
                      ? require('../../assets/images/microphone-red-button.png')
                      : require('../../assets/images/microphone-black-button.png')
                  }
                  style={styles.micIcon}
                />
              </TouchableOpacity>

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
          </Animated.View>
        )}

        <ProgressDialog
          visible={showLoading}
          title='Processing'
          message='Please wait...'
        />
        <ErrorAlert
          title={'Error!'}
          message={this.state.alertmessage}
          handleCloseNotification={this.handleCloseNotification}
          visible={this.state.showAlert}
        />
      </SafeAreaView>
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class TextBubble extends Component {
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

class ImageBubble extends Component {
  state = {
    showAlert: false,
    showSuccessAlert: false,
    profilePic: '',
    showLoading: false,
  };

  handleImageView = () => {
    return this.setState({
      showAlert: true,
      showSuccessAlert: false,
      profilePic: this.props.image,
    });
  };

  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

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
        <View style={{ marginRight: 15 }}>
          <TouchableOpacity
            onPress={() => {
              this.handleImageView();
            }}
          >
            <Image
              style={{ width: 200, height: 200, borderRadius: 5 }}
              source={{
                uri: this.props.image,
              }}
            />
            <View style={bubbleTextStyle}>
              <Text>{this.props.time}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ImageModal
          image={this.props.image}
          handleCloseNotification={this.handleCloseNotification}
          visible={this.state.showAlert}
        />
        {rightSpacer}
      </View>
    );
  }
}

class FileBubble extends Component {
  state = {
    showAlert: false,
    showSuccessAlert: false,
    pdf: '',
    showLoading: false,
  };

  handlePDFView = () => {
    return this.setState({
      showAlert: true,
      showSuccessAlert: false,
      pdf: this.props.uri,
    });
  };

  handleCloseModal = () => {
    return this.setState({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

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
        <StatusBar backgroundColor='white' barStyle={'dark-content'} />
        {leftSpacer}
        <View
          style={{
            marginTop: 8,
            marginRight: 2,
            marginLeft: 10,
            paddingHorizontal: 10,
            paddingVertical: 6,
            flexDirection: 'row',
            flex: 1,
            shadowOffset: { height: 0, width: 0 },
            shadowColor: '#ffffff66',
            shadowOpacity: 0.25,
            shadowRadius: 2.26,
            alignContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.handlePDFView();
            }}
          >
            <Image
              style={{ width: 200, height: 50, borderRadius: 5 }}
              source={require('../../assets/images/pdf-image.png')}
            />
            <View style={bubbleTextStyle}>
              <Text numberOfLines={1}>{this.props.name.substring(0, 25)}</Text>
              <Text>{this.props.time}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <PDFModal
          uri={this.props.uri}
          handleCloseModal={this.handleCloseModal}
          visible={this.state.showAlert}
        />
        {rightSpacer}
      </View>
    );
  }
}

class AudioBubble extends Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;

    this.state = {
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      shouldCorrectPitch: true,
      isPlaybackAllowed: false,
      // isLoading: false,
    };
  }

  componentDidMount = async () => {
    await Audio.setIsEnabledAsync(true);
    const soundObject = new Audio.Sound();
    const source = this.props.uri;
    const changeExt = source.substr(0, source.lastIndexOf('.')) + '.m4a';
    soundObject.setOnPlaybackStatusUpdate();
    await soundObject.loadAsync({ uri: changeExt });

    try {
      if (this.sound !== null) {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
        this.sound = null;
      }
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        {
          uri: changeExt,
        },
        {
          isLooping: true,
          shouldCorrectPitch: this.state.shouldCorrectPitch,
        },
        this._updateScreenForSoundStatus
      );
      this.sound = soundObject;
    } catch (error) {
      console.log('error', error);
    }
  };

  _updateScreenForSoundStatus = (status) => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onPlayPausePressed = async () => {
    console.log('play/pause');

    try {
      if (this.sound != null) {
        if (this.state.isPlaying) {
          return await this.sound.pauseAsync();
        } else {
          await this.sound.playAsync();
          // return await this.sound.unloadAsync();
        }
      }
    } catch (error) {
      console.log('unable to play/pause sound', error);
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`;
    }
    return '';
  }

  _onSeekSliderValueChange = (value) => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

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
        <View style={playerStyle.volumeContainer}>
          <View style={playerStyle.playStopContainer}>
            <TouchableHighlight
              style={playerStyle.wrapper}
              onPress={this._onPlayPausePressed}
            >
              <Image
                style={playerStyle.image}
                source={
                  this.state.isPlaying
                    ? ICON_PAUSE_BUTTON.module
                    : ICON_PLAY_BUTTON.module
                }
              />
            </TouchableHighlight>
          </View>
          <View style={playerStyle.playbackContainer}>
            <Slider
              style={playerStyle.playbackSlider}
              trackImage={ICON_TRACK_1.module}
              thumbImage={ICON_THUMB_1.module}
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={this.state.isLoading}
            />
            <Text style={[playerStyle.playbackTimestamp]}>
              {this._getPlaybackTimestamp()}
            </Text>
          </View>
          <></>
          <View style={bubbleTextStyle}>
            <Text>{this.props.time}</Text>
          </View>
        </View>
        {rightSpacer}
      </View>
    );
  }
}

const playerStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },

  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },

  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: (ICON_PLAY_BUTTON.width * 3.0) / 2.0,
    maxWidth: (ICON_PLAY_BUTTON.width * 3.0) / 2.0,
  },

  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});
