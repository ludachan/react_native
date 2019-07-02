import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'native-base';

export default class Setting extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name='settings' style={{ color: tintColor }} />
        )
    }

  render() {
    return (
      <View>
        <Text> Setting </Text>
      </View>
    );
  }
}
