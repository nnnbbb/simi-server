import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { WhitelistResponse } from '../helper/whitelist-response.helper';

interface ClassType<T> {
  new(): T;
}
/**
 * @see https://stackoverflow.com/questions/53378667/cast-entity-to-dto
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {

  constructor(private readonly classType: ClassType<T>) { }

  intercept(context: ExecutionContext, call$: CallHandler<Partial<T>>,): Observable<T> {
    WhitelistResponse(this.classType)
    return call$.handle().pipe(
      map(data => {
        const res = plainToClass(this.classType, data);
        return res
      })
    );
  }
}
