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
import PropTypes from 'prop-types';
import PDFReader from 'rn-pdf-reader-js';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { ProgressDialog } from 'react-native-simple-dialogs';
import * as Sharing from 'expo-sharing';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import { ErrorAlert, SuccessAlert } from '../../components';

class PDFModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      showErrorAlert: false,
      showSuccessAlert: false,
      showLoading: false,
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
      showErrorAlert: false,
      showSuccessAlert: false,
    });
  };

  showLoadingDialogue = () => {
    this.setState({
      showLoading: true,
    });
  };
  // Hide Loading Spinner
  hideLoadingDialogue = () => {
    this.setState({
      showLoading: false,
    });
  };

  _downloadPdf = async () => {
    this.showLoadingDialogue();
    const uri = this.props.uri;
    let fileUri = FileSystem.documentDirectory + uri.split('/')[7];
    console.log(fileUri);

    if (Platform.OS === 'ios') {
      if (!(await Sharing.isAvailableAsync())) {
        this.hideLoadingDialogue();
        return this.setState({
          showErrorAlert: true,
          showSuccessAlert: false,
          message: "Uh oh, sharing isn't available on your platform",
        });
      }
      this.hideLoadingDialogue();
      return await Sharing.shareAsync(fileUri);
    } else {
      const timeout = (time, promise) => {
        return new Promise(function (resolve, reject) {
          setTimeout(() => {
            reject(console.log('Request timed out.'));
          }, time);
          promise.then(resolve, reject);
        }).catch((error) => {
          console.log(error);
          this.hideLoadingDialogue();
          return this.setState({
            showErrorAlert: true,
            showSuccessAlert: false,
            message: 'File could not be saved, check your network!',
          });
        });
      };
      const controller = new AbortController();

      timeout(60000, FileSystem.downloadAsync(uri, fileUri))
        .then(({ uri }) => {
          if (uri == undefined || null || '') {
            this.hideLoadingDialogue();
            return this.setState({
              showErrorAlert: true,
              showSuccessAlert: false,
              message: 'File could not be saved, check your network!',
            });
          }
          console.log(uri);
          return this.saveFile(uri);
        })
        .catch((error) => {
          console.error(error);
          this.hideLoadingDialogue();
          this.setState({
            showErrorAlert: true,
            showSuccessAlert: false,
            message: 'File could not be saved, check your network!',
          });
          controller.abort();
        });
    }
  };

  saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      this.hideLoadingDialogue();
      return this.setState({
        showErrorAlert: false,
        showSuccessAlert: true,
        message: 'File successfully saved!',
      });
    }
  };
  render() {
    const { visible, modalStyle } = this.props;
    const {
      message,
      showErrorAlert,
      showLoading,
      showSuccessAlert,
    } = this.state;
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
          <ProgressDialog
            visible={showLoading}
            title='Processing'
            message='Please wait...'
          />
          <ErrorAlert
            title={'Error!'}
            message={message}
            handleCloseNotification={this.handleCloseNotification}
            visible={showErrorAlert}
          />
          <SuccessAlert
            title={'Awesome!'}
            message={message}
            handleCloseNotification={this.handleCloseNotification}
            visible={showSuccessAlert}
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
    height: Platform.OS === 'ios' ? 25 : 18,
    width: Platform.OS === 'ios' ? 25 : 18,
    tintColor: colors.blacks,
  },
  downloadIcon: {
    height: Platform.OS === 'ios' ? 28 : 25,
    width: Platform.OS === 'ios' ? 28 : 25,
    tintColor: colors.black,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 50,
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 12 : StatusBar.currentHeight,
    height: Platform.OS === 'ios' ? 64 : 64,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colorAccent,
    elevation: 1,
    shadowOffset: { height: 1, width: 0 },
    shadowColor: '#00000066',
    shadowOpacity: 0.25,
    shadowRadius: 2.26,
    alignContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 25 : -20,
  },
});

export default PDFModal;
