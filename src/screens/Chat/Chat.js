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
  UIManager
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import colors from '../../assets/colors';
import styles from './styles';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { DisplayText, KeyboardAvoid } from '../../components';
import DropdownAlert from 'react-native-dropdownalert';
import {
  CreateThreadEndpoint,
  getUserDetails,
  GetAllMessageEndPoint,
  getRouteToken,
  WebSocketEndpoint,
  getProfile
} from '../Utils/Utils'
import moment from 'moment';
const { State: TextInputState } = TextInput;


export default class Chat extends Component {

  constructor(props) {
    super(props)
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
      responseMessage: '',
      adminTime: '',
      showAlert: false,
      showLoading: false,
      displayPhoto: '',
      threadId: '',
      connection: null,
      profilePhoto: 'https://gravatar.com/avatar/02bf38fddbfe9f82b94203336f9ebc41?s=200&d=retro',
      secondUsername: '',
      shift: new Animated.Value(0),

    }

  }
  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  UNSAFE_componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);


  }

  componentWillUnmount() {
    this.mounted = false
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    this.state.connection.close()
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
    await this.connect()
    this.mounted = true
    const { navigation } = this.props,
      data = navigation.getParam('data'),
      item = navigation.getParam('item');
    let profile = await getProfile();
    let userDetails = await getUserDetails();
    console.log('dfdfdfddfdfdfdfdfdfd', item)
    const token = profile.access_token,
      name = userDetails.fName,
      id = userDetails.id;

    this.setState({
      token: token,
      userid: id,
      name: name,
      threadId: data.id,
      secondUsername: item.secondParticipantfName || item.name || item.member.fName,
      profilePhoto: item.secondParticipantProfilepic || item.displayPhoto || item.profilePhoto
    });
    await this.handleGetAllMessage();
    setTimeout(function () {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but 
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {

    setTimeout(function () {
      this.scrollView.scrollToEnd();
    }.bind(this))
  }
  _onInputSizeChange() {
    setTimeout(function () {
      this.scrollView.scrollToEnd({ animated: false });
    }.bind(this))
  }
  showLoadingDialogue = () => {
    this.setState({
      showLoading: true,
    });
  }
  // Hide Loading Spinner
  hideLoadingDialogue = () => {
    this.setState({
      showLoading: false,
    });
  }

  showNotification = (type, title, message, ) => {
    this.hideLoadingDialogue();
    return this.dropDownAlertRef.alertWithType(type, title, message);
  }

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = async () => {
    const { messages } = this.state;
    let profile = await getProfile();
    const token = profile.access_token;
    var endpoint = `wss://ilinkon.herokuapp.com/?token=${token}`
    // var endpoint = `wss://echo.websocket.org`
    var connection = new WebSocket(endpoint);
    let that = this;
    let connectInterval;

    // websocket onopen event listener
    connection.onopen = () => {
      this.setState({ connection: connection });
      console.log("connected websocket main component.........", connection.readyState);
      that.timeout = 250; // reset timer to 250 on open of websocket  
      clearTimeout(connectInterval); // clear Interval onOpen of websocket 
    };
    connection.onmessage = (e) => {
      // console.log('i am here', e.data)
      const messageResponse = JSON.parse(e.data);
      this.onMessageData(messageResponse);
    };

    // websocket onclose event listener
    connection.onclose = e => {
      console.log(
        `Socket is closed. attempt reconnecting in ${Math.min(
          10000 / 1000, (that.timeout + that.timeout) / 1000
        )} second.`,
        e
      );
      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    connection.onerror = err => {
      console.log();
      (
        "WebSocket encountered error: ",
        err,
        "Closing socket"
      );
      connection.close();
    };
  };

  /**
   * @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { connection } = this.state;
    if (!connection || connection.readyState == WebSocket.CLOSED) this.connect();
  };

  _sendMessage = () => {
    const { threadId, connection, inputBarText, messages } = this.state
    let inputMessage = inputBarText.toString();
    let time = moment()
      .utcOffset('+01:00')
      .format('hh:mm:a');
    let body = `${inputMessage}\n${time}`
    messages.push({ direction: "right", text: body });
    let data = JSON.stringify({
      'threadId': threadId,
      'text': inputMessage
    })
    this.setState({
      messages: this.state.messages,
      inputBarText: ''
    });
    try {
      connection.send(data) //send data to the server
    } catch (error) {
      console.log(error)
    }
  }

  handleGetAllMessage = async () => {
    const { token, id, threadId } = this.state;
    this.setState({
      showLoading: true
    });
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      },
    };
    let endpoint = `${GetAllMessageEndPoint}/${threadId}?page=1&pageSize=1`;
    const response = await fetch(endpoint, settings);
    const res = await response.json();
    if (res.meta.status >= 300) {
      this.setState({
        showAlert: true,
        showLoading: false,
        message: res.meta.message
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      const dataResponse = res.data.messages;
      this.handleConvertData(dataResponse)
      this.setState({
        showLoading: false,
        responseMessage: dataResponse,
      });
    } else {
      if (res.meta.message) {

        this.setState({
          showAlert: true,
          message: res.meta.message,
          showLoading: false

        });
      }
    }
  };
  handleConvertData = async (dataResponse) => {
    const { messages } = this.state;

    let userDetails = await getUserDetails()
    let userid = userDetails.data.id
    dataResponse.forEach((data) => {
      const message = data.text,
        time = data.createdAt,
        name = data.sender.fName,
        newDate = moment(time).startOf('minute').fromNow();
      if (data.sender.id == userid) {
        let body = `${message}\n${newDate}`
        return messages.push({ direction: "right", text: body });
      }
      else {
        let body = `${message}\n${newDate}\n${name}`
        return messages.push({ direction: "left", text: body });
      }
    })
  }
  onMessageData = async (msg) => {
    const { messages, userid } = this.state;
    const time = msg.message.createdAt,
      newDate = moment(time).startOf('second').fromNow(),
      sender_id = msg.message.sender.id,
      sendersName = msg.message.sender.fName;

    try {
      if (sender_id === userid) {
        let sender = `${msg.message.text}\n${newDate}`
        messages.push({ direction: "right", text: sender });
      } else if (sender_id !== userid) {
        let receiver = `${msg.message.text}\n${newDate}\n${sendersName}`
        return messages.push({ direction: "left", text: receiver, senderId: sender_id });
      }
    } catch (error) {
    }
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text
    });
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  //This is to navigate back to the supportdesk
  handleBackPress = () => {
    return this.props.navigation.goBack();
  }
  handleCloseNotification = () => {
    return this.setState({
      showAlert: false
    });
  }

  render() {
    const { showLoading, time, shift, messages, userid } = this.state;
    var newMessages = [];
    messages.forEach(function (message, index) {
      newMessages.push(
        <MessageBubble key={index} direction={message.direction} text={`${message.text} ${time}`} />
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
            style={styles.headerImage}>
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
          </View>
        </View>
        {
          Platform.OS === 'ios' ?
            <View style={styles.inputContainer}>
              <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messagesBubble}>
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
            :
            <Animated.View style={[styles.inputContainer, { transform: [{ translateY: shift }] }]}>
              <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messagesBubble}>
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
            </Animated.View>
        }

        <ProgressDialog
          visible={showLoading}
          title="Processing"
          message="Please wait..." />

      </SafeAreaView >
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends Component {
  render() {
    //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
    let leftSpacer = this.props.direction === 'left' ? null : <View style={{ width: 140 }} />;
    let rightSpacer = this.props.direction === 'left' ? <View style={{ width: 140 }} /> : null;

    let bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];

    let bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

    return (
      <View style={{
        justifyContent: 'space-between', flexDirection: 'row', marginBottom: 14
      }}>
        <StatusBar barStyle={'dark-content'} />

        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>
            {this.props.text}
          </Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}



// // //The bar at the bottom with a textbox and a send button.
// class InputBar extends Component {

//   // AutogrowInput doesn't change its size when the text is changed from the outside.
//   // Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
//   // Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
//   // was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
//   // of the InputBar's text to be set from the outside.
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.text === '') {
//       this.autogrowInput.resetInputText();
//     }
//   }

//   render() {
//     return (
//       <View style={styles.inputBar}>
//         <StatusBar barStyle={'dark-content'} />
//         <AutogrowInput style={styles.textBox}
//           ref={(ref) => { this.autogrowInput = ref }}
//           placeholder='Enter message here'
//           multiline={true}
//           defaultHeight={35}
//           onChangeText={(text) => this.props.onChangeText(text)}
//           onContentSizeChange={this.props.onSizeChange}
//           value={this.props.text} />
//         <TouchableHighlight
//           style={styles.sendButton}
//           onPress={() => this.props.onSendPressed()}
//         >
//           {/* <Text style={{color: 'white'}}>Send</Text> */}
//           <Image
//             source={require('../../assets/images/send_button.png')}
//             style={styles.sendIcon}
//           />
//         </TouchableHighlight>
//       </View>
//     );
//   }
// }