const mongoose = require('mongoose');


const UpdateMessage = new mongoose.Schema({
    /*
        메시지 Type
        Type : 'U' 일경우 update
        Type : 'D' 일경우 delete
     */
    messageType:{
        type : String,
    },
    /*
        채팅방 UUID 
    */
    chatUUID: { 
        type : String,
        required: true,    
    },
    /*
        채팅UUID
    */
    messageUUID: { 
        type : String,
        required: true,    
    },
    /*
        USER objectID
    */
    userObjectId: { 
        type : String,
        required: true,    
    },
    /*
        채팅시간
    */
    messageTime: { 
        type : String,
        required: true,    
    },
    /*
        대화내용
    */
    text:{
        type : String,
    },
    /*
        이미지
    */
    image:{
        type : String,
    },
    thumnailImage:{
        type : String,
    },
    /*
        비디오
    */
    video:{
        type : String,
    },
    thumnailVideo:{
        type : String,
    },
    /*
        채팅 동기화 안된 유저수
    */
    noSyncObjectId: []
})

module.exports = mongoose.model('UpdateMessage',UpdateMessage);