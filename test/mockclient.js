var net = require('net');

net.createConnection({host: 'localhost', port: 8082 }, function() {
   console.log('connected');  
});

