'use strict';
import React, { Component } from 'react';
import { StatusBar, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from './styles';
import colors from '../../assets/colors';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

//Import screen
import DashBoard from '../DashBoard/DashBoard';
import Groups from '../Groups/Groups';
import Messages from '../Messages/Messages';
// import Notifications from '../Notifications/Notifications';
import Settings from '../Settings/Settings';
import Logout from '../Logout/Logout';
import CustomSidebarMenu from './CustomSidebarMenu';

const Dashboard_StackNavigator = createStackNavigator({
  //All the screen from the DashBoard will be indexed here
  DashBoard: {
    screen: DashBoard,
    navigationOptions: {
      headerShown: false
    }
  }
});
const Groups_StackNavigator = createStackNavigator({
  //All the screen from the Article will be indexed here
  Groups: {
    screen: Groups,
    navigationOptions: {
      headerShown: false
    }
  }
});

const Messages_StackNavigator = createStackNavigator({
  //All the screen from the Referral will be indexed here
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerShown: false
    }
  }
});
// const Notifications_StackNavigator = createStackNavigator({
//   //All the screen from the Referral will be indexed here
//   Notifications: {
//     screen: Notifications,
//     navigationOptions: {
//       headerShown: false
//     }
//   }
// });
const Settings_StackNavigator = createStackNavigator({
  //All the screen from the Referral will be indexed here
  Settings: {
    screen: Settings,
    navigationOptions: {
      headerShown: false
    }
  }
});
const Logout_StackNavigator = createStackNavigator({
  //All the screen from the Referral will be indexed here
  Logout: {
    screen: Logout,
    navigationOptions: {
      headerShown: false
    }
  }
});

const DrawerNavigator = createDrawerNavigator(
  {
    Dashboard: {
      screen: Dashboard_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Home'
      }
    },
    Groups: {
      screen: Groups_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Groups'
      }
    },
    Messages: {
      screen: Messages_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Messages'
      }
    },
    // Notifications: {
    //   screen: Notifications_StackNavigator,
    //   navigationOptions: {
    //     drawerLabel: 'Notifications'
    //   }
    // },
    Settings: {
      screen: Settings_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Settings'
      }
    },
    Logout: {
      screen: Logout_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Logout'
      }
    }
  },
  {
    contentComponent: CustomSidebarMenu,
    drawerWidth: 250,
    contentOptions: {
      activeTintColor: colors.gold
    }
  }
);

export default createAppContainer(DrawerNavigator);
