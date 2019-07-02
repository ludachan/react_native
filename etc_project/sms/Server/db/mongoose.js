const mongoose = require('mongoose');
const {databasePassword,databaseUsername} = require('../config');
mongoose.Promise = global.Promise;

//데이터 베이스 주소
mongoose
    .connect('mongodb://@localhost:27017/auth', { useNewUrlParser: true })
    .then(()=>{console.log('DB Connect')})
    .catch(err=>{ console.log(err) });

module.exports = mongoose;