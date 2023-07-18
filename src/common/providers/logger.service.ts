import { Injectable } from '@nestjs/common';
import jsonStringify from 'fast-safe-stringify';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
const Package = require('../../../../package.json')
const { format } = winston;
const USER_HOME = process.env.HOME || process.env.USERPROFILE//用户目录

const src = process.env.NODE_ENV === 'production' ? path.join(USER_HOME, "logs", Package.name) : path.join("logs", Package.name)

export type LogKey = "http" | "info" | "error"

const logLikeFormat = {
  transform(info: any) {
    const { timestamp, label } = info
    const level = info[Symbol.for('level')]
    let { message } = info
    if (typeof message == 'object') {
      message = jsonStringify(message)
    }
    info[Symbol.for('message')] = `[${timestamp} ${label}] ${level}: ${message}`
    return info
  }
}

@Injectable()
export class LoggerService {
  private loggers: winston.Container | null = null;
  constructor(
  ) {
    this.loggers = this.init()
  }

  get(key: LogKey) {
    return this.loggers.get(key)
  }

  /**
   * @description: 初始化
   * @param {*}
   * @return {*}
   */
  init() {
    this.createLogger("http", format.combine(//创建HTTP日志记录器
      format.splat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.label({ label: 'http' }),
      logLikeFormat,
    ))
    this.createLogger("error", format.combine(//创建错误日志记录器
      format.errors({ stack: true }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.prettyPrint()
    ))
    return winston.loggers;
  }

  /**
   * @description: 创建记录器
   * @param {LogKey} name
   * @param {winston} format
   * @return {*}
   */
  createLogger(name: LogKey, format: winston.Logform.Format) {
    let loggers = winston.loggers.add(name, {
      transports: [this.getRotateTransport(name, format)]
    });
    // 输出到控制台
    this.addConsole(loggers, format)
  }

  /**
   * @description: 日志记录器轮转
   * @param {string} name
   * @param {winston} format
   * @return {*}
   */
  getRotateTransport(name: string, format: winston.Logform.Format) {
    return new winston.transports.DailyRotateFile({
      filename: `${name}-%DATE%.log`,
      dirname: src,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      // maxFiles: '14d',
      format,
    });
  }

  /**
   * @description: 控制台输出
   * @param {winston} loggers
   * @param {winston} format
   * @return {*}
   */
  addConsole(loggers: winston.Logger, format: winston.Logform.Format) {
    // 生成环境禁止输出到控制台
    if (process.env.NODE_ENV !== 'production') {
      loggers.add(new winston.transports.Console({
        format,
        level: "debug"
      }));
    }
  }
}