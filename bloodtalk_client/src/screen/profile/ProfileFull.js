import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import color from '../../styles/color';

export default class ProfileFull extends Component {
    static navigationOptions = {
        header: null,
    };
  //크게 보는 화면 css resizeMode 에 따라 이미지 보는 방식 변경
  render() {
    const { navigation } = this.props;
    const userImg = navigation.getParam('userImg');
    return (
        <View style={ styles.container }>
            <Image source={{ uri: userImg }} style={styles.backgroundImage}>
        </Image>
    </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : color.black
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', // or 'cover' // or 'contain' // or 'stretch'
    },
    loginForm: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
});