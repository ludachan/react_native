import {TextInput,StyleSheet,Dimensions} from 'react-native';
import React, { Component } from 'react';

const {width,height} = Dimensions.get('screen');

// create a component
class Input extends Component {
    render() {
        return (
            <TextInput style={styles.textInput}
            {...this.props}  />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    textInput:{
        width :0.9*width,
        height:0.07*height,
        backgroundColor : '#fff',
        borderWidth: 1,
        borderColor: '#0067a3',
        paddingLeft: '3%',
        color:'#0067a3',
        fontSize:15,
        marginTop: 5,
        
      }
});

//make this component available to the app
export default Input;
