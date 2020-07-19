import { AsyncStorage } from 'react-native';



// userProfile
export const saveUserDetail = async (data, token, ) => {
  let details = {
    'data': data,
    'token': token,
  };
  return await AsyncStorage.setItem('details', JSON.stringify(details))
}
export const getUserDetails = async () => {
  return await AsyncStorage.getItem('details')
    .then((value) => {
      if (value) {
        return JSON.parse(value);
      } else {
        return false;
      }
    });
}
// 'use strict';
// import React, { useState, useEffect } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
// import Constants from 'expo-constants';
// import colors from '../../assets/colors';
// import theme from '../../assets/theme';
// import { Dropdown } from 'react-native-material-dropdown';
// // import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
// // import { useNavigation } from '@react-navigation/native';

// import moment from 'moment';
// import { ProgressDialog } from 'react-native-simple-dialogs';
// import styles from './styles';
// import {
//   TouchableOpacity,
//   AsyncStorage,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Image,
//   View,
//   Text,
//   KeyboardAvoidingView
// } from 'react-native';
// import {
//   getProfileImage,
//   GetGroupDetails,
//   getUserDetails,
//   getProfile
// } from '../Utils/Utils';
// import {
//   DisplayText,
//   ErrorAlert,
//   SubmitButton,
// } from '../../components';

// function GroupDetail() {
//   const { navigation } = useNavigation();
//   const [modalVisible, setModalVisible] = useState(false),
//     [showLoading, setShowLoading] = useState(false),
//     [showAlert, setShowAlert] = useState({
//       showAlert: false,
//       showSuccessAlert: false,
//       message: ''
//     }),
//     [successMessage, setSuccessMessage] = useState(''),
//     [show, setShow] = useState(false),
//     [customModal, setShowCustomModal] = useState(false),
//     [id, setId] = useState(''),
//     [groupDetails, setGroupDetail] = useState({
//       groupName: '',
//       date: '',
//       description: '',
//       interest: '',
//       groupId: '',
//     }),
//     [groupName, setGroupName] = useState(''),
//     [token, setToken] = useState('');

//   useEffect(() => {
//     checkToken();
//   }, []);

//   const checkToken = async () => {
//     const groupId = navigation.getParam('groupId');
//     console.log('dfdfdfdfdfdfdfd:', groupId);
//     let profile = await getProfile();
//     if (typeof profile.access_token !== 'undefined') {
//       let access_token = profile.access_token;
//       getGroupDetails(access_token, groupId);
//     }
//   };

//   const handleCreateEvent = () => {
//     return navigation.navigate('CreateEvent');
//   };
//   const handleCloseNotification = () => {
//     return setShowCustomModal(false);
//   };
//   const showLoadingDialogue = () => {
//     setShowLoading(true);
//   };
//   const hideLoadingDialogue = () => {
//     setShowLoading(false);
//   };

//   const getGroupDetails = async (token, id) => {
//     showLoadingDialogue();
//     const settings = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: token
//       },
//     };
//     let endpoint = `${GetGroupDetails}${id}`;
//     console.log('idddddddd', endpoint);

//     const response = await fetch(endpoint, settings);
//     const res = await response.json();
//     if (typeof res.meta.status >= 300) {
//       console.log('join group statussss', res.meta.status);
//       hideLoadingDialogue();
//       setShowAlert({
//         showAlert: true,
//         message: res.meta.message.toString()
//       });
//     } else if (res.meta.status == 200 || res.meta.status < 300) {
//       console.log(" '''''''''''''succes details group' ", res);
//       hideLoadingDialogue();

//     } else {
//       if (res.meta.message) {
//         hideLoadingDialogue();
//         setShowAlert({
//           showAlert: true,
//           message: res.meta.message.toString()
//         });
//         console.log({ responses: res.meta.message });
//       }
//     }
//   };
//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       <View style={styles.headView}>
//         <TouchableOpacity>
//           <Image
//             style={styles.backLogo}
//             source={require('../../assets/images/left-arrow.png')}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.left}>
//           <Image
//             style={styles.menu}
//             source={require('../../assets/images/notification.png')}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.leftView}>
//           <Image
//             style={styles.menu}
//             source={require('../../assets/images/notification.png')}
//           />
//         </TouchableOpacity>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.textView}>
//           <Image
//             source={require('../../assets/images/flower.jpg')}
//             style={StyleSheet.flatten(styles.csView)}
//           />
//           <View>
//             <DisplayText
//               text={'CS 321'}
//               styles={StyleSheet.flatten(styles.userProfileText)}
//             />
//             <DisplayText
//               text={'Tutorials, Tips and More'}
//               styles={StyleSheet.flatten(styles.editProText)}
//             />
//             <View style={styles.memberView}>
//               <Image
//                 source={require('../../assets/images/group.png')}
//                 style={StyleSheet.flatten(styles.memberIcon)}
//               />
//               <DisplayText text={'85 Members'} />
//             </View>
//           </View>
//         </View>
//         <View style={styles.holder}>
//           <View style={styles.secondView}>
//             <DisplayText
//               text={'Members'}
//               styles={StyleSheet.flatten(styles.secondViewTxt)}
//             />
//             <View style={styles.imagesView}>
//               <Image
//                 source={require('../../assets/images/flower.jpg')}
//                 style={StyleSheet.flatten(styles.circleView)}
//               />
//               <Image
//                 source={require('../../assets/images/flower.jpg')}
//                 style={StyleSheet.flatten(styles.circleView)}
//               />
//               <Image
//                 source={require('../../assets/images/flower.jpg')}
//                 style={StyleSheet.flatten(styles.circleView)}
//               />
//               <DisplayText
//                 text={'+ 82 more'}
//                 styles={StyleSheet.flatten(styles.more)}
//               />
//             </View>
//             <View>
//               <DisplayText
//                 text={'Group Events'}
//                 styles={StyleSheet.flatten(styles.secondViewTxt)}
//               />
//               <View style={styles.memberView}>
//                 <DisplayText text={'View group events'} />
//               </View>
//             </View>
//           </View>
//           <View style={styles.cardView}>
//             <View style={styles.div}>
//               <View style={styles.cardImgView}>
//                 <DisplayText styles={styles.cardImgTxt} text={'15TH Jan'} />
//                 <DisplayText styles={styles.cardImgTxt} text={'10:00 am'} />
//               </View>
//             </View>
//             <View style={styles.divide}>
//               <DisplayText
//                 styles={styles.divideTxt}
//                 text={'Computer Appreciation Seminar'}
//               />
//               <DisplayText
//                 styles={styles.divideOneTxt}
//                 text={'Posted: 10th jan,2020'}
//               />
//               <View style={styles.divideTxtView}>
//                 <Image
//                   source={require('../../assets/images/group.png')}
//                   style={StyleSheet.flatten(styles.divideIcon)}
//                 />
//                 <DisplayText
//                   styles={styles.divideOneTxt}
//                   text={'Multipurpose Hall'}
//                 />
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//       <TouchableOpacity
//         onPress={handleCreateEvent}
//         style={styles.joinBtn}
//       >
//         <Text onPress={handleCreateEvent} style={styles.joinTxt}>
//           {'+'}
//         </Text>
//       </TouchableOpacity>
//       <ProgressDialog
//         visible={showLoading}
//         title='Processing'
//         message='Please wait...'
//       />
//       <ErrorAlert
//         title={'Error!'}
//         message={showAlert.message}
//         handleCloseNotification={handleCloseNotification}
//         visible={showAlert.showAlert}
//       />
//     </SafeAreaView>
//   );

// }

// export default GroupDetail;
