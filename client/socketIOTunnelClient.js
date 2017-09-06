var net = require('net');
var io = require('socket.io-client');
var log4js = require('log4js');
var logger = log4js.getLogger();
var SocketIOTunnelConnection = require('../common/SocketIOTunnelConnection');

class SocketIOTunnelClient {
   constructor() {

   }

   connect(url, options, fOnConnect) {
      var socket = io(url, options);
      var conn = new SocketIOTunnelConnection(socket);
      // socket.on('disconnect', function(){
      //    logger.info('on disconnect');
      //    //socket.close();
      // });

      // socket.on('error', function(err){
      //    logger.error('on error', err);
      // });

      // socket.on('connect_error', function(){
      //    logger.error('on connect error');
      // });

      conn.on('connect', () => {
         logger.info('connected');
         //var tunConn = new TunnelConnection(socket);
         //this.tunnelConnection = tunConn;
         //tunConn.start();
         if (fOnConnect instanceof Function) {
            fOnConnect();
         }
      });

      return conn;
   }
}


module.exports = SocketIOTunnelClient;