/* eslint-disable no-unused-vars */
'use strict';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import {
  Image,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureInput: props.inputType === 'password',
      inputValue: props.value
    };
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  toggleShowPassword() {
    this.setState({ secureInput: !this.state.secureInput });
  }

  onChangeText = text => {
    this.props.onChangeText(text);
    this.setState({ inputValue: text });
  };

  render() {
    const {
      textColor,
      borderBottomColor,
      borderBottomWidth,
      borderWidth,
      borderColor,
      borderRadius,
      borderTopRightRadius,
      borderTopLeftRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      inputType,
      labelText,
      labelTextSize,
      labelTextWeight,
      labelColor,
      paddingLeft,
      customStyle,
      formStyle,
      inputStyle,
      autoCapitalize,
      placeholder,
      placeholderTextColor,
      maxLength,
      height,
      width,
      defaultValue,
      editable,
      backgroundColor,
      onFocus,
      onBlur,
      returnKeyType,
      refs,
      autoFocus,
      blurOnSubmit,
      onSubmitEditing,
      numberOfLines,
      textAlign,
      ellipsizeMode
    } = this.props;

    const { secureInput, inputValue } = this.state;
    const fontSize = labelTextSize || 16;
    const fontWeight = labelTextWeight || '700';
    const color = labelColor || colors.white;
    const inputColor = textColor || colors.white;
    const placeholderColor = placeholderTextColor || colors.text;
    const style = formStyle || styles.forms;
    const customInputStyle = inputStyle || {};
    if (!inputStyle || (inputStyle && !inputStyle.paddingBottom)) {
      customInputStyle.paddingBottom = 5;
    }

    let keyboardType;

    if (inputType === 'phone') {
      keyboardType = 'phone-pad';
    } else if (inputType === 'number') {
      keyboardType = 'numeric';
    } else if (inputType === 'name') {
      keyboardType = 'default';
    } else if (inputType === 'email') {
      keyboardType = 'email-address';
    }

    return (
      <View style={[customStyle, styles.wrapper]}>
        {/* <Text style={[{ fontWeight, color, fontSize }, styles.label]}>
          {labelText}
        </Text> */}
        <TextInput
          style={[{ color: inputColor }, style, inputStyle, styles.inputField]}
          borderWidth={borderWidth}
          borderColor={borderColor}
          borderRadius={borderRadius}
          borderTopRightRadius={borderTopRightRadius}
          borderTopLeftRadius={borderTopLeftRadius}
          borderBottomLeftRadius={borderBottomLeftRadius}
          borderBottomRightRadius={borderBottomRightRadius}
          backgroundColor={backgroundColor}
          secureTextEntry={secureInput}
          onChangeText={this.onChangeText}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          paddingLeft={paddingLeft}
          underlineColorAndroid='transparent'
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          defaultValue={defaultValue}
          value={inputValue}
          inputType={inputType}
          maxLength={maxLength}
          height={height}
          width={width}
          textAlign={textAlign}
          onBlur={onBlur}
          onFocus={onFocus}
          borderBottomColor={borderBottomColor}
          borderBottomWidth={borderBottomWidth}
          editable={editable}
          ref={refs}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
        />
        {inputType === 'password' ? (
          <TouchableOpacity
            style={styles.showButton}
            onPress={this.toggleShowPassword}
          >
            {secureInput ? (
              <Image
                onPress={this.toggleShowPassword}
                source={require('../../assets/images/view.png')}
                style={StyleSheet.flatten(styles.logoIcon)}
              />
            ) : (
              <Image
                onPress={this.toggleShowPassword}
                source={require('../../assets/images/hide.png')}
                style={StyleSheet.flatten(styles.logoIcon)}
              />
            )}

            {/* <Text style={styles.showButtonText}>
                {secureInput ? 'Show' : 'Hide'}
              </Text> */}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

InputField.propTypes = {
  placeholder: PropTypes.string,
  labelTextSize: PropTypes.number,
  labelColor: PropTypes.string,
  textColor: PropTypes.string,
  borderRadius: PropTypes.number,
  returnKeyType: PropTypes.string,
  borderBottomLeftRadius: PropTypes.number,
  borderBottomRightRadius: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  borderBottomWidth: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  inputType: PropTypes.string.isRequired,
  customStyle: PropTypes.object,
  onChangeText: PropTypes.func,
  autoFocus: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  labelTextWeight: PropTypes.string,
  inputStyle: PropTypes.object,
  defaultValue: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  maxLength: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.string,
  textAlign: PropTypes.string
};

const styles = StyleSheet.create({
  forms: {
    backgroundColor: colors.white
  },
  inputField: {
    // borderBottomWidth : 1,
    fontFamily: theme.LightFont,
    fontSize: theme.SmallFont,
    paddingTop: 1
    // height :40,
  },
  // label: {
  //   fontFamily: theme.headerFont,
  //   marginBottom: 1,
  // },
  logoIcon: {
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.darkGray,
    width: 22
    // marginTop: 16,
  },
  showButton: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    height: 52,
    justifyContent: 'center',
    width: 30
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 4,
    width: '100%'
  }

  // showButtonText: {
  //   color: colors.green_background,
  //   fontWeight: '100',
  //   fontFamily: theme.primaryFont
  // },
});
