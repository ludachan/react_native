const express = require('express');
const router =express.Router();
const User = require('../db/models/user-models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} =require('../config');

router.post('/register',(req,res)=>{
    const {email,password,username,numauthyn,number} = req.body;
    console.log(email,password,username,numauthyn,number)   ;
    let newUser = new User({
        email,
        password,
        username,
        numauthyn,
        number
    })
    newUser.save().then(user=>{
        if(!user){
            console.log(user)
            return res.status(400).send();
        }
        console.log(user)
        return res.status(201).send(user);
    }).catch(err=>{
        console.log(err)
        if(err){
            return res.status(400).send({error:err});
        }
        return res.status(400).send();
    })
});

router.post('/update',(req,res)=>{
    const {number,username} = req.body;
    const numauthyn = 'Y'
    let newUser = new User({
        number,
        numauthyn
    })
    console.log(number);
    console.log(numauthyn);
    User.updateOne({username:username},{$set:{number:number,numauthyn:numauthyn}}).then(user=>{
        if(!user){
            return res.status(400).send();
        }
        return res.status(201).send(user);
    }).catch(err=>{
        if(err){
            return res.status(400).send({error:err});
        }
        return res.status(400).send();
    })
});

router.post('/login',(req,res)=>{
    const {username,password} = req.body;
    User.findOne({username}).then(user=>{
        if(!user){s
            return res.status(400).send();
        }
        bcrypt.compare(password,user.password).then(match=>{
            if(!match){
                return res.status(401).send();
            };
            let token = jwt.sign({_id:user._id},secret);
            return res.status(201).header('x-auth',token).send();
        }).catch(err=>{
            return res.status(401).send({error:err});
        })
    }).catch((err)=>{
        if(err){
            return res.status(401).send(err);
        }
        return res.status(401).send();
    })
})
router.post('/test',(req,res)=>{
    const status = true;
    return res.send(status);
})

//sha256방식으로 만든 번호 기준으로 insert
router.post('/authInsert',(req,res)=>{
    const {username} = req.body;
    User.findOne({username:username}).then(user=>{
        return res.status(201).send(user.numauthyn);
    }).catch((err)=>{
        if(err){
            return res.status(401).send(err);
        }
        return res.status(401).send();
    })
})


module.exports = router;
