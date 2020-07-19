'use strict'
import React, {Component} from 'react';
import { StyleSheet, Text, Platform, Animated } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomToast extends Component
{
  constructor()
  {
    super();
    this.animateOpacityValue = new Animated.Value(0);
    this.state = { 
      ShowToast: false 
    }
    this.ToastMessage = '';
  }
  componentWillUnmount(){
    this.timerID && clearTimeout(this.timerID);
  }
  ShowToastFunction( message = "Custom React Native Toast", duration = 4000){
    this.ToastMessage = message;
    this.setState({
       ShowToast: true 
    }, () => {
      Animated.timing(this.animateOpacityValue,
        { 
          toValue: 1,
          duration: 500
        }
      ).start(this.HideToastFunction(duration))
    });
  }

  HideToastFunction = (duration) =>
  {
    this.timerID = setTimeout(() => {
      Animated.timing
      (
        this.animateOpacityValue,
        { 
          toValue: 0,
          duration: 500
        }
      ).start(() =>
    {
      this.setState({ 
        ShowToast: false 
      });
      clearTimeout(this.timerID);
    })
    }, 
    duration);      
  }

  render()
  {
    if(this.state.ShowToast)
    {
      return(
        <Animated.View 
          style = {[ styles.animatedToastView,{  
            opacity: this.animateOpacityValue, 
            top: (this.props.position == 'top') ? '10%' : '80%', 
            backgroundColor: this.props.backgroundColor}]
          }>
          <Text numberOfLines = { 1 } 
            style = {[ styles.ToastBoxInsideText, { color: this.props.textColor }]}>
            { this.ToastMessage }
          </Text>
        </Animated.View>
      );
    }
    else {
      return null;
    }
  }
}

CustomToast.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf([
     'top',
     'bottom'
  ]),
  textColor: PropTypes.string
};

CustomToast.defaultProps = {
  backgroundColor: 'rgba(0,0,0,0.7)',
  textColor: '#fff'
}
 
const styles = StyleSheet.create({
  MainContainer :{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (Platform.OS == 'ios') ? 20 : 18,
    margin:10
  },
  animatedToastView: {
    width: '80%',
    // marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 2,
    zIndex: 9999,
    position: 'absolute',
    top: 16,
    justifyContent: 'center'
  },
  ToastBoxInsideText: {
    fontSize: 15,
    alignSelf: 'stretch',
    textAlign: 'center'
  }
});