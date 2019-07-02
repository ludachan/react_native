import React from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity,CheckBox } from "react-native";
import axios from 'axios';
import {URL} from '../../config'
import AsyncStorage from '@react-native-community/async-storage';
import {HeaderBackButton} from 'react-navigation';
import { MaterialHeaderButtons, Item } from '../component/HearderIconBtn';

export default class ChatAdd extends React.Component {

static navigationOptions =({navigation})=> {
    const { params = {} } = navigation.state
    return {
        title : '대화방 추가',
        headerLeft:(<HeaderBackButton onPress={({})=>{navigation.replace('Main')}}/>),
        headerRight: (
            <MaterialHeaderButtons>
              <Item title="add" 
                    iconName="add" 
                    onPress={() => params.roomAdd()} />
            </MaterialHeaderButtons>
          )
    } 
}
    
  
  constructor(props) {
    super(props);
    this.state = {
      token : '',
      isChecked:[],
      userList:[],
      selectedUserObjecId:[],
    }
    this._getToken = this._getToken.bind(this);
    this._getToken();
  }

  _roomCreate = () => {
    let {selectedUserObjecId,token}= this.state;
    let members = selectedUserObjecId;
    let isGroup;
    let chatTitle;
    let count = members.length;
    if(count == 1){
        isGroup=false;
        chatTitle='1:1 대화방'
    }
    else{
        isGroup=true;
        chatTitle='그룹 대화방'
    }
    if (token !== null) {
        axios.post(URL+'/room/add',{
            token,
            members,
            isGroup,
            chatTitle,
        }).then(response=>{
            if(response.data.message=='chatroom is exist'){
                console.log('1:1 대화방이 존재하기에 그 대화방으로 이동')
                this._clickEvent(response.data.chatroom.chatUUID,response.data.chatroom.members,response.data.userId,response.data.chatroom.chatTitle)
            }else{
                this._clickEvent(response.data.chatroom.chatUUID,response.data.chatroom.members,response.data.userId,response.data.chatroom.chatTitle)
                console.log('채팅방이 생성! 생성된 채팅방으로 이동')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
  }

  //대화방으로 이동
  _clickEvent(chatUUID,members,userObjectId,chatTitle){
    const {navigate} = this.props.navigation;
    navigate('Chatting',{chatUUID:chatUUID,members:members,userObjectId:userObjectId,chatTitle:chatTitle});
    console.log(chatUUID+" / "+members+" / "+userObjectId + " / "+chatTitle);
  }

   //토큰뽑아서 친구목록 출력
   _getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('x-auth');
      if (token !== null) {
        //토큰 확인후 프로필 정보 확인
        this.setState({
          token : token
        })
        axios.post(URL+'/friend/list',{
          token
        }).then(response=>{
          let userList =[];
          let isChecked = [];
            for(let i=0; i<response.data.length; i++){
              userList.push(response.data[i])
              isChecked.push(false)
              if(i==response.data.length-1){
                this.setState({
                  userList:userList,
                  isChecked:isChecked
                })
              }
            }
        }).catch(err=>{
          console.log(err)
        })
          }
        } catch (error) {
            
        }
  };

  componentDidMount() {
    this.props.navigation.setParams({ roomAdd: this._roomCreate })
  }

  componentWillUnmount() {
  }

  //프로필 보기
  _profileView=userId=>{
    this.props.navigation.navigate('Profile', {
      userId: userId
    });
  }

  isIconCheckedOrNot = (item,index) => {
    let { isChecked,selectedUserObjecId } = this.state;
    //console.log(item._id)
    isChecked[index] = !isChecked[index];
    //console.log(isChecked)
    this.setState({ 
        isChecked : isChecked
    });
        if(isChecked[index] == true){
            selectedUserObjecId.push(item._id)
            this.setState({
                selectedUserObjecId:selectedUserObjecId
            })
        }else {            
            selectedUserObjecId.splice(selectedUserObjecId.indexOf(item._id),1)
            this.setState({
                selectedUserObjecId:selectedUserObjecId
            })
        }
    }

  render() {
    return (
      <FlatList
        data={this.state.userList}
        keyExtractor={(item) => item.userId}
        extraData={this.state}
        renderItem={({item,index}) => (
        <TouchableOpacity onPress={()=>{this.isIconCheckedOrNot(item,index)}} style={{padding:10}}>     
          <View style={styles.lvRow}> 
            <CheckBox value={ this.state.isChecked[index]}
            onChange={()=>{this.isIconCheckedOrNot(item,index)}}/> 
            <Image style={styles.img} source = { { uri: `${item.userImg}` } }/>        
            <View style = { styles.textView}  > 
              <Text style = { styles.textTitle } numberOfLines = { 1 }> {`${item.userNickname}`} </Text> 
            </View>
          </View> 
          </TouchableOpacity>
        )}
      />
    );
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
      fontSize: 15,  
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