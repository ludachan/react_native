import React, {Component} from 'react';
import { AsyncStorage, View, Text } from 'react-native';
import firebase from 'react-native-firebase';

export default class App extends Component {

async componentDidMount() {
  this.checkPermission();
}

async checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
      console.log('checkPermission ');
  } else {
      this.requestPermission();
      console.log('checkPermission rejected');
  }
}

async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log("토큰1 : " + fcmToken);
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log("토큰2 : " + fcmToken);
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}

async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
      console.log('requestPermission');
  } catch (error) {
      // User has rejected permissions
      console.log('requestPermission rejected');
  }
}

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}