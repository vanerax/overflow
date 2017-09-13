var net = require('net');
var assert = require('assert');
var SocketIOTunnelServer = require('../server/socketIOTunnelServer');
var SocketIOTunnelClient = require('../client/socketIOTunnelClient');
var TunnelCommandController = require('../server/tunnelCommandController');
var tunnel = require('../common/tunnel');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var url = 'http://localhost:45033';
var port = 45033;
var options = { reconnection: false };
var testStr1 = 'test123';
var testStr2 = {value: 'test456'};

// describe('Tunnel server', function() {
//    it('should receive data from client', function(done) {
//       var server = new SocketIOTunnelServer((conn) => {
//          conn.on('data', (data) => {
//             logger.info('server receive: ', data);
//             assert.equal(data, testStr1);

//             logger.info('server send: ', testStr2);
//             conn.write(testStr2);
//          });

//          conn.on('end', () => {
//             logger.info('server on disconnect');
//             server.close();

//             assert.equal(false, conn.isActive());
//             done(); // test done
//          });
//       });
//       server.listen(port);
//       logger.info('server listen on :45033');

//       var client = new SocketIOTunnelClient();
//       var clientConn = client.connect(url, options, () => {
//          logger.info('client connected to server');

//          logger.info('client send: ', testStr1);
//          clientConn.write(testStr1);

//          //clientConn.end();
//       });
//       clientConn.on('data', (data) => {
//          logger.info('client recv: ', data);
//          assert.equal(data.value, testStr2.value);

//          assert.equal(clientConn.isActive(), true);
//          logger.info('client try to disconnect');
//          clientConn.end();
         
//       });
//       clientConn.on('end', () => {
//          logger.info('client on disconnect');
//          assert.equal(false, clientConn.isActive());
//       });
//    });
// });

describe('Tunnel Command Controller', function() {
   it('should handle command', function(done) {
      var testStr1 = 'test123';
      var testStr2 = 'test456';
      var bindPayload = {
         address: 'localhost',
         port: 45034,
         reqId: 9999
      };
      var bindCommand = {
         command: tunnel.TUNNEL_COMMAND.BIND,
         id: 0,
         payload: bindPayload
      };
      var sendCommand = {
         command: tunnel.TUNNEL_COMMAND.SEND,
         id: 1,
         payload: testStr1
      };
      var unbindCommand = {
         command: tunnel.TUNNEL_COMMAND.UNBIND,
         id: 1,
         payload: {}
      };

      var server = net.createServer((socket)=> {
         socket.on('data', (chunk)=>{
            logger.info('server recv: ' + chunk);
            assert.equal(testStr1, chunk.toString());

            logger.info('server send: ' + testStr2);
            socket.write(testStr2);
         });

         socket.on('end', () => {
            logger.info('server recv end');
            logger.info('server closed');
            server.close();
            done();
         });
      });
      server.listen(bindPayload.port);

      var response = {
         _index: 0,
         write: function(data) {
            logger.info('tunnel recv: ', data);
            if (this._index == 0) {
               assert.equal(tunnel.TUNNEL_COMMAND.BIND_REPLY, data.command);
               assert.equal(tunnel.TUNNEL_REPLY.SUCCESS, data.payload.status);
               assert.equal(bindPayload.reqId, data.payload.reqId);
               //console.log('>>1 channel id ', data);
               logger.info('tunnel send: ', sendCommand);
               controller.onCommand(sendCommand);

            } else if (this._index == 1) {

               assert.equal(tunnel.TUNNEL_COMMAND.SEND, data.command);
               assert.equal(testStr2, data.payload.toString());

               logger.info('tunnel unbind: ', sendCommand);
               controller.onCommand(unbindCommand);
            }
            this._index++;
         }
      };
      var controller = new TunnelCommandController(response);
      logger.info('generate a bind command: ', bindCommand);
      controller.onCommand(bindCommand);

   });
});