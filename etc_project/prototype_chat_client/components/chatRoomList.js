import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CardView from 'react-native-cardview'

export default class chatRoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
        <Text>
            Elevation 0
        </Text>
        </CardView>
    );
  }
}
