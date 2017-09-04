var util = require('util');
var tunnel = require('../common/tunnel');

function AbstractTunnelClient() {
   this._proxyMap = {};
   this._bindRequestMap = {};
}

AbstractTunnelClient.prototype.connect = function(url, options, fOnConnect) {
   throw "Not implemented";
};

