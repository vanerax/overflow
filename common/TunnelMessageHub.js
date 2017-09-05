var util = require('util');
var net = require('net');
var EventEmitter = require('events');
var log4js = require('log4js');
var logger = log4js.getLogger();
var tunnel = require('./tunnel');
var TunnelChannel = require('./TunnelChannel');

var TUNNEL_MESSAGE_HUB_EVENT = 'tunnel.message.hub';

// interpret message and dispatch
// handle bind command and create TunnelChannel
class TunnelMessageHub {
   constructor() {
      this._lastUsedId = 0;
      this._eventEmitter = new EventEmitter();
      this._channelMap = {};
   }

   write(msg) {
      //this._eventEmitter.emit(TUNNEL_COMMAND_SERVICE_EVENT, msg);
      var channelId = msg.id;
      switch(msg.command) {
         case tunnel.TUNNEL_COMMAND.BIND_REQUEST:
            this._onBind(msg.payload);
            break;

         case tunnel.TUNNEL_COMMAND.BIND_REPLY:
            break;

         case tunnel.TUNNEL_COMMAND.UNBIND:
            //this._onUnbind(id, oData.payload);
            this.emit('unbind');
            break;

         case tunnel.TUNNEL_COMMAND.SEND:
            //this._onSend(id, oData.payload);
            var tunnelChannel = this._channelMap[channelId];
            tunnelChannel.write(msg.payload)
            break;

         default:
            break;
      }
   }

   onRecv(fHandler) {
      this._eventEmitter.on(TUNNEL_COMMAND_SERVICE_EVENT, fHandler);
   }

   _emit(cmd, channelId, payload) {
      var oMsg = {
         command: cmd,
         id: channelId,
         payload: payload
      };
      this._eventEmitter.emit(TUNNEL_COMMAND_SERVICE_EVENT, oMsg);
   }

   _onBind(bindPayload) {
      var proxyInfo = bindPayload;
      var clientSocket = net.connect({host: proxyInfo.address, port: proxyInfo.port}, () => {
         // 'connect' listener
         // console.log('connected to server!');
         var channelId = this._generateUniqueId();
         var tunnelChannel = new TunnelChannel(channelId, clientSocket);
         this._channelMap[channelId] = tunnelChannel;


         this._bindReply(channelId, {status: tunnel.TUNNEL_REPLY.SUCCESS, reqId: proxyInfo.reqId});
      });

      clientSocket.on('error', function(err) {
         logger.debug('error. failed to connect');
         self._bindReply(0, {status: tunnel.TUNNEL_REPLY.FAIL, reqId: proxyInfo.reqId });
      });
   }

   _bindReply(channelId, replyPayload) {
      this._emit(tunnel.TUNNEL_COMMAND.BIND_REPLY, channelId, replyPayload);
   }

   _generateUniqueId() {
      return ++this._lastUsedId;
   }

}

// function composeEventName(channelId) {
//    return util.format("%s.channelId.%d", TUNNEL_COMMAND_SERVICE_EVENT, channelId);
// }

// TunnelCommandService.getInstance = function(type) {
//    if (type === 'in') {
//       if (!_inInstance) {
//          _inInstance = new TunnelCommandService();
//       }
//       return _inInstance;
//    } else if (type === 'out') {
//       if (!_outInstance) {
//          _outInstance = new TunnelCommandService();
//       }
//       return _outInstance;
//    }
//    throw "incorrect parameter";
// }

//TunnelCommandService.out = TunnelCommandService.getInstance('out');
//TunnelCommandService.in = TunnelCommandService.getInstance('in');

module.exports = TunnelMessageHub;