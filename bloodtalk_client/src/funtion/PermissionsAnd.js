import React from 'react';
import {
  View,
  PermissionsAndroid
} from 'react-native';

export default class PermissionCheck extends React.Component {

  constructor(props) {
    super(props);

   
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.requestAlbumPermission = this.requestAlbumPermission.bind(this);
    this.requestSmsPermission = this.requestSmsPermission.bind(this);
    this.requestCameraPermission();
    this.requestAlbumPermission();
    this.requestSmsPermission();
  } 
  requestSmsPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.READ_SMS,
        {
          title: '문자 읽기',
          message:
            'SMS READ ', 
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  requestCameraPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '사진권한',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  
  requestAlbumPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '앨범 권한',
          message:
            'Album ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  
  render() {
    return (
      <View></View>
    );
  }
}

