const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
		logDirectory: 'C:/DLSU_OPPS',
        logFilePath:'mylogfile.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger(opts);

module.exports.logToFile = function(type, message){
    if(type == "Info")
        log.info(message)
    else
        log.error(message);
}