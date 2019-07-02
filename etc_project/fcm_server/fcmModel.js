// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var fcmSchema = mongoose.Schema({  //스키마 정의, 여기에 정의하지 않으면 데이터를 추가,삭제,갱신이 이루어지지 않는다.
    phone_no: {
        type: String,
        required: true
    },
    fcm_id: {
        type: String,
        required: true
    }
});

// Export Contact model
var Fcm = module.exports = mongoose.model('fcm', fcmSchema);  //fcm 인자는 collection의 fcms로 자동변환되어 사용된다. //module.exports 는 다른 파일에서 Fcm으로 사용가능
module.exports.get = function (callback, limit) {
    Fcm.find(callback).limit(limit);
}