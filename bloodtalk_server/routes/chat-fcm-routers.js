const express = require('express');
const router =express.Router();
const User = require('../db/models/user-models')

var admin = require("firebase-admin");

var serviceAccount = require("../fcm-test-41ceb-firebase-adminsdk-iott3-0227fefe62.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fcm-test-41ceb.firebaseio.com"
});

// fcm 전송
// parameter: Objectid[],chatTitle,message,chatUUID,conversationUUID,userObjectId,chatTime,chatImg,chatVideo
router.post('/', (req,res)=> {
    let pushUser=[];
    const {pushObjectId,chatTitle,message,chatUUID,messageUUID,userObjectId,chatTime,chatImg,chatVideo,type} = req.body;
    // console.log('pushObjectId : ' + pushObjectId )
    // console.log('chatTitle : ' + chatTitle)
    // console.log('message : ' + message)
    // console.log('chatUUID : ' + chatUUID)
    // console.log('messageUUID : ' + messageUUID)
    // console.log('userObjectId : ' + userObjectId)
    // console.log('chatTime : ' + chatTime)
    // console.log('chatImg : ' + chatImg)
    // console.log('chatVideo : ' + chatVideo)
    console.log('type : ' + type)
    User.find().where('_id').in(pushObjectId).select('pushT').then(user=>{
        //console.log('user1 : ' + user)
        if(!user){
            console.log('!user')
            return res.status(201).send('usernull'); 
        }
        else{
            for(let i =0; i<user.length;i++)
            {
                pushUser.push(user[i].pushT);
            }
            //console.log('pushUser : ' + pushUser)
            let push_data;
            if(type=='SEND'){
                //console.log('SEND')
                push_data = {
                    notification : {       
                        title: chatTitle,
                        body: message,
                        android_channel_id: "blood_chat",                             
                    },
                    data: {
                        chatUUID: chatUUID,
                        messageUUID: messageUUID,
                        userObjectId: userObjectId,
                        chatTime: chatTime,
                        message: message,
                        chatImg: chatImg,
                        chatVideo: chatVideo,
                    },
                };
            }
            else if(type=='DELETE'){
                //console.log('DELETE')
                push_data = {
                    data: {
                        chatUUID: chatUUID,
                        messageUUID: messageUUID,
                        userObjectId: userObjectId,
                        chatTime: chatTime,
                        message: message,
                        chatImg: chatImg,
                        chatVideo: chatVideo,
                        type:type
                    },
                };
            }
            let result = null;
            admin.messaging().sendToDevice(pushUser, push_data)
            .then(function(response) {
                console.log("Successfully sent message:", JSON.stringify(response));
                result = response;
            })
            .catch(function(error) {
                console.log("Error sending message:", error);
                result = error;
            });
            return res.status(200).send(result);
        }
    }).catch(err=>{
        console.log('error : ' + err)
        return res.status(400).send(err);
    })
})    


// fcm 전송
// parameter: Objectid[],chatTitle,message,chatUUID,conversationUUID,userObjectId,chatTime,chatImg,chatVideo
router.post('/delete', (req,res)=> {
    let pushUser=[];
    let chatUUID;
    const {pushObjectId,userObjectId,data,type} = req.body;
    //console.log('pushObjectId : ' + pushObjectId )
    //console.log('data : ' + JSON.stringify(data))
    //console.log('type : ' + type)
    User.find().where('_id').in(pushObjectId).select('pushT').then(user=>{
        if(!user){
            console.log('!user')
            return res.status(201).send('usernull'); 
        }
        for(let i =0; i<user.length;i++)
        {
            pushUser.push(user[i].pushT);
        }
        chatUUID = data[0].chatUUID;
        let push_data;
        push_data = {
            data: {
                type: type,
                chatUUID: chatUUID,
                userObjectId:userObjectId
            },
        };
        let result = null;
        admin.messaging().sendToDevice(pushUser, push_data)
        .then(function(response) {
            console.log("Successfully sent message:", JSON.stringify(response));
            result = response;
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
            result = error;
        });
        return res.status(200).send(result);
    }).catch(err=>{
        console.log('error : ' + err)
        return res.status(400).send(err);
    })
})    


module.exports = router;
