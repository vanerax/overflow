var tunnel = require('./tunnel');
var TunnelCommandService = require('./TunnelCommandService');

// Once recv bind command, it'll generate a new channel
// Channel does independent of Connection therefore it still lives even if connection is disconnected.
class TunnelChannel {
   constructor(id) {
      this._id = id;   
   }
   
   send(payload) {
      _sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, payload)
   }

   bindReply(payload) {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND_REPLY, {});
   }

   unbind() {
      this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, {});
   }

   onSend(payload) {
      
   }

   _sendTunnelCommand(cmd, payload) {
      TunnelCommandService.getInstance().publishOutCommand(TUNNEL_COMMAND_SERVICE_EVENT, cmd, this._id, payload);
   }
}

module.exports = TunnelChannel;