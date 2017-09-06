var EventEmitter = require('events');
var util = require('util');

class AbstractTunnelConnection extends EventEmitter {
   constructor() {
      super();
   }

   write(data) {
         throw "Not implemented";
   }

   end() {
         throw "Not implemented";
   }
}

module.exports = AbstractTunnelConnection;