'use strict';
import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Text
} from 'react-native';
import { DisplayText, SingleButtonAlert, SubmitButton } from '../../components';
import styles from './styles';
import OtpInputs from 'react-native-otp-inputs';
import colors from '../../assets/colors';
import {
  VerificationEndpoint,
  getRoute,
  getProfile,
  postWithToken,
  ProfileEndpoint
} from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';

export default class Verification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      showLoading: false,
      title: '',
      message: '',
      token: '',
      id: '',
      otp: ''
    };
  }

  async componentDidMount() {
    let profile = await getProfile();

    this.setState({
      token: profile.access_token
    });
    // await this.handleGetProfile();
  }

  handleCloseVerification = () => {
    return this.props.navigation.navigate('Register');
  };
  handleCloseNotification = () => {
    return this.setState({
      showAlert: false
    });
  };
  handleGetProfile = () => {
    const { token } = this.state;
    this.setState({
      showLoading: true
    });
    let endPoint = `${ProfileEndpoint}`;

    getRoute(endPoint, token)
      .then(res => {
        if (typeof res.message !== 'undefined' || typeof res.message === '') {
          return this.setState({
            showLoading: false,
            title: 'Alert',
            message: res.message,
            showAlert: true
          });
        } else {
          const id = res.data.id;
          this.setState({
            showLoading: false,
            id: id
          });
        }
      })
      .catch(res => {
        this.setState({
          showLoading: false,
          tittle: 'Alert',
          message: res.message,
          showAlert: true
        });
      });
  };

  handleSend = () => {
    // const {id, token, otp} = this.state
    // this.setState({
    //   showLoading: true,
    // });
    // // const {navigation} = this.props,
    // // id = navigation.getParam('id', 'no_id'),
    // // token = navigation.getParam('token', 'no_id'),
    // let endPoint = `${VerificationEndpoint}${id}/${'phone'}`;

    // let data = JSON.stringify({
    //   'otp' : otp,
    // });
    // postWithToken(endPoint, data, token)
    //   .then((res) => {
    //     if (typeof res.message !== 'undefined' ) {
    //       this.setState({
    //         showLoading : false,
    //         title : 'Alert',
    //         message : res.message,
    //         showAlert : true,
    //       });
    //       this.props.navigation.navigate('DashBoard');

    //     }
    //     else{
    //       this.setState({
    //         showLoading : false,
    //         title : 'Alert',
    //         message : res.message,
    //         showAlert : true,
    //       });
    //       this.props.navigation.navigate('DashBoard');
    //     }
    //   })
    //   .catch((res) => {
    //     this.setState({
    //       showLoading : false,
    //       messageKey : 'Message',
    //       errorMessage : res.message,
    //       visible : true,
    //     });

    //   })
    return this.props.navigation.navigate('Navigations');
  };
  handleResend = () => {};
  render() {
    const { showAlert, showLoading, title, message } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <TouchableOpacity
          onPress={this.handleCloseVerification}
          style={styles.closeView}
        >
          <Image
            source={require('../../assets/images/back.png')}
            style={StyleSheet.flatten(styles.closeIcon)}
          />
        </TouchableOpacity>
        <DisplayText
          text={'Verify your \nphone number'}
          styles={styles.Verification}
        />
        <View style={styles.textView1}>
          <DisplayText
            text={"Check your SMS message. We've sent the confirmation"}
            styles={styles.msgText2}
          />
        </View>

        <KeyboardAvoidingView style={styles.optView}>
          <OtpInputs
            handleChange={code =>
              this.setState({
                otp: code
              })
            }
            focusedBorderColor={'#ffffff'}
            numberOfInputs={4}
            inputContainerStyles={styles.inputContiner}
          />
        </KeyboardAvoidingView>

        <View style={styles.textView}>
          <Text style={styles.msgText}>
            {"Did't recieve SMS? "}
            <Text onPress={this.handleResend} style={styles.resend}>
              {'Resend code '}
            </Text>
          </Text>
        </View>

        <SubmitButton
          title={'Verify'}
          onPress={this.handleSend}
          btnStyle={styles.buttonBorder}
          titleStyle={styles.btnText}
        />
        <ProgressDialog
          visible={showLoading}
          title='Processing'
          message='Please wait...'
        />
        <SingleButtonAlert
          title={title}
          message={message}
          handleCloseNotification={this.handleCloseNotification}
          visible={showAlert}
        />
      </SafeAreaView>
    );
  }
}
