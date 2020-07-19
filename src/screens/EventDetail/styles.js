import theme from '../../assets/theme';
import { StyleSheet, StatusBar } from 'react-native';
import colors from '../../assets/colors';

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    resizeMode: "contain",
    width: 20,
    height: 20,
  },


  badge: {
    height: 16,
    borderRadius: 10,
    backgroundColor: colors.red,
    position: 'absolute',
    left: 25,
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 16,
  },
  notificatioTxt: {
    color: theme.colorAccent,
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,

  },
  badgeGreen: {
    height: 16,
    width: 16,
    borderRadius: 10,
    backgroundColor: colors.green,
    position: 'absolute',
    left: 25,
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftView: {
    paddingLeft: 10
  },
  menu: {
    resizeMode: "contain",
    width: 25,
    height: 25,
    marginLeft: 20
  },
  flatListView: {
    marginHorizontal: 4,
    borderRadius: theme.btnRadius,
    marginTop: 16,
    width: '90%',
    height: 150,
    alignSelf: 'center'
  },
  cardView: {
    flexDirection: 'row',
    width: '90%',
    height: '90%',
    backgroundColor: theme.colorAccent,
    marginLeft: 30,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25
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
    right: 10,
    position: 'relative'
  },
  divideTxt: {
    color: '#000000',
    fontFamily: theme.headerFont,
    fontSize: 15
    // paddingRight: 4
  },
  divideIcon: {
    width: 20,
    height: 20,
    paddingRight: 5
  },
  divideOneTxt: {
    color: colors.darkGray,
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    width: '100%',
    marginLeft: 4
  },
  divideTxtView: {
    flexDirection: 'row',
    color: theme.lightTextGRay,
    alignItems: 'center'
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
  modalBtn: {
    width: '90%',
    height: 55,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 2, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: 25,
    marginVertical: 4
  },
  modalTxt: {
    fontFamily: theme.headerFont,
    color: theme.primaryColor,
    fontSize: theme.MediumFont,
  },
  descriptionView: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  descEvent: {
    fontFamily: theme.headerFont,
    color: theme.primaryColor,
    fontSize: theme.LargeFont,
    marginLeft: 8
  },
  descImage: {
    width: 25,
    height: 25,
    tintColor: colors.yellow
  },

  descDetails: {
    width: '80%',
    borderLeftWidth: 3,
    borderLeftColor: colors.yellow,
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetails: {
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: colors.yellow,
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  descText: {
    width: '100%',
    fontFamily: theme.LightFont,
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    marginLeft: 24,
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
  },
  joinTxt: {
    fontFamily: theme.headerFont,
    color: theme.colorAccent,
    fontSize: 40,
    alignSelf: 'center'
  },
  msgImage: {
    width: 25,
    height: 25,
    tintColor: theme.colorAccent
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
  noIimage: {
    borderRadius: 50,
    width: 60,
    height: 60,
    marginRight: 8,
    tintColor: colors.gray
  },
  commentListView: {
    width: '95%',
    marginLeft: 10,

  },
  commentView: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.yellow,
    padding: 8,
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center'
  },
  commentDetail: {
    width: '80%',
    flexDirection: 'column',
    paddingLeft: 5,
    overflow: 'hidden'
  },
  commentText: {
    fontSize: theme.SmallerFont,
    fontFamily: theme.LightFont,
    color: theme.primaryColor,

  },
  timeText: {
    fontSize: theme.SmallerFont,
    fontFamily: theme.LightFont,
    color: theme.primaryTextColor,
  },
  nameText: {
    fontSize: theme.SmallerFont,
    fontFamily: theme.LightFont,
    color: theme.primaryTextColor,
  },
  modal: {
    flex: 1,
    padding: 2
  },
  modalContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    // paddingTop: '30%'
  },
  commentBtn: {
    width: '90%',
    height: 52,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: 30,

  },
  commentTxt: {
    fontFamily: theme.headerFont,
    color: theme.colorAccent,
    fontSize: 18,
    alignSelf: 'center'
  },
  buttonsView: {
    width: '100%',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    paddingRight: 10,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    width: '90%',
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center'
  },
  textInputView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'tomato'
  },
  closeTxt: {
    fontFamily: theme.headerFont,
    fontSize: theme.SmallerFont,
    color: colors.darkText
  },
  textBtny: {
    width: '90%',
    // height: 30,
    borderRadius: 8,
    backgroundColor: theme.colorAccent,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginVertical: 8
  },
  commentTimeTxt: {
    fontFamily: theme.LightFont,
    fontSize: theme.SmallerFont,
    color: colors.darkText
  }

});

export default styles;
