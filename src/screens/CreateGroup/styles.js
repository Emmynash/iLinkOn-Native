import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../assets/theme';
import colors from '../../assets/colors';

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: theme.colorAccent
  },
  headView: {
    width: '100%',
    height: Platform.OS === 'ios' ? 50 : 50
  },
  backLogo: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginTop: 10,
    marginLeft: 20
  },
  textView: {
    width: '60%',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingLeft: 20,
    marginTop: 20
  },
  profileImageView: {
    // width: '75%',
    width: '83%',
    height: 150,
    // paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.yellow,
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: theme.btnRadius,
    alignSelf: 'center'
  },
  profileContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 10
  },
  langDropDowm: {
    width: '98%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: Platform.OS === 'ios' ? 16 : 8,
  },
  profileDetails: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%',
    justifyContent: 'center',
    marginLeft: '10%'
  },
  imageView: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    left: 100
  },
  userProfileText: {
    fontFamily: theme.headerFont,
    fontSize: theme.LargeFont,
    color: theme.textGray
  },
  editProTxt: {
    color: theme.lightTextGRay
  },
  usernameText: {
    fontFamily: theme.headerFont,
    fontSize: theme.LargeFont,
    color: theme.colorAccent
  },
  emailText: {
    fontFamily: theme.primaryFont,
    fontSize: theme.SmallerFont,
    color: theme.whiteShade
  },
  formLabelText: {
    fontFamily: theme.primaryFont,
    fontSize: 15,
    fontWeight: '300',
    color: theme.darkText,
    marginLeft: 10
  },
  profileView: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: theme.colorAccent,
    elevation: 1,
    shadowColor: '#707070',
    shadowOffset: { height: 1, width: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    height: '99%',
    width: '99%',
    borderRadius: 50,
    overflow: 'hidden'
  },
  profilePlaceHolder: {
    height: '90%',
    width: '90%',
    borderRadius: 50,
    overflow: 'hidden'
  },
  cameraCont: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
    // bottom: 4,
    // right: 0
  },
  camera: {
    width: 35,
    height: 35,
    resizeMode: 'contain'
  },
  messageView: {
    width: '90%',
    paddingHorizontal: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.primaryTextColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 16
  },
  messageText: {
    fontFamily: theme.headerFont,
    fontSize: theme.MediumFont,
    color: '#707070'
  },
  mesageImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  },
  inputFieldView: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 280
  },
  textInputView: {
    width: '100%',
    height: 50,
    borderRadius: theme.inputRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 28,
    paddingLeft: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.darkText,
    marginVertical: 8
    // borderWidth: 1,
    // borderColor: colors.black,
  },
  nameTxtInputtView: {
    width: '50%',
    height: 40,
    borderRadius: theme.inputRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 28,
    paddingLeft: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.darkText,
    marginVertical: 8
    // borderWidth: 1,
    // borderColor: colors.black,
  },
  iconForm: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 8,
    borderRadius: 15
    // tintColor: colors.darkText,
  },
  plusIcon: {
    backgroundColor: colors.yellow,
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginRight: 8,
    borderRadius: 15,
    tintColor: colors.darkText
  },
  flag: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 8,
    borderRadius: 15
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
    paddingVertical: 5
  },
  buttonTxt: {
    fontFamily: theme.secondaryHeader,
    color: theme.whiteShade,
    fontSize: theme.SmallerFont,
    alignSelf: 'center'
  },
  loginTxt: {
    fontFamily: theme.headerFont,
    color: theme.whiteShade,
    fontSize: theme.SmallFont,
    alignSelf: 'center',
    fontWeight: '900'
  },

  dropdownStyle: {
    borderColor: theme.buttonGray
    // paddingLeft: 4
  },
  buttonWithImage: {
    // borderRadius: 10,
    width: '100%',
    height: 52,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 50
    // paddingRight: 8
  },
  // iconDoor: {
  //   height: 18,
  //   width: 18,
  //   resizeMode: 'contain',
  //   marginLeft: 24
  // },
  brnText: {
    fontFamily: theme.headerFont,
    color: colors.white,
    fontSize: 18,
    alignSelf: 'center'
  }
});

export default styles;
