// https://facebook.github.io/react-native/docs/using-a-listview
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

// React Native에는 ListView가 FlatList와 SectionList 두가지 컴포넌트를 제공함
// FlatList는 시간이 지남에 따라 항목 수가 변경 될 수 있는 긴 데이터 목록에 적합
// ScrollView와 기능은 같지만 FlatList은 화면에 현재 표시된 요소만 렌더링 함
export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Devin'},
            {key: 'Jackson'},
            {key: 'James'},
            {key: 'Joel'},
            {key: 'John'},
            {key: 'Jillian'},
            {key: 'Jimmy'},
            {key: 'Julie'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
