import React from 'react'
import { GiftedChat, Message } from 'react-native-gifted-chat'
import { Clipboard,Alert, StyleSheet,TouchableOpacity,View } from 'react-native';
import axios from 'axios';
import {URL,CHAT_SERVER} from '../../config';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import UUID from 'uuid/v1'
import AccessoryBar from '../chatComponent/AccessoryBar'
import SQLiteDatabase from '../../src/funtion/SQLiteDatabase';
import Modal from 'react-native-modal';
import VideoPlayer from '../chatComponent/VideoPlayer';
import produce from "immer"
import { MaterialHeaderButtons, Item } from '../component/HearderIconBtn';
import {HeaderBackButton} from 'react-navigation';
const db = new SQLiteDatabase();


export async function dbDelete(){
    db.DeleteList();
}

export default class ChattingScreen extends React.Component {
  static navigationOptions =({navigation})=> {
    const { params = {} } = navigation.state
    return {
        title : '대화방',
        headerLeft:(<HeaderBackButton onPress={({})=>{navigation.replace('Main')}}/>),
        headerRight: (
            <MaterialHeaderButtons>
              <Item title="exit" 
                    iconName="exit-to-app" 
                    onPress={() => params.roomExit()} />
            </MaterialHeaderButtons>
          )
    } 
} 

  constructor(props) {
    super(props);
    try{
      this.socket = SocketIOClient(CHAT_SERVER);
    }catch(err){
    }
    this.state = {
        isLoading: false,
        chatUUID: '',
        members: '',
        userObjectId:'',
        chatTitle:'',
        messages: [],
        checkUser:[],
        is_modal_visible: false,
        video_uri: null,
        AllDelete: false,
    };
    this.onSend = this.onSend.bind(this);
    this._getReply = this._getReply.bind(this);
    this._getUser = this._getUser.bind(this);
  }

  componentWillUnmount(){
    this.socket.close();
  }

  _roomExit = () => {
    Alert.alert(
      '대화방 나가기',
      '대화 내용을 유지하시겠습니까?',
      [
        {
          text: '취소', 
          onPress: () => {  console.log('취소') }
        },
        {
          text: '삭제', 
          onPress: () => {  
            this._allDeleteMessage(this.state.userObjectId)
          } //방을 나갈때 삭제를 선택하면 대화내용이 다 삭제 된다.
        },
        {
          text: '유지',
          onPress:() => {  
            this._Leave() 
          } //방을 나갈때 유지를 선택하면 유지가 된다. 자기 클라이언트 DB만 지움
        },
      ],
      { cancelable: false }
    );
  }

  /**
   * 서버에 있는 데이터 불러와서 클라이언트 DB에 저장
   */
  async componentDidMount() {
    this.props.navigation.setParams({ roomExit: this._roomExit })
    this.setState({
      isLoading:true
    })
    axios.post(URL+'/chat/load', {
      chatUUID: chatUUID,
      userObjectId: userObjectId,
    }).then(response=>{
      for (let i = 0; i < response.data.length; i++) {
        console.log('messageType : ' ,response.data[i].messageType)
        if(response.data[i].messageType=='U'){
          this._severSaveData(chatUUID,response.data[i].messageUUID,response.data[i].userObjectId,response.data[i].messageTime,response.data[i].text,response.data[i].image,response.data[i].video,userObjectId)
        }else if(response.data[i].messageType=='D'){
          db.updateClientMessagesList(this.state.chatUUID, response.data[i].messageUUID, this.state.userObjectId)
        }
      }
      this._getClientMessagesList();
    }).catch(err=>{
      console.log('chat/load err ' + err)
      this._getClientMessagesList();
    })

    this.setState({
      chatUUID:chatUUID,
      members:members,
      userObjectId:userObjectId,
      chatTitle:chatTitle,
      messages: [],
    })
    this._Join();
    this.socket.on(chatUUID, this._getReply);
    this.socket.on(chatUUID+',DeleteMessage', this._getUser);
  }

  /*
    클라이언트 DB에 저장된 메시지를 채팅창에 뿌려주는 함수
  */
  _getClientMessagesList(){
    db.getClientMessagesList(chatUUID).then((data) => {
      let messageList = [];
      for (let i = 0; i < data.length; i++) {
        let messageData = 
        {
          _id: data[i].messageUUID,
          text: data[i].text,
          createdAt: data[i].messageTime,
          user: { _id : data[i].userObjectId,
                  name: 'React Native',
                  avatar: 'https://placeimg.com/140/140/any'
                },
          image:data[i].image,
          video:data[i].video,
        }
        messageList.push(messageData); //클라이언트 DB
      }
      this.setState({ messages : messageList,
                      isLoading : false,
      });
    }).catch((err) => {
      this.setState({
        isLoading: false
      })
      console.log('error : ' + err);
    })
  }

  /*
    클라이언트DB에 채팅 데이터 저장하는 함수
  */
  _saveData(chatUUID,messageUUID,userObjectId,messageTime,content,image,video){
    db.saveClientMessagesList(chatUUID,messageUUID,userObjectId,messageTime,content,image,video);
  }

  /*
    서버DB에 있는 채팅 데이터를 클라이언트DB에 채팅 데이터 저장하는 함수
  */
  _severSaveData(chatUUID,messageUUID,userObjectId,messageTime,content,image,video,myObjectId){
    if(userObjectId!=myObjectId){
      db.saveServerMessagesList(chatUUID,messageUUID,userObjectId,messageTime,content,image,video,myObjectId);
    }
  }

  /*
    서버에 채팅 데이터 전송하는 함수(noSyncObjectId는 해당 소켓에 접속해있지 않는 objectId데이터 삽입)
  */
  async _updateMessageData(chatUUID,messageUUID,userObjectId,messageTime,content,image,video,checkUser){
    await axios.post(URL+'/chat/save', {
      chatUUID: chatUUID,
      messageUUID:messageUUID,
      userObjectId:userObjectId,
      messageTime:messageTime,
      content:content,
      image:image,
      video:video,
      noSyncObjectId:checkUser
    }).then(response=>{
      //console.log(response.data);
    }).catch(err=>{
      console.log("axios _updateMessageData err : " + err)
    })
  }

  _getUser(data,joinUser,allDelete){
    // console.log('_getUser')
    // console.log('allDelete => ' + allDelete)
    if(allDelete==false){ // 메시지 1개 지우는 방법
      // console.log('data.user._id => ' + data.user._id)
      // console.log('this.state.userObjectId => ' + this.state.userObjectId)
      if(data.user._id!=this.state.userObjectId){ //메시지 삭제 요청한 사람과 받는 사람이 다르면 
        this._deleteMessage(data) //소켓에 접속되어있는 사람 클라이언트DB 지우기
      }
      if(data.user._id==this.state.userObjectId){ //메시지 삭제 요청한 사람이라면
        let pushUser = [];
        axios.post(URL+'/room/members', {
          chatUUID: this.state.chatUUID,
          userObjectId: this.state.userObjectId
        }).then(response=>{
          let roomUser = new Array();
          roomUser = response.data;
          //roomUser.splice(roomUser.indexOf(this.state.userObjectId),1)
          for(let j=0; j<joinUser.length; j++){
            roomUser.splice(roomUser.indexOf(joinUser[j]),1)
          }
          pushUser = roomUser; //소켓에 접속되어있는 사람과 채팅방 유저를 비교하여 비접속자 체크
          if(pushUser.length!=0){
            axios.post(URL + '/chat/merge', {
              chatUUID: this.state.chatUUID,
              messageUUID: data._id,
              messageTime: data.createdAt,
              noSyncObjectId : pushUser,
              userObjectId : this.state.userObjectId
            }).then(response=>{
              this._pushSend(pushUser,data,'DELETE',false) // 이미 클라이언트로 DB로 받은 사람은 푸시(알림창없는)를 받으면 DB업데이트(앱이 켜져있을 때)
            }).catch(err=>{
              console.log("axios /chat/merge err : " + err)
            })
          }
        }).catch(err=>{
          console.log("axios _getUser / members  err : " + err)
        })
      }
    }
    else{
      // console.log('data' + JSON.stringify(data))
      console.log('data[0].userObjectId => ' + data[0].userObjectId)
      console.log('this.state.userObjectId => ' + this.state.userObjectId)
      if(data[0].userObjectId!=this.state.userObjectId){
        this._allDeleteMessage(data[0].userObjectId)
      }
      if(data[0].userObjectId==this.state.userObjectId){
        console.log('들어옴')
        let pushUser = [];
        axios.post(URL+'/room/members', {
          chatUUID: this.state.chatUUID,
          userObjectId: this.state.userObjectId
        }).then(response=>{
          let roomUser = new Array();
          roomUser = response.data;
          //roomUser.splice(roomUser.indexOf(this.state.userObjectId),1)
          for(let j=0; j<joinUser.length; j++){
            roomUser.splice(roomUser.indexOf(joinUser[j]),1)
          }
          pushUser = roomUser;
          console.log('pushUser : ' + pushUser)
          if(pushUser.length!=0){
            axios.post(URL + '/delete/merge', {
              chatUUID: this.state.chatUUID,
              data: data,
              noSyncObjectId : pushUser,
              userObjectId : this.state.userObjectId
            }).then(response=>{
              console.log('Data : ' + JSON.stringify(data))
              this._pushSend(pushUser,data,'allDelete',true)
              this._Leave()
            }).catch(err=>{
              console.log("axios /chat/merge2 err : " + err)
            })
          }
        }).catch(err=>{
          console.log("axios _getUser / members2  err : " + err)
        })
      }
    }
  }

  /* 
    서버에서 받은 채팅을 받아 소켓에 접속 안되어있는 유저는 Push로, 접속 되어있는 유저는 실시간으로 데이터 뿌려줌
    그리고 클라이언트DB에 저장과 서버에 채팅데이터 전송
  */
  _getReply(data,joinUser){
    console.log('_getReply')
    let isLoading = this.state.isLoading;
    if(isLoading==false){
      let pushUser = [];
      axios.post(URL+'/room/members', {
        chatUUID: this.state.chatUUID,
        userObjectId: this.state.userObjectId
      }).then(response=>{
        let roomUser = new Array();
        roomUser = response.data;
        //roomUser.splice(roomUser.indexOf(this.state.userObjectId),1)
        for(let j=0; j<joinUser.length; j++){
          roomUser.splice(roomUser.indexOf(joinUser[j]),1)
        }
        pushUser = roomUser;
        if(data.user._id==userObjectId&&pushUser.length!=0){
          this._pushSend(pushUser,data,'SEND',false)
        }
        let messages = data;
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
        if(messages.image == undefined){
          messages.image=''
        }
        if(messages.video == undefined){
          messages.video=''
        }
        if(messages.user._id==this.state.userObjectId){ // 제일 처음에 메시지 보낸 사람만 서버에 채팅 데이터를 보내기 때문에 채팅 받은 사람이 다시 보낼 필요가 없다.
          this._updateMessageData(this.state.chatUUID,messages._id,messages.user._id,messages.createdAt,messages.text,messages.image,messages.video,pushUser)
        }
        this._saveData(this.state.chatUUID,messages._id,messages.user._id,messages.createdAt,messages.text,messages.image,messages.video)
      })
    }
  }

  
  /* pushSend 보내기 */
  async _pushSend(pushUser,data,type,allDelete){
    if(allDelete==false){
      let image;
      let video;
      if(data.image == undefined){
        image=''
      }else{
        image=data.image
      }
      if(data.video == undefined){
        video=''
      }else{
        video=data.video
      }
      await axios.post(URL+'/chatfcm', {
        pushObjectId : pushUser,
        chatTitle: this.state.chatTitle,
        message : data.text,
        chatUUID: this.state.chatUUID,
        messageUUID: data._id,
        userObjectId: data.user._id,
        chatTime: data.createdAt,
        chatImg: image,
        chatVideo: video,
        type: type
      }).then(response=>{
        console.log("push return Data : " + response.data);
      }).catch(err=>{
        console.log("axios _pushSend err: " + err)
      })
    }else{
      let image;
      let video;
      if(data.image == undefined){
        image=''
      }else{
        image=data.image
      }
      if(data.video == undefined){
        video=''
      }else{
        video=data.video
      }
      await axios.post(URL+'/chatfcm/delete', {
        pushObjectId : pushUser,
        userObjectId: this.state.userObjectId,
        data : data,
        type: type
      }).then(response=>{
        console.log("push return Data : " + response.data);
      }).catch(err=>{
        console.log("axios _pushSend err: " + err)
      })
    }
  }
  
  /*채팅방 접속*/
  _Join(){
    console.log('join')
    this.socket.emit('join',chatUUID, userObjectId);
  }

  /*채팅방 끊기*/
  _Leave(){
    this.socket.emit('leave',chatUUID);
    axios.patch(URL+'/room/member/remove', {
      userObjectId:this.state.userObjectId,
      chatUUID:this.state.chatUUID
    }).then(response=>{
      console.log("leave return Data : " + JSON.stringify(response));
      this.props.navigation.goBack()
    }).catch(err=>{
      console.log("axios leave err: " + err)
    })
  }
  
  /*서버에 채팅 보내기*/
  onSend(messages = []) {
    let image = messages.images;
    let video = messages.videos;
    if(messages.images==undefined&&messages.videos==undefined){
      console.log('메시지')
    let _messages =
      {
        _id: UUID(),
        text: messages[0].text,
        createdAt: '',
        user: messages[0].user,
      }
      this.socket.emit('message', chatUUID, _messages)
    }
    else if(messages.images&&messages.videos==undefined){
      console.log('이미지')
      let _messages =
      {
        _id: UUID(),
        text: '',
        createdAt: '',
        user: {
          _id: userObjectId,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        },
        image: image
      }
      this.socket.emit('message', chatUUID, _messages)
    }
    else if(messages.videos&&messages.images==undefined){
      console.log('비디오')
      let _messages =
      {
        _id: UUID(),
        text: '',
        createdAt: '',
        user: {
          _id: userObjectId,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        },
        video: video
      }
      this.socket.emit('message', chatUUID, _messages)
    }
  }

  renderAccessory = () => <AccessoryBar onSend={this.onSendFromUser} />

  onSendFromUser = (messages = []) => {
    this.onSend(messages[0])
  }

  onLongPress(context, message = []){
    const DEFAULT_OPTION_TITLES = ['메시지 복사', '메시지 삭제', '번역', 'Cancel'];
    const { optionTitles } = this.props;
    const options = optionTitles && optionTitles.length > 0
        ? optionTitles.slice(0, 2)
        : DEFAULT_OPTION_TITLES;
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
    }, (buttonIndex) => {
        switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              /* 메시지 1개 삭제 루틴 */
              if(message.user._id == this.state.userObjectId){
                this._deleteMessage(message)  //자기 자신 클라이언트DB 내용 지우기 
                this.socket.emit('getUser', chatUUID, message , false) //소켓으로 현재 유저 체크 후 소켓에 접속해 있는 유저는 바로 실시간 삭제 -> _getUser() 함수 호출
              }
              else{
                Alert.alert('자기 메시지만 지울 수 있습니다.')
              }
              break;
            case 2: Alert.alert('준비중입니다.')
              break;  
            default:
              break;
        }
    });
  }

  /* 대화방 대화내용 1개씩 지우기 */
  _deleteMessage(message){
    db.updateClientMessagesList(this.state.chatUUID, message._id, this.state.userObjectId) //나의 클라이언트DB 지우기
    const deleteMessage = this.state.messages;
    let index = deleteMessage.findIndex(x => x._id ==  message._id);
    const newMessage = produce(deleteMessage, newMessage => {
      newMessage[index].text = '삭제된 메시지 입니다.'
    })
    this.setState({
      messages : newMessage
    })
  }

  /* 대화방 나갈 때 클라이언트 대화내용 다 지우기 */
  _allDeleteMessage(userObjectId){
    console.log('_allDeleteMessage : ' + userObjectId)
    axios.post(URL+'/delete/message/load', {
      userObjectId:userObjectId,
      chatUUID:this.state.chatUUID
    }).then(response=>{
      db.updateClientAllMessagesList(this.state.chatUUID, response.data[0].userObjectId, this.state.userObjectId) //나의 클라이언트DB 지우기
      this._getClientMessagesList(); //메시지 리 로드
      if(userObjectId == this.state.userObjectId){
        console.log('여기 ' , + response.data)
        this.socket.emit('getUser', chatUUID, response.data, true)
      }
    }).catch(err=>{
      console.log("axios leave err: " + err)
    })
  }

  renderMessage = (msg) => {
    if(msg.currentMessage.video!=''||msg.currentMessage.video!=null){
      const onLongPress =  this.onLongPressMessageBubble.bind(this, msg.currentMessage.video);
      const modified_msg = {
        ...msg,
        onLongPress,
        videoProps: {
          paused: true
        }
      }
      return <Message {...modified_msg} />
    }
    else{
      
    }
  }

  onLongPressMessageBubble = (link) => {
    this.setState({
      is_modal_visible: true,
      video_uri: link
    });
  }

  hideModal = () => {
    this.setState({
      is_modal_visible: false,
      video_uri: null
    });
  }
//renderMessage={this.renderMessage}
  render() {
    const { navigation } = this.props;
    chatUUID = navigation.getParam('chatUUID','');
    members = navigation.getParam('members','');
    userObjectId = navigation.getParam('userObjectId','');
    chatTitle = navigation.getParam('chatTitle','');
    return (
      <View style={styles.container}>
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        onLongPress={(context,messages)=> this.onLongPress(context,messages)}
        user={{
          _id: userObjectId,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }}
        showUserAvatar={true}
        renderAccessory={this.renderAccessory}
      />

      <Modal isVisible={this.state.is_modal_visible}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={this.hideModal}>
              <Icon name={"close"} size={20} color={"#FFF"} style={styles.close} />
            </TouchableOpacity>
            <VideoPlayer uri={this.state.video_uri} />
          </View>
        </Modal>
    </View>
    )
  }
}

const styles = {
  container: {
    flex: 1
  },
  loader: {
    paddingTop: 20
  },
  sendLoader: {
    marginRight: 10,
    marginBottom: 10
  },
  customActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    padding: 10
  },
  modal: {
    flex: 1
  },
  close: {
    alignSelf: 'flex-end',
    marginBottom: 10
  }
}