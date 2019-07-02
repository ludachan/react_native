const express = require('express');
const app = express();
const mongoose = require('./db/mongoose');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/user-routes')
const friendRoutes = require('./routes/friend-routers');
const private = require('./routes/private');
const roomListRoutes = require('./routes/roomList-routers');
const updateMessageRoutes = require('./routes/updateMessage-routers');
const deleteMessageRoutes = require('./routes/deleteMessage-routers');
const bodyParser = require('body-parser');
const pushRoutes = require('./routes/push-routers');


//fcm
const chatFcmRoutes = require('./routes/chat-fcm-routers')

app.use(bodyParser.json());

app.get('/test',(req,res)=>{
    return res.send('test');
})
//router 연결
app.use('/user',userRoutes);
app.use('/private',private);
app.use('/room', roomListRoutes);
app.use('/friend', friendRoutes);
app.use('/chat', updateMessageRoutes);
app.use('/delete', deleteMessageRoutes);
app.use('/push',pushRoutes);
app.use('/chatfcm',chatFcmRoutes);
const PORT = 3000;

app.listen(PORT,()=>{
    console.log('server started on port '+PORT)
});
