var log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'console'
        },
        allLog: {
            type: 'file',
            filename: './log/all.log',
            keepFileExt: true,
            maxLogSize: 10485760,
            backups: 3
        },
        httpLog: {
            type: "dateFile",
            filename: "./log/httpAccess.log",
            pattern: "yyyy-MM_dd",
            keepFileExt: true
        },
        errorLog: {
            type: 'file',
            filename: './log/error.log',
        },
        error: {
            type: "logLevelFilter",
            level: "error",
            appender: "errorLog"
        }
    },
    categories: {
        http: {
            appenders: ['out', 'httpLog'],
            level: "debug"
        },
        default: {
            appenders: ['out', 'allLog', 'error'],
            level: 'debug'
        },
    }
});

const logger = log4js.getLogger("default");

const httpLog = log4js.getLogger("http")
const httpLogger = log4js.connectLogger(httpLog, {
    level: 'WARN'
});

module.exports = {
    logger,
    httpLogger
};