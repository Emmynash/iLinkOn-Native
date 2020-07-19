import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
const window = Dimensions.get('window');
import Constants from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';

const elevation = {
  elevation: 2,
  shadowColor: '#00000066',
  shadowOffset: { height: 2, width: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 2.25,
};

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgColor,
  },

  menuIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white
  },
  wrapper: {
    flex: 1,
  },
  searchView: {
    height: Platform.OS === 'ios' ? 50 : 64,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
    paddingHorizontal: 20
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.textGray
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 20
  },
  btnView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0
  },
  headerView: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: theme.colorAccent,
    ...elevation,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    backgroundColor: colors.orange,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 30,
    marginTop: 16
  },
  btnText: {
    fontSize: 18,
    color: colors.white,
    // fontFamily: 'Roboto-Regular',
    alignSelf: 'center'
  },
  listView: {
    flex: 1
  },
  btnStyle: {
    backgroundColor: colors.yellow,
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 4,
    borderColor: theme.colorAccent,
    elevation: 2,
    shadowColor: theme.colorAccent,
    shadowOpacity: 0.25,
    shadowRadius: 2.56,
    shadowOffset: { height: 2, width: 2 },
    position: 'relative',
    bottom: 20
  },
  btnText: {
    fontSize: 40,
    color: colors.white,
    fontFamily: theme.headerFont,
    position: 'relative',
    bottom: 4
  },

  categoryHeader: {
    width: '100%',
    paddingLeft: 20,
    paddingVertical: 4
    // alignItems: 'center'
  },
  otherCategoryHeader: {
    width: '100%',
    paddingLeft: 20,
    paddingVertical: 4,
    marginTop: 10
  },
  groupText: {
    fontSize: 25,
    color: theme.darkText,
    fontFamily: theme.headerFont
  },
  groupSubText: {
    fontSize: theme.SmallerFont,
    color: colors.darkGrayTxt,
    fontFamily: theme.LightFont
  },
  renderRowView: {
    margin: 4,
    // overflow: 'hidden',
    borderRadius: theme.btnRadius,
    marginTop: 20,
    width: 200,
    height: 200,
    ...elevation,
    backgroundColor: theme.colorAccent,

  },

  flatlistGroup: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colorAccent,
    borderRadius: theme.btnRadius
  },
  itemImage: {
    width: 200
  },
  itemImageEvent: {
    width: '100%'
  },
  faceImageEvent: {
    width: '100%',
    height: 160
    // resizeMode: 'contain'
  },
  faceImage: {
    width: '100%',
    height: 130
    // resizeMode: 'contain'
  },
  itemDetails: {
    padding: 8,
    // height: 70,
    borderBottomLeftRadius: theme.btnRadius,
    borderBottomRightRadius: theme.btnRadius,
  },
  titleText: {
    fontFamily: theme.headerFont,
    fontSize: theme.SmallerFont,
    elevation: 2,
    shadowColor: colors.darkGray,
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.56
  },
  itemType: {
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    elevation: 2,
    shadowColor: colors.darkGray,
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.56
  },
  flatListView: {
    marginHorizontal: 16,
    // overflow: 'hidden',
    borderRadius: theme.btnRadius,
    marginTop: 10,
    width: 300,
    height: 150,
  },
  cardView: {
    flexDirection: 'row',
    width: '95%',
    height: '80%',
    backgroundColor: theme.colorAccent,
    // marginHorizontal: 4,
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
    width: '50%',
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
    width: 20,
    height: 20,
    paddingRight: 5
  },
  divideOneTxt: {
    color: colors.darkGray,
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    marginLeft: 4
  },
  divideTxtView: {
    flexDirection: 'row',
    color: theme.lightTextGRay,
    alignItems: 'center'
  },
  cardImgView: {
    margin: 4,
    backgroundColor: colors.yellow,
    width: '100%',
    height: '75%',
    borderRadius: theme.btnRadius,
    position: 'relative',
    top: 11,
    left: -20,
    elevation: 1,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  interestView: {
    width: 100,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

  },
  interestImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    marginTop: 16,
    borderColor: colors.whiteGray,
    borderWidth: 1,
    shadowColor: '#00000066',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
  },
  interestListView: {
    marginBottom: 50,
  },
  nameText: {
    fontSize: theme.SmallFont,
    color: theme.darkText,
    fontFamily: theme.LightFont,
    marginTop: 8
  },
  stroll: {
    fontSize: theme.XlargeFont,
    color: colors.darkGrayTxt,
    fontFamily: theme.LightFont
  },
  modal: {
    flex: 1,
    width: '100%',
    padding: 2
  },
  customStyle: {
    paddingLeft: 20,
  },
  modalContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  joinGropView: {
    width: '90%',
    height: '60%',
    backgroundColor: theme.colorAccent,
    borderRadius: 4,
    overflow: 'hidden'
  },
  imageView: {
    width: '100%',
    height: '40%',
    overflow: 'hidden'
  },
  joinView: {
    width: '100%',
    height: '60%',
    padding: 16
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  groupDetailView: {
    flexDirection: 'row',
    paddingVertical: 4,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupName: {
    width: '80%'
  },
  groupInterest: {
    // width: '20%',
    height: 35,
    backgroundColor: colors.yellow,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 8
  },
  groupDescription: {
    width: '80%',
    marginTop: 8
  },
  descHeader: {
    fontSize: 18,
    color: theme.darkText,
    fontFamily: theme.headerFont
  },
  description: {
    fontSize: theme.thinyFont,
    color: colors.darkGrayTxt,
    fontFamily: theme.LightFont,
    marginLeft: 2
  },
  buttonsView: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 4,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    position: 'absolute',
    bottom: 0
  },
  cancelBtn: {
    width: '30%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  cancelTxt: {
    fontFamily: theme.LightFont,
    color: theme.darkGrayTxt,
    fontSize: theme.LargeFont,
    alignSelf: 'center'
  },
  joinBtn: {
    width: '40%',
    height: 50,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    borderRadius: 30
  },
  joinTxt: {
    fontFamily: theme.LightFont,
    color: theme.whiteShade,
    fontSize: theme.LargeFont,
    alignSelf: 'center'
  },
  interestIcon: {
    width: 14,
    height: 14,
    tintColor: theme.colorAccent,
    resizeMode: 'contain'
  },
  interestText: {
    fontFamily: theme.headerFont,
    color: theme.whiteShade,
    fontSize: theme.SmallFont,
    alignSelf: 'center'
  },
  eventRowView: {
    borderRadius: theme.btnRadius,
    marginVertical: 8,
    width: '100%',
    height: 290,
    ...elevation,
    backgroundColor: theme.colorAccent,

  },
  dateTime: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 4
  },
  eventCardTxt: {
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    fontFamily: theme.headerFont,
    marginRight: 4
  },
  eventTimeTxt: {
    color: theme.primaryTextColor,
    fontSize: theme.SmallerFont,
    fontFamily: theme.LightFont

  },
  eventDesc: {
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    ...elevation,
    color: theme.primaryTextColor,
    marginTop: 4
  },
  eventDetails: {
    flexDirection: 'row',
    color: theme.lightTextGRay,
    alignItems: 'center',
    marginLeft: 8
    // width: '100%',
    // justifyContent: 'space-between'

  },
  emptyView: {
    width: '100%',
    height: 170,
    ...elevation,
    backgroundColor: theme.colorAccent,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 3,
  }
});
