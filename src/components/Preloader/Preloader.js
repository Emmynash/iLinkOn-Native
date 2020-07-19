// 'use strict';

// import React, {Component} from 'react';
// import { PropTypes } from 'prop-types';
// import { View, Image, Modal, StyleSheet,} from 'react-native';

// export default class Preloader extends Component {
 
//   render() {
//     const { animationType, modalVisible } = this.props;
//     return (
//       <Modal
//         animationType={animationType}
//         transparent = {true}
//         onRequestClose = {this.closeNotification}
//         visible={modalVisible}
//       >
//         <View style={styles.wrapper}>
//           <View style={styles.loaderContainer}>
//             <Image
//               style={styles.loaderImage}
//               source={require('../../assets/images/aye_loader.gif')}
//               /* source={require('../../assets/images/whiteLoader.gif')} */

//             />
//           </View>
//         </View>
//       </Modal>
//     );
//   }
// }

// Preloader.propTypes = {
//   animationType: PropTypes.string.isRequired,
//   modalVisible: PropTypes.bool.isRequired,
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     opacity : 0.9,
//     alignItems : 'center',
//     backgroundColor: 'rgba(0, 0, 0,0.9)',
//   },
  
//   loaderImage: {
//     width: 120,
//     height: 120,
//   },
// });
