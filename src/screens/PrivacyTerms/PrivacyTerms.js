'use strict';
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import styles from './styles';
import { WebView } from 'react-native-webview';

export default class PrivacyTerms extends Component {
  constructor() {
    super();
    this.state = {
      uri: '',
      name: ''
    }
  }

  async componentDidMount() {
    this.checkUri()
  }

  checkUri = async () => {
    let newUri = this.props.navigation.getParam('uri');
    let newName = this.props.navigation.getParam('name');

    if (newUri !== 'undefined') {
      return this.setState({
        uri: newUri,
        name: newName,
      })
    }
  }

  handleCloseNotification = () => {
    return this.setState({
      showAlert: false
    })
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
  }

  _onNavigationStateChange(webViewState) {
    if (webViewState.title === 'Payment Successful') {

      setTimeout(() => {
        this.props.navigation.navigate('ManageSubscription', {
          'paid': true
        });
      }, 3000);
    }
  }
  render() {
    const { navigation } = this.props,
      { uri } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          source={{ uri: uri }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          // scalesPageToFit={false}
          useWebKit={true}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}

        />
      </SafeAreaView>
    )
  }
}