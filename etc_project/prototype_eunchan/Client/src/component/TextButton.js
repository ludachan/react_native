//import liraries
import React, { Component } from 'react';
import {TouchableOpacity,Text,StyleSheet,Dimensions} from 'react-native';


// create a component
class TextButton extends Component {
    render() {
        return (
            <TouchableOpacity {...this.props} >
                <Text style={styles.textButton}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textButton: {
        color:'rgb(174,149,149)',
        textDecorationLine:'underline',
        textDecorationStyle:'solid',
        textDecorationColor:'rgb(174,149,149)',
        fontSize:17,

    },
});

export default TextButton;
