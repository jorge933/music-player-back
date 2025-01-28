import { FastifySchema } from "fastify";
import {
  AllowHttpMethods,
  RouteMetadata,
  Path,
} from "../../interfaces/route-metadata.interface";

export function Route(
  route: Path,
  httpMethod: AllowHttpMethods,
  schema?: FastifySchema
) {
  return (target: Object, propertyKey: string) => {
    const metadataValue: RouteMetadata = { path: route, httpMethod, schema };

    Reflect.defineMetadata("route", metadataValue, target, propertyKey);
  };
}
