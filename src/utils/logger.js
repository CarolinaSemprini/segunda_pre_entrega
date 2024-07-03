//archivo logger.js
import winston, { createLogger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Definir los niveles de log
const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

// Asignar colores a los niveles
winston.addColors(logLevels.colors);

// Configuración del formato de log
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

// Crear un logger para desarrollo
const devLogger = winston.createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ],
});

// Crear un logger para producción
const prodLogger = createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new transports.Console({ level: 'info' }),
        new DailyRotateFile({
            filename: 'logs/errors-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            level: 'error',
            format: logFormat,
        }),
    ],
});


// Exportar el logger adecuado según el entorno
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;
