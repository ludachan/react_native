//import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { View,Text, StyleSheet,TouchableOpacity,Dimensions,Button } from 'react-native';
const {width,height} = Dimensions.get('screen');
import {pickImageAsync,pickVideoAsync} from './mediaUtils'
import { dbDelete } from '../screen/ChattingScreen'
//import {  getLocationAsync,  pickImageAsync,  takePictureAsync} from './mediaUtils'

export default class AccessoryBar extends React.Component {
  render() {
    const { onSend } = this.props
    return (
      <View style={styles.container}>
        <Button title='photo' onPress={() => pickImageAsync(onSend)} name='photo' />
        <Button title='video' onPress={() => pickVideoAsync(onSend)} name='video' />
        <Button title='dbDelete' onPress={() => dbDelete()} name='dbDelete' />
      </View>
    )
  }
}

//<Button title='camera'onPress={() => takePictureAsync(onSend)} name='camera' />
//<Button title='my-location' onPress={() => getLocationAsync(onSend)} name='my-location' />  
const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
})