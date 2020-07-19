'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';
import Rave from 'react-native-rave';
import { PropTypes } from 'prop-types';
import Toast from 'react-native-easy-toast';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { SingleButtonAlert } from '../Alert/SingleButtonAlert';
import {postWithToken, CreateInvestment, getProfile} from '../../screens/Utils/Utils';

export default class CreditCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoading : false,  
      showAlert : false,
      token : '',
      period : '',
      title : '',
      message : '',
    }
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }


  componentDidMount () {
    this.displayProfile(); 
  }

  displayProfile = async() => {
    let profile = await getProfile();
    if( profile) { 
      this.setState({
        token : profile.access_token,
        period : profile.duration,
      });
    }     
  }

  onSuccess(data) {
    this.handlePayment(data)
  }

  onFailure(data) {
   this.setState({ 
      showLoading : false,
    });
    return this.refs.toastError.show( data.message, 300);  
  }
    onClose (){
    return this.props.navigation.navigate('Dashboard');
  }
  handleCloseNotification = () => {
    return this.setState({
       showAlert : false
     })
  }
  // Post Payment to detail to api/investment
  handlePayment =  (data) => {
    const {token, period, } = this.state;
    this.setState({ 
      showLoading : true ,
    }); 
    let principal = data.data.amount,
    trans_id = data.data.tx.flwRef,
    currency = data.data.tx.currency.toLowerCase();


    //convert ref to an object
    let body = JSON.stringify({
      principal : 2000, 
      trans_id : 'tytt66rttryuyyygvcgffgfc', 
      currency : 'ngn', 
      period: 6,
    });
    
    postWithToken( CreateInvestment, body, token )    
    .then((res) => { 

      if(typeof res.message !== 'undefined') {
        this.setState({ 
          showLoading : false,
          title : 'Alert',
          message : res.message,
          showAlert : true,
        }); 
        // return this.refs.toastError.show(res.message, 400);
       } 
       else {
          this.setState({ 
            showLoading : false, 
          }); 
          this.refs.toastSuccess.show('Payment Successful!', 200, () => {
          this.onClose();      
      }); 
    }
  });
}


  render() {
    const{ firstName, lastName, amount, currency} = this.props;
    const {showLoading, message, title, showAlert} = this.state,
    public_key = "FLWPUBK_TEST-8f91082fe07d13f8eab27ff57df96ac2-X",
    secretkey = "FLWSECK_TEST-1d64062b1e22c866f89631bbd2bc6dfc-X",
    encryptionkey = "FLWSECK_TEST8b3a6bd4c129";

    return (
      
      <View style = {styles.container}>

        <Rave 
          amount={amount} 
          country="NG" 
          currency="NGN" 
          // country= {country}
          // currency={currency} 
          email="dihwengalbert@gmail.com" 
          firstname= {firstName} 
          lastname= {lastName} 
          publickey= {public_key}
          secretkey= {secretkey}
          encryptionkey = {encryptionkey}
          meta={[{ metaname: "color", metavalue: "red" }, { metaname: "storelocation", metavalue: "ikeja" }]}
          production={false} 
          paymenttype="card"
          onSuccess={res => this.onSuccess(res)} 
          onFailure={e => this.onFailure(e)}
          onClose={e => this.onClose(e)}
          />
          <Toast
          ref="toastSuccess"
          style={{backgroundColor: 'green'}}
          position='bottom'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={4000}
          opacity={0.8}
          textStyle={{color:'white'}}
        /> 
        <Toast
          ref="toastError"
          style={{backgroundColor: 'red'}}
          position='bottom'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={4000}
          opacity={0.8}
          textStyle={{color:'white'}}
        /> 

        <ProgressDialog
          visible={showLoading}
          title="Processing"
          message="Please wait..."
        />
        {/* <SingleButtonAlert
          title = {title} 
          message = {message}
          handleCloseNotification = {this.handleCloseNotification}
          visible = {showAlert}
        /> */}
      </View>   
    );
  }
}

CreditCard.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired, 
}

// Test MasterCard 3DSecure authentication
// 5531886652142950
// cvv 564
// Expiry: 09/22
// Pin 3310
// otp 12345


// 5531886652142950
// cvv 564
// Expiry: 09/22
// Pin 3310
// otp 12345