// https://facebook.github.io/react-native/docs/height-and-width
import React, { Component } from 'react';
import { View } from 'react-native';

// 고정 치수(Fixed Dimensions)
// 모든 치수는 단위가 없으며 밀도와 무관한 픽셀을 의미
export default class FixedDimensionsBasics extends Component {
  render() {
    return (
      <View>
        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
        <View style={{width: 150, height: 150, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
};
