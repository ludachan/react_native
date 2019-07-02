import React, { Component } from 'react';
import { View, Text,Alert,StyleSheet } from 'react-native';
import Input from '../component/input';
import CoustomButton from '../component/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


export default class PhoneAuth extends Component {
    //authState - 1. 요청 , 2. 완료
    state = {
        number : '',
        clientAuthNum : 0,
        userAuthNum: 0,
        authStateText:'인증 요청',
        authState:0,
        username:''
      }
    getUserInfo() {
        AsyncStorage.getItem("username")
        .then((username) => {
            this.setState({
                username : username
            })
        })
        .catch((e) => console.log(e));
    }

    _changePhoneNumber=text=>{
        this.setState({
            number: text
        })
    }
    _changeUserAuthNum = text=>{
        this.setState({
            userAuthNum : text
        })
    }
    _sendSms=()=>{
        this.getUserInfo()
        if(this.state.authState==0){
            if(this.state.number){
                const authNum = Math.floor(Math.random() * 1000000)+100000;
                if(authNum>1000000){
                    authNum = authNum - 100000;
                }
                this.setState({ 
                    authStateText: '인증 완료',
                    authState : 1,
                    clientAuthNum: authNum
                })
                //인증번호 메세지 보내주기
                const { navigation } = this.props;
                const nationCode = navigation.getParam('code','');
                const phoneNumber = this.state.number;
                const message = '[블러드톡] 인증번호는 ' +authNum+ ' 입니다.';
                const apikey = '12ndicscm290cj9s0'
                Alert.alert('msg',message);
                return;
                axios.post('http://192.168.15.109:3000/user/register',{
                    nationCode,phoneNumber,message,apikey
                }).then((response)=>{
                    Alert.alert('완료','인증번호를 입력해주세요.');
                }).catch((err)=>{
                    Alert.alert('인증 에러',err);
                })
                Alert.alert('완료','인증번호를 입력해주세요.');
            }else{
                Alert.alert('오류','번호를 입력하세요.')
            }
        }else if(this.state.authState==1){
            const {number,username} = this.state;
            console.log(username)
            if(this.state.clientAuthNum==this.state.userAuthNum){
                   //서버의 인증 여부 데이터 업데이트
                   axios.post('http://192.168.202.143:3000/user/update',{
                    username,number
                    }).then((response)=>{
                        Alert.alert('완료','완료');
                       //메인 화면 이동 코드
                    }).catch((err)=>{
                        console.log(err)
                        Alert.alert('인증 에러','에러');
                    })
                   //메인 화면 이동 코드
            }else{
                Alert.alert('오류','인증번호를 다시 입력해주세요.')
            }
        }
        
    }

    render() {
        const { navigation } = this.props;
        const name = navigation.getParam('name','');
        const code = navigation.getParam('code','');
    return (
        <View style={styles.container}>
            <Text>{name},{code}</Text>
            <Input 
                placeholder="휴대폰 번호 입력" 
                onChangeText={this._changePhoneNumber} 
                value={this.state.number} 
            />
            <Input 
                placeholder="인증 번호 입력" 
                onChangeText={this._changeUserAuthNum} 
                value={this.state.userAuthNum} 
            />
            <CoustomButton text={this.state.authStateText} onPress={this._sendSms} />
        </View>
    )    
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
      },
})