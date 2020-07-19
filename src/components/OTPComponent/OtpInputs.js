// import React, {Component} from 'react';
// import { StyleSheet } from 'react-native';
// import { Content, Item, Input } from 'native-base';
// import { Grid, Col } from 'react-native-easy-grid';
// import colors from '../../assets/colors';
// import { View, KeyboardAvoidingView } from 'react-native';
// import theme from '../../assets/theme';

// export default class OtpInputs extends Component {

//   constructor(props) {
//     super(props);

//     this.state ={
//       code : ''
//     }
//   }
//     otpTextInput = [];

//     componentDidMount() {
//         this.otpTextInput[0]._root.focus();
//     }

//     renderInputs() {
//       const inputs = Array(5).fill(0);
//       const txt = inputs.map(
//         (i, j) => <Col key={j} style={styles.txtMargin}>
//           <Item >
//             <Input
//               style={styles.inputRadius}
//               keyboardType="numeric"
//               onChangeText={v => this.focusNext(j, v)}
//               onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
//               ref={ref => this.otpTextInput[j] = ref}
//             />
//           </Item>
//         </Col>
//       );
//         return txt;
//     }

//     focusPrevious(key, index) {
//       if (key === 'Backspace' && index !== 0)
//         this.otpTextInput[index - 1]._root.focus();
//     }

//     focusNext(index, value) {
//       if (index < this.otpTextInput.length - 1 && value)
//         this.otpTextInput[index + 1]._root.focus();
//     }

//     render() {
//       return (
//         <KeyboardAvoidingView style = {{flexDirection: 'row'}}>
//           <Grid style={styles.gridPad}>
//             {this.renderInputs()}
//           </Grid>
//         </KeyboardAvoidingView>
//       );
//   }
// }

// const styles = StyleSheet.create({
//   gridPad: { 
//     // padding: 30,
//     // borderWidth: 1,
//     paddingLeft: 30,
//     paddingRight: 30,
//   },
//   txtMargin: { 
//     margin: 3,
    
//   },
//   inputRadius: { 
//     textAlign: 'center',
//     // borderRadius: 10,   
//     // borderWidth: 1,
//     borderColor: colors.green_background,
//     borderBottomWidth: 2,
//     color : colors.text,
//     fontSize: 18,
// fontFamily: theme.primaryFont,
    
//   }
// });