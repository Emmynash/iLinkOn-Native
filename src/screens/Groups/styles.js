const window = Dimensions.get('window');
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
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
    backgroundColor: colors.background_color
  },

  menuIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white
  },
  wrapper: {
    flex: 1
    // alignItems: 'center'
  },
  searchView: {
    height: Platform.OS === 'ios' ? 60 : 64,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
    marginBottom: 16
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.textGray
  },
  btnView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    justifyContent: 'flex-end',
    height: 55,
    backgroundColor: colors.yellow,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  listView: {
    width: '100%',
  },
  listView2: {
    flex: 1,
    paddingBottom: 90
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
  flatlistView: {
    flex: 1,
    // paddingHorizontal: 16
  },
  categoryHeader: {
    width: '100%',
    paddingLeft: 16,
    paddingVertical: 4
    // alignItems: 'center'
  },
  otherCategoryHeader: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    marginTop: 20
  },
  groupText: {
    fontSize: 25,
    color: theme.darkText,
    fontFamily: theme.headerFont
  },
  groupSubText: {
    fontSize: theme.MediumFont,
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
  itemImage: {
    width: 200
  },
  faceImage: {
    width: '100%',
    height: 130
    // resizeMode: 'contain'
  },
  itemDetails: {
    padding: 8,
    height: 70,
    borderBottomLeftRadius: theme.btnRadius,
    borderBottomRightRadius: theme.btnRadius,
    backgroundColor: colors.whiteShade
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
    marginHorizontal: 4,
    overflow: 'hidden',
    borderRadius: theme.btnRadius,
    marginTop: 20,
    width: '48%',
    height: 200,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2.56,
    backgroundColor: theme.colorAccent
  },
  itemType: {
    fontSize: theme.thinyFont,
    fontFamily: theme.LightFont,
    color: theme.primaryColor
  },
  // Modal
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
  // headerMessageView: {
  //   paddingLeft: 16,
  //   paddingRight: 16,
  //   width: '100%',
  //   height: 55,
  //   backgroundColor: theme.primaryColor,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  search: {
    width: '80%',
    backgroundColor: theme.colorAccent,
    height: 40,
    // borderRadius : 4,
    elevation: 2,
    shadowColor: '#00000044',
    shadowOpacity: 0.25,
    shadowRadius: 2.56,
    shadowOffset: { height: 1, width: 0 },
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 14

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
