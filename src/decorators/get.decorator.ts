import { Path } from "../interfaces/route-metadata.interface";
import { Route } from "./route.decorator";

export function Get(route: Path) {
  return Route(route, "get");
}
