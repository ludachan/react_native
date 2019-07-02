import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'native-base';

export default class Blood extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name='pulse' style={{ color: tintColor }} />
        )
    }

  render() {
    return (
      <View>
        <Text> Blood </Text>
      </View>
    );
  }
}
