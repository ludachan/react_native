// https://facebook.github.io/react-native/docs/handling-touches
import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';

export default class Touchables extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!')
  }

  _onLongPressButton() {
    Alert.alert('You long-pressed the button!')
  }

            // TouchableHighlight : 버튼을 누르면 뷰의 배경이 underlayColor가 씌워짐
            // TouchableOpacity : 버튼을 누르면 버튼의 불투명도를 줄임
            // TouchableNativeFeedback : 버튼을 누르면 잔물결 효과, android에서만 적용
            // TouchableWithoutFeedback : 효과 없음
            // onPress, onLongPress
  render() {
    return (
        <View style={styles.container}>
            <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
            <View style={styles.button}>
                <Text style={styles.buttonText}>TouchableHighlight</Text>
            </View>
            </TouchableHighlight>
            <TouchableOpacity onPress={this._onPressButton}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>TouchableOpacity</Text>
            </View>
            </TouchableOpacity>
            <TouchableNativeFeedback
                onPress={this._onPressButton}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>TouchableNativeFeedback</Text>
            </View>
            </TouchableNativeFeedback>
            <TouchableWithoutFeedback
                onPress={this._onPressButton}
                >
            <View style={styles.button}>
                <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
            </View>
            </TouchableWithoutFeedback>
            <TouchableHighlight onPress={this._onPressButton} onLongPress={this._onLongPressButton} underlayColor="white">
            <View style={styles.button}>
                <Text style={styles.buttonText}>Touchable with Long Press</Text>
            </View>
            </TouchableHighlight>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  }
});
