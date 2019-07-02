// https://facebook.github.io/react-native/docs/height-and-width
import React, { Component } from 'react';
import { View } from 'react-native';

// 유연한 치수(Flex Dimensions)
// flex를 사용하면 사용 가능한 공간에 따라 컴포넌트를 동적으로 확장 및 축소시킬 수 있음
// 일반적으로 flex: 1을 사용하면 컴포넌트에 사용 가능한 공간을 모두 채움
// 주어진 flex 값이 클수록 다른 컴포넌트에 비해 해당 컴포넌트가 차지하는 공간의 비율이 높아짐
// 부모가 flex 값을 가지지 않으면 부모의 치수를 0으로 되어 자식 컴포넌트는 표시 되지 않음
export default class FlexDimensionsBasics extends Component {
    render() {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1, backgroundColor: 'powderblue'}} />
          <View style={{flex: 2, backgroundColor: 'skyblue'}} />
          <View style={{flex: 3, backgroundColor: 'steelblue'}} />
        </View>
      );
    }
  };
