var util = require('util');
var AbstractTunnelServer = require('./abstractTunnelServer');
var SocketIOTunnelConnection = require('../common/SocketIOTunnelConnection');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// why we have a wrapper of socket.io?
// We plan to support multiple tunnel type. SocketIOTunnelServer is just one implementation.
class SocketIOTunnelServer extends AbstractTunnelServer {
   constructor(fOnConnect) {
      super();
      this._socket = null;
      this._fOnConnect = fOnConnect;

      //this._init();
      this._subscribeEvents();
   }

   listen(port) {
      server.listen(port);
   }

   close() {
      server.close();
   }

   _subscribeEvents() {
      var self = this;
      io.on('connect', (socket) => {
         self._tunnelConnection = new SocketIOTunnelConnection(socket);
         self._tunnelConnection._outBufferList = self._outBufferList;
         self._fOnConnect(self._tunnelConnection);

         //self._socket = socket;
         // socket.on('tunneldata', function(data) {
         //    self._recvTunnelCommand(data);
         // });
         // socket.on('disconnect', function(reason) {
         //    self._socket = null;
         // });
      })
   }
}

module.exports = SocketIOTunnelServer;