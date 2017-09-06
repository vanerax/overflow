var EventEmitter = require('events');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var SocketIOTunnelServer = require('./socketIOTunnelServer');

class App extends EventEmitter {
   constructor() {
      super();
      if (this instanceof App) {
         throw "Operation not allowed";
      }
   }

   _startServer() {
      var tunnelServer = new SocketIOTunnelServer(conn => {
         conn.on('data', (data) => {
            this.emit('data', data);
         });
      });

      tunnelServer.listen(port, function(){
         console.log('listening on *:' + port);
      });
   }

   _stopServer() {
      tunnelServer.close();
   }
}

App.getInstance = function() {
   if (!app) {
      app = new App();
   }
   return app;
}

var app;
var port = 8082;

module.exports = App;