var log4js = require('log4js');
var logger = log4js.getLogger();
const net = require('net');
var log4js = require('log4js');
var logger = log4js.getLogger();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var tunnel = require('../common/tunnel');
var TunnelConnection = require('./TunnelConnection');


function TunnelServer() {
   this._proxyMap = {};
   this._lastUsedId = 0;
}

TunnelServer.prototype.listen = function(port, onConnect) {
   this._setupTunnel();
   server.on('error', function() {
      logger.error('on error');
   });
   server.on('connection', function(socket){
      logger.error('on connection. ', socket);
   });
   server.listen(port, onConnect);
};

TunnelServer.prototype._setupTunnel = function() {
   var self = this;
   io.on('connect', function(socket) {
      //logger.info('new connection established. address = ' + socket.localeAddress + ' , port = ' + socket.localPort);
      //logger.info('new connection established.', socket);
      // socket.on('disconnect', function(){
         // console.log('user disconnected');
      // });

      // socket.on('chat message', function(msg){
         // console.log('message: ' + msg);
      // });

      // socket.on('hello', function (name, fn) {
      //    console.log(name);
      //    //fn('reply ' + name);
      //    //io.emit('welcome', 'welcome ' + socket.id);
      //     socket.emit('hello', "hello " + name);
      // });
      var tunConn = new TunnelConnection(socket, this);
      tunConn.start();
   });
};

// TunnelServer.prototype._recvTunnelData = function(socket, data) {
//    // parse data
//    var oData = data;
//    switch(oData.action) {
//       case tunnel.TUNNEL_COMMAND.BIND:
//          this._bind(socket, oData.payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.UNBIND:
//          this._unbind(socket, oData.payload);
//          break;

//       case tunnel.TUNNEL_COMMAND.SEND:
//          this._send(socket, oData.payload);
//          break;

//       default:
//          break;
//    }
// };

// TunnelServer.prototype._bind = function(tunnelSocket, proxyInfo) {
//    // Proxy {
//    //   id
//    //   address
//    //   port
//    //   ts
//    // }
//    var self = this;
//    var id = proxyInfo.id;
//    if (id == null || this._proxyMap[id]) {
//       throw "proxyInfo error";
//    }

//    if (this._proxyMap[id]) {
//       throw `id = ${id} already bound`;
//    }

//    this._proxyMap[id] = proxyInfo;
//    var clientSocket = net.connect({host: proxyInfo.address, port: proxyInfo.port}, () => {
//       // 'connect' listener
//       //console.log('connected to server!');
      
//       proxyInfo.socket = clientSocket;

//       // reply to tunnel
//       self._reply(tunnelSocket, proxyInfo, tunnel.TUNNEL_REPLY.SUCCESS);

//       clientSocket.on('data', function(chunk) {
//          self._send(tunnelSocket, id, chunk);
//       });
//    });

//    clientSocket.on('error', function(err) {
//       self._reply(tunnelSocket, proxyInfo, tunnel.TUNNEL_REPLY.FAIL);
//    });

//    //clientSocket.on('drain', function() {

//    //});
      
// };


TunnelServer.prototype._generateUniqueId = function() {
   return ++this._lastUsedId;
};

module.exports = TunnelServer;
