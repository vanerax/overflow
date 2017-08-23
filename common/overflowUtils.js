function OverFlowUtils() {

}

OverFlowUtils.generateUniqueId = function() {
   return Math.floor(Math.random() * Math.pow(2, 32)).toString() + "_" + (new Date()).getTime().toString();
};

module.exports = OverFlowUtils;
