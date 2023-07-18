import { Type } from '@nestjs/common';
import { addApiProperty, applyTypeDecorator } from './helpers.utils';

type PaginationResType<T> = new (...args: any[]) => { total: number, list: Array<T> }


export function PaginationRes<T>(classRef: Type<T>): PaginationResType<T> {
  abstract class PaginationResClass {
    constructor() { }
  }
  addApiProperty(PaginationResClass, 'total', {
    description: "总数",
    type: Number,
    required: true,
  })
  addApiProperty(PaginationResClass, 'list', {
    type: [classRef],
    required: true,
  })
  applyTypeDecorator(PaginationResClass, 'list', Array, classRef)
  return PaginationResClass as PaginationResType<T>
}

