"use strict";

var path    = require('path');
var express = require('express')
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public')));

http.listen(process.env.PORT || 5000, function () {
  console.log('ready to chat')
});

io.on('connection', function (socket) {

  //
  // Allow the client to join a specified room
  //
  socket.on('join', function (data) {

    console.log(data.nickname, 'joined', data.roomName)
    socket.join(data.roomName)
    socket.nickname = data.nickname
    socket.emit('joined room', data.roomName)

  });

  //
  // Allow the client to leave a specified room
  //
  socket.on('leave', function (roomName) {

    socket.leave(roomName);

  });

  //
  // Allow the client to send a message to any room
  // they have already joined
  //
  socket.on('send', function (data) {
    socket.to(data.room).emit('message', {
      message: data.message,
      type: data.type,
      nickname: socket.nickname,
      timestamp: Date.now()
    });

  });

});
