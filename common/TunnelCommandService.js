var EventEmitter = require('events');

var _instance;
class TunnelCommandService {
   constructor() {
      this._outEventEmitter = new EventEmitter();
      this._inEventEmitter = new EventEmitter();
   }

   publishOutCommand(cmd, data) {
      this._outEventEmitter.emit(cmd, data);
   }

   subscribeOutCommand(cmd, fHandler) {
      this._outEventEmitter.on(cmd, fHandler);
   }

   publishInCommand(cmd, data) {
      this._inEventEmitter.emit(cmd, data);
   }

   subscribeInCommand(cmd, fHandler) {
      this._inEventEmitter.on(cmd, fHandler);
   }
}

TunnelCommandService.getInstance = function() {
   if (!_instance) {
      _instance = new TunnelCommandService();
   }
   return _instance;
}

module.exports = TunnelCommandService;