const mongoose = require('mongoose');

const roomLists = new mongoose.Schema({
    chatUUID: { type: String, required: true },
    chatTitle: { type: String },
    isGroup : { type: Boolean, required: true },
    members: [], // user 다큐먼트에 index 필드 값을 배열 가짐.
    createdOn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('roomLists',roomLists);