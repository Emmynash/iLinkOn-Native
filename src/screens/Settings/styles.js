import { StyleSheet, StatusBar } from 'react-native';
import theme from '../../assets/theme';
import colors from '../../assets/colors';

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headView: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchView: {
    height: Platform.OS === 'ios' ? 50 : 60,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: theme.colorAccent,
    paddingVertical: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.textGray
  },
  headerText: {
    fontFamily: theme.headerFont,
    fontSize: theme.LargeFont,
    color: theme.primaryColor,
    marginLeft: 20
  },

  wrapper: {
    padding: 20,
    justifyContent: 'center',
  },
  accountTxt: {
    fontFamily: theme.LightFont,
    fontSize: theme.MediumFont,
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
  changePwd: {
    fontFamily: theme.LightFont,
    fontSize: 19,
    color: theme.primaryColor,
  },

});

export default styles;
