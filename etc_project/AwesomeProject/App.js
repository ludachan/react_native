/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 // https://facebook.github.io/react-native/docs/getting-started

import React, {Component} from 'react';
import { View } from 'react-native';
import Props_State from './src/Props_State';
import FixedDimensionsBasics from './src/FixedDimensionsBasics';
import FlexDimensionsBasics from './src/FlexDimensionsBasics';
import AlignItemsBasics from './src/flexboxlayout/AlignItemsBasics';
import HandlingTextInput from './src/HandlingTextInput';
import ButtonBasics from './src/ButtonBasics';
import Touchables from './src/Touchables';
import UsingScrollView from './src/UsingScrollView';
import FlatListBasics from './src/FlatListBasics';
import SectionListBasics from './src/SectionListBasics';
import CustomActivityIndicator from './src/component/ActivityIndicator';

export default class App extends Component {
  render() {
    return (
      // <Props_State text='Blood Talk!'/>

      // <View style={{flex: 1}}>
      //   <View style={{flex: 1}}>
      //     <FixedDimensionsBasics />
      //   </View>
      //   <View style={{flex: 1}}>
      //     <FlexDimensionsBasics />
      //   </View>
      // </View>

      // flexDirection : row, column.
      // justifyContent : flex-start, center, flex-end, space-around, space-between.
      // alignItems : flex-start, center, flex-end, stretch
      // <AlignItemsBasics 
      //   flexDirection='column' 
      //   justifyContent='space-around' 
      //   alignItems='center' />

      // <HandlingTextInput />

      // <ButtonBasics />

      // <Touchables />

      // <UsingScrollView />

      // <FlatListBasics />

      <SectionListBasics />

      // <CustomActivityIndicator />
    );
  }
}
