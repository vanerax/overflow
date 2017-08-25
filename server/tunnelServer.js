var log4js = require('log4js');
var logger = log4js.getLogger();
const net = require('net');
var log4js = require('log4js');
var logger = log4js.getLogger();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var tunnel = require('../common/tunnel');
var TunnelConnectionServer = require('./TunnelConnectionServer');


function TunnelServer(fOnBindRequest) {
   this._proxyMap = {};
   this._lastUsedId = 0;
   thos._fOnBindRequest = fOnBindRequest;
}

TunnelServer.prototype.listen = function(port, onConnect) {
   this._setupTunnel();
   server.on('error', function(err) {
      logger.error('on error', err);
   });
   //server.on('connection', function(socket){
   //   logger.info('on connection. ');
   //});
   server.listen(port, onConnect);
};

TunnelServer.prototype.close = function() {
   server.close();
}

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
      self._processConnection(socket);
   });
};

TunnelServer.prototype._processConnection = function(tunnelSocket) {
   var self = this;

   var proxyMap = {};
   var tunConn = new TunnelConnectionServer(tunnelSocket, this);

   tunConn.on('bind', function(bindPayload) {
      //bindPayload.address
      //bindPayload.port

      var proxyInfo = bindPayload;
      var clientSocket = net.connect({host: address, port: port}, () => {
         // 'connect' listener
         //console.log('connected to server!');
         logger.debug('connected');
         proxyInfo.socket = clientSocket;
         var id = self._generateUniqueId();
         proxyMap[id] = proxyInfo;

         // reply to tunnel
         tunConn.bindReply(id, {status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: bindPayload.reqId});

         clientSocket.on('data', function(chunk) {
            tunConn.send(id, chunk);
         });

         clientSocket.on('end', function() {
            tunConn.unbind(id);
            delete proxyMap[id];
         });
      });
      clientSocket.on('error', function(err) {
         logger.debug('error. failed to connect');
         tunConn.bindReply(id, {status: tunnel.TUNNEL_REPLY.FAIL, reqId: bindPayload.reqId });
      });
   });

   tunConn.on('unbind', function(id) {
      if (proxyMap[id]) {
         var socket = proxyMap[id].socket;
         socket.end();

         delete proxyMap[id];
      }
   });

   tunConn.on('send', function(id, sendPayload) {
      if (proxyMap[id]) {
         var socket = proxyMap[id].socket;
         if (socket) {
            socket.write(sendPayload);
         }
      }
   });

};

TunnelServer.prototype._connectTarget = function(address, port, fSucceed, fFail, fData, fEnd) {
   
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
