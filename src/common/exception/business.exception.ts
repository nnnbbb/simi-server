import { HttpException, HttpStatus } from "@nestjs/common";
import _ from "lodash";
import { ResponseFormat } from "src/common/interfaces/http-response.interface";

// 业务异常
export class BusinessException extends HttpException {
  constructor(body: ResponseFormat, message?: string) {
    let obj = _.clone(body)
    obj.msg = message ? message : body.msg
    super(obj, HttpStatus.OK)
  }
}