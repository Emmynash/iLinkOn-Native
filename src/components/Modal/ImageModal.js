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
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ResponsiveImage from 'react-native-responsive-image';
import colors from '../../assets/colors';
import { ErrorAlert, SuccessAlert } from '../../components';

export default class ImageModal extends Component {
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
    this._downloadImage = this._downloadImage.bind(this);
  }

  closeNotification = () => {
    return this.props.handleCloseNotification();
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

  _downloadImage = async () => {
    this.showLoadingDialogue();
    const uri = this.props.image;
    let fileUri = FileSystem.documentDirectory + uri.split('/')[7];
    console.log(fileUri);

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
          message: 'Image could not be saved, check your network!',
        });
      });
    };

    const controller = new AbortController();

    timeout(6000, FileSystem.downloadAsync(uri, fileUri))
      .then(({ uri }) => {
        console.log(uri);
        if (uri == undefined || null || '') {
          this.hideLoadingDialogue();
          return this.setState({
            showErrorAlert: true,
            showSuccessAlert: false,
            message: 'File could not be saved, check your network!',
          });
        }
        return this.saveFile(uri);
      })
      .catch((error) => {
        console.error(error);
        controller.abort();
      });
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
        message: 'Image successfully saved!',
      });
    }
  };

  render() {
    const { image, visible, showLoading } = this.props;
    const { message, showErrorAlert, showSuccessAlert } = this.state;
    return (
      <TouchableWithoutFeedback onPress={this.closeNotification}>
        <Modal
          visible={visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this.closeNotification}
        >
          <View style={styles.MainContainer}>
            <View style={styles.navBar}>
              <TouchableOpacity
                onPress={this.closeNotification}
                activeOpacity={0.2}
              >
                <Text onPress={this.closeNotification} style={styles.TextStyle}>
                  {'close'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._downloadImage}
                activeOpacity={0.2}
              >
                <Image
                  onPress={this._downloadImage}
                  source={require('../../assets/images/download_icon.png')}
                  style={StyleSheet.flatten(styles.headerIcon)}
                />
              </TouchableOpacity>
            </View>
            <View style={StyleSheet.flatten(styles.imageContainer)}>
              <ResponsiveImage
                source={{ uri: image }}
                initWidth={Dimensions.get('window').width}
                initHeight='400'
              />
            </View>
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

  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  TextStyle: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 15,
  },
  headerIcon: {
    padding: 15,
    height: 18,
    width: 18,
    tintColor: colors.white,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    elevation: 1,
    shadowOffset: { height: 1, width: 0 },
    shadowColor: '#00000066',
    shadowOpacity: 0.25,
    shadowRadius: 2.26,
    alignContent: 'space-between',
  },
});
