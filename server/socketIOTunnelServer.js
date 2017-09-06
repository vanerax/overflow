var util = require('util');
var AbstractTunnelServer = require('./abstractTunnelServer');
var SocketIOTunnelConnection = require('../common/SocketIOTunnelConnection');
var TunnelMessageHub = require('../common/TunnelMessageHub');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// why we have a wrapper of socket.io?
// We plan to support multiple tunnel type. SocketIOTunnelServer is just one implementation.
function SocketIOTunnelServer(fOnConnect) {
   this._socket = null;
   this._outBufferList = [];
   this._fOnConnect = fOnConnect;

   this._init();
}
util.inherits(SocketIOTunnelServer, AbstractTunnelServer);

SocketIOTunnelServer.prototype.listen = function(port) {
   server.listen(port);
};

SocketIOTunnelServer.prototype.close = function() {
   server.close();
   //if (this._socket) {
   //   this._socket.close();
   //}
};

SocketIOTunnelServer.prototype._init = function() {
   var self = this;
   io.on('connect', (socket) => {
      //if (self._socket) {
         // already have socket. Close other sockets.
      //   socket.close();
      //   return;
      //}
      self._tunMsgHub = new TunnelMessageHub();

      self._tunnelConnection = new SocketIOTunnelConnection(socket, self._tunMsgHub);
      self._tunnelConnection._outBufferList = self._outBufferList;
      self._fOnConnect(self._tunnelConnection);

      //self._socket = socket;
      // socket.on('tunneldata', function(data) {
      //    self._recvTunnelCommand(data);
      // });
      // socket.on('disconnect', function(reason) {
      //    self._socket = null;
      // });
      

      // TunnelCommandService.out.subscribe(function(cmd, id, payload) {
      //    // get a connection
      //    // then send command
      //    if (self._tunnelConnection.isActive()) {
      //       self._tunnelConnection.write({
      //          command: cmd,
      //          id: id,
      //          payload: payload
      //       });
      //    }
      // });

      // // send out buffer if existed
      // while (self._outBufferList.length > 0) {
      //    var oData = self._outBufferList.splice(0, 1);
      //    self._socket.emit('tunneldata', oData);
      // }
   });
};

SocketIOTunnelServer.prototype._sendTunnelCommand = function(cmd, id, payload) {
   var oData = {
      command: cmd,
      id: id,
      payload: payload
   };
   if (this._socket) {
      this._socket.emit('tunneldata', oData);
   } else {
      this._outBufferList.push(oData);
   }
};

module.exports = SocketIOTunnelServer;