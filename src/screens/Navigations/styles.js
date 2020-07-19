import { StyleSheet, Dimensions, Platform } from 'react-native';
const window = Dimensions.get('window');
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
    // backgroundColor: 'rgba(0,0,0,0.49)'
  },
  navbarStyle: {
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
    height: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
    backgroundColor: colors.green,
    borderBottomWidth: 1,
    borderBottomColor: colors.green
  },
  headerItem: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.divider
  },
  imageLogo: {
    height: 20,
    width: 20,
    tintColor: theme.colorAccent,
    marginLeft: 16
  },
  // profileTxt: {
  //   fontSize: theme.MediumFont,
  //   fontFamily: theme.primaryFont,
  //   color: theme.colorAccent,
  // },
  // backIcon: {
  //   height: 20,
  //   width: 20,
  //   tintColor: theme.colorAccent,
  // },
  // toolbarView : {
  //   width : '100%',
  //   justifyContent : 'center',
  //   alignItems : 'center',
  //   paddingRight : 24
  // },
  // headerItem : {
  //   height : 150,
  //   backgroundColor : theme.height,
  //   justifyContent : 'center',
  //   alignItems : 'center',
  // },
  // touchView : {
  //   flexDirection : 'row',
  //   backgroundColor : colors.green,
  //   alignItems : 'center',
  //   height : 50,
  //   paddingLeft : 16,
  //   position : 'relative',
  //   bottom : 0,
  // },
  // imageStyle : {
  //   height : 60,
  //   width : 60,
  //   borderRadius : 100
  // },
  // logoutIcon : {
  //   height : 18,
  //   width : 18,
  //   tintColor : theme.colorAccent,
  // },
  // LogoutTxt : {
  //   fontSize : 14,
  //   fontFamily : theme.primaryFont,
  //   color : theme.colorAccent,
  //   paddingLeft : 8
  // },
  drawerImageView: {
    flexDirection: 'column',
    height: '25%',
    elevation: 1,
    shadowColor: theme.whiteShade,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.56,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: colors.yellow,
    paddingTop: 8,
  },
  imageView: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.whiteGray,
    overflow: 'hidden',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.56
  },
  userDetailView: {
    flexDirection: 'column'
    // paddingTop : 16,
  },
  txtuser: {
    fontFamily: theme.primaryFont,
    marginLeft: 20,
    color: colors.white,
    marginBottom: 4
  },

  draweIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
  txtName: {
    fontFamily: theme.LightFont,
    fontSize: theme.LargeFont,
    marginLeft: 20,
    color: colors.whiteShade,
    marginTop: 4,

  },
  txtuserName: {
    fontFamily: theme.LightFont,
    fontSize: theme.SmallerFont,
    marginLeft: 20,
    color: theme.whiteShade
  },
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  sideMenuProfileIcon: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
    // marginVertical: 8
  },
  navToolbar: {
    paddingLeft: 10,
    color: theme.colorAccent
  },
  imageMore: {
    height: 18,
    width: 18,
    tintColor: colors.white
  },
  overflowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.primaryColor,
    marginRight: 4
  },
  txtEmail: {
    fontFamily: theme.secondaryFont,
    fontSize: theme.MediumFont,
    marginLeft: 15,
    textAlign: 'center'
  },
  logoutView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: 52,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  logoutIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.darkGray
  },
  logoutText: {
    fontFamily: theme.LightFont,
    fontSize: theme.MediumFont,
    color: colors.darkGray,
    marginLeft: 8
  }
});
