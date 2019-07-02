const express = require('express');
const router = express.Router();
const UpdateMessage = require('../db/models/updateMessage-models')
const Message = require('../db/models/message-models')
const User = require('../db/models/user-models')

/*
    대화방 나갈때 삭제 버튼 누를 시 호출, 현재 대화한 대화UUID 전달
*/
router.post('/message/load',(req,res)=>{
    const {chatUUID,userObjectId} = req.body;
    Message.find().where('chatUUID').equals(chatUUID).where('userObjectId').equals(userObjectId).then(message => {
        if(!message)
        {
            return res.status(400).send()
        }
        return res.status(201).send(message)
    })
});

/* 삭제 메시지가 클라이언트DB에 동기화가 되었으면 UpdateMessage에 noSyncObjectId에 동기화 된 유저 지우기, 동기화가 완전히 완료 되었다면 UpdateMessage Delete (대화방 자기 메시지[전체]) */
router.post('/message',(req,res)=>{
    const {chatUUID, messageObjectId ,userObjectId} = req.body;
    User.findOne().where('_id').equals(userObjectId).then(user=>{
      UpdateMessage.find().
      where('chatUUID').equals(chatUUID).
      where('userObjectId').equals(messageObjectId).
      where('noSyncObjectId').in([user._id.toString()]).then(updatemessage=>{
        if(updatemessage.length==0){
          console.log('데이터 제로1')
          return res.status(201).send(updatemessage); 
        }
        else{
          console.log('데이터 have1')
          let chatUser = updatemessage[0].noSyncObjectId;
          chatUser.splice(chatUser.indexOf(userObjectId),1)
          UpdateMessage.updateMany({ chatUUID:chatUUID, userObjectId:messageObjectId }, {$set:{ noSyncObjectId: chatUser, text:'삭제된 메시지 입니다.', image:'', video:''}}).then(updatemessage=>{       
          })
          
          if(updatemessage[0].noSyncObjectId.length==0){
            UpdateMessage.deleteMany({ chatUUID:chatUUID, userObjectId:messageObjectId }).then(updatemessage=>{
          })
            return res.status(201).send(updatemessage); 
          }
      }
    }).catch((err)=>{
      if(err){
        return res.status(400).send(err);
      }
        return res.status(400).send();
    })
  })
})


router.post('/merge',(req,res)=>{
    const {chatUUID, data ,userObjectId, noSyncObjectId} = req.body;
    //console.log('/merge/all')
    //console.log(chatUUID)
    console.log('aaa')
    //console.log(JSON.stringify(data))
    //console.log('messageUUID : ' + JSON.stringify(messageUUID))
    //console.log(data.length)
    //console.log(userObjectId)
    //console.log(noSyncObjectId)
    let messageUUID=[];
    //let userObjectId1=[];
    //let messageTime=[];
    for(let i=0; i<data.length;i++){
      messageUUID.push(data[i].messageUUID)
      // userObjectId1.push(data[i].userObjectId)
      // messageTime.push(data[i].messageTime)
    }
    User.find().where('_id').equals(userObjectId).then(user=>{
      UpdateMessage.find().
      where('chatUUID').equals(chatUUID).
      where('messageUUID').in(messageUUID).then(updatemessage=>{
      console.log(updatemessage.length)
     if(updatemessage.length!=0){
        UpdateMessage.updateMany({  chatUUID:chatUUID, messageUUID:messageUUID }, 
        {$set:{noSyncObjectId: noSyncObjectId, text:'삭제된 메시지 입니다.', image:'', video:'',messageType:'D',"created": true}}).then(updatemessage=>{     
                console.log('업데이트완료2 : ' + noSyncObjectId)
                return res.status(201).send(updatemessage)
        })  
      }else{
        for(let i=0; i<data.length;i++){
          let UpdateMessageData = new UpdateMessage({
            chatUUID : data[i].chatUUID,
            messageUUID : data[i].messageUUID,
            userObjectId : data[i].userObjectId,
            messageTime :data[i].messageTime,
            text:'삭제된 메시지 입니다.',
            image:'',
            video:'',
            noSyncObjectId:noSyncObjectId,
            messageType:'D'
          });
          UpdateMessageData.save().then(updatemessagedata=>{
            console.log('인설트완료2')
          })  
        }
          return res.status(201).send(updatemessage)
        } 
      })
    }).catch((err)=>{
      if(err){
        return res.status(400).send(err);
      }
        return res.status(400).send();
    })
  })

  
module.exports = router;
