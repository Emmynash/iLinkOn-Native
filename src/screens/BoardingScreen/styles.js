import { StyleSheet, Dimensions, Platform } from 'react-native';
const window = Dimensions.get('window');
export const IMAGE_HEIGHT = window.width / 3;
export const IMAGE_HEIGHT_SMALL = window.width / 6;
import defaultTheme from '../../assets/theme';
import colors from '../../assets/colors';
import theme from '../../assets/theme';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
    // paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    // padding : 20
  },

  slide: {
    flex: 1,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },

  sliderText: {
    fontSize: defaultTheme.SmallFont,
    color: colors.darkSilver,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: defaultTheme.LightFont,
    width: '100%',
    paddingHorizontal: 26
  },
  sliderTitle: {
    fontSize: 28,
    marginBottom: 8,
    color: colors.itemColor,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: defaultTheme.headerFont,
    width: '100%',
    paddingHorizontal: 16
  },
  image: {
    width: '90%',
    height: '40%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '20%'
  },

  sliderDots: {
    backgroundColor: defaultTheme.secondaryTextColor,
    marginBottom: 90
  },
  textView: {
    width: '100%',
    padding: 20
  },
  activeDotStyle: {
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.gold,
    marginBottom: 90
  },

  nextBtn: {
    width: 150,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    width: '100%',
    height: '100%'
  },
  doneBtn: {
    width: 324,
    height: 50,
    backgroundColor: colors.gold,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  skipBtn: {
    width: 150,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, .002)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold
  },
  skipBtnText: {
    fontFamily: defaultTheme.headerFont,
    color: colors.itemColor,
    fontSize: defaultTheme.SmallFont
  },
  nextBtnText: {
    fontFamily: defaultTheme.headerFont,
    color: defaultTheme.whiteShade,
    fontSize: defaultTheme.SmallFont
  }
});

export default styles;
