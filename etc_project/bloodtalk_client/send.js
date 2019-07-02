// fcm-node 모듈 설치 필요 
// --> npm install fcm-mode --save
var FCM = require('fcm-node');
 
// Firebase에서 발급받은 서버키
var serverKey = 'AAAATOjHqcs:APA91bEm3sgeBrhDYpzOn5Xtf1DNoQd1ERoQu0fTMKcIzAcOtxLxqBYC5YCu8pXsikhexIvXWbEqVfv9eB0ZorEaMXlZeqcisgK-KEXIjgiu2R28G2BV5EoE1XkO8D0WACdBpPsNoM6n';

// fcm의 token값 
//여기값을 DB에 저장시키면됨 
var client_token = ' eDRNXwq31Xw:APA91bFIdJ6eiKxM-GjAOpXCA-Y6QyZl-SFnV6lfMUVZxOUhaQqvzdRfevc6pFEkDc0WHR48S9eMpbel_jbsbIR-e1ufVbr7XidH-HKVsql4j2FemXVUG1dt_dYdMs2LjGL19faM6jd4';
//var client_tokens = ['토큰1','토큰2']; 여러명에게준다면 

// 발송할 Push 메시지 내용 
var push_data = {
    // 수신대상
    to: client_token,
    // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
    notification: {
        title: "지금접속한다면?~!!",
        body: "그냥접속하는거지 뭘그러냐 이새꺄!!",
        sound: "default",
        click_action: "FCMPLUGINACTIVITY",
        icon: "fcmpushicon"
    },
    // 메시지 중요도
    priority: "high",
    // App 패키지 이름
    restricted_package_name: "com.bloodtalk_client",
    /* App에게 전달할 데이터 만약이 전달해줄꺼라면 
    data: {
        num1: 2000, 예시..
        num2: 3000
    }*/
};
 
// 아래는 푸시메시지 발송절차 메시지가 잘갔을경우 안갔다면 왜 못간건지 
var fcm = new FCM(serverKey);
 
fcm.send(push_data, function(err, response) {
    if (err) {
        console.error('Push메시지 발송에 실패했습니다.');
        console.error(err);
        return;
    }
 
    console.log('Push메시지가 발송되었습니다.');
    console.log(response);
});