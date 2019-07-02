import React from 'react';
import { StyleSheet,TextInput, Text, View, Image ,Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Input from '../component/input';
import CoustomButton from '../component/Button';
import TextButton from '../component/TextButton';
import axios from 'axios';


export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    username : '',
    password : ''
  }
  
  //펑션
  _changeUsername = text =>{
    this.setState(()=>{
       return{
         username:text
       }
    })
  }
  _changePassword = text =>{
    this.setState(()=>{
       return{
         password:text
       }
    })
  }
  _createAcount = ()=> {
    const {navigate} = this.props.navigation;
    navigate('Acount');
  }
  

  _signInFn = ()=>{
    const {username,password} = this.state;
    if(username&&password){
        axios.post('http://192.168.202.143:3000/user/login',{
            username,password
        }).then((response)=>{
            const token = response.headers['x-auth'];
            if(token){
              AsyncStorage.setItem('x-auth',token).then(()=>{
                axios.post('http://192.168.202.143:3000/user/authcheck',{username})
                .then(response=>{
                  if(response.data === 'Y'){
                    //인증된 계정은 메인페이지로
                    const {navigate} = this.props.navigation;
                    navigate('Main');
                  }else if(response.data==='N'){
                    //미인증 계정은 인증 페이지로
                    const {navigate} = this.props.navigation;
                    navigate('NationCode');
                  }
                })
                
              }).catch((err)=>{
                Alert.alert('login',err);

              })
            }
            AsyncStorage.setItem('username',username);
        }).catch((err)=>{
            Alert.alert('login error','retry please');
        })
    }else{
        Alert.alert('login error','retry please');
    }
    
}
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.images} source={require('../../assets/images/logo.png')} />
        <View style={styles.formContainer}>
          <Input placeholder="username" onChangeText={this._changeUsername} value={this.state.username} />
          <Input 
          placeholder="password" 
          secureTextEntry
          onChangeText={this._changePassword} 
          value={this.state.password} 
          />
        </View>
        <View style={{alignItems : 'center',height:150,justifyContent:'space-around'}}>
          <CoustomButton text="Sign In" onPress={this._signInFn} />
          <TextButton  onPress={this._createAcount} text="Sign Up" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  images:{
    width: 100,
    height: 100,
    marginTop:'35%',
    marginBottom:'25%'
  },
  formContainer:{
    height :150,
    justifyContent: 'space-around',
  },

 
});
