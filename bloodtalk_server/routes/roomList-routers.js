const express = require('express');
const router = express.Router();
const roomList = require('../db/models/roomList-models')
const User = require('../db/models/user-models')
const UUID = require('uuid/v1');

/*
1. req.param
    주소에 포함된 변수를 담는다. 
    예를 들어 https://okky.com/post/12345 라는 주소가 있다면 12345를 담는다

2. req.query
    주소 바깥, ? 이후의 변수를 담는다. 
    예를 들어 https://okky.com/post?q=Node.js 일 경우 Node.js를 담는다

3. req.body
    XML, JSON, Multi Form 등의 데이터를 담는다. 
    당연히 주소에선 확인할 수 없다.
*/

//대화방 목록 불러오기
/*
    현재 참가하고 있는 대화방 목록 불러오기    
    //const query = new RegExp(req.params.userId); // oracle의 like 쿼리
*/
router.post('/list',(req,res)=>{
    const {token} = req.body;
    User.findOne().where('authT').equals(token).then(user=>{
        if(!user){
            return res.status(400).send();
        } 
        roomList.find().where('members').in(user._id.toString()).then(roomlist=>{
        //console.log(roomlist)
        if(!roomlist){
            return res.status(400).send();
        }
            return res.status(201).send({roomlist, userObjectId:user._id.toString()});
        }).catch(err=>{
        if(err){
            return res.status(400).send({error:err});
        }
            return res.status(400).send();
        })
    })
});

//대화방 추가 하기
/*
    신규 대화방 추가할 때 부르는 api
    채팅방uuid,채팅방에 참가한 유저 id,채팅방이름, 그룹 채팅방 여부, 채팅방 생성시간을 db에 데이터 삽입
*/
router.post('/add',(req,res)=>{
    let { token, chatTitle, members, isGroup } = req.body;
    User.findOne().where('authT').equals(token).then(user=>{
        //console.log(user);
        if(!user){
            return res.status(400).send();
        }
        members.push(user._id.toString());
        if(isGroup == false){ //1:1 대화방
            console.log('1:1')
            roomList.findOne().where('members').all(members).where('isGroup').equals('false').then(chatroom=>{
                if(chatroom){ //1:1 채팅방이 존재 하면 
                    return res.status(201).send({chatroom,message:"chatroom is exist",userId:user._id.toString()});
                }
                else{ // 1:1 채팅방이 존재하지 않으면
                    let chatRoom = new roomList({
                        chatTitle : chatTitle,
                        members : members,
                        isGroup : isGroup,
                        chatUUID : UUID()
                    });
                    chatRoom.save().then(chatroom=>{
                        return res.status(201).send({chatroom, userId:user._id.toString()})
                    }).catch((err)=>{
                        if(err){
                            return res.status(400).send({error:err});
                        }
                            return res.status(400).send();
                    })
                }
            })
        }
        else { // 그룹채팅방
            let chatRoom = new roomList({
                chatTitle : chatTitle,
                members : members,
                isGroup : isGroup,
                chatUUID : UUID()
            });
            chatRoom.save().then(chatroom=>{
                console.log(chatroom)
                return res.status(201).send({chatroom, userId:user._id.toString()})
            }).catch((err)=>{
                if(err){
                    return res.status(400).send({error:err});
                }
                    return res.status(400).send();
            })
        }
    })
});

//대화방에 인원 추가
/*
    1:1 or 단체 대화방에 유저를 추가 할 때 부르는 api
    토큰으로 검색 후 유저가 해당하는 토큰이 유효하면 챗UUID로 검색후 member를 더한다.
*/
router.patch('/member/add',(req,res)=>{
    let { token, AddMembers, chatUUID} = req.body;
    User.findOne().where('authT').equals(token).then(user=>{
        if(!user){
            return res.status(400).send();
        }
        //console.log('개별') 
        roomList.findOne().where('chatUUID').equals(chatUUID).where('members').in(user._id.toString()).select('isGroup members').then(chatroom=>{
            //console.log('AddMembers : ' + AddMembers)
            if(chatroom.isGroup==false){ //개별채팅방은 현재인원에 추가인원해서 새로운 그룹채팅방을 만든다.
                //console.log('개별');
                for(let i=0; i<chatroom.members.length; i++){
                    console.log(chatroom.members[i])
                    AddMembers.push(chatroom.members[i]);
                }
                let chatRoom = new roomList({
                    chatTitle : "그룹 채팅방",
                    members : AddMembers,
                    isGroup : true,
                    chatUUID : UUID()
                });
                chatRoom.save().then(chatroom=>{
                    //console.log(chatroom)
                    return res.status(201).send(chatroom)
                })
            }
            else{
                //console.log('그룹')
                for(let i=0; i<AddMembers.length; i++){
                    chatroom.members.push(AddMembers[i])
                }
                chatroom.save();
                return res.status(201).send(chatroom);
            }
        }).catch((err)=>{
            if(err){
                return res.status(400).send({error:err});
            }
                return res.status(400).send();
        })
    }).catch((err)=>{
        if(err){
            return res.status(400).send({error:err});
        }
            return res.status(400).send();
    })
});

//대화방에 인원 빼기
/*
    1:1 or 단체 대화방에 유저를 제거 할 때 부르는 api
    토큰으로 검색 후 유저가 해당하는 토큰이 유효하면 챗UUID로 검색후 member를 뺀다.
*/
router.patch('/member/remove',(req,res)=>{
    let { userObjectId, chatUUID} = req.body;
    console.log(userObjectId)
    console.log(chatUUID)
    roomList.findOne().where('chatUUID').equals(chatUUID).where('members').in(userObjectId).then(roomlist=>{
        if(!roomlist){
            return res.status(400).send();
        }
        let chatUser = roomlist.members;
        chatUser.splice(chatUser.indexOf(userObjectId),1)
        roomList.updateOne({ chatUUID:chatUUID }, {$set:{ members: chatUser}}).then(roomlist=>{
        })
        if(roomlist.members.length==0){
            roomList.deleteOne({ chatUUID:chatUUID }).then(roomlist=>{
            })
        }
        return res.status(201).send({message: 'success'});
    })
});


//대화방에 참가하고 있는 인원 확인
/*
    단체방에 속해져 있는 인원을 구한다.
*/
router.post('/members',(req,res)=>{
    let { chatUUID, userObjectId } = req.body;
    roomList.findOne().where('chatUUID').equals(chatUUID).where('members').in(userObjectId).then(roomlist=>{
        return res.status(200).send(roomlist.members);
    }).catch((err)=>{
    if(err){
        return res.status(400).send({error:err});
    }
        return res.status(400).send();
    })
})
    /*User.findOne().where('authT').equals(token).then(user=>{
        //console.log(user);
        if(!user){
            return res.status(400).send();
        }*/

        //대화방에 참가하고 있는 인원 확인
/*
    단체방에 속해져 있는 인원을 구한다.
*/
router.post('/notiinfo',(req,res)=>{
    let { chatUUID, token } = req.body;
    User.findOne().where('authT').equals(token).then(user=>{
        roomList.findOne().where('chatUUID').equals(chatUUID).where('members').in(user._id.toString()).then(roomlist=>{
            return res.status(200).send({roomlist, userObjectId:user._id.toString()});
        }).catch((err)=>{
        if(err){
            return res.status(400).send({error:err});
        }
            return res.status(400).send();
        })
    })
    
})


module.exports = router;
