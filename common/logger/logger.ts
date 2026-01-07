// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createLogger, format, transports } = require('winston');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');
transports.DailyRotateFile = require('winston-daily-rotate-file');

const customTransports = [new transports.Console()];
const dirName = config.log?.directory
  ? config.log.directory
  : '/usr/apps/iop/apps/logs';
const baseFileName = config.log?.baseFileName
  ? config.log.baseFileName
  : 'iop-pm-service';
const levels = config.log?.levels ? config.log.levels : ['debug'];

levels.forEach((level) => {
  customTransports.push(
    new transports.DailyRotateFile({
      filename: baseFileName + '-' + level + '-%DATE%.log',
      dirname: dirName,
      level: level,
      datePattern: 'YYYY-MM-DD', //Daily
      zippedArchive: true,
      maxsize: 104857600, //100 MB
      maxFiles: '14d',
    }),
  );
});

// Logger initialized
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: customTransports,
  exceptionHandlers: [new transports.Console()],
  exitOnError: false,
});

export default logger;
