// listen port for application
// socks5 shakehand and authentic
// generate proxy info
//   generate id
//   target address and port
// register on the remote side (action = bind)
// connection ok

// on data: wrap and tunnel it (action = send)

// disconnect and unregister
// on disconnect: action = unbind


// recv tunnel command: 
// 2. unbind
// 3. send data
var net = require('net');
var socks5 = require('./socks5.js');
var io = require('socket.io-client');
var log4js = require('log4js');
var tunnel = require('../common/tunnel');
var TunnelClient = require('./tunnelClient');
var TunnelConnection = require('./tunnelConnectionClient');

var HOST='127.0.0.1';
var PORT='45030';
var url = 'http://localhost:8082/';



function createSocks5Server(tunnelClient) {
   var server = socks5.createServer(function(socket, port, address, proxy_ready) {
      var fOnBind = function(tunId) {
         proxy_ready();

         // read data socket
         socket.on('data', function(chunk) {
            tunnelClient.send(tunId, chunk);
         });

         socket.on('end', function() {
            tunnelClient.unbind(tunId);
         });
      };
      var fOnBindFail = function() {
         socket.end();
      };
      var fOnSend = function(chunk) {
         socket.write(chunk);
      };
      var fOnUnbind = function() {
         socket.end();
      };
      tunnelClient.bind(address, port, fOnBind, fOnBindFail, fOnSend, fOnUnbind);
   });

   server.on('error', function (e) {
      console.error('SERVER ERROR: %j', e);
      if (e.code == 'EADDRINUSE') {
         console.log('Address in use, retrying in 10 seconds...');
         // setTimeout(function () {
         //     console.log('Reconnecting to %s:%s', HOST, PORT);
         //     server.close();
         //     server.listen(PORT, HOST);
         // }, 10000);
      }
   });
   server.listen(PORT, HOST);
}


var logger = log4js.getLogger();
logger.level = 'debug';

var tunnelClient = new TunnelClient();
tunnelClient.connect(url, {reconnection: false}, function() {
   logger.info('proxy server listening on ' + PORT);
   createSocks5Server(tunnelClient);
});


