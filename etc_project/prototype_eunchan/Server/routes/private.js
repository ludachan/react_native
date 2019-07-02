const router = require('express').Router();
const authecticate = require('../middleware/authenticate');

router.get('/private',authecticate,(req,res)=>{
    let obj ={
        message :'This is a secret ROUTE',
        secret:'YOU MAY PASS',
        _id:req._id
    };
    res.status(200).send(obj);
});

module.exports = router;