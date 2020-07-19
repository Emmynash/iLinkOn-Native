'use strict';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ImageBackground, Text } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { SubmitButton } from '../../components';
import styles from './styles';
import { getProfile } from '../Utils/Utils';

const RemoveGroup = () => {
  const { navigate } = useNavigation(),
    [restoring, setRestoring] = useState(true);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     let profile = await getProfile();
  //     if (typeof profile.access_token !== 'undefined') {
  //       console.log('hellologin', profile.access_token);
  //       return navigate('Navigations');
  //     } else {
  //       return setRestoring(false);
  //     }
  //   };
  //   checkLogin();
  // }, []);
  return(
    <View style={{
      backgroundColor:'gray',
      color:'white',
      flex:1,
      justifyContent:'center',
      alignItems:'center',

    }}>
      <Text>Hello World</Text>
    </View>
  )

  
};

export default RemoveGroup;
