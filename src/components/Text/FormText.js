import React, {Component} from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';


export default class FormText extends Component { 
  render( ){
    const { disabled, text, onPress, style } = this.props;
    const opacityStyle = disabled ? 0.2 : null;
    return(
      <View>
        <TouchableHighlight 
          onPress = {onPress}
          style={{opacity: opacityStyle}}>
          <Text style = {style}> 
            { text }
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

FormText.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  styles: PropTypes.object,
};