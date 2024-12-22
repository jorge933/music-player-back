import {
  DecoratorHttpMethods,
  Metadata,
  Path,
} from "../interfaces/route-metadata.interface";

export function Route(route: Path, httpMethod: DecoratorHttpMethods) {
  return function (target: Object, propertyKey: string) {
    const metadataValue: Metadata = { path: route, httpMethod };

    Reflect.defineMetadata("route", metadataValue, target, propertyKey);
  };
}
