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
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
import { ErrorAlert, SuccessAlert } from '../../components';

export default class ImageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      showAlert: false,
      showSuccessAlert: false,
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
      showAlert: false,
      showSuccessAlert: false,
    });
  };

  _downloadImage = async () => {
    const uri = this.props.image;
    let fileUri = FileSystem.documentDirectory + uri.split('/')[7];
    console.log(fileUri);
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        if (uri === '' || undefined || null) {
          return this.setState({
            showAlert: true,
            showSuccessAlert: false,
            message: 'Image could not be saved, check yourr network!',
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
        message: 'Image successfully saved!',
      });
    }
  };

  render() {
    const { image, visible } = this.props;
    const { showAlert, message } = this.state;
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
            <Image
              source={{ uri: image }}
              style={StyleSheet.flatten(styles.profileIcon)}
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
