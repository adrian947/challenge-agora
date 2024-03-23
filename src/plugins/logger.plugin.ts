import winston from 'winston';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    info: 3,
    data: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    info: 'green',
    data: 'magenta',
    verbose: 'cyan',
    silly: 'grey',
    custom: 'yellow',
  },
};
winston.addColors(config.colors);
const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `[ ${info.level} ] ▶ ${info.message} 
[ ${info.level} ]`),  
);

const logger = winston.createLogger({
  levels: config.levels,
  format: format,
  level: 'custom',
  transports: [
    
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console());
  }

export const buildLogger = (service: string) => {
    const logFunctions: any = {};
    for (const level in config.levels) {
        logFunctions[level] = (message: string) => {
            (logger as any)[level](`
            [ MESSAGE ]: ${message} 
            [ SERVICE ]: ${service} 
            [ LOGDATE ]: ${new Date().toISOString()}`
            );
        };
    }
    return logFunctions;
};
  

