import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CountryCodeList from 'react-native-country-code-list'
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