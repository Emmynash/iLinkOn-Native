import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../assets/theme';
import colors from '../../assets/colors';

const elevation = {
  elevation: 1,
  shadowColor: '#00000066',
  shadowOffset: { height: 1, width: 1 },
  shadowOpacity: 0.25,
  shadowRadius: 2.25,
};
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: (Platform.OS == 'ios') ? 20 : 0,
  },
  headView: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchView: {
    height: Platform.OS === 'ios' ? 50 : 64,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 20,
    backgroundColor: theme.colorAccent,
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.textGray
  },
  userHeader: {
    width: '100%',
    height: 40,
    ...elevation,
    backgroundColor: theme.colorAccent,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  headerText: {
    fontFamily: theme.LightFont,
    fontSize: theme.MediumFont,
    color: theme.primaryColor,
    marginLeft: 20
  },

  wrapper: {
    padding: 20,
    justifyContent: 'center',
  },
  accountTxt: {
    width: '100%',
    textAlign: 'center',
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    color: theme.primaryColor,
  },
  account: {
    width: '100%',
  },
  pushNotification: {
    width: '100%'
  },
  profileContainer: {
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    paddingTop: 10
  },
  pushTxt: {
    fontFamily: theme.LightFont,
    fontSize: theme.MediumFont,
    color: theme.primaryColor,
    marginTop: 20
  },
  userProfileText: {
    fontFamily: theme.headerFont,
    fontSize: theme.XlargeFont,
    color: theme.lightTextGRay,
    marginTop: 16
  },
  editProText: {
    // color: theme.lightTextGRay,
    padding: 5
  },

  cardView: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: theme.colorAccent,
    borderRadius: 2,
    elevation: 1,
    shadowColor: '#00000066',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  cardView2: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: theme.colorAccent,
    borderRadius: 2,
    elevation: 1,
    shadowColor: '#00000066',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  holder: {
    paddingHorizontal: 20,
  },
  secondView: {
    backgroundColor: '#fff',
  },
  headerView: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  playIcon: {
    width: 13,
    height: 18,
    tintColor: theme.primaryTextColor
  },
  name: {
    fontFamily: theme.LightFont,
    fontSize: 19,
    color: theme.primaryColor,
    marginLeft: 20,
  },
  messageTxt: {
    fontFamily: theme.LightFont,
    fontSize: theme.thinyFont,
    color: theme.primaryColor,
    marginLeft: 20,
  },
  changePwd: {
    fontFamily: theme.LightFont,
    fontSize: 19,
    color: theme.primaryColor,
  },
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
});

export default styles;
