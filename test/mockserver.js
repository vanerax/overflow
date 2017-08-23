var net = require('net');

var server = net.createServer(function(socket) {
   // 'connection' listener
   console.log('client connected');
   socket.on('end', () => {
      console.log('client disconnected');
   });
   socket.write('hello\r\n');
   //socket.pipe(c);
   // setTimeout(function(){
   //    socket.end();
   // }, 5000);
});

server.listen(45030, () => {
  console.log('server bound');
});
