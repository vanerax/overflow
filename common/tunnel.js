var TUNNEL_COMMAND = {
   SEND: 1,
   BIND: 2,
   BIND_REPLY: 3,
   UNBIND: 4,
   REPLY: 5
};

var TUNNEL_REPLY = {
   SUCCESS: 1,
   FAIL: 2
};

// class TunnelData {
//   TUNNEL_COMMAND command,
//   UUID id,
//   AbstractPayload payload
//}

// class BindPayload : AbstractPayload {
//   address
//   port
//   timestamp
//}

// class SendPayload : AbstractPayload {
//   data
//}

// class UnindPayload : AbstractPayload {
//}

// class ReplyPayload : AbstractPayload {
//   status
//}

function Tunnel() {

}

Tunnel.bind = function(data, onComplete) {
   return {action: TUNNEL_COMMAND.BIND, data: data};
};



module.exports = {
   TUNNEL_COMMAND: TUNNEL_COMMAND,
   TUNNEL_REPLY: TUNNEL_REPLY
};