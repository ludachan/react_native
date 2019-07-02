import {createSwitchNavigator,createStackNavigator, createAppContainer,createMaterialTopTabNavigator} from 'react-navigation';
import React, { Component } from 'react';
import { Platform,Button,TouchableOpacity } from 'react-native';
import NationCode from './src/screen/NationCodeScreen';
import PhoneAuth from './src/screen/PhoneAuthScreen';
import UserProfile from './src/screen/UserProfileScreen';
//import Main from './src/screen/main/Main';
import Loding from './src/screen/LodingScreen';
import FriendAdd from './src/screen/FriendAddScreen';
import Chatting from './src/screen/ChattingScreen';
import FriendList from './src/screen/main/FriendListScreen';
import ChatRoomList from './src/screen/main/ChatRoomListScreen';
import ChatAdd from './src/screen/ChatAddScreen';
import Blood from './src/screen/main/BloodScreen';
import Setting from './src/screen/main/SettingScreen';
import { Icon } from 'native-base';
import Profile from './src/screen/profile/ProfileScreen';
import ProfileFull from './src/screen/profile/ProfileFull';
import VideoSample from './src/screen/VideoSample';
import { MaterialHeaderButtons, Item } from './src/component/HearderIconBtn';

const TabNavigator = createMaterialTopTabNavigator({
  Friend:  FriendList,
  ChatRoom: ChatRoomList,
  Blood: Blood,
  Setting: Setting
},
{
  animationEnabled: true,
  swipeEnabled: true,
  tabBarPosition: "bottom",
  tabBarOptions: {
    style: {
      ...Platform.select({
        ios:{
          backgroundColor:'white',
        },
        android:{
          backgroundColor:'white',
        }
      })
    },
    iconStyle: { height: 50 },
    activeTintColor: '#000',
    inactiveTintColor: '#d1cece',
    upperCaseLabel: false,
    showLabel: false,
    showIcon: true,
  }
});


//메인 메뉴의 네비게이션 옵션 설정
TabNavigator.navigationOptions=({navigation, navigationOptions})=>{
  const { routeName } = navigation.state.routes[navigation.state.index];
  const title = routeName;
  switch(title){
    case 'Friend': result = {
      title: '친구목록',
      headerRight: (
        <MaterialHeaderButtons>
          <Item title="add" iconName="add" onPress={()=>navigation.navigate('FriendAdd')} />
          <Item title="more-horiz" iconName="more-horiz" onPress={()=>navigation.navigate('Profile')} />
        </MaterialHeaderButtons>
      )
    }
      break;
    case 'ChatRoom': result = {
      title: '채팅목록',
      headerRight: (
        <TouchableOpacity onPress={()=>{navigation.navigate('ChatAdd')}} style={{padding:10}}>
          <Icon name='chatboxes'></Icon>  
        </TouchableOpacity>
      )
    }
      
      break;
    case 'Blood': result = {
      title: '블러드',
      // use MaterialHeaderButtons with consistent styling across your app
      
    }
      break;
    case 'Setting': result = {
      title: '설정'
    }
      break;      
  }
  
  
  return result;
}

const MainNavigator = createStackNavigator({
  NationCode:{screen:NationCode},
  PhoneAuth : {screen:PhoneAuth},
  UserProfile :{screen :UserProfile},
  Main : TabNavigator,
  Loding:{screen:Loding},
  Chatting :{screen :Chatting},
  ChatAdd : {screen: ChatAdd},
  FriendAdd : {screen : FriendAdd},
  Profile : {screen : Profile},
  ProfileFull : {screen: ProfileFull},
  VideoSample :{screen : VideoSample}
},{
  //시작화면 . 테스트시 원하는 테스트 화면부터 시작하시면 됩니다.
  initialRouteName: "Loding"
}
);





const App = createAppContainer(MainNavigator);



export default App;




