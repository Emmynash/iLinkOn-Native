// 'use strict';
import React, { Component, useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import colors from '../../assets/colors';
import styles from './styles';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { DisplayText } from '../../components';
import { useNavigation } from 'react-navigation-hooks';

import {
  CreateThreadEndpoint,
  getUserDetails,
  GetAllMessageEndPoint,
  getRouteToken,
  WebSocketEndpoint,
  getProfile,
} from '../Utils/Utils';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';

const ChatHooks = ({ navigation }) => {
  const { navigate } = useNavigation();
  const ws = useRef(null);
  const [messages, setMessages] = useState([]),
    [inputBarText, setInputBarText] = useState(''),
    [id, setID] = useState(''),
    [token, setToken] = useState(''),
    [message, setMessage] = useState(''),
    [title, setTitle] = useState(''),
    [time, setTime] = useState(''),
    [name, setName] = useState(''),
    [responseMessage, setResponseMessage] = useState(''),
    [adminTime, setAdminTime] = useState(''),
    [showLoading, setShowLoading] = useState(false),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    }),
    [displayPhoto, setDisplayPhoto] = useState(''),
    [threadId, setThreadId] = useState(''),
    // [ws, setWs] = useState(null),
    [secondUsername, setSecondUsername] = useState(''),
    [profilePhoto, setProfilePhoto] = useState(
      'https://gravatar.com/avatar/02bf38fddbfe9f82b94203336f9ebc41?s=200&d=retro'
    );
  let timeout = 250; // Initial timeout duration as a class variable

  useEffect(() => {
    // connect();
    console.log(ws.current);
    let profile = getProfile();
    const token = profile.access_token;
    let ws = new WebSocket(`wss://ilinkon.herokuapp.com/?token=${token}`);
    var connectInterval;

    ws.onopen = () => {
      console.log('connected websocket main component', ws);
      setWs(ws);
      timeout = 250; // reset timer to 250 on open of websocket
      clearTimeout(connectInterval); // clear Interval onOpen of websocket
    };

    ws.onmessage = (e) => {
      console.log('message loaded');
      const message = JSON.parse(e.data);
      (time = message.createdAt),
        (newDate = moment(time).startOf('second').fromNow());
      let body = `${message}\n${newDate}\n${secondUsername}`;
      return messages.push({ direction: 'left', text: body });
    };
    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (timeout + timeout) / 1000
        )} second.`,
        e.reason
      );
      timeout = timeout + timeout; //increment retry interval
      connectInterval = setTimeout(check, Math.min(10000, timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.log();
      'Socket encountered error: ', err.message, 'Closing socket';
      ws.close();
    };
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    _getChatMessages();
  }, []);

  const _getChatMessages = async () => {
    const data = navigation.getParam('data'),
      item = navigation.getParam('item'),
      profile = await getProfile(),
      userDetails = await getUserDetails(),
      token = profile.access_token,
      name = userDetails.fName,
      id = userDetails.id;
    setToken(token);
    setName(name);
    setThreadId(data.id);
    setSecondUsername(item.fName || item.name);
    setProfilePhoto(item.profilePhoto || item.displayPhoto);
    let threadId = data.id;
    await handleGetAllMessage(threadId, token);
  };
  const showLoadingDialogue = () => {
    setShowLoading(true);
  };

  const hideLoadingDialogue = () => {
    setShowLoading(false);
  };

  // const showNotification = (type, title, message, ) => {
  //   hideLoadingDialogue();
  //   return dropDownAlertRef.alertWithType(type, title, message);
  // }

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  const connect = async () => {
    let profile = await getProfile();
    const token = profile.access_token;
    let ws = new WebSocket(`wss://ilinkon.herokuapp.com/?token=${token}`);
    var connectInterval;

    ws.onopen = () => {
      console.log('connected websocket main component');
      // setWs(ws)
      timeout = 250; // reset timer to 250 on open of websocket
      clearTimeout(connectInterval); // clear Interval onOpen of websocket
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (timeout + timeout) / 1000
        )} second.`,
        e.reason
      );
      timeout = timeout + timeout; //increment retry interval
      connectInterval = setTimeout(check, Math.min(10000, timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.warn();
      'Socket encountered error: ', err.message, 'Closing socket';
      ws.close();
    };
  };

  /**
   * @function connect to check if the connection is close, if so attempts to reconnect
   */
  const check = () => {
    if (!ws || ws.readyState == WebSocket.CLOSED) connect();
  };

  const _sendMessage = () => {
    messages.push({ direction: 'right', text: inputBarText });
    let inputMessage = inputBarText.toString();
    let data = JSON.stringify({
      threadId: threadId,
      text: inputMessage,
    });
    setMessages(messages);
    setInputBarText('');
    try {
      ws.send(data); //send data to the server
      console.log('message send', data);
    } catch (error) {
      console.log(error); // catch error
    }
  };

  const handleGetAllMessage = async (threadId, token) => {
    showLoadingDialogue();
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
    // console.log('dfdfdfdfdfdfdfdfdfdfdfd', res)
    if (res.meta.status >= 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message,
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      const dataResponse = res.data.messages;
      handleConvertData(dataResponse);
      hideLoadingDialogue();
      setShowAlert({
        showLoading: false,
        message: dataResponse,
      });
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: dataResponse,
      });
    } else {
      if (res.meta.message) {
        hideLoadingDialogue();
        setShowAlert({
          showAlert: true,
          message: res.meta.message,
        });
      }
    }
  };

  const handleConvertData = async (dataResponse) => {
    let userDetails = await getUserDetails();
    let userid = userDetails.data.id;
    dataResponse.forEach((data) => {
      console.log('user......check', userDetails.data.id);
      const message = data.text,
        time = data.createdAt,
        newDate = moment(time).startOf('minute').fromNow();
      if (data.sender.id == userid) {
        let body = `${message}\n${newDate}`;
        return setMessages((msg) =>
          msg.concat({ direction: 'right', text: body })
        );
      } else {
        let body = `${message}\n${newDate}\n${secondUsername}`;
        return setMessages((messages) =>
          messages.concat({ direction: 'left', text: body })
        );
      }
    });
  };

  const _onChangeInputBarText = (text) => {
    setInputBarText(text);
  };

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.

  //This is to navigate back to the supportdesk
  const handleBackPress = () => {
    return navigate('Messages');
  };

  // const _messageBubble = () => {
  //   let new_messages = [];
  //   return (

  //     messages.forEach(function (message, index) {
  //       new_messages.push(
  //         <MessageBubble key={index} direction={message.direction} text={`${message.text} ${time}`} />
  //       );
  //     })
  //   )
  // }

  return (
    <SafeAreaView style={styles.outer}>
      <StatusBar barStyle={'dark-content'} />
      {/* <DropdownAlert ref={ref => dropDownAlertRef = ref} /> */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.headerImage}>
          <Image
            onPress={handleBackPress}
            source={require('../../assets/images/back.png')}
            style={StyleSheet.flatten(styles.headerIcon)}
          />
        </TouchableOpacity>
        <View style={styles.nameView}>
          <Image
            source={{ uri: profilePhoto }}
            style={StyleSheet.flatten(styles.profileIcon)}
          />
          <DisplayText
            styles={StyleSheet.flatten(styles.txtHeader)}
            text={secondUsername}
          />
        </View>
      </View>
      {/* toolbar */}
      <ScrollView
        // ref={(ref) => { scrollView = ref }}
        style={styles.messages}
      >
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
        {/* {messages} */}
      </ScrollView>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textBox}
          placeholder='Enter message here'
          multiline={true}
          onChangeText={(text) => _onChangeInputBarText(text)}
          value={inputBarText}
          // ref={(ref) => { autogrowInput = ref }}
          // defaultHeight={35}
          // onContentSizeChange={() => _onInputSizeChange()}
        />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => _sendMessage()}
        >
          {/* <Text style={{color: 'white'}}>Send</Text> */}
          <Image
            source={require('../../assets/images/send_button.png')}
            style={styles.sendIcon}
          />
        </TouchableHighlight>
      </View>
      <KeyboardSpacer />
      <ProgressDialog
        visible={showLoading}
        title='Processing'
        message='Please wait...'
      />
    </SafeAreaView>
  );
};
export default ChatHooks;

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
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}

//The bar at the bottom with a textbox and a send button.
// class InputBar extends Component {

//   //AutogrowInput doesn't change its size when the text is changed from the outside.
//   //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
//   //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
//   //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
//   //of the InputBar's text to be set from the outside.
//   // componentWillReceiveProps(nextProps) {
//   //   if (nextProps.text === '') {
//   //     this.autogrowInput.resetInputText();
//   //   }
//   // }

//   render() {
//     return (
//       <View style={styles.inputBar}>
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
