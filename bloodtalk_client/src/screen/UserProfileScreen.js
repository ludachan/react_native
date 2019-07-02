import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import Input from "../component/input";
import CoustomButton from "../component/Button";
import axios from "axios";
import { SMS_SERVER_URL, URL, IMAGE_UPLOAD_URL } from "../../config";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  Platform,
  PermissionsAndroid
} from "react-native";
import ImagePicker from "react-native-image-picker";
import Contacts from "react-native-contacts";

const { width, height } = Dimensions.get("screen");

export default class UserProfile extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    //유저 이미지 경로
    userImg: "",
    userId: "",
    userName: "",
    //userId 중복 체크 상태 false-미인증,인증실패, true-사용가능
    userIdStatus: false,
    //버튼 텍스트
    userIdStateText: "중복확인",
    token: "",
    //이미지 경로
    avatarSource: null,
    userList: [],
    contacts: []
  };

  /**
   * function 정의
   */
  //카메라,앨범 권한 체크
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //앨범 권한 주기
  requestAlbumPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //유저 이미지 변경
  _selectImg = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      title: "Select Image"
    };
    //const {token}= this.state.token
    ImagePicker.launchImageLibrary(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.uri);

        let source = { uri: response.uri };

        this.setState({
          avatarSource: source
        });
        const data = new FormData();
        data.append("name", "avatar");
        data.append("fileData", {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        });
        const config = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            token: this.state.token
          },
          body: data
        };
        fetch(IMAGE_UPLOAD_URL + "/user/upload/profile", config)
          .then(response => response.json())
          .then(data => {
            this.setState({
              userImg: IMAGE_UPLOAD_URL + data.path
            });
            console.log(this.state.userImg);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  //userId 변경시 상태값 및 유저 아이디 변경
  //버튼 이벤트로 인해 상태값이 많음
  _changeUserId = text => {
    if (this.state.userIdStatus) {
      this.setState({
        userId: text,
        userIdStatus: false,
        userIdStateText: "중복확인"
      });
    } else {
      this.setState({
        userId: text
      });
    }
  };
  //텍스트 입력시 state 변경
  _changeUserName = text => {
    this.setState({
      userName: text
    });
  };

  //중복체크
  _userIdOverlabCheck = () => {
    let userId = this.state.userId;
    axios
      .post(URL + "/user/idCheck", {
        userId
      })
      .then(response => {
        if (response.data == "success") {
          //성공
          Alert.alert("알림", "사용 가능한 ID입니다.");
          //인증 상태값 변경
          this.setState({
            userIdStatus: true,
            userIdStateText: "완료"
          });
          return;
        }
        Alert.alert("알림", "중복된 ID입니다.");
        //인증 상태값 변경
      })
      .catch(err => {
        console.log(err);
        Alert.alert("알림", "다시 시도해주세요");
      });
  };

  //토큰 추출
  _getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("x-auth");
      if (token !== null) {
        // We have data!!
        this.setState({
          token: token
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  //전화부 read후 파싱
  loadContacts() {
    Contacts.getAll((err, contacts) => {
      if (err === "denied") {
        console.warn("Permission to access contacts was denied");
      } else {
        this.setState({ contacts });
        let numberData = [];
        const token = this.state.token;
        //3단 배열 구조 -> 배열안에 json안에 배열
        for (let i = 0; i < contacts.length; i++) {
          const numbers = contacts[i].phoneNumbers[0].number;
          numberData.push(numbers.replace(/-/gi, "").replace(/(\s*)/g, ""));
        }
        console.log(numberData);
        axios.post(URL + "/friend/autoAdd", {
          numberData,
          token
        });
      }
    });
  }
  //프로필 저장
  _profileUpdate = () => {
    const { userImg, userId, userName, userIdStatus, token } = this.state;
    //빈칸 예외처리
    if (userId.trim() && userName.trim()) {
      //중복 확인 예외처리
      if (!userIdStatus) {
        Alert.alert("알림", "중복 확인이 필요합니다.");
        return;
      }
      //토큰 문제 없을 경우 파라미터 전송(id,name,img,token)
      //AsyncStorage 토큰 꺼내오기
      axios
        .post(URL + "/user/profileUpdate", {
          userId,
          userName,
          userImg,
          token
        })
        .then(() => {
          Alert.alert("알림", "저장되었습니다.");
          this.loadContacts();
          this.props.navigation.replace("Main");
        })
        .catch(err => {
          console.log(err);
          Alert.alert(
            "알림",
            "서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        });
    } else {
      Alert.alert("알림", "빈 칸을 입력해주세요.");
    }
  };

  async componentWillMount() {
    this.requestAlbumPermission();
    this.requestCameraPermission();
    this.requestReadPermission();
  }

  //전화부
  requestReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Cool Photo App READ_CONTACTS Permission",
          message:
            "Cool Photo App needs access to your READ_CONTACTS " +
            "so you can take awesome READ_CONTACTS.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.loadContacts();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    this._getToken();
    //this.requestReadPermission();

    return (
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={this._selectImg}>
            {this.state.avatarSource === null ? (
              <Image
                style={styles.avatar}
                source={require("../../assets/images/user.png")}
              />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              placeholder="ID를 입력해주세요."
              onChangeText={this._changeUserId}
              value={this.state.userId}
            />
            <TouchableOpacity
              //중복확인 여부에 따라 css 변경
              style={
                this.state.userIdStatus
                  ? styles.buttonContainerTrue
                  : styles.buttonContainerFalse
              }
              onPress={this._userIdOverlabCheck}
            >
              <Text style={styles.buttonText}>
                {this.state.userIdStateText}
              </Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="이름을 입력해주세요."
            onChangeText={this._changeUserName}
            value={this.state.userName}
          />
        </View>
        <View style={styles.saveButtonContainer}>
          <CoustomButton text="저장" onPress={this._profileUpdate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // Set content's horizontal alignment.
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
  inputContainer: {
    marginTop: 30,
    flex: 4,
    flexDirection: "column"
  },
  saveButtonContainer: {
    flex: 1,
    alignItems: "flex-end"
  },
  container: {
    width: 0.9 * width,
    height: 0.07 * height,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0067a3",
    marginTop: 5,
    flexDirection: "row"
  },
  textInput: {
    flex: 4,
    paddingLeft: "3%",
    color: "#0067a3",
    fontSize: 15
  },
  //미인증 버튼 스타일(default)
  buttonContainerFalse: {
    flex: 1,
    backgroundColor: "#0067a3",
    alignItems: "center",
    justifyContent: "center"
  },
  //인증 완료 버튼 스타일
  buttonContainerTrue: {
    flex: 1,
    backgroundColor: "#808080",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 15,
    color: "white"
  }
});
