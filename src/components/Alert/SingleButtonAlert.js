'use strict';

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, Modal, TouchableOpacity} from 'react-native';
import colors from '../../assets/colors';
import PropTypes from 'prop-types';
import RadioButtonsGroup from 'react-native-radio-buttons-group';
import theme from '../../assets/theme';

export default class SingleButtonAlert extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.closeNotification = this.closeNotification.bind(this);
  }

  closeNotification = () => {
    return this.props.handleCloseNotification();  
  }

  render() {

    const {title, message, visible, positiveButton} = this.props;
      const posButton = positiveButton || 'OK';
     
    return (
      <View>
       <Modal
        visible={visible}
        transparent={true}
        animationType={"fade"}
        onRequestClose={this.closeNotification} >

        <View style={styles.modalView}>

          <View style={styles.Alert_Main_View}>

             <Text style={styles.Alert_Title}>
               {title}
              </Text>

             <View style={{ 
               width: '90%', height: 
               StyleSheet.hairlineWidth, 
               backgroundColor: colors.white}} 
               />
              <Text style={styles.Alert_Message}>
                {message} 
              </Text>

             <View style={{ 
               width: '100%', 
               height: StyleSheet.hairlineWidth, 
              }}
               />
              <View style={{flexDirection: 'row', height: '30%'}}>

                <TouchableOpacity 
                  style={styles.buttonStyle}
                  onPress={this.closeNotification } 
                  activeOpacity={0.2} >
                  <Text style={styles.TextStyle}>
                    {posButton}
                  </Text>
         
                </TouchableOpacity>
             </View> 
            </View>
          </View>
        </Modal>
      </View>      
    )
  }
}


SingleButtonAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  MainContainer :{ 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (Platform.OS == 'ios') ? 20 : 0,    
   },
   modalView : { 
     flex: 1, 
     alignItems: 'center', 
     justifyContent: 'center', 
     backgroundColor : 'rgba(0,0,0,0.5)',
  },
    
   Alert_Main_View:{
    // alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor : colors.white, 
    height: '25%' ,
    width: '90%',
    borderWidth: 0.5,
    borderColor: colors.white,
    borderRadius:4,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,  

   },
    
   Alert_Title:{  
    fontSize: 16, 
    color: colors.black,
    paddingTop : 16,
    // padding: 5,
    height: '25%',
    fontFamily: theme.primaryFont,
    
   },
    
   Alert_Message:{
    fontSize: 15, 
    color: colors.darkGray,
    textAlign: 'left',
    fontFamily: theme.secondaryHeader,
    paddingRight: 4,
    paddingTop: 8,
    // padding: 10,
    // paddingLeft: 1,
    height: '45%'
      
  },
    
   buttonStyle: {  
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems : 'center',
    marginTop : 8,
    position : 'absolute',
    right : 16
   },
      
   TextStyle:{
    color: colors.green_background,
    fontSize: 14,
    fontFamily: theme.secondaryHeader,
   }
})