'use strict';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import * as Font from 'expo-font';
import Navigator from './routes';
import colors from './assets/colors';
TextInput.defaultProps.selectionColor = colors.text_color;
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
  const [fontsLoaded, setfontLoad] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'segoe-ui-bold': require('../src/assets/fonts/segoe-ui-bold.ttf'),
        'segoe-ui': require('../src/assets/fonts/segoe-ui.ttf'),
      });

      setfontLoad(true);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Provider store={store}>{fontsLoaded ? <Navigator /> : null}</Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    elevation: 4,
  },
});

export default App;
