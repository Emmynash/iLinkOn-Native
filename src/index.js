'use strict';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import * as Sentry from 'sentry-expo';
import * as Font from 'expo-font';
import Navigator from './routes';
import colors from './assets/colors';
TextInput.defaultProps.selectionColor = colors.text_color;
import { Provider } from 'react-redux';
import store from './redux/store';

Sentry.init({
  dsn:
    'https://a19d70ab4d604ea19ac81a793b800b72@o476524.ingest.sentry.io/5516801',
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
  setCommits: true,
});

// Access any @sentry/react-native exports via:
// Sentry.Native.*

// Access any @sentry/browser exports via:
// Sentry.Browser.*

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
