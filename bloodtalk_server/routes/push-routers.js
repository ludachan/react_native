const express = require('express');
const router = express.Router();
let FCM = require('fcm-node');
const User = require('../db/models/user-models')
const serverKey = require('../config').FCM_SERVER_KEY;
let pushFCM  = new FCM(serverKey);

router.post('/send', (req,res)=> {
    let pushUser=[];
    const {pushObjectid,chatTitle,message,chatUUID,conversationUUID,userObjectId,chatTime,image,video} = req.body;
    User.find().where('_id').in(pushObjectid).select('pushT').then(user=>{
        if(!user){
            return res.status(400).send(); 
        }
        else{
            for(let i =0; i<user.length;i++)
            {
                pushUser.push(user[i].pushT);
            }
            console.log('pushUser : ' + pushUser)
            // console.log('chatUUID :   ' + chatUUID)
            // console.log('chatTitle :   ' + chatTitle)
            // console.log('conversationUUID :   ' + conversationUUID)
            // console.log('userObjectId :   ' + userObjectId)
            // console.log('chatTime :   ' + chatTime)
            // console.log('message :   ' + message)
            // console.log('image :   ' + image)
            // console.log('video :   ' + video)
            pushSend(pushUser,chatTitle,message,chatUUID,conversationUUID,userObjectId,chatTime,image,video).then(result =>{
                
                return res.status(200).send(result);
            })
        }
    })
})    

async function pushSend(pushObjectid,chatTitle,message,chatUUID,conversationUUID,userObjectId,chatTime,image,video){
    console.log('pushObjectid : ' + pushObjectid)
    let returnData;
    let push_data = {
        registration_ids: pushObjectid,
        notification : {       
            show_in_foreground : true,
            title: chatTitle,
            body: message,
            sound: "default",
            click_action: "FCMPLUGINACTIVITY",
            icon: "fcmpushicon"                             
        },
        data: {
            chatUUID: chatUUID,
            conversationUUID: conversationUUID,
            userObjectId: userObjectId,
            chatTime: chatTime,
            message: message,
            image: image,
            video: video,
        },
    };

   await pushFCM.send(push_data, (err,response)=> {
    // console.log(push_data)
    // console.log('chatTitle :   ' + push_data.notification.title)
    // console.log('chatUUID :   ' + push_data.data.chatUUID)
    // console.log('conversationUUID :   ' + push_data.data.conversationUUID)
    // console.log('userObjectId :   ' + push_data.data.userObjectId)
    // console.log('chatTime :   ' + push_data.data.chatTime)
    // console.log('message :   ' + push_data.data.message)
    // console.log('image :   ' + push_data.data.image)
    // console.log('video :   ' + push_data.data.video)
        if (err) {
            console.error(err);
            returnData=err;
            //return res.status(400).send(message);
        }
        else{
            console.error(response);
            returnData=response
            //return res.status(200).send(message);
        }
    })
    return returnData;
}

module.exports = router;


