export type Path = `${string}`;

export type DecoratorHttpMethods = "get" | "post";

export interface Metadata {
  path: Path;
  httpMethod: DecoratorHttpMethods;
}

export interface ControllerRouteMetadata extends Metadata {
  callbackPropertyName: string;
}

export type Controller = {
  [key: string]: any;
};
