import { Path } from "../interfaces/route-metadata.interface";
import { Route } from "./route/route.decorator";

export function Post(route: Path) {
  return Route(route, "post");
}
