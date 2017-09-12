var EventEmitter = require('events');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var SocketIOTunnelServer = require('./socketIOTunnelServer');
var TunnelCommandController = require('./tunnelCommandController');
var CONNECTION_DATA_EVENT = 'data';
var CONNECTION_END_EVENT = 'end';

class AppImpl {
   constructor() {
      // if (this instanceof App) {
      //    throw "Operation not allowed";
      // }
      this._conn;
      this._connMap = {}; // controller, connection
      this._controller = null;
   }

   exit() {
      _stopServer();
   }

   _startServer() {
      var self = this;
      var tunnelServer = new SocketIOTunnelServer(conn => {
         if (this._conn) {
            conn.end();
            return;
         }

         this._conn = conn;
         if (this._connMap[conn.id]) {
            // already exist. 

         } else {
            // new connection
            var response = { // when reconnected, make sure using the latest connection
               _buffers: [],
               write: function(data) {
                  // get active connnection and write data
                  if (_conn) {
                     while (this._buffers.length > 0) {
                        var oData = this._buffers.splice(0, 1);
                        _conn.write(oData);
                     }
                     _conn.write(data);
                  } else {
                     _buffers.push(data);
                  }
               }
            };
            var controller = this._controller = new TunnelCommandController(response);
         }
         
         conn.on('data', (data) => {
            self._controller.onCommand(data);
         });

         conn.on('end', ()=>{
            this._conn = null;
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

var App = {
   getInstance: function() {
      if (!app) {
         app = new AppImpl();
      }
      return app;
   },
   CONNECTION_DATA_EVENT: CONNECTION_DATA_EVENT,
   CONNECTION_END_EVENT: CONNECTION_END_EVENT
};

var app;
var port = 8082;

module.exports = App;