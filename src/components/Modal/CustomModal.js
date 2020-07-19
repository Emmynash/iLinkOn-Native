'use strict';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import colors from '../../assets/colors';
import PropTypes from 'prop-types';
import theme from '../../assets/theme';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  closeNotification = () => {
    return this.props.handleCloseModal();
  };
  render() {
    const { visible, modalStyle } = this.props;
    const style = modalStyle || styles.modalCont;
    return (
      <TouchableWithoutFeedback onPress={this.closeNotification}>
        <Modal
          visible={visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this.closeNotification}
        >
          <View style={[styles.modalCont, style]}>{this.props.children}</View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

CustomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  style: PropTypes.object,
  children: PropTypes.any
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 0
  },
  modalCont: {
    flex: 1,
    // padding: 20,
    backgroundColor: 'rgba(0,0,0,.476)'
  }
});
