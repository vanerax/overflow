const net = require('net');
var EventEmitter = require('events');
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger();
var tunnel = require('./tunnel');
var AbstractTunnelConnection = require('./abstractTunnelConnection');
//var TunnelCommandService = require('../common/TunnelCommandService');
var overflowUtils = require('./overflowUtils');

var SOCKETIO_TUNNEL_EVENT = 'tunneldata';
class SocketIOTunnelConnection extends AbstractTunnelConnection {
   constructor(socket) {
      super();
      // socketio instance
      this._socket = socket;
      this._active = true;
      //this._tunMsgHub = tunMsgHub;
      //this._proxyMap = {};
      //this._bindRequestMap = {};

      this._subscribeEvents();
   }

   isActive() {
      return this._active;
   }

   // handle if socket disconnected case
   write(data) {
      if (this.isActive()) {
         this._socket.emit(SOCKETIO_TUNNEL_EVENT, data);
      } else {
         // var outBufferList = this._tunMsgHub._outBufferList;
         // outBufferList.push(data);
      }
   }

   end() {
      this._socket.disconnect();
   }

   _subscribeEvents() {
      var self = this;
      this._socket.on('connect', ()=>{
         this.emit('connect');
      });

      this._socket.on('disconnect', () => {
         this._active = false;
         this.emit('end');
      });

      this._socket.on(SOCKETIO_TUNNEL_EVENT, (data) => {
         this.emit('data', data);
      });
   }
}



//////////////////////////////////////

//TunnelConnection.prototype._recvTunnelCommand = function(data) {
//    // parse data
//    var oData = data;
//    var id = oData.id;
//    switch(oData.command) {
//       case tunnel.TUNNEL_COMMAND.BIND_REQUEST:
//          this._onBind(oData.payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.BIND_REPLY:
//          this.emit('bindreply');
//          TunnelCommandService.in.getInstance().emit(TUNNEL_COMMAND_SERVICE_EVENT, cmd, this._id, payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.UNBIND:
//          //this._onUnbind(id, oData.payload);
//          this.emit('unbind');
//          break;

//       case tunnel.TUNNEL_COMMAND.SEND:
//          //this._onSend(id, oData.payload);
//          this.emit('send');
//          break;

//       default:
//          break;
//    }
// };

// TunnelConnection.prototype.bind = function(bindPayload) {
//    // generate req id for binding process so that reply message can be mapped to the correct socket
//    var reqId = overflowUtils.generateUniqueId();
//    //logger.debug('generated req id = ' + reqId);
//    //logger.debug('target address = ' + bindPayload.address + ' , port = ' + bindPayload.port);
//    bindPayload.reqId = reqId;
//    this._bindRequestMap[reqId] = bindPayload;

//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND, reqId, bindPayload);
// };

// TunnelConnection.prototype.send = function(id, sendPayload) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, id, sendPayload);
// };

// TunnelConnection.prototype.bindReply = function(id, replyPayload) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND_REPLY, id, replyPayload);
// };

// TunnelConnection.prototype.unbind = function(id) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, id, {});
// };




// TunnelConnection.prototype._sendTunnelCommand = function(cmd, id, payload) {
//    logger.debug('server send command: ', cmd, id, payload);
//    this._socket.emit('tunneldata', {
//       command: cmd,
//       id: id,
//       payload: payload
//    });
// };

// TunnelConnection.prototype._onBind = function(bindPayload) {
//    var self = this;
//    //var id = this._generateUniqueId();
//    //var proxyInfo = bindPayload;
//    //this._proxyMap[id] = proxyInfo;
   
//    var fSucceed = function(id) {
//       self.reply(id, {status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: proxyInfo.reqId });
//    };
//    var fFail = function(id) {
//       self.reply(id, {status: tunnel.TUNNEL_REPLY.FAIL, reqId: proxyInfo.reqId });
//    };

//    this.emit('bind', bindPayload, action);

//    logger.debug('try to connect target host. address = ' + proxyInfo.address + ' port =  ' + proxyInfo.port);
//    logger.debug(bindPayload);
//    var clientSocket = net.connect({host: proxyInfo.address, port: proxyInfo.port}, () => {
//       // 'connect' listener
//       //console.log('connected to server!');
//       logger.debug('connected');
//       proxyInfo.socket = clientSocket;

//       // reply to tunnel
//       self._reply(id, {status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: proxyInfo.reqId });

//       clientSocket.on('data', function(chunk) {
//          self._send(id, chunk);
//       });

//       clientSocket.on('end', function() {
//          self._unbind(id);
//       });
//    });

//    clientSocket.on('error', function(err) {
//       logger.debug('error. failed to connect');
//       self._reply(id, {status: tunnel.TUNNEL_REPLY.FAIL, reqId: proxyInfo.reqId });
//    });

//    //clientSocket.on('drain', function() {

//    //});
// };

// TunnelConnection.prototype._onUnbind = function(id, unbindPayload) {
//    //if (this._proxyMap[id]) {
//    //   var socket = this._proxyMap[id].socket;
//    //   socket.end();

//    //   delete this._proxyMap[id];
//    //}
// };

// TunnelConnection.prototype._onSend = function(id, sendPayload) {
//    //if (this._proxyMap[id]) {
//    //   var socket = this._proxyMap[id].socket;
//    //   if (socket) {
//    //      socket.write(sendPayload.payload);
//    //   }
//    //}
// };



module.exports = SocketIOTunnelConnection;
