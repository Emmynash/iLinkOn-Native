'use strict';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import { getUserDetails, getProfileImage } from '../Utils/Utils';
import colors from '../../assets/colors';
import styles from './styles';
import theme from '../../assets/theme';

const groups = require('../../assets/images/group.png'),
  messages = require('../../assets/images/messages.png'),
  home = require('../../assets/images/home.png'),
  settings = require('../../assets/images/settings.png'),
  logout = require('../../assets/images/logout.png');

export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    (this.state = {
      token: '',
      email: '',
      name: '',
      firstname: '',
      lastname: '',
      phone: '',
      id: '',
      message: '',
      username: '',
      profileImage:
        'http://res.cloudinary.com/https-cyberve-com/image/upload/v1584886506/pre61jvaz0nrrmoudwxr.jpg',
    }),
      (this.items = [
        {
          navOptionThumb: home,
          navOptionName: 'Home',
          screenToNavigate: 'DashBoard',
        },
        {
          navOptionThumb: groups,
          navOptionName: 'Groups',
          screenToNavigate: 'Groups',
        },
        {
          navOptionThumb: messages,
          navOptionName: 'Messages',
          screenToNavigate: 'Messages',
        },
        {
          navOptionThumb: settings,
          navOptionName: 'Settings',
          screenToNavigate: 'Settings',
        },
        {
          navOptionThumb: logout,
          navOptionName: 'Logout',
          screenToNavigate: 'Logout',
        },
      ]);
  }

  async componentDidMount() {
    await this.checkProfile();
  }
  checkProfile = async () => {
    const profile = await getUserDetails();
    try {
      if (profile.data) {
        let image = ''
        if (profile.data.profilePhoto.split(':')[0] === 'http') {
          let secure_url = 'https:' + profile.data.profilePhoto.split(':')[1]
          image = secure_url;
        } else {
          image = profile.data.profilePhoto;
        }
        const email = profile.data.email,
          firstname = profile.data.fName,
          profileImage = image,
          lastname = profile.data.lName;
        this.setState({
          firstname,
          lastname,
          email,
          profileImage,
        });
      }
    } catch (error) {}
  };

  handleLogout = () => {
    return this.props.navigation.navigate('Logout');
  };

  render() {
    const { firstname, email, id, profileImage } = this.state;
    return (
      <SafeAreaView style={styles.sideMenuContainer}>
        <StatusBar backgroundColor='white' barStyle={'dark-content'} />
        {/*Top Large Image */}
        <View style={styles.drawerImageView}>
          <View style={styles.imageView}>
            <Image
              style={styles.sideMenuProfileIcon}
              source={{ uri: profileImage }}
            />
          </View>

          <View style={styles.userDetailView}>
            {firstname ? (
              <Text style={styles.txtName}>Hi, {`${firstname}`}</Text>
            ) : (
              <Text style={styles.txtName}>{''}</Text>
            )}

            {email ? (
              <Text style={styles.txtuser}>{email}</Text>
            ) : (
              <Text style={styles.txtuserName}>{''}</Text>
            )}
          </View>
        </View>
        {/*Divider between Top Image and Sidebar Option*/}
        {/* <View style={styles.divider}/> */}
        {/*Setting up Navigation Options from option array using map*/}
        <View
          style={{
            width: '75%',
            marginLeft: 8,
            marginTop: 20,
          }}
        >
          {this.items.map((item, key) => (

            <TouchableOpacity
              key={key}
              onPress={() => {
                global.currentScreenIndex = key;
                this.props.navigation.navigate(item.screenToNavigate);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                backgroundColor:
                  global.currentScreenIndex === key
                    ? colors.darkSilver
                    : colors.white,
                // borderLeftWidth: global.currentScreenIndex === key ? 4 : 0,
                borderColor: theme.primaryColor,
                // marginVertical: 4,
                borderRadius: theme.btnRadius,
                height: 48,
              }}
            >
              <View style={{ marginRight: 10, marginLeft: 12 }}>
                <Image
                  source={item.navOptionThumb}
                  style={[
                    styles.draweIcon,
                    {
                      tintColor:
                        global.currentScreenIndex === key
                          ? colors.darkGray
                          : colors.darkGray,
                    },
                  ]}
                  key={key}
                  onPress={() => {
                    global.currentScreenIndex = key;
                    this.props.navigation.navigate(item.screenToNavigate, {
                      id: id,
                    });
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: theme.secondaryFont,
                  color:
                    global.currentScreenIndex === key
                      ? colors.darkGray
                      : colors.darkSilver,
                }}
                key={key}
                onPress={() => {
                  global.currentScreenIndex = key;
                  this.props.navigation.navigate(item.screenToNavigate, {
                    id: id,
                  });
                }}
              >
                {item.navOptionName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }
}
