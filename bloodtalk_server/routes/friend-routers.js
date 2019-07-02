const express = require('express');
const router =express.Router();
const Friend = require('../db/models/friend-models');
const User = require('../db/models/user-models')

//friend list
//param : authT(token)
//ps : token으로 먼저 유저를 조회한후 list를 찾는다.
router.post('/list',(req,res)=>{
    const {token} = req.body;
    User.findOne({authT:token}).then(user=>{    
        if(!user){
            return res.status(400).send();
        }
        Friend.findOne().where('userId').equals(user.userId).select('friendId').then(friend=>{
            if(!friend){
                return res.status(201).send('null');
            }
            User.find().where('userId').in(friend.friendId).then(friendList=>{
                //console.log(friendList);
                return res.status(201).send(friendList);
            })
            //return res.status(201).send(friend)
        }).catch(err=>{
            if(err){
                return res.status(400).send({error:err});
            }
            return res.status(400).send();
        })
    }).catch(err=>{
        if(err){
            return res.status(400).send({error:err});
        }
        return res.status(400).send();
    })
})

//friend add
//param : token,friendId
router.post('/add',(req,res)=>{
    let {token,friendId} = req.body;
    //console.log(token)
    //console.log(friendId)
    User.findOne().where('authT').equals(token).then(user=>{
        if(!user){
            return res.status(400).send();
        }
        //먼저 친구 등록이 되어있는지 확인
        Friend.findOne().where('userId').equals(user.userId).where('friendId').in(friendId).select('friendId').then(friendList=>{
            //console.log(friendList);
            //친구등록이 안되어 있으면
            if(!friendList){
                //console.log("ggg")
                Friend.findOne().where('userId').equals(user.userId).then(add=>{
                if(!add){
                    let newFriend = new Friend({
                        userId : user.userId,
                        friendId : [friendId]
                    })
                    newFriend.save().then(result=>{
                        if(!result){
                            return res.status(400).send('fail');
                        }
                        return res.status(201).send('success');
                    }).catch(err=>{
                        if(err){
                            return res.status(400).send(err);
                        }
                        return res.status(400).send();
                    })
                }else{
                    let friendUpdateArray =[];
                    add.friendId.push(friendId)
                    friendUpdateArray = add.friendId;
                    Friend.updateOne({userId : user.userId},{$set:{friendId:friendUpdateArray}}).then(friend=>{
                    return res.status(201).send('success');
                    }) 
                }    
                }).catch(err=>{
                    if(err){
                        return res.status(400).send(err);
                    }
                })
            }else{
                //이미 친구가 되어 있다면..
                return res.status(201).send('already');
            }
            
        })
        
    })
})

//friend search
//param : userId
router.post('/search',(req,res)=>{
    const {userId} = req.body;
    User.findOne().where('userId').equals(userId).then(user=>{
        if(!user){
            return res.status(201).send('usernull');
        }
        return res.status(201).send(user);
    }).catch(err=>{
        if(err){
            return res.status(400).send(err);
        }
        return res.status(400).send();
    })
})

//주소록 조회후 자동 친구 추가
//param : 주소록 리스트,token
router.post('/autoAdd',(req,res)=>{
    const {numberData,token} = req.body;
    let friendUpdateArray =[];
    User.findOne().where('authT').equals(token).then(user=>{
        if(!user){
            return res.status(201).send('usernull');
        }
        for(let i=0;i<numberData.length;i++){
            User.findOne().where('userPhone').equals(numberData[i]).then(friendInfo=>{
                if(!friendInfo){
                    return res.status(201).send();
                }
                let newFriend = new Friend({
                    userId : user.userId,
                    friendId : friendInfo.userId
                })
                //먼저 친구 등록이 되어있는지 확인
                Friend.findOne().where('userId').equals(user.userId).where('friendId').in(friendInfo.userId).select('friendId').then(friendList=>{
                    //친구등록이 안되어 있으면
                    if(!friendList){
                        Friend.findOne().where('userId').equals(user.userId).then(add=>{
                        let friendUpdateArray =[];
                        add.friendId.push(friendId)
                        friendUpdateArray = add.friendId;
                        Friend.updateOne({userId : user.userId},{$set:{friendId:friendUpdateArray}}).then(friend=>{
                            return res.status(201).send('success');
                        })    
                        }).catch(err=>{
                            if(err){
                                return res.status(400).send(err);
                            }
                        })
                    }else{
                        //이미 친구가 되어 있다면..
                        return res.status(201).send('already');
                    }
                })
            })
        }
    }).catch(err=>{
        return res.status(400).send();
    })
})



module.exports = router;
