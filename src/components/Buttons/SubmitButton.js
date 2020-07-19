'use strict';

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import colors from '../../assets/colors';
import {
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text
} from 'react-native';
import theme from '../../assets/theme';

export default class SubmitButton extends Component {
  render() {
    const {
      disabled,
      onPress,
      title,
      btnStyle,
      imgStyle,
      imgSrc,
      titleStyle
    } = this.props;
    const opacityStyle = disabled ? 0.5 : null;
    const style = btnStyle || styles.button;
    const textStyle = titleStyle || styles.title;
    return (
      // <TouchableHighlight
      //   style = {[{opacity: opacityStyle}, style]}
      //   disabled = {disabled}
      //   onPress = {onPress}>
      //   <Text style = {titstyle}>
      //     {title}
      //   </Text>
      // </TouchableHighlight>

      <TouchableOpacity
        onPress={onPress}
        style={[{ opacity: opacityStyle }, style]}
        disabled={disabled}
      >
        <Image source={imgSrc} style={imgStyle} />
        <Text style={textStyle} onPress={onPress}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

SubmitButton.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 45,
    marginTop: 16,
    backgroundColor: colors.green,
    borderRadius: 60
  },

  title: {
    fontFamily: theme.headerFont,
    color: colors.white
  },

  icon: {
    marginRight: -2,
    marginTop: -2
  }
});
