// https://facebook.github.io/react-native/docs/flexbox
// ToDo : https://facebook.github.io/react-native/docs/layout-props.html
import React, { Component } from 'react';
import { View } from 'react-native';

// react native 컴포넌트는 flexbox 알고리즘을 사용하여 하위 요소의 레이아웃을 지정할 수 있음
// flexDirection : row, column.
// justifyContent : flex-start, center, flex-end, space-around, space-between.
// alignItems : flex-start, center, flex-end, stretch
export default class AlignItemsBasics extends Component {
  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: this.props.flexDirection,
        justifyContent: this.props.justifyContent,
        alignItems: this.props.alignItems,
      }}>
        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
        <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
        <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
      </View>
    );
  }
};
