var net = require('net');

net.createConnection({host: 'slc09ybk.us.oracle.com', port: 7101 }, function() {
   console.log('connected');  
});
