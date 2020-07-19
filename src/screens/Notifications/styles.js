import theme from '../../assets/theme';
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../assets/colors';

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  searchView: {
    height: Platform.OS === 'ios' ? 50 : 70,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 20 : 24
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: theme.textGray
  },
  headerView: {
    // marginTop: 20,
    marginRight: 20,
    overflow: 'hidden'
  },
  headerTxt: {
    fontSize: theme.MediumFont,
    marginTop: 5,
    fontFamily: theme.headerFont,
  }
});

export default styles;
