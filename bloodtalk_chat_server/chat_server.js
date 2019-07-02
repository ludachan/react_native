const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dateTime = require('date-time');

// let joinList= [];
// let chatUUID_joinUser= {
//   chatUUID: '',
//   JoinUser: [],
// }

io.on('connection', function(socket){
  console.log("connect")
  socket.on('join', (chatUUID, data) => {
    socket.join(chatUUID, () => {
      socket.userObjectId = data;
      console.log('joinRoomName : ' + chatUUID);
      let rooms = Object.keys(socket.rooms);
      console.log(rooms); // [ <socket.id>, 'room 237' ]
      //console.log('data : ' + data);
      //console.log('socket.userObjectId1 : ' +socket.userObjectId)
      //console.log('socket.id1 : ' +socket.id)
      // let socketData = new Object();
      // socketData.chatUUID = chatUUID;
      // socketData.JoinUser = userId;
      // chatUUID_joinUser.chatUUID=chatUUID
      // chatUUID_joinUser.JoinUser= socket.userObjectId;
      // joinList.push(chatUUID_joinUser)
      // console.log('sss : ' + JSON.stringify(joinList));
    });
  });
 
  socket.on('leave', (chatUUID, data) => {
    socket.leave(chatUUID, () => {
      console.log('leaveRoomName : ' + chatUUID);
      //io.to(chatUUID).emit(chatUUID, "join finish");
    });
  });

  socket.on('getUser', (chatUUID, data, allDelete) => {
    console.log('allDelete : ' + allDelete)
    let joinUser = [];
    for(let item01 in io.sockets.adapter.rooms[chatUUID].sockets){
        console.log('item01 : ' + item01)
        //console.log('io.sockets.adapter.rooms[chatUUID] : ' + JSON.stringify(io.sockets.adapter.rooms[chatUUID]))
      for(let item02 in io.sockets.sockets){
        console.log('item02 : ' + item02)
        if(item01 == io.sockets.sockets[item02].id){
          console.log(item01 + '.userid : ' + io.sockets.sockets[item02].userObjectId);
          joinUser.push(io.sockets.sockets[item02].userObjectId);
        }
      }
    }
    io.to(chatUUID).emit(chatUUID+',DeleteMessage', data, joinUser, allDelete);
  });


  socket.on('message', (chatUUID, data) => {
    let joinUser = [];
    for(let item01 in io.sockets.adapter.rooms[chatUUID].sockets){
        console.log('item01 : ' + item01)
        //console.log('io.sockets.adapter.rooms[chatUUID] : ' + JSON.stringify(io.sockets.adapter.rooms[chatUUID]))
      for(let item02 in io.sockets.sockets){
        console.log('item02 : ' + item02)
        if(item01 == io.sockets.sockets[item02].id){
          console.log(item01 + '.userid : ' + io.sockets.sockets[item02].userObjectId);
          joinUser.push(io.sockets.sockets[item02].userObjectId);
        }
      }
    }
    //console.log('socketId : ' + socket.id);
    //console.log(socket.userid)
    //console.log(io.sockets.adapter.rooms[chatUUID]);
    //var roster = io.of('/').in(chatUUID).clients;
    //let Rooms=[];
    //let roomJoinMemeber=io.sockets.adapter.rooms;
    //console.log(roomJoinMemeber[chatUUID].sockets)
    //console.log('socket.userObjectId2 : ' + socket.userObjectId)
    //console.log('socket.id2 : '+ socket.id)
    /*if(roomJoinMemeber){
      for(let room in roomJoinMemeber){
        if(!roomJoinMemeber[room].hasOwnProperty(room)){
          Rooms.push(room);
        }
      }
    }
    console.log(Rooms);*/
    //console.log(io.sockets.clients(chatUUID));
    // console.log('클라에서 받은 데이터 : ' + chatUUID);
    // console.log('클라에서 받은 데이터 : ' + data._id);
    // console.log('클라에서 받은 데이터 : ' + data.text);
    // console.log('클라에서 받은 데이터 : ' + data.createdAt);
    // console.log('클라에서 받은 데이터 : ' + data.user);
    //console.log('클라에서 받은 데이터 : ' + data.user._id);
    let json = data;
    json.createdAt = dateTime();
    console.log(dateTime())
    io.to(chatUUID).emit(chatUUID, json, joinUser);
    //console.log('클라에서 받은 데이터 : ' + JSON.stringify(json));
    console.log('클라에서 받은 데이터 : ' + joinUser);
  });

  socket.on('disconnect', function(){
    console.log('접속종료');
  });
});





http.listen(3050, function(){
  console.log('listening on *:3050');
});

