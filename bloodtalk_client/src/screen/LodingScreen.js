import React, { Component } from 'react';
import { View, Image, Dimensions,StyleSheet,Platform,PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {URL} from '../../config';
import firebase, { Notification } from 'react-native-firebase';
import Contacts from 'react-native-contacts';


export default class Loding extends Component {
  constructor(props){
    super(props);

    this._getToken = this._getToken.bind(this)
    //로딩화면 3초후 화면이동.
    setTimeout(() => {
      this._getToken();
    }, 3000);
  }

  
  static navigationOptions = {
    header: null,
  };

  state = {
    token : '',
    fcmToken : '',
    contacts : []
  }

  //화면 생성 완료시 실행되는 생명주기
  async componentDidMount() {
    this.checkPermission();
  }

  //1 firebase-fcm에 대한 권한
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getPushToken();
    } else {
        this.requestPermission();
    }
  }
  
  //2 firebase-fcm에 대한 권한이 없을경우 요청
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        this.getPushToken();
    } catch (error) {
        console.log('permission rejected');
    }
  }
  
  //3 firebase-fcm에 대한 토큰 받아서 state에 저장
  async getPushToken() {
    let fcmToken = await firebase.messaging().getToken();//서버 fcm
    this.setState({
      fcmToken : fcmToken
    })
  }
  
  //render 메소드 호출전 실행되는 생명주기
  async componentWillMount() {
    //전화번호루 read 권한 요청
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.'
        }
      ).then(() => {
        this.loadContacts();
      })
    } else {
      this.loadContacts();
    }
  }


  //전화부 read 권한이 있다면 친구목록에서 자동 친구 추가
  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied'){
        console.warn('Permission to access contacts was denied');
      } else {
        this.setState({ contacts });
        let numberData =[];
        const token = this.state.token;
        //3단 배열 구조 -> 배열안에 json안에 배열
        for(let i = 0;i<contacts.length;i++){
         const numbers = contacts[i].phoneNumbers[0].number;
         numberData.push((numbers.replace(/-/gi, "")).replace(/(\s*)/g,""));
        }
        console.log(numberData);
        axios.post(URL+'/friend/autoAdd',{
          numberData,token
        })
      }
    })
  }
  //토큰 확인후 화면이동
  _getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('x-auth');
      const {fcmToken} = this.state;
      if (token !== null) {
        //토큰 확인후 프로필 정보 확인
        axios.post(URL+'/user/userCheck',{
            token
          }).then((response)=>{
            if(response.data=='Y'){
              this.props.navigation.replace('Main')
                axios.post(URL+'/user/pushTokenUpdate',{
                  token,fcmToken
                })
            }else if(response.data=='N'){
                this.props.navigation.replace('UserProfile')
                //navigate('UserProfile');
            }
          }).catch(err=>{
            console.log(err);
          })
        
      }else{
        this.props.navigation.replace('NationCode')
        // const {navigate} = this.props.navigation;
        // navigate('NationCode');
      }
    } catch (error) {
      console.log('error',error)
      this.props.navigation.replace('NationCode')
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.avatar} source={require('../../assets/images/logo.png')}/>
      </View>
    );
  }
  
    
  
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },

})