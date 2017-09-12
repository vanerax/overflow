var util = require('util');
var net = require('net');
var EventEmitter = require('events');
var tunnel = require('../common/tunnel');

var CHANNEL_DATA_EVENT = 'data';
// Once recv bind command, it'll generate a new channel
// Channel does independent of Connection therefore it still lives even if connection is disconnected.
class TunnelChannel extends EventEmitter {
   constructor() {
      super();
      this._isInit = false;
      this._id = 0;
   }

   isInitialized() {
      return this._isInit;
   }

   // fOnSuccess(fSetChannelId) Provide caller a chance to generate channel id
   connect(bindPlayload, fOnSuccess, fOnFail) {
      var self = this;
      if (this.isInitialized()) {
         throw "already initialized";
      }

      var clientSocket = net.connect({host: bindPlayload.address, port: bindPlayload.port}, () => {
         // 'connect' listener
         // console.log('connected to server!');
         var setChannelId = function(id) {
            self._id = id;
            self._socket = clientSocket;
            self._isInit = true;
            self._subscribeEvents();
            self._onBindReply({status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: bindPlayload.reqId });
         };
         fOnSuccess(setChannelId);
      });

      clientSocket.on('error', function(err) {
         //logger.debug('error. failed to connect');
         fOnFail();
         self._onBindReply({status: tunnel.TUNNEL_REPLY.FAIL, reqId: bindPlayload.reqId });
      });
   }

   send(data) {
      if (!this.isInitialized()) {
         throw "not initialized";
      }
      this._socket.write(data);
   }

   unbind() {
      if (!this.isInitialized()) {
         throw "not initialized";
      }
      this._socket.end();
   }

   _onBindReply(replyPayload) {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND_REPLY, replyPayload);
   }

   _sendTunnelCommand(cmd, payload) {
      this.emit(CHANNEL_DATA_EVENT, cmd, this._id, payload);
   }

   _subscribeEvents() {
      // socket event
      this._socket.on('data', (chunk) => {
         this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, chunk);
      });

      this._socket.on('end', () => {
         this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, {});
      });
   }

}

TunnelChannel.CHANNEL_DATA_EVENT = CHANNEL_DATA_EVENT;

module.exports = TunnelChannel;