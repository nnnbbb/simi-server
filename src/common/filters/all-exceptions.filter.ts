import { ArgumentsHost, Catch, HttpException, HttpServer, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import winston from 'winston';
import { LoggerService } from '../providers/logger.service';

// 捕获全部异常 记录到日志中
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  logger: winston.Logger
  constructor(
    private readonly loggerService: LoggerService,
  ) {
    super()
    this.logger = this.loggerService.get("error");
  }

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error("error", exception);
    super.catch(exception, host);
  }

  handleUnknownError(exception: any, host: ArgumentsHost, applicationRef: AbstractHttpAdapter | HttpServer) {
    const message = `${exception.message}`
    exception = new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    // this.logger.error("error", exception);
    super.catch(exception, host);
  }
}