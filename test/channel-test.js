var net = require('net');
var assert = require('assert');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var tunnel = require('../common/tunnel');
var TunnelChannel = require('../server/TunnelChannel');

var testStr1 = 'test123';
var testStr2 = 'test456';
var bindPayload = {
   address: 'localhost',
   port: 45034,
   reqId: 9999
};
var defaultChannelId = 100;


describe('TunnelChannel', function() {
   it('should connect to target successfully', function(done) {
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
         });
      });
      server.listen(bindPayload.port);

      var channel = new TunnelChannel();
      channel.connect(bindPayload, (fSetChannelId)=>{
         logger.info('tunnel channel: connect to server');
         fSetChannelId(defaultChannelId);

         channel.once(TunnelChannel.CHANNEL_DATA_EVENT, (cmd, channelId, payload) => {
            logger.info('channel recv and emit: ', cmd, channelId, payload.toString());
            assert.equal(tunnel.TUNNEL_COMMAND.SEND, cmd);
            assert.equal(defaultChannelId, channelId);
            assert.equal(testStr2, payload.toString());

            logger.info('channel try to unbind');
            channel.unbind();
            channel.once(TunnelChannel.CHANNEL_DATA_EVENT, (cmd, channelId, payload) => {
               logger.info('channel recv and emit: ', cmd, channelId, payload);
               done();
            });
         });
         logger.info('channel send: ' + testStr1);
         channel.send(testStr1);


      }, ()=>{

      });
   });

   it('should fail to connect to target', function(done) {
      var channel = new TunnelChannel();
      // try to connect but server not listened
      channel.connect(bindPayload, (fSetChannelId)=>{

      }, ()=>{
         logger.info('tunnel channel: failed to connect to server');
         channel.once(TunnelChannel.CHANNEL_DATA_EVENT, (cmd, channelId, payload) => {
            logger.info('channel recv and emit: ', cmd, channelId, payload);
            assert.equal(tunnel.TUNNEL_COMMAND.BIND_REPLY, cmd);
            assert.equal(0, channelId);
            assert.equal(tunnel.TUNNEL_REPLY.FAIL, payload.status);
            assert.equal(bindPayload.reqId, payload.reqId);
            done();
         });
      });
   });
});