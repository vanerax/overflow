const net = require('net');

function TunnelConnection(socket, generator) {
   this._socket = socket;
   this._proxyMap = {};
   this._uniqueIdGenerator = generator;
}

TunnelConnection.prototype.start = function() {
   var self = this;
   this._socket.on('tunneldata', function(data) {
      console.log(data);

      self._recvTunnelCommand(data);

   });
};

TunnelConnection.prototype._recvTunnelCommand = function(data) {
   // parse data
   var oData = data;
   switch(oData.command) {
      case tunnel.TUNNEL_COMMAND.BIND:
         this._onBind(oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.UNBIND:
         this._onUnbind(oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.SEND:
         this._onSend(oData.payload);
         break;

      default:
         break;
   }
};

TunnelConnection.prototype._sendTunnelCommand = function(cmd, payload) {
   this._socket.emit('tunneldata', {
      command: cmd,
      payload: payload
   });
};

TunnelConnection.prototype._onBind = function(bindPayload) {
   var self = this;
   var id = this._uniqueIdGenerator();
   var proxyInfo = bindPayload;
   this._proxyMap[id] = proxyInfo;

   var clientSocket = net.connect({host: proxyInfo.address, port: proxyInfo.port}, () => {
      // 'connect' listener
      //console.log('connected to server!');
      
      proxyInfo.socket = clientSocket;

      // reply to tunnel
      self._reply(id, {status: tunnel.TUNNEL_REPLY.SUCCESS});

      clientSocket.on('data', function(chunk) {
         self._send(id, chunk);
      });

      clientSocket.on('end', function() {
         self._unbind(id);
      });
   });

   clientSocket.on('error', function(err) {
      self._reply(id, {status: tunnel.TUNNEL_REPLY.FAIL});
   });

   //clientSocket.on('drain', function() {

   //});
};

TunnelConnection.prototype._onUnbind = function(unbindPayload) {
   var id = unbindPayload.id;
   var socket;
   if (this._proxyMap[id]) {
      socket = this._proxyMap[id].socket;
      socket.end();

      delete this._proxyMap[id];
   }
};

TunnelConnection.prototype._onSend = function(sendPayload) {
   var id = sendPayload.id;
   var socket;
   if (this._proxyMap[id]) {
      socket = this._proxyMap[id].socket;
      if (socket) {
         socket.write(sendPayload.payload);
      }
   }
};

TunnelConnection.prototype._send = function(id, sendPayload) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, {
      id: id,
      payload: sendPayload
   });
};

TunnelConnection.prototype._reply = function(id, replyPayload) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.REPLY, {
      id: id,
      payload: replyPayload
   });
};

TunnelConnection.prototype._unbind = function(id) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, {
      id: id
   });
};

TunnelConnection.prototype._generateUniqueId = function() {
   if (this._uniqueIdGenerator == null) {
      throw "unique id generator not set up";
   }

   return this._uniqueIdGenerator._generateUniqueId();
};

module.exports = TunnelConnection;
