angular.module('app.controllers', [])
.controller('AppCtrl', function($scope, $http, socket) {

  $scope.user = {}
  $scope.message = {}
  $scope.messages = []

  socket.on('message', function (data) {
    $scope.messages.push({
      from: data.nickname,
      type: data.type,
      message: data.message,
      time: data.timestamp
    })
  })

  socket.on('joined room', function(room) {
    $scope.user.room = room
    $scope.loggedIn = true
  })

  $scope.join = function(room, nick) {
    socket.emit('join', {
      roomName: room,
      nickname: nick
    })
  }

  $scope.leave = function(room) {
    socket.emit('join', room)
  }

  $scope.send = function(msg) {
    $scope.message.value = ''
    if(msg.substring(0, 6) == '/giphy') {
      var query = 'q=' + encodeURIComponent(msg.substring(6)) + '&limit=1'
      $http.get('http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&' + query)
        .then(function(res) {
          if(res.data.data.length) {
            result = res.data.data[0].id
            gif = 'https://media.giphy.com/media/'+result+'/giphy.gif'
            $scope.messages.push({
              from: 'me',
              type: 'gif',
              message: gif,
              time: Date.now()
            })
            socket.emit('send', {
              room: $scope.user.room,
              type: 'gif',
              message: result,
              nickname: $scope.user.nickname
            })
          }
        })
    } else {
      $scope.messages.push({
        from: 'me',
        type: 'text',
        message: msg,
        time: Date.now()
      })
      socket.emit('send', {
        room: $scope.user.room,
        type: 'text',
        message: msg,
        nickname: $scope.user.nickname
      })
    }
  }
})

/*
var socket = io();

//
// Handle an incoming message
//
socket.on('message', function (data) {
  console.log(data);
});

//
// Join a room
//
function join(room) {
  socket.emit('join', room);
}

//
// Leave a room
//
function leave(room) {
  socket.emit('leave', room);
}

//
// Send a message
//
function send(room, message) {
  socket.emit('send', {
    room: room,
    message: message
  });
}*/
