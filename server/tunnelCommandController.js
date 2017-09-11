var EventEmitter = require('events');
var tunnel = require('../common/tunnel');
var TunnelChannel = require('./TunnelChannel');
var App = require('./app');
var app = App.getInstance();

class TunnelCommandController extends EventEmitter {
   constructor(response) {
      this._lastUsedId = 0;
      this._channelMap = {};
      this._response = response;

      this._subscribeEvents();
   }

   run() {

   }

   onCommand(data) {
      var oData = data;
      var id = oData.id;
      switch(oData.command) {
         case tunnel.TUNNEL_COMMAND.BIND:
            this._onBind(oData.payload);
            break;

         case tunnel.TUNNEL_COMMAND.UNBIND:
            this._onUnbind(id, oData.payload);
            break;

         case tunnel.TUNNEL_COMMAND.SEND:
            this._onSend(id, oData.payload);
            break;

         //case tunnel.TUNNEL_COMMAND.BIND_REPLY:
         default:
            break;
      }
   }

   getResponse() {
      return this._response;
   }

   _subscribeEvents() {
      var self = this;

   }

   _onBind(bindPayload) {
      var channel = new TunnelChannel();
      channel.connect(bindPayload, (fSetChannelId) => {
         // success
         var id = _generateUniqueId();
         fSetChannelId(id);

         channel.on(TunnelChannel.CHANNEL_DATA_EVENT, (cmd, channelId, payload) => {
            // send to tunnel
            var data = {
               command: cmd, 
               id: channelId, 
               payload: payload
            };
            this._response.write(data);
         });
         this._channelMap[id] = channel;

      }, () => {
         // failed
      });
   }

   _onUnbind(id) {
      if (this._channelMap[id]) {
         this._channelMap[id].unbind();
         delete this._channelMap[id];
      }
   }

   _onSend(id, payload) {
      if (this._channelMap[id]) {
         this._channelMap[id].send(payload);
      }
   }

   _generateUniqueId() {
      return ++this._lastUsedId;
   }

}