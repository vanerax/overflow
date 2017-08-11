var io = require('socket.io-client');
var tunnel = require('../common/tunnel');


var socket = io('http://localhost:3001/');
socket.on('connect', function() {
   
   var tunConn = new TunnelConnection(socket);
   tunConn.start();
   //socket.on('tunneldata', function (data) {
      //console.log(data);
   //   tunConn._recvTunnelCommand(data);
   //});
   //socket.emit('tunneldata', )
});

socket.on('disconnect', function(){
   socket.close();
});

function TunnelConnection(socket) {
   this._socket = socket;
   this._proxyMap = {};
}

TunnelConnection.prototype.start = function(data) {

};

TunnelConnection.prototype._recvTunnelCommand = function(data) {
   // parse data
   var oData = data;
   switch(oData.command) {
      case tunnel.TUNNEL_COMMAND.BIND:
         this._onBind(oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.UNBIND:
         this._onUnbind(oData.payload);
         break;

      case tunnel.TUNNEL_COMMAND.SEND:
         this._onSend(oData.payload);
         break;

      default:
         break;
   }
};

TunnelConnection.prototype._sendTunnelCommand = function(cmd, payload) {
   this._socket.emit('tunneldata', {
      command: cmd,
      payload: payload
   });
};


