// contactController.js
// Import contact model
Fcm = require('./fcmModel');
// Handle index actions

var FcmSend = require('./fcm_send');

/*
    Fcm.find{} fcms스키마 전체 조회 => select * from fcms 라고 보면 된다.
*/
exports.index = function (req, res) {
    Fcm.find({},function (err, fcms) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            data: fcms
        });
    });
};


/*
    fcm.save fcms 스키마에 데이터 insert => insert into fcms(phone_no,fcm_id) values(req.body.phone_no,req.body.fcm_id);
*/
exports.new = function (req, res) {
    var fcm = new Fcm();
    fcm.phone_no = req.body.phone_no;
    fcm.fcm_id = req.body.fcm_id;
    fcm.save(function (err) {
    if (err)
        res.json(err);
    res.json({
            message: 'New fcm insert!',
            data: fcm
        });
    });
};

/* 
    Fcm.find{phone_no: req.params.phone_no} fcms스키마 조회시 검색조건 추가 => select fcm_id from fcms where phone_no = 'req.params.phone_no' 라고 보면 된다.
*/
exports.view = function (req, res) {
    Fcm.findOne({phone_no: req.params.phone_no}, function (err, fcms) {
        if (err){
            res.send(err);
        }
        else{
            res.json({
                message: 'fcm send success'
            })
            FcmSend(fcms.fcm_id); //fcm_send.js에 있는 FcmSend 함수를 호출(인자는 DB에서 읽어온 fcm_id)
        }
    });
};


