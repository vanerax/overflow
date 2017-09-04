var tunnel = require('../common/tunnel');


function AbstractTunnelServer() {
   //this._tunnelMap = {};

   // last used id
   this._lastUsedId = 0;

   // id to proxyInfo including target server socket, address, port
   this._proxyMap = {};

   this._init();
}

AbstractTunnelServer.prototype.listen = function(port) {
   throw "Not implemented";
};

AbstractTunnelServer.prototype.close = function() {
   throw "Not implemented";
};

AbstractTunnelServer.prototype.send = function(id, sendPayload) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.SEND, id, sendPayload);
};

AbstractTunnelServer.prototype.bindReply = function(id, replyPayload) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.BIND_REPLY, id, replyPayload);
};

AbstractTunnelServer.prototype.unbind = function(id) {
   this._sendTunnelCommand(tunnel.TUNNEL_COMMAND.UNBIND, id, {});
};

AbstractTunnelServer.prototype._init = function() {

};

AbstractTunnelServer.prototype._setupTunnel = function() {
   throw "Not implemented";
};

AbstractTunnelServer.prototype._recvTunnelCommand = function(data) {
   // parse data
   var oData = data;
   var id = oData.id;
   switch(oData.command) {
      case tunnel.TUNNEL_COMMAND.BIND_REQUEST:
         this.emit('bind');
         this._onBind(oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.BIND_REPLY:
         this.emit('bindreply');
         break;

      case tunnel.TUNNEL_COMMAND.UNBIND:
         //this._onUnbind(id, oData.payload);
         this.emit('unbind');
         break;

      case tunnel.TUNNEL_COMMAND.SEND:
         //this._onSend(id, oData.payload);
         this.emit('send');
         break;

      default:
         break;
   }
};

AbstractTunnelServer.prototype._sendTunnelCommand = function(cmd, id, payload) {
   throw "Not implemented";
};


AbstractTunnelServer.prototype._onBind = function(bindPayload) {
   //var socket = this._getOutTunnelSocket();
   var proxyInfo = bindPayload;
   
   this._connectTargetServer(proxyInfo.address, proxyInfo.port, bindPayload);
};

AbstractTunnelServer.prototype._connectTargetServer = function(address, port, bindPayload) {
   // call _onTargetServerConnectSuccess()
};

AbstractTunnelServer.prototype._onTargetServerConnectSuccess = function(socket, bindPayload) {
   var id = this._generateUniqueId();
   this._proxyMap[id] = bindPayload;
   this._proxyMap[id].socket = socket;
   this.bindReply(id, {status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: bindPayload.reqId});
};

AbstractTunnelServer.prototype._onTargetServerConnectFail = function(bindPayload) {
   this.bindReply(0, {status: tunnel.TUNNEL_REPLY.FAIL, reqId: bindPayload.reqId});
};

AbstractTunnelServer.prototype._generateUniqueId = function() {
   return ++this._lastUsedId;
};

module.exports = AbstractTunnelServer;