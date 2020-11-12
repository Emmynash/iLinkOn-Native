'use strict';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  AsyncStorage,
  StyleSheet,
} from 'react-native';
import styles from './styles';
import { UserLogoutEndpoint, getProfile } from '../Utils/Utils';
import DropdownAlert from 'react-native-dropdownalert';
import { ProgressDialog } from 'react-native-simple-dialogs';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      title: '',
      message: '',
      showAlert: false,
      showLoading: false,
    };
  }
  async componentDidMount() {
    await this.handleLogout();
  }

  handleLogout = async () => {
    this.showLoadingDialogue();
    try {
      await AsyncStorage.clear();
      return await this.props.navigation.navigate('Login');
    } catch (err) {
      console.log(`The error is: ${err}`);
    }
  };

  showLoadingDialogue = () => {
    this.setState({
      showLoading: true,
    });
  };

  hideLoadingDialogue = () => {
    this.setState({
      showLoading: false,
      restoring: false,
    });
  };

  showNotification = (type, title, message) => {
    this.hideLoadingDialogue();
    return this.dropDownAlertRef.alertWithType(type, title, message);
  };

  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='white' barStyle='default' />
        <Image
          source={require('../../assets/images/splash.png')}
          style={StyleSheet.flatten(styles.logoIcon)}
        />
        {/* <ProgressDialog
        visible={this.state.showLoading}
        title="Processing"
        message="Please wait..."
      /> */}
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
      </SafeAreaView>
    );
  }
}
