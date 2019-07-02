const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    //친구등록용 user_id
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    //유저 닉네임
    userNickname:{
        type:String,
        required:false,
        default: '',
    },
    //fcm용 토큰
    pushT:{
        type:String,
        required:false,
        default: 'N',
    },
    //번호 인증시 토큰
    authT:{
        type:String,
        required:false,
        default: '',
    },
    //유저 프로필
    userImg:{
        type:String,
        required:false,
        default: '',
    },
    //유저 폰번호
    userPhone:{
        type:String,
        required:true,
        unique:true,
    },
    //가입시간
    userDate:{
        type: Date, 
        default: Date.now
    },
});
//암호화
// User.pre('save',function(next){
//     let user = this;

//     if(!user.isModified('password')){
//         return next();
//     }
//     bcrypt.genSalt(12,(err,salt)=>{
//         if(err){
//             return Promise.reject(err);
//         }
//         bcrypt.hash(user.password,salt,(err,hashedPassword)=>{
//             user.password = hashedPassword;
//             next();
//         });
//     });
// });


module.exports = mongoose.model('User',User);