var io = require('socket.io-client');
var log4js = require('log4js');
var tunnel = require('../common/tunnel');

var logger = log4js.getLogger();
logger.level = 'debug';

var url = 'http://localhost:3001/';
var socket = io(url, { reconnection: false });
logger.info('connect to ' + url);

socket.on('connect', function() {
   logger.info('connected');
   var tunConn = new TunnelConnection(socket);
   tunConn.start();

});

socket.on('disconnect', function(){
   logger.info('on disconnect');
   //socket.close();
});

socket.on('error', function(){
   logger.error('on error');
});

socket.on('connect_error', function(){
   logger.error('on connect error');
});

function TunnelConnection(socket) {
   this._socket = socket;
   this._proxyMap = {};
   this._bindRequestMap = {};
}

TunnelConnection.prototype.start = function(data) {
   socket.on('tunneldata', function (data) {
      this._recvTunnelCommand(data);
   });
};

TunnelConnection.prototype._recvTunnelCommand = function(data) {
   // parse data
   var oData = data;
   var id = oData.id;
   switch(oData.command) {
      case tunnel.TUNNEL_COMMAND.REPLY:
         this._onReply(id, oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.UNBIND:
         this._onUnbind(id, oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.SEND:
         this._onSend(id, oData.payload);
         break;

      default:
         logger.warn('unkown command');
         break;
   }
};

TunnelConnection.prototype._sendTunnelCommand = function(cmd, id, payload) {
   this._socket.emit('tunneldata', {
      command: cmd,
      id: id,
      payload: payload
   });
};

TunnelConnection.prototype._onReply = function(id, replyPayload) {
   logger.debug('on bind reply. id = ' + id);
   if (this._bindRequestMap[replyPayload.reqId]) {
      var socket = this._bindRequestMap[replyPayload.reqId].socket;
      if (replyPayload.status == tunnel.TUNNEL_REPLY.SUCCESS) {
         this._proxyMap[id] = this._bindRequestMap[replyPayload.reqId];
         delete this._bindRequestMap[replyPayload.reqId];
      } else {
         // close socket? or return sock5 error?
         socket.end();
      }
      
   }
};

TunnelConnection.prototype._onUnbind = function(id, unbindPayload) {
   logger.debug('on unbind. id = ' + id);
   if (this._proxyMap[id]) {
      var socket = this._proxyMap[id].socket;
      socket.end();
      delete this._proxyMap[id];
   }
};

TunnelConnection.prototype._onSend = function(id, sendPayload) {
   logger.debug('on send. id = ' + id);
   var payload = sendPayload.payload;
   if (this._proxyMap[id]) {
      var socket = this._proxyMap[id].socket;
      if (socket) {
         socket.write(payload);
      }
   }
};

TunnelConnection.prototype._bind = function(bindPayload) {
   // generate req id for binding process so that reply message can be mapped to the correct socket
   var reqId = this._generateUUID();
   logger.debug('generated req id = ' + reqId);
   logger.debug('target address = ' + bindPayload.address + ' , port = ' + bindPayload.port);
   bindPayload.reqId = reqId;
   this._bindRequestMap[reqId] = bindPayload;

   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND, reqId, bindPayload);
};

TunnelConnection.prototype._unbind = function(id) {
   logger.debug('unbind. id = ' + id);
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, id, {});
};

TunnelConnection.prototype._send = function(id, payload) {
   logger.debug('send. id = ' + id);
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, id, payload);
};

TunnelConnection.prototype._generateUUID = function() {
   return Math.floor(Math.random() * Math.pow(2, 32)).toString() + "_" + (new Date()).getTime().toString();
};