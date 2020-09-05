import React from 'react';
import { ImageBackground, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const AuthBackground = ({ children }) => (
  <ImageBackground
    style={styles.backgroundImage}
    resizeMode='cover'
    blurRadius={0.3}
    source={require('../../assets/images/bg.png')}
  >
    <View style={styles.overlay}>{children}</View>
  </ImageBackground>
);

AuthBackground.propTypes = {
  children: PropTypes.any,
};
export default AuthBackground;
