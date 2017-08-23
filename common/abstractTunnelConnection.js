var EventEmitter = require('events');
var util = require('util');

function AbstractTunnelConnection(socket) {

}
util.inherits(AbstractTunnelConnection, EventEmitter);

module.exports = AbstractTunnelConnection;