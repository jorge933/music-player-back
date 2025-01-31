import { FastifySchema } from "fastify";
import { Path } from "@mp/interfaces";
import { Route } from "@mp/decorators";

export function Get(route: Path, schema?: FastifySchema) {
  return Route(route, "get", schema);
}
