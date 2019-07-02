import React from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from 'axios';
import {URL} from '../../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'native-base';

export default class ChatRoomList extends React.Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name='chatboxes' style={{ color: tintColor }} />
    )
  }
  
  constructor(props) {
    super(props);
    this.state = {
      check : false,
      chatList: [],
      token:'',
      userObjectId:'',
      members:[],
    };
  }

  

  //룸 리스트 가져오기
  _getToken = async () =>{  
    try {
      const token = await AsyncStorage.getItem('x-auth');
      //console.log(token);
      if (token != null) {
        this.setState({
          token : token
        })
        axios.post(URL+'/room/list', {
            token: token
        }).then(response=>{
          //console.log(response.data);
          this.setState({
            chatList:response.data.roomlist,
            userObjectId:response.data.userObjectId,
            check: false
          })
        }).catch(err=>{
          this.setState({
            check: true
          })
          console.log("axios err : " + err)
        })
      }
    } catch (err) {
      console.log("token err : " + err)
      this.setState({
        check: true
      })
    }
  }

  componentDidMount() {
    this._getToken();
    //console.log("화면 시작시 호출");
  }

  componentWillUnmount() {
    //console.log("화면 종료시 호출");
  }
  
  /*
  updateSearch = searchData =>{
    this.setState({searchData});
    this.componentDidMount();
  };
  */


  _clickEvent(chatUUID,members,userObjectId,chatTitle){
    const {navigate} = this.props.navigation;
    navigate('Chatting',{chatUUID:chatUUID,members:members,userObjectId:userObjectId,chatTitle:chatTitle});
    console.log(chatUUID+" / "+members+" / "+userObjectId + " / "+chatTitle + " / " + members);
  }

  render() {
      if(this.state.check == false){
        return (
          <FlatList
            data={this.state.chatList}
            keyExtractor={(item, index) => item.chatUUID}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>{this._clickEvent(item.chatUUID,item.members,this.state.userObjectId,item.chatTitle)}} style={{padding:10}}> 
              <View style={styles.lvRow}>
                <Image style={styles.img} source = { { uri: 'https://cdn3.iconfinder.com/data/icons/e-commerce-8/91/group-512.png' } }/>        
                <View style = { styles.textView}  > 
                  <Text style = { styles.textTitle } numberOfLines = { 1 }> {`${item.chatTitle}`} </Text> 
                  <Text style = { styles.textContent }> { item.chatUUID } </Text> 
                </View>
              </View> 
            </TouchableOpacity>
            )}
          />
      );
    }
    else{
      return (
        <View>
          <Text>대화방이 존재 하지 않습니다.</Text>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  lvRow:{
     flex:1,
     flexDirection:'row',
     padding:10,
     //backgroundColor:'red',
  },
  textView: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    padding: 5, 
  },
  textTitle: { 
    flex: 1, 
    textAlign: 'left', 
    color: '#000', 
  }, 
  textContent: { 
    flex: 1, 
    fontSize: 11, 
    color: '#000', 
    textAlign: 'center', 
  },
  img:{
     height:50,
     width:50,
  },
});