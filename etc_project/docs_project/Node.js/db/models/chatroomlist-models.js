const mongoose = require('mongoose');

/**
 * 채팅방 목록 Schema
 * @module schema/chatRoomList
 */
const ChatRoomList = new mongoose.Schema({/** @lends module:schema/chatRoomList */
    /**
     * 채팅방 UUID
     */
    chatUUID:{
        type:String,
        required:true,
        unique:true,
    },
    /**
     * 채팅방 참여 유저 ID
     * <br>유저가 3명이면 a,b,c로 콤마로 구분 데이터를 받아와서 ,기준으로 파싱
     */
    userId:{
        type:String,
        required:true,
    },
    /**
     * 채팅방 제목
     */
    chatTitle:{
        type:String,
        required:false,
    },
    /**
     * 생성시간
     */
    chatTime:{
        type: Date, 
        default: Date.now
    },
});

/** @lends module:schema/chatRoomList */
/**
 * 사용자 비밀번호 체크 함수
 * @method methods:comparePassword
 * @param {Number} pw 암호화 된 사용자 패스워드
 * @param {Callback} cb 결과값 전달 callback
 * @returns {} ....
 */
ChatRoomList.methods.comparePassword = function(pw ,callback)  {
    if (this.password === pw) {
        callback(null, true);
    } else {
        callback('password 불일치');
    }
}

/**
* 함수 설명...
* @method query:sortByName
* @param {String} order 
* @returns {Object} 리턴 설명...
*/
ChatRoomList.query.sortByName = function(order) {
    return this.sort({ nickname: order })
}

/**
* 함수 설명...
* @method pre:save
* @param {String} next 설명...
*/
ChatRoomList.pre('save', function(next) {
    if (!this.email) {
        throw '이메일이 없습니다'
    }
    if (!this.createdAt) {
        this.createdAt = new Date()
    }
    next()
})

/**
 * 채팅방 목록 Model
 * @module model/chatRoomList
 * @see module:schema/chatRoomList
 */
module.exports = mongoose.model('ChatRoomList',ChatRoomList);
