var net = require('net');
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger();
var OverFlowUtils = require('./OverFlowUtils');

var SOCKS_VERSION5 = 5;
/*
 * Authentication methods
 ************************
 * o  X'00' NO AUTHENTICATION REQUIRED
 * o  X'01' GSSAPI
 * o  X'02' USERNAME/PASSWORD
 * o  X'03' to X'7F' IANA ASSIGNED
 * o  X'80' to X'FE' RESERVED FOR PRIVATE METHODS
 * o  X'FF' NO ACCEPTABLE METHODS
 */
var AUTHENTICATION = {
   NOAUTH: 0x00,
   GSSAPI: 0x01,
   USERPASS: 0x02,
   NONE: 0xFF
};
/*
 * o  CMD
 *    o  CONNECT X'01'
 *    o  BIND X'02'
 *    o  UDP ASSOCIATE X'03'
 */
var REQUEST_CMD = {
   CONNECT: 0x01,
   BIND: 0x02,
   UDP_ASSOCIATE: 0x03
};
/*
 * o  ATYP   address type of following address
 *    o  IP V4 address: X'01'
 *    o  DOMAINNAME: X'03'
 *    o  IP V6 address: X'04'
 */
var ATYP = {
   IP_V4: 0x01,
   DNS: 0x03,
   IP_V6: 0x04
};

function Socks5Client() {

}

Socks5Client.prototype.connect = function(proxyAddress, proxyPort, address, port, fOnProxyReady) {
   this._address = address;
   this._port = port;
   this._proxyAddress = proxyAddress;
   this._proxyPort = proxyPort;
   this._fOnProxyReady = fOnProxyReady;

   var self = this;
   var clientSocket = net.connect({host: this._proxyAddress, port: this._proxyPort}, function() {
      self._shakeHands(clientSocket);
   });

   clientSocket.on('error', (err) => {
      logger.error(util.format("failed to connect address %s:%s", proxyAddress, proxyPort));
   });

   return clientSocket;
};

Socks5Client.prototype._shakeHands = function(socket) {
   var self = this;
   var buff = Buffer.from([SOCKS_VERSION5, 0x01, AUTHENTICATION.NOAUTH]);
   logger.debug("shakeHands: ", buff);
   socket.write(buff);
   socket.once('data', function(chunk) {
      if (chunk.length >= 2 && chunk[0] == 0x05 && chunk[1] == 0x00) {
         self._requestConnect(socket);
      } else {
         logger.error("unexpected shakehands response");
         socket.end();
      }
   });
};

Socks5Client.prototype._requestConnect = function(socket) {
   var self = this;
   var buffHead = Buffer.from([SOCKS_VERSION5, REQUEST_CMD.CONNECT, 0x00, ATYP.IP_V4]);
   var buffAddress = OverFlowUtils.IPv4StrToBuf(this._address);
   var buffPort = OverFlowUtils.portNumToBuf(this._port);
   var buff = Buffer.concat([buffHead, buffAddress, buffPort]);

   logger.debug("requestConnect: ", buff);
   socket.write(buff);
   socket.once('data', function(chunk){
      if (chunk.length >= 2 && chunk[0] == 0x05 && chunk[1] == 0x00) {
         self._fOnProxyReady(socket);
      } else {
         logger.error("unexpected requestConnect response");
         socket.end();
      }
   });
};

module.exports = Socks5Client;
