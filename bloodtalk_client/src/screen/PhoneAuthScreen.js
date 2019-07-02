import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid
} from "react-native";
import Input from "../component/input";
import CoustomButton from "../component/Button";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { SMS_SERVER_URL, URL, NUMBER_SECRET_KEY, API_KEY } from "../../config";
import CryptoJS from "react-native-crypto-js";
import SmsAndroid from "react-native-get-sms-android";
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info";

const { width, height } = Dimensions.get("screen");

export default class PhoneAuth extends Component {
  static navigationOptions = {
    header: null
  };

  //authState - false-요청 , true-완료
  state = {
    number: "",
    clientAuthNum: 0,
    userAuthNum: 0,
    authStateText: "인증",
    authState: false,
    username: "",
    nowDate: "",
    resultAuth: 0,
    minDate: "",
    maxDate: "",
    smsList: [],
    nowDate: Date.now(),
    resultAuth: null,
    pushToken: ""
  };

  constructor(props) {
    super(props);
    //fcm 토큰을 받는다.
    this._getPushToken = this._getPushToken.bind(this);
    this._getPushToken();
    //안드로이드의 경우에만 실행되게 변경
    this.readSms = this.readSms.bind(this);
    var timer = setInterval(() => {
      this.readSms();
      if (this.state.resultAuth != null) {
        clearInterval(timer);
      }
    }, 2000);
  }
  //fb-fcm token 요청
  _getPushToken = async () => {
    const Token = await firebase.messaging().getToken();
    this.setState({
      pushToken: Token
    });
  };
  //문자 읽어 오는 permission
  requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "문자 읽기",
          message: "SMS READ ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  //안드로이드의 경우 내 폰 정보 읽어 오는 permission
  requestPhonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "READ_PHONE_STATE",
          message: "READ_PHONE_STATE ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const phoneNumber = DeviceInfo.getPhoneNumber();
        const { navigation } = this.props;
        const code = navigation.getParam("code", "");
        if (phoneNumber != null) {
          if (
            phoneNumber.indexOf(code) == -1 ||
            phoneNumber.indexOf(code) == "-1"
          ) {
            Alert.alert(
              "알림",
              "선택된 국가 코드와 휴대폰의 국가 코드가 다릅니다. 다시 선택해주세요."
            );
            this.props.navigation.replace("NationCode");
          } else {
            let parseData = phoneNumber.replace(code, "0");
            this.setState({
              number: parseData
            });
          }
        }
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //text 입력시 state 변경
  _changePhoneNumber = text => {
    let changeType = String(text);
    this.setState({
      number: changeType,
      authState: false
    });
  };
  //text 입력시 state 변경
  _changeUserAuthNum = text => {
    this.setState({
      resultAuth: text
    });
  };
  //문자 인증 전송 버튼
  _sendSms = () => {
    if (this.state.number) {
      let authNum = Math.floor(Math.random() * 1000000) + 100000;
      if (authNum > 1000000) {
        authNum = authNum - 100000;
      }
      //인증번호 메세지 보내주기
      const { navigation } = this.props;
      let nationCode = navigation.getParam("code", "").replace("+", "");
      let phoneNumber = this.state.number;
      let message = "[Blood Talk] Certification Number is " + authNum;
      let apikey = API_KEY;
      this.setState({
        nowDate: Date.now()
      });
      //1.문자인증 테스트 완료(프로토 타입에선 사용하지 않음)
      // axios.post(SMS_SERVER_URL,{
      //     nationCode,phoneNumber,message,apikey
      // }).then((response)=>{
      //     if(response.data.status){
      //         Alert.alert('완료','인증번호를 입력하세요.');
      // this.setState({
      //     authStateText: '완료',
      //     authState : true,
      //     clientAuthNum: authNum
      // })
      //     }else{
      //         Alert.alert('실패','번호를 다시 입력해주세요.');
      //     }
      // }).catch((err)=>{
      //     Alert.alert('인증 에러',err);
      // })

      //2. 테스트시에는 알림창으로 대체
      Alert.alert("완료", message);
      this.setState({
        authStateText: "완료",
        authState: true,
        clientAuthNum: authNum,
        resultAuth: authNum
      });
    } else {
      Alert.alert("오류", "번호를 입력하세요.");
    }
  };
  //sms 메세지 읽어서 파싱해준다.
  readSms = () => {
    const { minDate, maxDate } = this.state;
    var filter = {
      box: "inbox",
      maxCount: 3
    };
    if (minDate !== "") {
      filter.minDate = minDate;
    }
    if (maxDate !== "") {
      filter.maxDate = maxDate;
    }

    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {},
      (count, smsList) => {
        var arr = JSON.parse(smsList);
        this.setState({ smsList: arr });
      }
    );
    this.state.smsList.map(sms => {
      if (
        sms.body.indexOf("Blood Talk") != -1 &&
        sms.date > this.state.nowDate
      ) {
        let smsParse = Number(sms.body.substr(sms.body.length - 6, 6));
        this.setState({
          resultAuth: smsParse
        });
        this._authFinish();
      }
    });
    console.log(this.state.resultAuth);
  };

  //인증완료후 인증 정보를 저장
  _authFinish = () => {
    let userPhone = this.state.number;
    let ciphertext = CryptoJS.AES.encrypt(
      userPhone,
      NUMBER_SECRET_KEY
    ).toString();
    userPhone = ciphertext;
    if (!this.state.authState) {
      Alert.alert("알림", "인증 요청 해주세요.");
    }

    const { clientAuthNum, resultAuth, userAuthNum, pushToken } = this.state;
    if (clientAuthNum == resultAuth || clientAuthNum == userAuthNum) {
      //서버의 인증 여부 데이터 업데이트
      axios
        .post(URL + "/user/insert", {
          userPhone,
          pushToken
        })
        .then(response => {
          const token = response.headers["x-auth"];

          //프로필 화면 이동 코드

          if (token) {
            AsyncStorage.setItem("x-auth", token)
              .then(() => {
                if (response.data == "userOverlap") {
                  this.props.navigation.replace("Main");
                }
                this.props.navigation.replace("UserProfile");
              })
              .catch(err => {
                Alert.alert("token", err);
              });
          }
        })
        .catch(err => {
          console.log(err);
          Alert.alert("인증 에러", "에러");
        });
    } else {
      Alert.alert("오류", "인증번호를 다시 입력해주세요.");
    }
  };

  render() {
    const { navigation } = this.props;
    const name = navigation.getParam("name", "");
    const code = navigation.getParam("code", "");
    this.requestSmsPermission();
    //this.requestPhonePermission();
    return (
      <View style={styles.mainContainer}>
        <Text style={{ marginTop: 5 }}>
          {name},{code}
        </Text>
        <View style={styles.inputContainer}>
          <View style={styles.container}>
            <Input
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="휴대폰 번호 입력"
              onChangeText={this._changePhoneNumber}
            >
              {this.state.number}
            </Input>

            <TouchableOpacity
              //인증 여부에 따라 css 변경
              style={
                this.state.authState
                  ? styles.buttonContainerTrue
                  : styles.buttonContainerFalse
              }
              onPress={this._sendSms}
            >
              <Text style={styles.buttonText}>{this.state.authStateText}</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="인증 번호 입력"
            keyboardType="numeric"
            onChangeText={this._changeUserAuthNum}
          >
            {this.state.resultAuth}
          </Input>
        </View>
        <View style={styles.nextButtonContainer}>
          <CoustomButton text="다음" onPress={this._authFinish} />
        </View>
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
  nextButtonContainer: {
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
