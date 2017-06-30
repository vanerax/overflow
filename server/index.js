const net = require('net');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('hello', function (name, fn) {
     console.log(name);
     //fn('reply ' + name);
     //io.emit('welcome', 'welcome ' + socket.id);
     socket.emit('hello', "hello " + name);
  });

  socket.on('tunneldata', function (data) {
     console.log(data);
     socket.emit('tunneldata', "reply " + data);
  });

  // establish connection to target server
  var targetOptions = {
     port: 80,
     host: www.bing.com
  };
  var clientSocket = net.connect(targetOptions, function(){

  });
});



http.listen(3001, function(){
  console.log('listening on *:3001');
});