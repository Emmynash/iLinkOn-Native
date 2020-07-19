import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../assets/theme';
import colors from '../../assets/colors';
const elevation = {
  elevation: 2,
  shadowColor: '#00000010',
  shadowOffset: { height: 1, width: 0 },
  shadowOpacity: 3.25,
  shadowRadius: 3.25
}
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colorAccent
  },

  headView: {
    height: Platform.OS === 'ios' ? 50 : 64,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
    paddingHorizontal: 20
  },
  backLogo: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  headerIconView: {
    flexDirection: 'row'
  },
  backTp: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16
  },
  menu: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  textView: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    marginTop: 8
  },
  csView: {
    marginHorizontal: 20,
    width: 100,
    height: 100,
    borderRadius: 3
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
    marginLeft: 30
  },
  profileContainer: {
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    paddingTop: 10
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
    // left: -40
    left: 100
  },
  gpDetailHeader: {
    width: '60%',
    overflow: 'hidden'
  },
  userProfileText: {
    fontFamily: theme.headerFont,
    fontSize: theme.LargeFont,
    color: '#00000099',
  },
  editProText: {
    fontFamily: theme.LightFont,
    fontSize: theme.SmallerFont,
    color: theme.primaryColor,

  },
  memberText: {
    fontFamily: theme.LightFont,
    fontSize: theme.SmallFont,
    color: theme.primaryColor,
    marginLeft: 4
  },
  memberIcon: {
    width: 20,
    height: 20,
    tintColor: '#00000069'
  },
  memberView: {
    flexDirection: 'row',
    paddingLeft: 5,
    color: theme.lightTextGRay
  },
  flatListView: {
    // marginHorizontal: 16,
    // overflow: 'hidden',
    // marginTop: 10,
    borderRadius: theme.btnRadius,
    width: '95%',
    height: 150,
    marginLeft: 30,
    ...elevation,
  },
  cardView: {
    flexDirection: 'row',
    width: '95%',
    height: '80%',
    backgroundColor: theme.colorAccent,
    // marginHorizontal: 4,
    borderRadius: 15,

  },
  div: {
    width: '40%',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
  divide: {
    width: '60%',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    // alignItems: 'center',
    justifyContent: 'center',
    // right: 10,
    // position: 'relative'
  },
  divideTxt: {
    color: '#000000',
    fontFamily: theme.headerFont,
    fontSize: 15
    // paddingRight: 4
  },
  divideIcon: {
    width: 18,
    height: 18,
    // paddingRight: 5
  },
  divideOneTxt: {
    color: colors.darkGray,
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    width: '90%',
    marginLeft: 4
  },
  divideTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardImgView: {
    // margin: 8,
    backgroundColor: colors.yellow,
    width: '100%',
    height: '75%',
    borderRadius: theme.btnRadius,
    position: 'relative',
    top: 17,
    left: -30,
    elevation: 2,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardImgTxt: {
    color: colors.white,
    fontSize: 23,
    fontFamily: theme.headerFont
  },
  timeTxt: {
    color: colors.white,
    fontSize: 23,
    fontFamily: theme.LightFont
  },
  holder: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  secondView: {
    backgroundColor: '#fff'
  },
  secondViewTxt: {
    fontFamily: theme.headerFont,
    fontSize: theme.LargeFont,
    color: '#000000',
    marginTop: 16
    // paddingLeft: 20
  },
  flatlist: {
    flexDirection: 'row',
  },
  imagesView: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  circleView: {
    borderRadius: 50,
    width: 60,
    height: 60,
    marginRight: 8
  },
  memberImage: {
    borderRadius: 50,
    width: 60,
    height: 60,
    marginRight: 8,
    tintColor: colors.gray
  },
  more: {
    fontSize: theme.MediumFont,
    paddingTop: 40,
    position: 'absolute',
    right: 50,
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
    borderRadius: 59,
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
  langDropDowm: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    // alignItems: 'center',
    // padding: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    paddingBottom: 10
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
    marginTop: 120
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
  },
  joinBtn: {
    width: 62,
    height: 62,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingBottom: 8
  },
  joinTxt: {
    fontFamily: theme.headerFont,
    color: theme.colorAccent,
    fontSize: 40,
    alignSelf: 'center'
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 45
  },
  joinGropView: {
    width: '40%',
    // height: 150,
    backgroundColor: theme.colorAccent,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    width: '100%',
    padding: 2
  },
  modalBtn: {
    width: '90%',
    height: 30,
    backgroundColor: theme.colorAccent,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 2, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: 4,
    marginVertical: 4
  },
  modalTxt: {
    fontFamily: theme.LightFont,
    color: theme.primaryColor,
    fontSize: theme.SmallFont,
    alignSelf: 'center'
  },
  groupSubText: {
    fontSize: theme.SmallerFont,
    color: colors.darkGrayTxt,
    fontFamily: theme.LightFont
  },
  groupSubText: {
    fontSize: theme.SmallerFont,
    color: colors.darkGrayTxt,
    fontFamily: theme.LightFont
  },

  renderRowView: {
    margin: 4,
    overflow: 'hidden',
    borderRadius: theme.btnRadius,
    marginTop: 20,
    width: 200,
    height: 200
  },
  flatlistGroup: {
    width: '100%',
    height: '100%',
    elevation: 2,
    backgroundColor: theme.colorAccent,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: theme.btnRadius
  },
});

export default styles;
