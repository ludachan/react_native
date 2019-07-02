import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,  
  TouchableOpacity,
  Alert,
  Button,
  PermissionsAndroid,
  Platform
} from "react-native";
import { Icon } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { URL } from "../../../config";
import firebase from "react-native-firebase";
import SQLiteDatabase from '../../funtion/SQLiteDatabase';
const db = new SQLiteDatabase();

export default class Friend extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="person" style={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      token: "",
      fcmToken: "",
      userList: []
    };
    this._getToken = this._getToken.bind(this);
    this._getToken();
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log("permission rejected");
    }
  }

  //3
  async getToken() {
    let fcmToken = await firebase.messaging().getToken(); //서버 fcm
    this.setState({
      fcmToken: fcmToken
    });
  }

  async createNotificationListeners() {
    const token = await AsyncStorage.getItem("x-auth");

    //param - 1. 채널id   / 2. 채널 명 / 3.중요도
    const channel = new firebase.notifications.Android.Channel(
      "blood_chat",
      "Test Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("chat description");

    console.log('notinoti')

    //기본 리스너 받아주는 역할을 한다.
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        notification.android
          .setChannelId("blood_chat")
          .android.setSmallIcon("ic_launcher");
        firebase.notifications().displayNotification(notification);
        firebase.notifications().android.createChannel(channel);
      });

    //앱이 실행중일떄 알림을 터치할 경우
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        if (notificationOpen) {
          console.log("TOKEN 앱 실행 중 알람 터치 : " + JSON.stringify(token));
          axios
            .post(URL + "/room/notiinfo", {
              chatUUID: notificationOpen.notification._data.chatUUID,
              token: token
            })
            .then(response => {
              let userList = [];
              for (let i = 0; i < response.data.length; i++) {
                userList.push(response.data[i]);
              }

              //네비게이터로 화면 이동
              this.props.navigation.navigate("Chatting", {
                chatUUID: notificationOpen.notification._data.chatUUID,
                userObjectId: response.data.userObjectId,
                members: userList,
                chatTitle: notificationOpen.notification._data.chatTitle
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });

    //백그라운드에서 알림을 터치할 경우
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.log("TOKEN 백그라운드에서 알람 터치 : " + JSON.stringify(token));
      axios
        .post(URL + "/room/notiinfo", {
          chatUUID: notificationOpen.notification._data.chatUUID,
          token: token
        })
        .then(response => {
          let userList = [];
          for (let i = 0; i < response.data.length; i++) {
            userList.push(response.data[i]);
          }

          //네비게이터로 화면 이동
          this.props.navigation.navigate("Chatting", {
            chatUUID: notificationOpen.notification._data.chatUUID,
            userObjectId: response.data.userObjectId,
            members: userList,
            chatTitle: notificationOpen.notification._data.chatTitle
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    
    //알림 받은후 이벤트 발생(data만 받을 경우만 실행)
    this.messageListener = firebase.messaging().onMessage((message) => {
      //try{
        console.log('messageListener');
        //console.log('token : ' + token);
        //console.log(JSON.stringify(message));
        if(message._data.type=='DELETE'){
          axios.post(URL+'/user/iSelect',{
            token: token,
          }).then(response=>{
            console.log(message._data.chatUUID)
            console.log(message._data.messageUUID)
            console.log(response.data._id)
            db.updateClientMessagesList(message._data.chatUUID, message._data.messageUUID, response.data._id);
          }).catch(err=>{
            console.log(err)
          })
        }
        else if(message._data.type=='allDelete'){
          axios.post(URL+'/chat/load', {
            chatUUID: message._data.chatUUID,
            userObjectId: message._data.userObjectId,
          }).then(response=>{
            for (let i = 0; i < response.data.length; i++) {
              if(response.data[i].messageType=='D'){
                db.updateClientMessagesList(this.state.chatUUID, response.data[i].messageUUID, this.state.userObjectId)
              }
            }
          }).catch(err=>{
            console.log('chat/load err ' + err)
          })
        }
      }).catch(err=>{
        console.log('firebase err' + err)
      })
  }

  //토큰뽑아서 친구목록 출력
  _getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("x-auth");
      if (token !== null) {
        //토큰 확인후 프로필 정보 확인
        this.setState({
          token: token
        });
        axios
          .post(URL + "/friend/list", {
            token
          })
          .then(response => {
            let userList = [];
            for (let i = 0; i < response.data.length; i++) {
              userList.push(response.data[i]);
            }
            this.setState({
              userList: userList
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (error) {}
  };

  //유저 선택시 프로필 보기
  _profileView = userId => {
    this.props.navigation.navigate("Profile", {
      userId: userId
    });
  };

  render() {
    return (
      <FlatList
        data={this.state.userList}
        keyExtractor={(item, index) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              this._profileView(item.userId);
            }}
            style={{ padding: 10 }}
          >
            <View style={styles.lvRow}>
              <Image style={styles.img} source={{ uri: `${item.userImg}` }} />
              <View style={styles.textView}>
                <Text style={styles.textTitle} numberOfLines={1}>
                  {" "}
                  {`${item.userNickname}`}{" "}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  lvRow: {
    flex: 1,
    flexDirection: "row",
    padding: 10
    //backgroundColor:'red',
  },
  textView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5
  },
  textTitle: {
    flex: 1,
    textAlign: "left",
    color: "#000",
    fontSize: 15
  },
  textContent: {
    flex: 1,
    fontSize: 11,
    color: "#000",
    textAlign: "center"
  },
  img: {
    height: 50,
    width: 50
  }
});
