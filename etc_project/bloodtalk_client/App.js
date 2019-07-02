import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import firebase, { Firebase } from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



type Props = {};
export default class App extends Component<Props> {
  
  
  async componentDidMount(){  //시작
    this._checkPermission(); //permission 이 있는지 체크
    this._listenForNotifications();
   
    
  }

  componentWillUnmount(){  //해제
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  //필요없지만 테스트 할려고 만들어놓음
  /*async _TokenToGet(){ 
    const _token = await firebase.messaging().getToken();
  }*/

  
  //권한요청
  async _checkPermission(){
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        // 유저가 permission 이있다면 
        console.log(enabled);
        //permission 있다면 서버에 토큰정보 저장
        //특정 사용자의 token정보 함께 저장해두기 
        this._updateTokenToServer(); 
    } else {
        // permission이없다면 요청하기 
        this._requestPermission();
    }
  }

   // permission이없다면 요청하기 
  async _requestPermission(){
    try {
      // 권한요청
      await firebase.messaging().requestPermission();
      await this._updateTokenToServer();
    } catch (error) {
        // 거절
        alert("you can't handle push notification");
        console.log(error);
    }
  }
  //메시지 토큰받아오기
  async _updateTokenToServer(){
    const fcmToken = await firebase.messaging().getToken();
    console.log("token_id:  "+fcmToken);
   
   
    //토큰 데이터값을 받아서
    //const url ="https://server";
    //const fcmtoken= await fetch(url); 
    


    const header = {
      method: "POST",
      headers: {
         'Accept':  'application/json',
         'Content-Type': 'application/json',
         'Cache': 'no-cache'
      },
      body: JSON.stringify({ 
        user_id:"abc", 
        firebase_token: fcmToken
      }),
      credentials: 'include',
    };
  //  const url = "http://localhost:3000/";

  //  await fetch(url, header);   
  }
  
  async _listenForNotifications(){   
    /*const channel = new firebase.notifications.Android.Channel('testchannel', 'Test Channel이야', firebase.notifications.Android.Importance.Max)
    .setDescription('My apps test channel');

    await channel();*/
      const notification = new firebase.notifications.Notification()
      .setNotificationId('abc')
      .setTitle('My notification title')
      .setBody('My notification body')
      .setData({
      key1: 'value1',
      key2: 'value2',
    });
    
          
    //onNotification는 앱이 background에서 ,push 알림을 클릭하여 열 때, 해당 push 알림을 처리
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log('onNotification', notification);               
    });

    //onNotificationOpened는 앱이 foreground 실행 중일때, push 알림을 클릭하여 열 때, 해당 push 알림을 처리
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notification) => {
        console.log('onNotificationOpened', notification);
        
  
    });

    // background 메시지 listener
    this.messageListener = firebase.messaging().onMessage((message) => {     
      console.log(message);
      
    });



    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {      
        console.log('getInitialNotification', notificationOpen);
        
    }
  }

   
  render() {
    
    return (         
      <View style={styles.container}>
      
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});