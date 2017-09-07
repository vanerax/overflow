var net = require('net');

var socket = net.createConnection({host: 'slc09ybk.us.oracle.com', port: 7101 }, function() {
   console.log('connected');
   socket.end();
});

socket.on('end', () => {
   console.log('on end');
})

