const mongoose = require('mongoose');


const message = new mongoose.Schema({
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
        type: String,
        required: true,    
    },
})

module.exports = mongoose.model('message',message);