var net = require('net');
var assert = require('assert');
var Socks5Client = require('../common/socks5client');
var Socks5Server = require('../common/socks5server');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var proxyAddress = 'localhost';
var proxyPort = 45031;
// target server
var address = '127.0.0.1';
var port = 45032;

var testStr = "test1_" + Math.random();
var testStr2 = "test2_" + Math.random();

var server = Socks5Server.createServer(function(socket, port, address, proxy_ready) {
   proxy_ready();
   socket.on('data', function(chunk){
      console.log("server recv: ", chunk.toString());
      assert.equal(testStr, chunk.toString());
      
      // reply
      console.log("server send: ", testStr2);
      socket.write(testStr2);
   });
   socket.on('end', function(){
      server.close();
   });
}, null);
server.listen(proxyPort, proxyAddress);

var client = new Socks5Client();
var clientSocket = client.connect(proxyAddress, proxyPort, address, port, function(socket) {
   assert.equal(clientSocket, socket);
   console.log("client send: ", testStr);
   socket.write(testStr);
   //socket.end();

   socket.on('data', function(chunk) {
      console.log("client recv: ", chunk.toString());
      assert.equal(testStr2, chunk.toString());
      socket.end();
   });
});
