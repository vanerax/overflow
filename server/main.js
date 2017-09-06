var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var SocketIOTunnelServer = require('./socketIOTunnelServer');
var port = 8082;
var tunnelServer = new SocketIOTunnelServer(conn => {
   conn.on('data', (data) => {
      
   });
});

tunnelServer.listen(port, function(){
   console.log('listening on *:' + port);
});

