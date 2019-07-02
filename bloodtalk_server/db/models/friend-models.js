const mongoose = require('mongoose');


const Friend = new mongoose.Schema({
    //user_id
    userId:{
        type:String,
        required:false,
    },
    //friend_id 배열
    friendId:[],
    //추가 날짜
    addDate:{
        type: Date, 
        default: Date.now
    },
});


module.exports = mongoose.model('Friend',Friend);