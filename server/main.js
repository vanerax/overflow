var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var TunnelServer = require('./TunnelServer');
var port = 3001;
var tunnelServer = new TunnelServer();

tunnelServer.listen(port, function(){
   console.log('listening on *:' + port);
});
