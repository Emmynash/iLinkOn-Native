import { StyleSheet, Platform } from 'react-native';
import theme from '../../assets/theme';
import colors from '../../assets/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

let styles = StyleSheet.create({
  container: {},
  wrapper: {
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    // backgroundImage,
  },
  headerView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper_bg_image: {
    marginBottom: -200,
    // justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.3,
  },
  backgroundImage: {
    width: 250,
    height: 250,
    marginTop: Platform.OS === 'ios' ? 10 : 40,
  },
  // backBtnView: {
  //   width: 50,
  //   height: 35,
  //   backgroundColor: 'transparent',
  //   borderRadius: 20,
  //   marginTop: Platform.OS === 'ios' ? 8 : 20,
  //   justifyContent: 'center',
  //   // alignItems: 'center'
  //   paddingLeft: 4
  // },
  // backImage: {
  //   resizeMode: 'contain',
  //   width: 18,
  //   height: 18,
  //   tintColor: theme.primaryTextColor
  // },
  SignupTxt: {
    fontFamily: theme.headerFont,
    fontSize: theme.SmallerFont,
    marginVertical: 1,
    color: colors.black,
  },
  ResendOTP: {
    fontFamily: theme.LightFont,
    fontSize: 12,
    marginVertical: 2,
    color: colors.black,
  },
  tryAgain: {
    fontFamily: theme.headerFont,
    fontSize: 13,
    marginVertical: 2,
    color: colors.red,
    marginLeft: 10,
  },
  LoginTxt: {
    fontFamily: theme.LightFont,
    fontSize: theme.SmallerFont,
    marginVertical: 4,
    color: theme.textGray,
  },
  Signup: {
    fontFamily: theme.headerFont,
    fontSize: theme.SmallFont,
    color: colors.darkGray,
    marginTop: 2,
  },

  socialButtonView: {
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
  },
  // buttonFacebook: {
  //   borderRadius: theme.btnRadius,
  //   width: '90%',
  //   height: 52,
  //   backgroundColor: theme.buttonBlue,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   paddingRight: 8,
  //   elevation: 2,
  //   shadowColor: theme.primaryTextColor,
  //   shadowOffset: { height: 2, width: 0 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3.0
  // },

  buttonTwiiter: {
    borderRadius: 60,
    width: '48%',
    height: 50,
    backgroundColor: theme.btnTwiiter,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 8,
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
  },
  iconBtn: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginHorizontal: 8,
    tintColor: theme.colorAccent,
  },
  txtNormal: {
    fontFamily: theme.LightFont,
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    alignSelf: 'center',
    marginVertical: 4,
  },
  txtTerms: {
    fontFamily: theme.headerFont,
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 16,
  },
  txtForgot: {
    fontFamily: theme.LightFont,
    color: theme.primaryTextColor,
    fontSize: theme.thinyFont,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 8,
  },
  inputField: {
    paddingVertical: 20,
    width: '100%',
    borderRadius: 16,
    marginTop: 24,
  },
  txtLogin: {
    fontFamily: theme.headerFont,
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 10,
  },
  txtLogin1: {
    fontFamily: theme.headerFont,
    color: colors.orange,
    fontSize: theme.SmallerFont,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 16,
  },
  textInputView: {
    width: '100%',
    height: 50,
    borderRadius: theme.inputRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 28,
    paddingLeft: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gray,
    marginVertical: 8,
    // borderWidth: 1,
    // borderColor: colors.black,
  },
  iconForm: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: colors.darkGray,
    borderRadius: 4,
  },
  buttonSignUp: {
    width: '96%',
    height: 52,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    fontSize: theme.SmallFont,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonTxt: {
    fontFamily: theme.secondaryHeader,
    color: theme.whiteShade,
    fontSize: theme.SmallerFont,
    alignSelf: 'center',
  },
  loginTxt: {
    fontFamily: theme.headerFont,
    color: theme.whiteShade,
    fontSize: theme.SmallFont,
    alignSelf: 'center',
    fontWeight: '900',
  },
  linkView: {
    position: 'relative',
    bottom: 0,
  },
  lastTxt: {
    color: theme.colorAccent,
    fontSize: theme.MediumFont,
    fontFamily: theme.LightFont,
  },
  nextTxt: {
    color: theme.primaryTextColor,
    fontSize: theme.MediumFont,
    fontFamily: theme.LightFont,
  },
  loginImg: {
    width: '100%',
    // height: 90,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: -80,
    left: 0,
    right: 0,
    shadowColor: theme.whiteShade,
    shadowOffset: { height: 0, width: 4 },
    shadowOpacity: 2.56,
    shadowRadius: 3.0,
  },
  iconDoor: {
    width: 50,
    resizeMode: 'contain',
    // alignSelf: 'center',
  },
  socialImage: {
    width: 120,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default styles;
