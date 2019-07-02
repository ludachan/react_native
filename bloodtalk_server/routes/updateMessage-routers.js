const express = require('express');
const router = express.Router();
const UpdateMessage = require('../db/models/updateMessage-models')
const Message = require('../db/models/message-models')
const User = require('../db/models/user-models')

/*
    대화내용 저장하기
*/
router.post('/save',(req,res)=>{
    const {chatUUID,messageUUID,userObjectId,messageTime,content,image,video,noSyncObjectId} = req.body;
    console.log('noSyncObjectId.length : ' + noSyncObjectId.length)
    let UpdateMessageData = new UpdateMessage({
        chatUUID : chatUUID,
        messageUUID : messageUUID,
        userObjectId : userObjectId,
        messageTime : messageTime,
        text:content,
        image:image,
        video:video,
        noSyncObjectId:noSyncObjectId,
        messageType:'U'
    });
    let MessageData = new Message({
        chatUUID : chatUUID,
        messageUUID : messageUUID,
        userObjectId : userObjectId,
        messageTime : messageTime
    })
    MessageData.save().then(messagedata => {
    if(!messagedata)
    {
      return res.status(400).send()
    }
    if(noSyncObjectId.length==0){
      return res.status(201).send(messagedata)
    }else{
      UpdateMessageData.save().then(updatemessagedata=>{
        if(!updatemessagedata)
        {
          return res.status(400).send()
        }
        return res.status(201).send(messagedata)
        }).catch((err)=>{
        if(err){
            return res.status(400).send(err);
        }
            return res.status(400).send();
        })
    }
  })
});

/* 서버에 있는 DB 부르기 */
router.post('/load',(req,res)=>{
  const {chatUUID,userObjectId} = req.body;
  //console.log('load')
  //console.log(chatUUID)
  //console.log(userObjectId)
  UpdateMessage.find().where('chatUUID').equals(chatUUID).where('noSyncObjectId').in([userObjectId]).sort({ messageTime: 'desc'}).then(updatemessage=>{
    //console.log(conversation)
    return res.status(200).send(updatemessage);
  }).catch((err)=>{
    if(err){
      return res.status(400).send(err);
    }
      return res.status(400).send();
  })
})
  
/* 일반 메시지가 클라이언트 DB에 동기화 되었으면 UpdateMessage에 noSyncObjectId에 동기화 된 유저 지우기, 동기화가 완전히 완료 되었다면 UpdateMessage Delete */
router.post('/delete',(req,res)=>{
  const {chatUUID,userObjectId} = req.body;
  User.findOne().where('_id').equals(userObjectId).then(user=>{
    UpdateMessage.find().where('chatUUID').equals(chatUUID).where('noSyncObjectId').in([user._id.toString()]).sort({ messageTime: 'desc'}).then(updatemessage=>{
      for(let i =0; i< updatemessage.length; i ++){
        let chatUser = updatemessage[i].noSyncObjectId;
        chatUser.splice(chatUser.indexOf(userObjectId),1)
        UpdateMessage.updateOne({ chatUUID:chatUUID, messageUUID:updatemessage[i].messageUUID }, {$set:{ noSyncObjectId: chatUser}}).then(updatemessage1=>{
        })
        if(updatemessage[i].noSyncObjectId.length==0){
          UpdateMessage.deleteOne({ chatUUID:chatUUID, messageUUID:updatemessage[i].messageUUID }).then(updatemessage=>{
          })
        }
      }
      return res.status(201).send(updatemessage); 
  })
  }).catch((err)=>{
    if(err){
      return res.status(400).send(err);
    }
      return res.status(400).send();
  })
})

/* 삭제 메시지가 클라이언트DB에 동기화가 되었으면 UpdateMessage에 noSyncObjectId에 동기화 된 유저 지우기, 동기화가 완전히 완료 되었다면 UpdateMessage Delete (1개의메시지) */
router.post('/delete/message',(req,res)=>{
  const {chatUUID, messageUUID ,userObjectId} = req.body;
  User.findOne().where('_id').equals(userObjectId).then(user=>{
    //console.log("user  delete: " + user)
    UpdateMessage.find().
    where('chatUUID').equals(chatUUID).
    where('messageUUID').equals(messageUUID).
    where('noSyncObjectId').in([user._id.toString()]).then(updatemessage=>{
      if(updatemessage.length==0){
        console.log('데이터 제로')
        return res.status(201).send(updatemessage); 
      }
      else{
        console.log('데이터 have')
        let chatUser = updatemessage[0].noSyncObjectId;
        chatUser.splice(chatUser.indexOf(userObjectId),1)
        UpdateMessage.updateOne({ chatUUID:chatUUID, messageUUID:messageUUID }, {$set:{ noSyncObjectId: chatUser, text:'삭제된 메시지 입니다.', image:'', video:''}}).then(updatemessage=>{       
        })
        
        if(updatemessage[0].noSyncObjectId.length==0){
          UpdateMessage.deleteOne({ chatUUID:chatUUID, messageUUID:messageUUID }).then(updatemessage=>{
        })
          return res.status(201).send(updatemessage); 
        }
      }
    })
  }).catch((err)=>{
    if(err){
      return res.status(400).send(err);
    }
      return res.status(400).send();
  })
})

/*메시지가 있으면 update, 없으면 insert */
/*한개 메시지 지우기 */
router.post('/merge',(req,res)=>{
  const {chatUUID, messageUUID, messageTime ,userObjectId, noSyncObjectId} = req.body;
  console.log('merge')
  console.log(chatUUID)
  console.log(messageUUID)
  console.log(userObjectId)
  console.log(messageTime)
  User.findOne().where('_id').equals(userObjectId).then(user=>{
    UpdateMessage.find().
    where('chatUUID').equals(chatUUID).
    where('messageUUID').equals(messageUUID).then(updatemessage=>{
      console.log(updatemessage.length)
      if(updatemessage.length==0){//메시지 동기화('/chat/delete')가 끝나서 데이터가 삭제되었기 때문에 해당 값은 insert해줘야 한다.
        let UpdateMessageData = new UpdateMessage({
          chatUUID : chatUUID,
          messageUUID : messageUUID,
          userObjectId : userObjectId,
          messageTime : messageTime,
          text:'삭제된 메시지 입니다.',
          image:'',
          video:'',
          noSyncObjectId:noSyncObjectId,
          messageType:'D'
        });
        UpdateMessageData.save().then(updatemessagedata=>{
          console.log('인설트완료' + noSyncObjectId)
          return res.status(201).send(updatemessagedata)
        })
      }
      else{
        UpdateMessage.updateOne({ chatUUID:chatUUID, messageUUID:messageUUID }, 
          {$set:{ noSyncObjectId: noSyncObjectId, text:'삭제된 메시지 입니다.', image:'', video:'',messageType:'D'}}).then(updatemessage=>{     
            console.log('업데이트완료 : ' + noSyncObjectId)
            return res.status(201).send(updatemessage)
        })  
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
