import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
} from "react-native";
import Input from "../component/input";
import CoustomButton from "../component/Button";
import axios from "axios";
import { URL } from "../../config";
import AsyncStorage from "@react-native-community/async-storage";
import { HeaderBackButton, StackActions } from "react-navigation";

const { width, height } = Dimensions.get("screen");
export default class FriendAdd extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "친구 추가",
      headerLeft: (
        <HeaderBackButton
          onPress={() => {
            navigation.replace("Main");
          }}
        />
      )
    };
  };

  state = {
    inputId: "",
    //버튼 색상에 적용하기 위해 사용
    searchState: false,
    //친구 존재 유무 default-0 // y-1 //n-2
    friendYn: 0,
    friendImg: "",
    friendName: "",
    token: "",
    resultId: "",
    resultAdd: false,
    addBtnText: "추가"
  };

  //토큰 상태 저장
  _getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("x-auth");
      if (token !== null) {
        this.setState({
          token: token
        });
      }
    } catch (error) {}
  };

  _changeIdInput = text => {
    this.setState({
      inputId: text
    });
  };
  //친구 찾기
  _searchFriend = () => {
    const userId = this.state.inputId;
    axios
      .post(URL + "/friend/search", {
        userId
      })
      .then(response => {
        if (response.data == "usernull") {
          this.setState({
            friendYn: 2,
            friendName: "",
            friendImg: "",
            resultId: "",
            resultAdd: false,
            addBtnText: "추가"
          });
        } else {
          this.setState({
            friendName: response.data.userNickname,
            friendImg: response.data.userImg,
            friendYn: 1,
            resultId: response.data.userId,
            resultAdd: false,
            addBtnText: "추가"
          });
        }
      });
  };

  //친구 추가하기
  _friendAdd = () => {
    const friendId = this.state.resultId;
    const { token } = this.state;
    axios
      .post(URL + "/friend/add", {
        token,
        friendId
      })
      .then(response => {
        if (response.data == "already") {
          this.setState({
            resultAdd: false,
            addBtnText: "완료"
          });
        }
        if (response.data == "success") {
          //버튼 안보이게 해야돼
          this.setState({
            resultAdd: true,
            addBtnText: "완료"
          });
        }
      })
      .catch(err => {
        if (err) {
          Alert.alert("알림", "잠시 후 다시 시도해주세요.");
        }
      });
  };

  // 내 프로필 or 친구 프로필 or 내 프로필 수정 화면으로 나누어서 render해주기
  _friendResultYn = () => {
    switch (this.state.friendYn) {
      case 0:
        return null;
      case 1:
        return (
          <View style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: this.state.friendImg }}
            />
            <Text style={styles.resultText}>{this.state.friendName}</Text>
            <TouchableOpacity
              style={
                this.state.resultAdd
                  ? styles.containerTrue
                  : styles.containerFalse
              }
              onPress={this._friendAdd}
            >
              <Text style={styles.buttonText}>{this.state.addBtnText}</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              source={require("../../assets/images/user.png")}
            />
            <Text style={styles.resultText}>결과 값이 없습니다.</Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.imageContainer}>
            <Image
              style={styles.avatar}
              source={require("../../assets/images/user.png")}
            />
            <Text style={styles.resultText}>결과 값이 없습니다.</Text>
          </View>
        );
    }
  };

  render() {
    this._getToken();
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Input
            style={styles.textInput}
            placeholder="친구 블러드톡 ID"
            onChangeText={this._changeIdInput}
            value={this.state.inputId}
          />

          <TouchableOpacity
            style={
              this.state.searchState
                ? styles.buttonContainerTrue
                : styles.buttonContainerFalse
            }
            onPress={this._searchFriend}
          >
            <Text style={styles.buttonText}>찾기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultContainer}>{this._friendResultYn()}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  imageContainer: {
    flex: 1,
    // Set content's horizontal alignment.
    alignItems: "center",
    marginTop: 30
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    marginBottom: 10
  },
  resultText: {
    fontSize: 25
  },
  container: {
    width: 0.9 * width,
    height: 0.07 * height,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0067a3",
    marginTop: 30,
    flexDirection: "row"
  },
  textInput: {
    flex: 4,
    paddingLeft: "3%",
    color: "#0067a3",
    fontSize: 15
  },
  buttonContainerFalse: {
    flex: 1,
    backgroundColor: "#0067a3",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContainerTrue: {
    flex: 1,
    backgroundColor: "#808080",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 15,
    color: "white"
  },
  resultContainer: {
    marginTop: 50,
    flexDirection: "column",
    alignItems: "center"
  },
  containerFalse: {
    height: 40,
    width: width * 0.4,
    backgroundColor: "#0067a3",
    alignItems: "center",
    justifyContent: "center"
  },
  containerTrue: {
    height: 40,
    width: width * 0.4,
    backgroundColor: "#808080",
    alignItems: "center",
    justifyContent: "center"
  }
});
