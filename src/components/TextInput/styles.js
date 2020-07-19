import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';
import colors from '../../assets/colors'
import theme from '../../assets/theme';
const INPUT_HEIGHT = 48;
const BORDER_RADIUS = 4;

export default EStyleSheet.create({
  container: {
    backgroundColor: '$white',
    width: '100%',
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  formContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    borderColor: colors.gold,
    borderWidth: 0.5,
  },
  input: {
    height: INPUT_HEIGHT,
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 8,
    color: '$inputText',
    fontFamily: theme.primaryFont,
  },
  border: {
    height: INPUT_HEIGHT,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '$border'
  },
  error: {
    borderWidth: 1,
    borderColor: 'red'
  }
});