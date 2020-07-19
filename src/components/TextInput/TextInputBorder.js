import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View, TextInput} from 'react-native';
import styles from './styles'

const TextInputBorder = (props) => {
  const { placeHolder, editable = true} = props;
  return(
    <View style = {styles.formContainer}>
      <TextInput 
        autoCorrect = {false}
        autoCapitalize = "none"
        placeholder = {placeHolder}
        underlineColorAndroid = "transparent"
        style = {styles.input}
        {...props}
      />
    </View>
  );
}
TextInputBorder.propTypes = {
  placeHolder: PropTypes.string,
  editable: PropTypes.bool,
}

export default TextInputBorder;