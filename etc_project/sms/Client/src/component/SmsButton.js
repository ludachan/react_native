import {TouchableOpacity,Text,StyleSheet,Dimensions} from 'react-native';
import React, { Component } from 'react';


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
        width :0.4*width,
        backgroundColor:'rgb(255,82,76)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonText:{
        fontSize:24,
        color:'white'
    }
});

//make this component available to the app
export default CustomButton;
