const TunnelServer = require('./TunnelServer');

var port = 3001;
var tunnelServer = new TunnelServer();
tunnelServer.listen(port, function(){
   console.log('listening on *:' + port);
});
