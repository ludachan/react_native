import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity,Button} from 'react-native';
import io from 'socket.io-client';


export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.socket = io('http://192.168.202.220:3000');
    this.socket.on('message_from_server', function(msg){ 
      console.log(msg);
    });
    this.socket.emit('message_from_client', "서버 접속완료");
  }
  
  sendMsg()
  {
    console.log("버튼 누르기1");
    this.socket.emit('message_from_client', "메시지 서버로 보내기");
    console.log("버튼 누르기2");
  }



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Button title="보내기"
                  onPress={() => {
                    this.sendMsg();
                  }}
          />
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
