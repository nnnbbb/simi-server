import { Type } from "@nestjs/common";
import { getMetadataArgsStorage } from "typeorm";
import { ColumnMetadataArgs } from "typeorm/metadata-args/ColumnMetadataArgs";
import { Base } from "../entities/base.entity";
import { addApiProperty, applyIsOptionalDecorator, applyValidatorDecorator } from "./helpers.utils";


const columns = getMetadataArgsStorage().columns
const baseColumns = getMetadataArgsStorage().columns.filter(c => c.target === Base)

type Keys<T> = {
  selectKeys?: readonly T[]
  filterKeys?: readonly T[]
}


export function EntityToDto<T, K extends keyof T>(
  classRef: Type<T>,
  keys: Keys<K> = { filterKeys: [], selectKeys: [] }
): Type<Omit<T, typeof keys.filterKeys[number]>> {
  const entityColumns = columns.filter(column => column.target === classRef)

  abstract class DtoClass {
    constructor() { }
  }
  const filterKeys = keys.filterKeys ?? []
  const selectKeys = keys.selectKeys ?? []

  function addProperty(column: ColumnMetadataArgs) {
    const propertyKey = column.propertyName
    const options = column.options
    let { comment = "", default: defaultValue, nullable, type } = options
    type = [Number, String].includes((type as any)) ? type : String
    const required = (defaultValue !== undefined || nullable === true) ? false : true

    const apiPropertyOptions = {
      description: comment,
      type,
      required,
    }
    addApiProperty(DtoClass, propertyKey, apiPropertyOptions)
    applyValidatorDecorator(DtoClass, propertyKey, type)

    if (required === false) {
      applyIsOptionalDecorator(DtoClass, propertyKey);
    }
  }
  function filter(columns: ColumnMetadataArgs[]) {
    return columns
      .filter(it => selectKeys.length === 0 ? true : selectKeys.includes(it.propertyName as K))
      .filter(it => !filterKeys.includes(it.propertyName as K))
  }

  const parentClass = Object.getPrototypeOf(classRef)

  if (parentClass === Base) {
    filter(baseColumns).forEach((column) => addProperty(column))
  }
  filter(entityColumns).forEach((column) => addProperty(column))

  return DtoClass as Type<Omit<T, typeof filterKeys[number]>>;
}
