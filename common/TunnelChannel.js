var util = require('util');
var EventEmitter = require('events');
var tunnel = require('./tunnel');
var TunnelCommandService = require('./TunnelCommandService');


// Once recv bind command, it'll generate a new channel
// Channel does independent of Connection therefore it still lives even if connection is disconnected.
class TunnelChannel {
   constructor(id, socket) {
      this._id = id;
      this._socket = socket;
      this._eventEmitter = new EventEmitter();
      this._recvCommand();
      this._processCommand();
      this._subscribeEvents();
   }
   
   send(payload) {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, payload);
   }

   bindReply(payload) {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND_REPLY, {});
   }

   unbind() {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, {});
   }

   onSend(payload) {
      
   }

   write(data) {
      this._socket.write(data);
   }

   _sendTunnelCommand(cmd, payload) {
      
   }

   _recvCommand() {
      TunnelCommandService.in.subscribeEx(this._id, function(msg) {
         switch(msg.command) {
         //case tunnel.TUNNEL_COMMAND.BIND_REQUEST:
            //this._onBind(oData.payload);
            //break;

         case tunnel.TUNNEL_COMMAND.BIND_REPLY:
            this.emit('bindreply', msg.payload);
            //TunnelCommandService.in.(TUNNEL_COMMAND_SERVICE_EVENT, cmd, this._id, payload);
            break;

         case tunnel.TUNNEL_COMMAND.UNBIND:
            //this._onUnbind(id, oData.payload);
            this.emit('unbind');
            break;

         case tunnel.TUNNEL_COMMAND.SEND:
            //this._onSend(id, oData.payload);
            this.emit('send', msg.payload);
            break;
         }
      });

      _subscribeEvents() {
         this._socket.on('data', (chunk) => {
            this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, payload);
         });
      }
   }

   _processCommand() {
      this.on('bindreply', (replyPayload) => {
         //this.
      });

      this.on('send', (sendPayload) => {
         
      });
   }
}

module.exports = TunnelChannel;