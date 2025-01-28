import { FastifySchema } from "fastify";

export type Path = string;

export type AllowHttpMethods = "get" | "post";

export interface RouteMetadata {
  path: Path;
  httpMethod: AllowHttpMethods;
  schema?: FastifySchema;
}

export interface ControllerRouteMetadata extends RouteMetadata {
  callback: () => {};
}
