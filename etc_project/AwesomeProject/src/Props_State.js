/**
 * https://facebook.github.io/react-native/docs/props
 * https://facebook.github.io/react-native/docs/state
 * https://facebook.github.io/react-native/docs/style
 */
import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

// props는 생성 매개 변수, 변경 될수 없음
// state는 변경 가능한 변수, component 생성자에서 초기화 하여 사용, 변경을 위해서는 setState 메서드 이용
export default class Props_State extends Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};

    setInterval(() => {
      this.setState({ showText: !this.state.showText });
    }, 1000);
  }

  render() {
    let display = this.state.showText ? this.props.text : ' ';
    return (
      <View>
        <Text style={[styles.blue, styles.red]}>{display}</Text>
        <Text style={styles.blue}>
          Blood 
          <Text style={styles.red}>
          {" "}&nbsp;Talk!
          </Text>
        </Text>
      </View>
    );
  }
}

// 스타일 이름과 값은 일반적으로 CSS가 웹에서 작동하는 방식과 일치
// 단, 이름은 캐멀 케이스(camel casing)를 사용하여 작성 (background-color가 아닌 backgroundColor 사용)
// 스타일 배열을 전달 가능, 배열의 마지막 스타일이 우선 순위 가짐
// 하위 컴포넌트의 스타일을 지정하는데 상위 컴포넌트의 스타일을 사용, 스타일을 "cascade" 방식으로 작성 가능
const styles = StyleSheet.create({
  blue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});
