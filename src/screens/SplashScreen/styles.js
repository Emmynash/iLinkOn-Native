import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');
import colors from '../../assets/colors';
import theme from '../../assets/theme';
// export const deviceWidth = Dimensions.get('window').width
// export const deviceHeight = Dimensions.get('window').height
// export const calcHeight = x => PixelRatio.roundToNearestPixel((deviceHeight * x) / 100)
// export const calcWidth = x => PixelRatio.roundToNearestPixel((deviceWidth * x) / 100)

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  splasBg: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  newView: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  logo: {
    marginTop: 100,
    resizeMode: 'contain',
    width: '40%',
    height: '30%'
  },
  buttonWithImage: {
    borderRadius: 30,
    width: '60%',
    height: 52,
    backgroundColor: theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
    paddingRight: 8,
    position: 'absolute',
    bottom: '10%',
    elevation: 2,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 4, width: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25
  },
  buttonTxt: {
    fontFamily: theme.primaryFont,
    color: theme.colorAccent,
    fontSize: 20,
    alignSelf: 'center'
  }
});
