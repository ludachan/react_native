// https://facebook.github.io/react-native/docs/handling-text-input
// ToDo : https://facebook.github.io/react-native/docs/textinput.html
import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';

export default class HandlingTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          /**  onChangeText : 텍스트가 변경될 때마다 호출되는 메서드
           *   onSubmitEditing : 텍스트를 Submit시 호출되는 함수
           */
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
        </Text>
      </View>
    );
  }
}
