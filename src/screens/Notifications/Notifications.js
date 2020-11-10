'use strict';
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { SubmitButton, ErrorAlert, DisplayText } from '../../components';
import styles from './styles';
import { getProfile, getExpoToken, NotificationEndpoint } from '../Utils/Utils';
import { ProgressDialog } from 'react-native-simple-dialogs';

const Notification = ({ navigation }) => {
  const { navigate } = useNavigation();
  const [showLoading, setShowLoading] = useState(false),
    [data, setData] = useState([]),
    [showAlert, setShowAlert] = useState({
      showAlert: false,
      message: '',
    });

  useEffect(() => {
    _checkToken();
  }, []);

  const _checkToken = async () => {
    let profile = await getProfile();
    let expoToken = await getExpoToken();
    let token = profile.access_token;
    await postToken(expoToken, token);
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
  const handleCloseNotification = () => {
    return setShowAlert({
      showAlert: false,
    });
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
    console.log('check status', settings);
    if (res.meta.status >= 300) {
      hideLoadingDialogue();
      setShowAlert({
        showAlert: true,
        message: res.meta.message,
      });
    } else if (res.meta.status == 200 && res.meta.status < 300) {
      hideLoadingDialogue();
      return navigate('Login');
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

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle='dark-content' />
      <View style={styles.searchView}>
        <TouchableOpacity style={{ padding: 8 }} onPress={toggleDrawers}>
          <Image
            onPress={toggleDrawers}
            source={require('../../assets/images/menu.png')}
            style={StyleSheet.flatten(styles.searchIcon)}
          />
        </TouchableOpacity>
        <DisplayText
          styles={StyleSheet.flatten(styles.headerTxt)}
          text={'Notification'}
        />
        <TouchableOpacity style={styles.headerView}></TouchableOpacity>
      </View>
      {/* <FlatList
        //data={data}          
        renderItem={renderRow}
        keyExtractor={data => data._id}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        showsVerticalScrollIndicator={false}
      /> */}

      <ProgressDialog
        visible={showLoading}
        title='Processing'
        message='Please wait...'
      />
      <ErrorAlert
        title={'Error!'}
        message={showAlert.message}
        handleCloseNotification={handleCloseNotification}
        visible={showAlert.showAlert}
      />
    </View>
  );
};

export default Notification;
