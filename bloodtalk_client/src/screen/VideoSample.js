import React from 'react';
import {
  AppRegistry,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Video
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {IMAGE_UPLOAD_URL} from '../../config';
import UUID from 'uuid/v1'

export default class VideoSample extends React.Component {
  state = {
    videoSource: null,
    resultVideo : ''
  };

  constructor(props) {
    super(props);
    this.selectVideoTapped = this.selectVideoTapped.bind(this);
  }

  //비디오 업로드 FUNCTION
  selectVideoTapped() {
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
      console.log('Response = ', response.uri);
      console.log('Response = ', response.name);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          videoSource: response.uri,
        });
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
        fetch(IMAGE_UPLOAD_URL + "/video/upload", config)
        .then(response => response.text())
        .then(data => {
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
          this.setState({
            resultVideo : IMAGE_UPLOAD_URL+parseData.filename
          })
        }).catch((err)=>{console.log(err)});

      }
    });
  }
  //테스트 화면 이므로 사용안하셔도 무방합니다.
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity>

        {this.state.videoSource && (
          <Text style={{ margin: 8, textAlign: 'center' }}>
            {this.state.userImg}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});