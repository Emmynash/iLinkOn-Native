'use strict';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../../assets/colors';
import PropTypes from 'prop-types';
import theme from '../../assets/theme';
import { ThemeColors } from 'react-navigation';

export default class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.closeNotification = this.closeNotification.bind(this);
  }

  closeNotification = () => {
    return this.props.handleCloseNotification();
  };
  render() {
    const { image, visible } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.closeNotification}>
        <Modal
          visible={visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this.closeNotification}
        >
          <View style={styles.MainContainer}>
            <TouchableOpacity
              onPress={this.closeNotification}
              activeOpacity={0.2}
            >
              <Text onPress={this.closeNotification} style={styles.TextStyle}>
                {'close'}
              </Text>
            </TouchableOpacity>
            <Image
              source={{ uri: image }}
              style={StyleSheet.flatten(styles.profileIcon)}
            />
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

ImageModal.propTypes = {
  image: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.476)',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    width: Dimensions.get('window').width,
  },

  profileIcon: {
    width: Dimensions.get('window').width,
    height: 400,
    borderRadius: 0,
  },

  TextStyle: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
