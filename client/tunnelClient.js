var io = require('socket.io-client');
var log4js = require('log4js');
var tunnel = require('../common/tunnel');
var TunnelConnectionClient = require('./tunnelConnectionClient');
var overflowUtils = require('../common/overflowUtils');

var logger = log4js.getLogger();
logger.level = 'debug';


function TunnelClient(url, options) {

}

TunnelClient.prototype.connect = function(url, options, fOnConnect) {
   var self = this;
   var socket = io(url, options);
   this.tunnelSocket = socket;
   logger.info('connect to ' + url);

   socket.on('disconnect', function(){
      logger.info('on disconnect');
      //socket.close();
   });

   socket.on('error', function(err){
      logger.error('on error', err);
   });

   socket.on('connect_error', function(){
      logger.error('on connect error');
   });

   socket.on('connect', function() {
      logger.info('connected');
      self._processConnection(socket);
      //var tunConn = new TunnelConnection(socket);
      //this.tunnelConnection = tunConn;
      //tunConn.start();
      if (typeof fOnConnect === 'function') {
         fOnConnect();
      }
   });
};

TunnelClient.prototype._processConnection = function(tunnelSocket) {
   var self = this;
   var bindRequestMap = this._bindRequestMap = {};
   var proxyMap = {};
   var tunConn = new TunnelConnectionClient(tunnelSocket);
   this.tunConn = tunConn;
   tunConn.on('bindreply', function(id, replyPayload) {
      if (replyPayload.reqId && bindRequestMap[replyPayload.reqId]) {
         if (replyPayload.status === tunnel.TUNNEL_REPLY.SUCCESS) {
            proxyMap[id] = bindRequestMap[replyPayload.reqId];
            delete bindRequestMap[replyPayload.reqId];

            if (typeof proxyMap[id].fOnSucceed == 'function') {
               proxyMap[id].fOnBind(id);
            }
         } else {
            // close socket? or return sock5 error?
            //var socket = bindRequestMap[replyPayload.reqId].socket; 
            //if (socket) {
            //   socket.close();
            //}
            if (typeof proxyMap[id].fOnFail == 'function') {
               proxyMap[id].fOnBindFail();
            }
         }
      }
   });

   tunConn.on('unbind', function(id) {
      if (proxyMap[id]) {
         if (typeof proxyMap[id].fOnUnbind == 'function') {
            proxyMap[id].fOnUnbind();
         }

         delete proxyMap[id];
      }
   });

   tunConn.on('send', function(id, payload) {
      if (proxyMap[id]) {
         if (typeof proxyMap[id].fOnSend == 'function') {
            proxyMap[id].fOnSend();
         }
      }
   });
};

// generate req id for binding process so that reply message can be mapped to the correct socket
//    var reqId = this._generateUUID();
//    logger.debug('generated req id = ' + reqId);
//    logger.debug('target address = ' + bindPayload.address + ' , port = ' + bindPayload.port);
//    bindPayload.reqId = reqId;
//    this._bindRequestMap[reqId] = bindPayload;

TunnelClient.prototype.bind = function(address, port, fOnBind, fOnBindFail, fOnSend, fOnUnbind) {
   var reqId = overflowUtils.generateUniqueId();
   //logger.debug('generated req id = ' + reqId);
   //logger.debug('target address = ' + bindPayload.address + ' , port = ' + bindPayload.port);
   var bindPayload = {
      address: address, 
      port: port, 
      reqId: reqId
   };
   this._bindRequestMap[reqId] = {
      address: address, 
      port: port, 
      reqId: reqId, 
      fOnBind: fOnBind, 
      fOnBindFail: fOnBindFail,
      fOnSend: fOnSend,
      fOnUnbind: fOnUnbind
   };

   this.tunConn.bind(bindPayload);
};

TunnelClient.prototype.send = function(id, payload) {
   this.tunConn.send(id, bindPayload);
};

TunnelClient.prototype.unbind = function(id) {
   this.tunConn.unbind(id);
};

module.exports = TunnelClient;
