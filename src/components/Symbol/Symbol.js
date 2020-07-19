'use strict';

import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../assets/colors';
import {TouchableHighlight} from 'react-native';


export default class Icons extends Component {

  render(){
    const {handleBackButton, styles} = this.props;
    return(
      <TouchableHighlight 
        style = {styles}
        onPress = {handleBackButton}>
        <Icon
          name= {'keyboard-backspace'}
          color = {colors.whiteShade}
          size = {24}
         // style = {{ marginRight: -2, marginTop: -2, }}
        />
      </TouchableHighlight>
    );
  }
}

Icons.propTypes = {
  handleBackButton: PropTypes.func,
  style: PropTypes.object,
}