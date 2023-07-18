import { CallHandler, ExecutionContext, HttpException, Injectable, InternalServerErrorException, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseFormat } from 'src/common/interfaces/http-response.interface';
import log from '../../utils/log';
import { ResponseCode } from '../constants/response-code.constants';
import { LoggerService } from '../providers/logger.service';

// 拦截器 处理响应格式
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private request: Request
  private response: Response
  constructor(
    private readonly loggerService: LoggerService,
  ) { }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat> {
    const http = context.switchToHttp()
    this.request = http.getRequest()
    this.response = http.getResponse()
    const path: string = this.request.originalUrl

    return next.handle().pipe(
      map(data => {
        if (!path.startsWith("/api/message/unread")) {
          this.logger()
        }
        return {
          ...ResponseCode.OK,
          data,
        }
      }),
      catchError((error) => {
        let r: any = error?.getResponse && error?.getResponse()
        const errorMessage = r?.message || error?.response || error?.message
        this.logger(errorMessage)
        // this.logger(context, r?.message || error?.response.msg)

        const parentClass = Object.getPrototypeOf(error.constructor)

        if (parentClass === HttpException) {
          throw new error.constructor(r)
        }
        const info = this.getRequestInfo()

        const message = `Exception: ${error.message}`
        /* eslint-disable  no-console */
        log('Error: ', error, info.req)
        throw new InternalServerErrorException(message)
      })
    )
  }

  logger(message?: string) {
    const time = Date.now()
    this.response.on('finish', () => {
      const info = this.getRequestInfo(message, time)
      this.loggerService.get("http").info(info)
    })

  }

  getRequestInfo(message?: string, time?: number) {
    const clientIp = this.request.headers['x-forwarded-for'] || this.request.socket.remoteAddress
    const duration = Date.now() - time
    const req = {
      method: this.request.method,
      path: this.request.originalUrl,
      clientIp,
      header: {
        "Content-Type": this.request.get('Content-Type'),
        "token": this.request.headers['token'],
      },
      query: this.request.query,
      body: this.request.body,
    }
    const res = {
      status: this.response.statusCode,
      statusMessage: this.response.statusMessage,
      message: message,
    }
    const info = {
      method: this.request.method,
      path: this.request.originalUrl,
      elapsedTime: `${duration}ms`,
      clientIp: clientIp,
      req: req,
      res: res,
    }
    return info
  }
}