var io = require('socket.io-client');
var log4js = require('log4js');
var tunnel = require('../common/tunnel');
var tunnelConnection = require('./tunnelConnectionClient');

var logger = log4js.getLogger();
logger.level = 'debug';



function TunnelClient(url, options) {

}

TunnelClient.prototype.connect = function(url, options, onConnect) {
   var socket = io(url, options);
   this.tunnelSocket = socket;
   logger.info('connect to ' + url);

   socket.on('disconnect', function(){
      logger.info('on disconnect');
      //socket.close();
   });

   socket.on('error', function(err){
      logger.error('on error', err);
   });

   socket.on('connect_error', function(){
      logger.error('on connect error');
   });

   socket.on('connect', function() {
      logger.info('connected');
      var tunConn = new TunnelConnection(socket);
      this.tunnelConnection = tunConn;
      tunConn.start();
      if (typeof onConnect === 'function') {
         onConnect();
      }
   });
};

module.exports = TunnelClient;
