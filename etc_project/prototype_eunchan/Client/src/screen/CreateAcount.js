//import liraries
import React, { Component } from 'react';
import Input from '../component/input';
import CoustomButton from '../component/Button';
import validator from 'validator';
import axios from 'axios';
import {URL} from '../../config';

import { View, Text, StyleSheet,TouchableOpacity,Alert } from 'react-native';
// create a component
class CreateAccount extends Component {
    static navigationOptions = {
        title: "Sign Up",
      };

    state = {
        email : '',
        username : '',
        password : ''
    }
    _changeEmail = email =>{ this.setState({ email }) }
    _changeUsername = username =>{ this.setState({ username }) }
    _changePassword = password =>{ this.setState({ password }) }
    _signUpFn = ()=>{
        const {email,username,password} = this.state;
        const numauthyn = 'N'
        const number=''
        if(validator.isEmail(email)&&username.trim()&&password.trim()){
            axios.post(URL+'/user/register',{
                email,username,password,numauthyn,number
            }).then((response)=>{
                console.log('test');
                console.log(response);
                console.log('response');
                if(response.status == 201){
                    const {navigate} = this.props.navigation;
                    navigate('Auth');
                }
            }).catch((err)=>{
                Alert.alert('Sign up error','err');
            })
        }else{
            Alert.alert('Sign up error','실패');
        }
        
    }
    
    

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signUpForm}>
                    <Input placeholder="Email" value={this.state.email} onChangeText={this._changeEmail} />
                    <Input placeholder="Username" value={this.state.username} onChangeText={this._changeUsername}/>
                    <Input placeholder="Password" value={this.state.password} onChangeText={this._changePassword} secureTextEntry />
                </View>
                <CoustomButton text="Sign Up" onPress={this._signUpFn} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        alignItems: 'center',
    }, 
    signUpForm:{
        height: 225,
        justifyContent: 'space-around'
    }
});

//make this component available to the app
export default CreateAccount;
