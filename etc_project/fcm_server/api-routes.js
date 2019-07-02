// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// Import contact controller
var fcmController = require('./fcmController'); //fcmController.js 파일 불러오기 --> fcmController 변수로 exports나 module.exports 지정한 함수 사용 가능
// Contact routes
router.route('/fcms') 
    .get(fcmController.index) //데이터 전체보기 SELECT * from fcms; 과 동일
    .post(fcmController.new); //새로운 데이터 DB INSERT (phone_no,fcm_id) 넣기
router.route('/fcms/:phone_no') 
    .get(fcmController.view) //데이터 검색 select phone_no, fcm_id from fcms where phone_no=:phone_no; 과 동일
module.exports = router; //router를 다른 파일에서 사용 가능하게 만들어 줌