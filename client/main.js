var TunnelClient = require('./tunnelClient');

var url = 'http://localhost:3001/';
var options = { reconnection: false };
var tunnelClient = new TunnelClient();
tunnelClient.connect(url, options);
logger.info('connect to ' + url);
