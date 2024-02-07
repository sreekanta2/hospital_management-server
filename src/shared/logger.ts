import path from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, label, printf, prettyPrint } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${date.toDateString()}  hour:${hour}  minute:${minute}  second:${second} [${label}] ${level}: ${message}`;
});

const infoLogger = createLogger({
  level: "info",
  format: combine(
    label({ label: "right meow!" }),
    timestamp(),
    prettyPrint(),
    myFormat
  ),

  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "success",
        "success-%DATE%.log"
      ),
      level: "info",
    }),
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(
    label({ label: "right meow!" }),
    timestamp(),
    prettyPrint(),
    myFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "error",
        "error-%DATE%.log"
      ),
      level: "error",
    }),
  ],
});

export { errorLogger, infoLogger };
