import React, { Component } from 'react';
import { View, Text,Alert } from 'react-native';
import CountryCodeList from 'react-native-country-code-list'
import AsyncStorage from '@react-native-community/async-storage';


class NationCode extends Component {
  _selectNation = (cellObject) =>{
    const {navigate} = this.props.navigation;
    navigate('PhoneAuth',{name:cellObject.name,code:cellObject.code});
  }
  

  
  render() {
    return (
      <CountryCodeList
        onClickCell={this._selectNation}
      />
    );
  }
}

export default NationCode;