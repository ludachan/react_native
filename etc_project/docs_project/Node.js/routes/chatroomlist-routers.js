/**
 * 대화방 목록 관련 routes
 * @module routes/chatRoomList
 */
const express = require('./node_modules/express');
const router =express.Router();
const chatRoomList = require('../db/models/chatroomlist-models')

/**
 * 대화방 목록 불러오기
 * <br>현재 참가하고 있는 대화방 목록 불러오기
 * <br>정규식을 써서 oracle의 like 기능 사용
 * @method get://chatroomlist
 * @param {Request} req
 * @param {String} req.userId 유저 아이디
 * @param {Response} res
 * @param {String} res.status 상태정보 [success : 성공 or fail : 실패]
 * @param {String} res.message ...
 * @param {Object} res.data 룸 정보 [{..., ....}]
 */
router.get('/chatroomlist',(req,res)=>{
    const query = new RegExp(req.params.userId);  // -> '/' 검색할 데이터 '/'로도 사용 가능
    chatRoomList.find({userId:query}, function(err, roomlist){
        if(err){
            res.json({
                status : "fail",
                message: err,
            });
        }
        res.json({
            status : "success",
            message : "room exist",
            data : roomlist
        });
    });
});


router.post('/chatroomlist',(req,res)=>{
    let chatRoomList = new chatRoomList();
    chatRoomList.chatUUID = req.body.chatUUID; //채팅방 uuid
    chatRoomList.userId = req.body.userId;  //채팅방에 참가한 userId , 로 구분
    chatRoomList.chatTitle = req.body.chatTitle; //채팅방 이름 default: 참가자 유저 nickname or userId,
    chatRoomList.chatTime = req.body.chatTime; // 채팅방 생성 시간
    chatRoomList.save(function (err){
        if(err){
            res.json({
                status : "fail",
                message : err,
            })
        }
        res.json({
            status : "success",
            message : "room add",
            data : chatRoomList
        })

    });
});


router.patch('/chatroomlist',(req,res)=>{
    chatRoomList.findOne({chatUUID: req.params.chatUUID}, function(err, roomlist){
        if(err){
            res.json({
                status : "fail",
                message : err,
            })
        }
        let userId = roomlist.userId;
        roomlist.userId = userId + "," + req.params.addUserId;
        roomlist.save(function (err){
            if(err){
                res.json({
                    status : "fail",
                    message : err,
                })
            }
            res.json({
                status : "success",
                message : "user_add",
                data : roomlist
            })
        });
    });
});

module.exports = router;
