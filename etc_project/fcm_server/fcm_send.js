var FCM = require('fcm-node');

var serverKey = 'AAAATOjHqcs:APA91bEm3sgeBrhDYpzOn5Xtf1DNoQd1ERoQu0fTMKcIzAcOtxLxqBYC5YCu8pXsikhexIvXWbEqVfv9eB0ZorEaMXlZeqcisgK-KEXIjgiu2R28G2BV5EoE1XkO8D0WACdBpPsNoM6n';

var fcm = new FCM(serverKey);

var fcmSend = function(r_client_token){
    var client_token = r_client_token;
    var message = {
        to: client_token, 
        notification: {
            title: '블러드랜드', 
            body: '접속 시 100블러드 증정' 
        },
        data: {
            wallet_id: 'wwesot',
            blood: '100'
        }
    };
    fcm.send(message, function(err, response){
        if (err) {
            console.log("err" + err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = fcmSend;