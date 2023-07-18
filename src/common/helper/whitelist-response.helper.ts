import { applyExcludeDecorator, applyExposeDecorator, getTransformerMetadataStorage, modelPropertiesAccessor } from "./helpers.utils";

export function WhitelistResponse(targetClass: Function) {
  const fields = modelPropertiesAccessor.getModelProperties(targetClass.prototype);

  const metadataStorage = getTransformerMetadataStorage()

  applyExcludeDecorator(targetClass)

  fields.forEach((key) => {
    const typeMetadata = metadataStorage.findTypeMetadata(targetClass, key)
    if (typeMetadata) {
      WhitelistResponse(typeMetadata.typeFunction())
    }
    applyExposeDecorator(targetClass, key)
  })

}
