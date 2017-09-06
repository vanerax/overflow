var net = require('net');
var assert = require('assert');
var SocketIOTunnelServer = require('../server/socketIOTunnelServer');
var SocketIOTunnelClient = require('../client/socketIOTunnelClient');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var url = 'http://localhost:45033';
var port = 45033;
var options = { reconnection: false };
var testStr1 = 'test123';
var testStr2 = {value: 'test456'};

describe('Tunnel server', function() {
   it('should receive data from client', function(done) {
      var server = new SocketIOTunnelServer((conn) => {
         conn.on('data', (data) => {
            logger.info('server receive: ', data);
            assert.equal(data, testStr1);

            logger.info('server send: ', testStr2);
            conn.write(testStr2);
         });

         conn.on('end', () => {
            logger.info('server on disconnect');
            server.close();

            assert.equal(false, conn.isActive());
            done(); // test done
         });
      });
      server.listen(port);
      logger.info('server listen on :45033');

      var client = new SocketIOTunnelClient();
      var clientConn = client.connect(url, options, () => {
         logger.info('client connected to server');

         logger.info('client send: ', testStr1);
         clientConn.write(testStr1);

         //clientConn.end();
      });
      clientConn.on('data', (data) => {
         logger.info('client recv: ', data);
         assert.equal(data.value, testStr2.value);

         assert.equal(clientConn.isActive(), true);
         logger.info('client try to disconnect');
         clientConn.end();
         
      });
      clientConn.on('end', () => {
         logger.info('client on disconnect');
         assert.equal(false, clientConn.isActive());
      });
   });
});
