import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,AsyncStorage,Alert, Dimensions  } from 'react-native';
import Input from '../../component/input';
import CoustomButton from '../../component/Button';
import color from '../../styles/color'
import axios from 'axios';
import {URL,IMAGE_UPLOAD_URL} from '../../../config';
import ImagePicker from 'react-native-image-picker';


const {width,height} = Dimensions.get('screen');

export default class profileScreen extends Component {
    static navigationOptions = {
        header: null,
    };
  constructor(props) {
    super(props);
    this.state = {
        status : 0,
        userImg : '',
        userName : '',
        userId : '',
        statusU : false,
        token : '',
        avatarSource: null,
    };
    this._getToken = this._getToken.bind(this);
    this._getToken();
}


//토큰 상태 저장
_getToken = async () =>{
    try {
        const token = await AsyncStorage.getItem('x-auth');
        if (token !== null) {
            this.setState({
                token : token
            })
            const { navigation } = this.props;
            const userId = navigation.getParam('userId');
            if(userId == null || userId == ''){
                //나일 경우
                axios.post(URL+'/user/iSelect',{
                    token
                }).then((response)=>{
                    console.log('성공')
                    console.log(response.data)
                    this.setState({
                        status : 1,
                        userImg : response.data.userImg,
                        userName : response.data.userNickname,
                        userId : response.data.userId
                    })
                }).catch(err=>{
                    Alert.alert('알림','다시 시도해주세요.')
                })
                    
            }else{
                //친구일 경우
                axios.post(URL+'/user/select',{
                userId
                }).then((response)=>{
                this.setState({
                    userImg : response.data.userImg,
                    userName : response.data.userNickname,
                    userId : response.data.userId
                })
                }).catch(err=>{
                    Alert.alert('알림','다시 시도해주세요.')
                })
            }
        }    
    } catch (error) {
        Alert.alert('알림','다시 시도해주세요.')
    }
}    
    



_changeUserName = (text) =>{
    this.setState({
        userName : text
    })
}
//이미지 픽하기
_selectImg=()=> {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      title: 'Select Image',
      
    };
    //const {token}= this.state.token
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response.uri);

        let source = { uri: response.uri };
        
        this.setState({
          avatarSource: source,
        });
        const data = new FormData();
        data.append('name', 'avatar');
        data.append('fileData', {
          uri : response.uri,
          type: response.type,
          name: response.fileName
        });
        const config = {
          method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'token': this.state.token
          },
          body: data
        };
        fetch(IMAGE_UPLOAD_URL + "/user/upload/profile", config)
        .then(response => response.json())
        .then(data => {
          this.setState({
            userImg : IMAGE_UPLOAD_URL+data.path
          })
          console.log(this.state.userImg)
        }).catch((err)=>{console.log(err)});
        }
    });
  }
//이미지 크게보기 화면 이동
_imgFull = () => {
    this.props.navigation.navigate('ProfileFull',{userImg : this.state.userImg});
}

//user 상태 변경시 서버에 저장
_userUpdate = () =>{
    const {userId,userName,userImg,token} = this.state;
    axios.post(URL+'/user/profileUpdate',{
        userId,userName,userImg,token
      }).then(()=>{
        Alert.alert('알림','저장되었습니다.');
        this.setState({status:1})
      }).catch(err=>{
        console.log(err);
        Alert.alert('알림','서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      })
}
//상태값에 따른 ui render 방식 변경
  _statusRender = () => {
    switch(this.state.status){
        case 0 :
            return (<View style={styles.mainContainer}>
                    <View style={styles.imageContainer}>
                    <TouchableOpacity activeOpacity = { .5 } onPress={this._imgFull}>
                        {this.state.userImg === ''?(
                        <Image style={styles.avatar} source={require('../../../assets/images/user.png')}/>
                        ):(
                        <Image style={styles.avatar} source={{ uri: this.state.userImg }} />
                        )}
                    </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.container }>
                            <Text style={styles.textName} >
                                {this.state.userName}
                            </Text>
                            <Text style={styles.textId} >
                                {this.state.userId}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.saveButtonContainer}>
                    <CoustomButton text='채팅' onPress={this._profileUpdate} /> 
                    </View>    
                </View>)
        
        case 1 :
            return (<View style={styles.mainContainer}>
                        <View style={styles.imageContainer}>
                        <TouchableOpacity activeOpacity = { .5 } onPress={this._imgFull}>
                            {this.state.userImg === ''?(
                            <Image style={styles.avatar} source={require('../../../assets/images/user.png')}/>
                            ):(
                            <Image style={styles.avatar} source={{ uri: this.state.userImg }} />
                            )}
                        </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                        <View style={styles.container }>
                            <Text style={styles.textName} >
                                {this.state.userName}
                            </Text>
                            <Text style={styles.textId} >
                                {this.state.userId}
                            </Text>
                        </View>
                        </View>
                        <View style={styles.saveButtonContainer}>
                            <CoustomButton text='수정' onPress={()=>{this.setState({status:2})}} /> 
                        </View> 
                    </View>)
        case 2 :
            return (<View style={styles.mainContainer}>
                        <View style={styles.imageContainer}>
                        <TouchableOpacity activeOpacity = { .5 } onPress={this._selectImg}>
                            {this.state.userImg === ''?(
                            <Image style={styles.avatar} source={require('../../../assets/images/user.png')}/>
                            ):(
                            <Image style={styles.avatar} source={{ uri: this.state.userImg }} />
                            )}
                        </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                        <View style={styles.container }>
                            <Input 
                            placeholder="이름을 입력해주세요."
                            onChangeText={this._changeUserName} 
                            value={this.state.userName}
                            />
                            <Text 
                                style={styles.textId}
                            >
                                {this.state.userId}
                            </Text>
                        </View>
                        </View>
                        <View style={styles.saveButtonContainer}>
                            <CoustomButton text='완료' onPress={this._userUpdate} /> 
                        </View> 
                    </View>)
    }
  }

  render() {
    return (
        this._statusRender()        
      );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
      flex: 1,
      // Set content's horizontal alignment.
      alignItems: 'center',
      flexDirection: 'column',
    },
    imageContainer: 
    {
        flex: 1,
        // Set content's horizontal alignment.
        alignItems: 'center',
        marginTop:30
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      marginBottom:10,
      
    },
    inputContainer: {
      marginTop:30,
      flex: 4,
      flexDirection: 'column',
      alignItems: 'center',
    },
    saveButtonContainer:{
      flex: 1,
      alignItems: 'flex-end',
    },
    container:{
      width :0.9*width,
      height:0.07*height,
      backgroundColor : '#fff',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 10,
    },
    textId:{
        paddingLeft: '3%',
        color: color.black,
        marginTop: 10,
        fontSize:15,
        alignItems: 'center',
    },
    textName:{
        paddingLeft: '3%',
        color: color.black,
        marginTop: 10,
        fontSize:25,
        alignItems: 'center',
    },
  //미인증 버튼 스타일(default)
  buttonContainerFalse:{
      flex : 1,
      backgroundColor:'#0067a3',
      alignItems: 'center',
      justifyContent: 'center',
  },
  //인증 완료 버튼 스타일
  buttonContainerTrue:{
    flex : 1,
    backgroundColor:'#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
      fontSize:15,
      color: color.white
  }
    
  });