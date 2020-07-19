import { StyleSheet } from 'react-native';
import colors from '../../assets/colors';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navbarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    height: 64,

  },

  navBarHeader: {
    color: colors.gold,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',

  },

  navBarButton: {
    marginLeft: 10,
    borderRadius: 50,
    width: 64,
  },

  headerText: {
    flex: 1,
    fontSize: 28,
    color: colors.gold,
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center'
  },

});