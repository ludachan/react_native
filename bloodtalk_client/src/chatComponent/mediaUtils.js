//import { Permissions, Location, ImagePicker, Linking } from 'expo'

import ImagePicker from 'react-native-image-picker';
import { Alert,PermissionsAndroid } from 'react-native'
import {URL,IMAGE_UPLOAD_URL} from '../../config'
import UUID from 'uuid/v1'


  /**
   * function 정의
   */
  //카메라,앨범 권한 체크
  /*
  requestCameraPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
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
  */
  
  requestAlbumPermission = async () =>  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera : ' + granted);
        return true;
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

/*  
export default async function getPermissionAsync(permission) {
  const { status } = await Permissions.askAsync(permission)
  if (status !== 'granted') {
    const { name } = Constants.manifest
    const permissionName = permission.toLowerCase().replace('_', ' ')
    Alert.alert(
      'Cannot be done 😞',
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL('app-settings:'),
        },
        { text: 'Nevermind', onPress: () => {}, style: 'cancel' },
      ],
      { cancelable: true },
    )

    return false
  }
  return true
}
*/
/*
export async function getLocationAsync(onSend) {
  if (await getPermissionAsync(Permissions.LOCATION)) {
    const location = await Location.getCurrentPositionAsync({})
    if (location) {
      onSend([{ location: location.coords }])
    }
  }
}
*/

export async function pickImageAsync(onSend) {
  let check = this.requestAlbumPermission();
  if (check) {
    const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        title: 'Select Image',
    };
    ImagePicker.launchImageLibrary(options, (response) => {
        //console.log('Response = ', response);
        if (response.didCancel) {
        //console.log('User cancelled photo picker');
        } else if (response.error) {
        //console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
        } else {
            //console.log(response.uri);
            //onSend([{ image: response.uri }])
            //return response.uri
            const data = new FormData();
            data.append('name', 'chat-image');
            data.append('fileData', {
              uri : response.uri,
              type: response.type,
              name: response.fileName
            });
            //console.log('data '  + data);
            const config = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'token':'aaa',
                },
                body: data
            };
            //console.log(URL+ "/conversation/imgUpload")
            //console.log(config)
            fetch(IMAGE_UPLOAD_URL + "/chat/upload/image", config)
            .then(response => response.json())
            .then(data => {
              console.log('image data : ' + data)
              console.log('image url : ' + URL+data.path)
              onSend([{ images: IMAGE_UPLOAD_URL+data.path }])
            }).catch((err)=>{
              console.log('err')
              console.log(err)
            });
        }
    }
)}
}

export async function pickVideoAsync(onSend) {
  let check = this.requestAlbumPermission();
  if (check) {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium',
      allowsEditing: true,
      base64: true,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      console.log('Response.uri = ', response.uri);
      console.log('Response.name = ', response.name);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const data = new FormData();
        data.append('name', 'avatar');
        data.append('fileData', {
          uri : response.uri,
          name : UUID()+'.mp4',
          type: 'video/mp4'
        });
        const config = {
          method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          },
          body: data
        };
        fetch(IMAGE_UPLOAD_URL + "/chat/upload/video", config)
        .then(response => response.text())
        .then(data => {
          console.log('vdata : ' + data)
            /* 결과 string->json 파싱후 사용하시면 됩니다.
            {"fieldname":"fileData",
            "originalname":"test.mp4",
            "encoding":"7bit","
            mimetype":"video/mp4",
            "destination":"/var/www/upload/chat_video",
            "filename":"1560939095718.mp4",
            "path":"/var/www/upload/chat_video/1560939095718.mp4",
            "size":897958}
            */ 
            let parseData = JSON.parse(data)
            //onSend([{ videos: IMAGE_UPLOAD_URL+parseData.path }])
            onSend([{ videos: IMAGE_UPLOAD_URL+parseData.path }])
        }).catch((err)=>{console.log(err)});
      }
    });  
  }
}
