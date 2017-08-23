const net = require('net');
var EventEmitter = require('events');
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger();
var tunnel = require('../common/tunnel');
var TunnelConnection = require('../common/tunnelConnection');

function TunnelConnectionServer(socket, generator) {
   TunnelConnectionServer.super_.call(this, socket);
   //this._socket = socket;
   //this._proxyMap = {};
   //this._uniqueIdGenerator = generator;
}
util.inherits(TunnelConnectionServer, TunnelConnection);

// TunnelConnection.prototype.start = function() {
//    var self = this;
//    logger.debug('server on tunneldata.');
//    this._socket.on('tunneldata', function(data) {
//       console.log(data);

//       self._recvTunnelCommand(data);

//    });
// };

// TunnelConnection.prototype._recvTunnelCommand = function(data) {
//    // parse data
//    var oData = data;
//    var id = oData.id;
//    switch(oData.command) {
//       case tunnel.TUNNEL_COMMAND.BIND:
//          this._onBind(oData.payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.UNBIND:
//          this._onUnbind(id, oData.payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.SEND:
//          this._onSend(id, oData.payload);
//          break;

//       default:
//          break;
//    }
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
//    var id = this._generateUniqueId();
//    var proxyInfo = bindPayload;
//    this._proxyMap[id] = proxyInfo;

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
//    if (this._proxyMap[id]) {
//       var socket = this._proxyMap[id].socket;
//       socket.end();

//       delete this._proxyMap[id];
//    }
// };

// TunnelConnection.prototype._onSend = function(id, sendPayload) {
//    if (this._proxyMap[id]) {
//       var socket = this._proxyMap[id].socket;
//       if (socket) {
//          socket.write(sendPayload.payload);
//       }
//    }
// };

// TunnelConnection.prototype._send = function(id, sendPayload) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, id, sendPayload);
// };

// TunnelConnection.prototype._reply = function(id, replyPayload) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.REPLY, id, replyPayload);
// };

// TunnelConnection.prototype._unbind = function(id) {
//    this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, id, {});
// };

// TunnelConnection.prototype._generateUniqueId = function() {
//    if (this._uniqueIdGenerator == null) {
//       throw "unique id generator not set up";
//    }

//    return this._uniqueIdGenerator.generateUniqueId();
// };

module.exports = TunnelConnectionServer;
