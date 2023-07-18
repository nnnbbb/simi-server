import { Type } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { ExcludeOptions, TypeHelpOptions, TypeOptions } from "class-transformer";
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';

export const modelPropertiesAccessor = new ModelPropertiesAccessor();

export function addApiProperty(targetClass: Function, propertyKey: string, options?: ApiPropertyOptions) {
  const decoratorFactory = ApiProperty({ ...options })
  decoratorFactory(targetClass.prototype, propertyKey);
}

function isClassValidatorAvailable() {
  try {
    require('class-validator');
    return true;
  } catch {
    return false;
  }
}

function isClassTransformerAvailable() {
  try {
    require('class-transformer');
    return true;
  } catch {
    return false;
  }
}

export function getTransformerMetadataStorage() {
  if (!isClassTransformerAvailable()) {
    return;
  }
  let classTransformer: any;
  try {
    /** "class-transformer" >= v0.3.x */
    classTransformer = require('class-transformer/cjs/storage')
  } catch {
    /** "class-transformer" <= v0.3.x */
    classTransformer = require('class-transformer/storage')
  }
  const metadataStorage: typeof import('class-transformer/types/storage').defaultMetadataStorage =
    classTransformer.defaultMetadataStorage;

  return metadataStorage
}

export function applyExcludeDecorator(
  targetClass: Function,
  propertyName: string = undefined,
  options: ExcludeOptions = {},
) {
  const metadataStorage = getTransformerMetadataStorage()
  metadataStorage.addExcludeMetadata({
    target: targetClass,
    propertyName,
    options,
  })
}

export function applyTypeDecorator(
  targetClass: Function,
  propertyName: string = undefined,
  reflectedType: any,
  typeFunction: Function,
  options: TypeOptions = {},
) {
  const metadataStorage = getTransformerMetadataStorage()
  metadataStorage.addTypeMetadata({
    target: targetClass,
    propertyName,
    reflectedType,
    typeFunction: () => typeFunction,
    options,
  })
}

export function applyExposeDecorator(
  targetClass: Function,
  propertyName: string = undefined,
  options: ExcludeOptions = {},
) {
  const metadataStorage = getTransformerMetadataStorage()

  metadataStorage.addExposeMetadata({
    target: targetClass,
    propertyName,
    options,
  })
}

export function applyIsOptionalDecorator(
  targetClass: Function,
  propertyKey: string,
) {
  if (!isClassValidatorAvailable()) {
    return;
  }
  const classValidator: typeof import('class-validator') = require('class-validator');
  const decoratorFactory = classValidator.IsOptional();
  decoratorFactory(targetClass.prototype, propertyKey);
}

export function applyValidatorDecorator(
  targetClass: Function,
  propertyKey: string,
  validatorType: any,
) {
  if (!isClassValidatorAvailable()) {
    return;
  }
  const classValidator: typeof import('class-validator') = require('class-validator');
  let validatorName = validatorType.name === "Date" ? "DateString" : validatorType.name
  validatorType = "Is" + validatorName
  const validator = classValidator[validatorType];
  if (validator) {
    const decoratorFactory = validator();
    decoratorFactory(targetClass.prototype, propertyKey);
  }
}

export function inheritPropertyInitializers(
  target: Record<string, any>,
  sourceClass: Type<any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPropertyInherited = (key: string) => true,
) {
  try {
    const tempInstance = new sourceClass();
    const propertyNames = Object.getOwnPropertyNames(tempInstance);

    propertyNames
      .filter(
        (propertyName) =>
          typeof tempInstance[propertyName] !== 'undefined' &&
          typeof target[propertyName] === 'undefined',
      )
      .filter((propertyName) => isPropertyInherited(propertyName))
      .forEach((propertyName) => {
        target[propertyName] = tempInstance[propertyName];
      });
  } catch { }
}
