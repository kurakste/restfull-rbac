import winston from 'winston';

//const ctime = () => (new Date()).toLocaleString();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'amazon-api' },
  transports: [
    new winston.transports.File({ filename: './logs/amazon_api.log', level: 'info' }),
    //new winston.transports.Console({ level: 'info' }),
  ]
});


const debugMessageLogger =
  (
    module: string,
    info?: Array<string> | string | object,
    err: Error | null = null
  ) => {
    let msg = (Array.isArray(info)) ? info.join(',') : info;
    let errmsg = err ? err.message : null;
    let lev = (!err) ? 'info' : 'error';
    logger.log({
      level: lev,
      message: `from module ${module} | ${msg} | Error: ${errmsg} `
    });
  }

export default debugMessageLogger;