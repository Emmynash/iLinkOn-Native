import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  closeView: {
    width: 40,
    height: 40,
    marginLeft: 10,
    // marginTop : 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: theme.primaryColor
  },
  wrapper: {},
  textView1: {
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 18,
    paddingLeft: 20
  },
  textView: {
    justifyContent: 'flex-start',
    // alignItems: 'center',
    width: '90%',
    paddingTop: 20,
    flexDirection: 'row',
    marginTop: 16,
    alignSelf: 'center'
  },
  inputContiner: {
    width: '18%',
    height: 62,
    backgroundColor: theme.colorAccent,
    borderRadius: theme.inputRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: colors.text,
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2.56,
    marginVertical: 8,
    marginHorizontal: 8
  },
  Verification: {
    fontSize: theme.XlargeFont,
    color: colors.primaryTextColor,
    marginTop: 18,
    marginLeft: 28,
    fontFamily: theme.headerFont
    // alignSelf: 'flex-start'
  },
  msgText: {
    fontSize: 14,
    color: colors.dar,
    fontFamily: theme.LightFont,
    alignSelf: 'center',
    marginLeft: 20
  },
  msgText2: {
    fontSize: theme.SmallFont,
    color: theme.primaryTextColor,
    fontFamily: theme.LightFont,
    marginLeft: 10
  },
  resend: {
    fontSize: 14,
    color: 'tomato',
    fontFamily: theme.headerFont,
    alignSelf: 'center',
    marginLeft: 2
  },
  buttonBorder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 52,
    backgroundColor: theme.primaryColor,
    borderRadius: theme.btnRadius,
    marginTop: 8,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30
  },
  btnText: {
    fontSize: theme.MediumFont,
    color: colors.white,
    fontFamily: theme.headerFont,
    alignSelf: 'center'
  },

  // otp design
  optView: {
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});
