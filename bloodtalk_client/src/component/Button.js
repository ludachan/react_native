import {TouchableOpacity,Text,StyleSheet,Dimensions} from 'react-native';
import React, { Component } from 'react';
import color from './../styles/color'
import font from './../styles/font'


const {width,height} = Dimensions.get('screen');

// create a component
class CustomButton extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.buttonContainer} {...this.props}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    buttonContainer:{
        height:0.07*height,
        width :0.9*width,
        backgroundColor: color.blue,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonText:{
        fontSize:15,
        color:color.white
    }
});

//make this component available to the app
export default CustomButton;
