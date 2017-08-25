function OverFlowUtils() {

}

OverFlowUtils.generateUniqueId = function() {
   return Math.floor(Math.random() * Math.pow(2, 32)).toString() + "_" + (new Date()).getTime().toString();
};

OverFlowUtils.IPv4BufToStr = function (buf) {
   return util.format('%s.%s.%s.%s', buf[0], buf[1], buf[2], buf[3]);
};

OverFlowUtils.IPv4StrToBuf = function (str) {
   return Buffer.from(str.split('.').map(n => { return parseInt(n, 10) }));
};

OverFlowUtils.portBufToNum = function (bufPort) {
   return buffer.readUInt16BE(0);
};

OverFlowUtils.portNumToBuf = function (nPort) {
   var buffer = new Buffer(2);
   buffer.writeUInt16BE(nPort, 0);
   return buffer;
};

module.exports = OverFlowUtils;
