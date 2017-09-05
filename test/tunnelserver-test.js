var net = require('net');
var assert = require('assert');
var SocketIOTunnerServer = require('../server/SocketIOTunnerServer');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var server = new SocketIOTunnerServer((conn) => {
   conn.on('data', chunk => {

   });

   conn.write
});

server.listen(45033);