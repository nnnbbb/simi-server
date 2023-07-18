import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../providers/logger.service';

const resDotSendInterceptor = (res, send) => (content) => {
  res.contentBody = content;
  res.send = send;
  res.send(content);
};

// 记录每次http请求
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: LoggerService,
  ) { }
  use(req: Request, res: Response, next: Function) {
    let time = Date.now();
    // (res as any).send = resDotSendInterceptor(res, res.send);
    res.on('finish', () => {
      let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      let duration = Date.now() - time;
      this.loggerService.get("http").info(
        // "%o",
        JSON.stringify({
          path: req.originalUrl,
          elapsedTime: `${duration}ms`,
          method: req.method,
          req: {
            clientIp,
            header: {
              'Content-Type': req.get('Content-Type'),
              "token": req.headers['token'],
              "resolution": req.headers['resolution'],//分辨率
            },
            query: req.query,
            body: req.body,
          },
          res: {
            status: res.statusCode,
            statusMessage: res.statusMessage,
            // data: (res as any).contentBody
          },
        }))
    });

    next();
  }
}