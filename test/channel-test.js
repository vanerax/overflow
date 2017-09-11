var net = require('net');
var assert = require('assert');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var TunnelChannel = require('../server/TunnelChannel');

var testStr1 = 'test123';

var bindPayload = {
   address: 'localhost',
   port: 45034,
   reqId: 9999
};

net.createServer((socket)=> {
   socket.on('data', (chunk)=>{
      logger.info('server recv: ' + chunk);
      assert.equal(testStr1, chunk.toString());
   });
});

describe('TunnelChannel', function() {
   it('should connect to target successfully')
   var channel = new TunnelChannel();
   channel.connect(bindPayload, (fSetChannelId)=>{
      logger.info('tunnel channel: connect to server');
      fSetChannelId(100);

      channel.on(TunnelChannel.CHANNEL_DATA_EVENT, (cmd, channelId, payload) => {
         // send to tunnel
         var data = {
            command: cmd, 
            id: channelId, 
            payload: payload
         };
         this._response.write(data);
      });

      channel.send(testStr1);


   }, ()=>{

   });
});