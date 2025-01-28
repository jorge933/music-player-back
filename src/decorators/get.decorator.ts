import { FastifySchema } from "fastify";
import { Path } from "../interfaces/route-metadata.interface";
import { Route } from "./route/route.decorator";

export function Get(route: Path, schema?: FastifySchema) {
  return Route(route, "get", schema);
}
