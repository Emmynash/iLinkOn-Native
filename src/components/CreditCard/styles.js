import {StyleSheet, Platform} from 'react-native';
import colors from '../../assets/colors';

export default  styles  = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor : colors.dakerCard,
    // paddingBottom : Platform.OS === 'ios' ?  '3%' :  '0%',
    // height : Platform.OS === 'ios' ? '65%' : '75%'
  },
  

});