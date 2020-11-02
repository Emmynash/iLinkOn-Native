'use strict';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import PropTypes from 'prop-types';
import PDFReader from 'rn-pdf-reader-js';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { ErrorAlert, SuccessAlert } from '../../components';

class PDFModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      showAlert: false,
      showSuccessAlert: false,
      message: '',
    };
    this.closeNotification = this.closeNotification.bind(this);
    this._downloadPdf = this._downloadPdf.bind(this);
  }

  closeNotification = () => {
    return this.props.handleCloseModal();
  };

  handleCloseNotification = () => {
    return this.setState({
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  _downloadPdf = async () => {
    const uri = this.props.uri;
    let fileUri = FileSystem.documentDirectory + uri.split('/')[7];
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        if (uri === '' || undefined || null) {
          return this.setState({
            showAlert: true,
            showSuccessAlert: false,
            message: 'File could not be saved, check yourr network!',
          });
        }
        this.saveFile(uri);
        console.log(uri);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      return this.setState({
        showAlert: true,
        showSuccessAlert: false,
        message: 'File successfully saved!',
      });
    }
  };
  render() {
    const { visible, modalStyle } = this.props;
    const { message, showAlert } = this.state;
    const style = modalStyle || styles.modalCont;
    return (
      <TouchableWithoutFeedback onPress={this.closeNotification}>
        <Modal
          visible={visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this.closeNotification}
        >
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={this.closeNotification}
              style={styles.headerImage}
            >
              <Image
                onPress={this.closeNotification}
                source={require('../../assets/images/back.png')}
                style={StyleSheet.flatten(styles.headerIcon)}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._downloadPdf} activeOpacity={0.2}>
              <Image
                onPress={this._downloadPdf}
                source={require('../../assets/images/download_icon.png')}
                style={StyleSheet.flatten(styles.downloadIcon)}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.modalCont, style]}>
            <PDFReader
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: '#000',
              }}
              source={{
                uri: this.props.uri,
              }}
            />
          </View>
          <ErrorAlert
            title={'Error!'}
            message={message}
            handleCloseNotification={this.handleCloseNotification}
            visible={showAlert}
          />
          <SuccessAlert
            title={'Awesome!'}
            message={message}
            handleCloseNotification={this.handleCloseNotification}
            visible={showAlert}
          />
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

PDFModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  style: PropTypes.object,
  children: PropTypes.any,
  uri: PropTypes.string,
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  modalCont: {
    flex: 1,
    // padding: 20,
    backgroundColor: 'rgba(0,0,0,.476)',
  },
  headerImage: {
    borderRadius: 30,
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    height: 18,
    width: 18,
    tintColor: colors.blacks,
  },
  downloadIcon: {
    height: 25,
    width: 25,
    tintColor: colors.black,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 50,
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 8 : StatusBar.currentHeight,
    height: Platform.OS === 'ios' ? 50 : 64,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colorAccent,
    elevation: 1,
    shadowOffset: { height: 1, width: 0 },
    shadowColor: '#00000066',
    shadowOpacity: 0.25,
    shadowRadius: 2.26,
    alignContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : -20,
  },
});

export default PDFModal;
