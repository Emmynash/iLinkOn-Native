import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { StatusBar } from 'react-native';
import DashBoard from '../screens/DashBoard/DashBoard';
import ForgetPassword from '../screens/ForgetPassword/ForgetPassword';
import Login from '../screens/Login/Login';
import Logout from '../screens/Logout/Logout';
import Navigations from '../screens/Navigations/Navigations';
import BoardingScreen from '../screens/BoardingScreen/BoardingScreen';
import Profile from '../screens/Profile/Profile';
import Register from '../screens/Register/Register';
import PrivacyTerms from '../screens/PrivacyTerms/PrivacyTerms';
import GroupMembers from '../screens/GroupMembers/GroupMembers';
import VerifyOtp from '../screens/VerifyOtp/VerifyOtp';
import Chat from '../screens/Chat/Chat';
import CreateEvent from '../screens/CreateEvent/CreateEvent';
import EventDetail from '../screens/EventDetail/EventDetail';
import CreateGroup from '../screens/CreateGroup/CreateGroup';
import GroupDetail from '../screens/GroupDetail/GroupDetail';
import Groups from '../screens/Groups/Groups';
import FindGroup from '../screens/FindGroup/FindGroup';
import JoinGroup from '../screens/JoinGroup/JoinGroup';
import RemoveGroup from '../screens/RemoveGroup/RemoveGroup';
import UpdateGroup from '../screens/UpdateGroup/UpdateGroup';
import Messages from '../screens/Messages/Messages';
import Notifications from '../screens/Notifications/Notifications';
import Settings from '../screens/Settings/Settings';
import UpdateProfile from '../screens/UpdateProfile/UpdateProfile';
import ChatHooks from '../screens/Chat/ChatHooks';
const OnBoardingStack = createStackNavigator({
  BoardingScreen: {
    screen: BoardingScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  // SplashScreen: {
  //   screen: SplashScreen,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
});

const AuthStack = createStackNavigator({

  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      headerShown: false
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      headerShown: false
    }
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: {
      headerShown: false
    }
  },

  VerifyOtp: {
    screen: VerifyOtp,
    navigationOptions: {
      headerShown: false
    }
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      headerShown: false
    }
  }
});

const MenuStack = createStackNavigator({
  Navigations: {
    screen: Navigations,
    navigationOptions: {
      headerShown: false
    }
  },
  DashBoard: {
    screen: DashBoard,
    navigationOptions: {
      headerShown: false
    }
  },
  CreateGroup: {
    screen: CreateGroup,
    navigationOptions: {
      headerShown: false
    }
  },
  GroupDetail: {
    screen: GroupDetail,
    navigationOptions: {
      headerShown: false
    }
  },
  Groups: {
    screen: Groups,
    navigationOptions: {
      headerShown: false
    }
  },
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerShown: false
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      headerShown: false
    }
  },

  ChatHooks: {
    screen: ChatHooks,
    navigationOptions: {
      headerShown: false
    }
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      headerShown: false
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      headerShown: false
    }
  },
  CreateEvent: {
    screen: CreateEvent,
    navigationOptions: {
      headerShown: false
    }
  },
  GroupMembers: {
    screen: GroupMembers,
    navigationOptions: {
      headerShown: false
    }
  },
  EventDetail: {
    screen: EventDetail,
    navigationOptions: {
      headerShown: false
    }
  },
  FindGroup: {
    screen: FindGroup,
    navigationOptions: {
      headerShown: false
    }
  },
  JoinGroup: {
    screen: JoinGroup,
    navigationOptions: {
      headerShown: false
    }
  },
  RemoveGroup: {
    screen: RemoveGroup,
    navigationOptions: {
      headerShown: false
    }
  },
  UpdateGroup: {
    screen: UpdateGroup,
    navigationOptions: {
      headerShown: false
    },
  },
  UpdateProfile: {
    screen: UpdateProfile,
    navigationOptions: {
      headerShown: false
    }
  },
  PrivacyTerms: {
    screen: PrivacyTerms,
    navigationOptions: {
      headerShown: false
    }
  }
});

const AppSwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: BoardingScreen,
    Splash: OnBoardingStack,
    Auth: AuthStack,
    Menu: MenuStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default createAppContainer(AppSwitchNavigator);
