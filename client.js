var io = require('socket.io-client');

var socket = io('http://localhost:3001/');
socket.on('connect', function(){
   //console.log(socket.id);

   socket.on('tunneldata', function (data) {
      console.log(data);

      test1(socket);
   });
   test1(socket);

   socket.on('hello', function(data){
      console.log(data);
   });

   // socket.on('hello', function(data){
   //    console.log(data);
   // });
   socket.on('welcome', function(data){
      console.log(data);
   });
});

socket.on('disconnect', function(){
   socket.close();
});

function test1(socket){
   setTimeout(function(){
      var now = new Date().getTime().toString();
      socket.emit('tunneldata', now);
   }, 1000);
}