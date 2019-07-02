const express = require('express');
const app = express();
const mongoose = require('./db/mongoose');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/user-routes')
const private = require('./routes/private');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// let password = 'myPassword';
// let salt = bcrypt.genSaltSync(12);
// let hashPassword = bcrypt.hashSync(password,salt);
// console.log('My hashed password is equal to -',hashPassword);
// let compare = bcrypt.compareSync(password,hashPassword)
// console.log('myfakePassword',compare);




app.use('/user',userRoutes);
app.use('/private',private);


const PORT = 3000;

app.listen(PORT,()=>{
    console.log('server started on posrt '+PORT)
});
