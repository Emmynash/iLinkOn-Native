import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');
import  Constants  from 'expo-constants';
import colors from '../../assets/colors';
import theme from '../../assets/theme';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : theme.primaryColor
  },
  iconsForm : {
    height : 30,
    width : 30,
    resizeMode : 'contain'
  },
  logoIcon : {
    resizeMode : 'contain',
    height : '100%',
    width : '100%',
  },
 
});