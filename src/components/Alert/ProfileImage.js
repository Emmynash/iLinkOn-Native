'use strict';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import colors from '../../assets/colors';
import PropTypes from 'prop-types';
import theme from '../../assets/theme';

export default class ProfileImage extends Component {
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
    const { title, image, visible, positiveButton } = this.props;
    const posButton = positiveButton || 'Okay';
    return (
      <View>
        <Modal
          visible={visible}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this.closeNotification}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={styles.Alert_Main_View}>
              <Image
                source={{ uri: image }}
                style={StyleSheet.flatten(styles.profileIcon)}
              />
              <Text style={styles.Alert_Message}>{title}</Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={this.closeNotification}
                  activeOpacity={0.2}
                >
                  <Text
                    onPress={this.closeNotification}
                    style={styles.TextStyle}
                  >
                    {posButton}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

ProfileImage.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  Alert_Main_View: {
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.white,
    // height: 220,
    width: '70%',
    borderRadius: 8,
    elevation: 3,
    shadowColor: theme.primaryTextColor,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2.25,
  },
  profileIcon: {
    width: 280,
    height: 200,
    borderRadius: 0,
  },

  Alert_Title: {
    fontSize: theme.MediumFont,
    color: colors.itemColor,
    fontFamily: theme.LightFont,
    marginTop: 8,
    marginLeft: 8,
    // textAlign: 'center'
  },
  Alert_Message: {
    fontSize: theme.SmallFont,
    color: colors.itemColor,
    marginTop: 8,
    marginLeft: 18,
    fontFamily: theme.LightFont,
    marginBottom: 4,
  },
  buttonStyle: {
    width: '24%',
    // height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 8,
    paddingVertical: 2,
    marginVertical: 4,
    marginRight: 16,
  },
  buttonView: {},
  TextStyle: {
    color: theme.colorAccent,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: theme.LightFont,
  },
  logoIcon: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
  },
});
