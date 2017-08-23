var io = require('socket.io-client');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var TunnelServer = require('../server/TunnelServer');
var TunnelClient = require('../client/TunnelClient');
var TunnelConnection = require('../client/TunnelConnectionClient');

var host = 'localhost';
var port = 8082;

// var tunnelServer = new TunnelServer();
// tunnelServer.listen(port, function(){
//    console.log('listening on *:' + port);
// });

var url = "http://localhost:3001/";
var options = { reconnection: false };
// client
var socket = io(url, options);
this.tunnelSocket = socket;
logger.info('connect to ' + url);

socket.on('disconnect', function(){
   logger.info('on disconnect');
   //socket.close();
});

socket.on('connect', function() {
   logger.info('connected');
   var tunConn = new TunnelConnection(socket);
   //this.tunnelConnection = tunConn;
   tunConn.start();
   tunConn._bind({ address: host, port: port });
   logger.debug(tunConn._bindRequestMap);
   logger.debug(tunConn._proxyMap);
});