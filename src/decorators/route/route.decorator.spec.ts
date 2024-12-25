import { Route } from "./route.decorator";
import "reflect-metadata";

describe("Route", () => {
  it("should set metadata on the target object", () => {
    const target = {};
    Route("/", "get")(target, "test");
    const metadata = Reflect.getMetadata("route", target, "test");
    expect(metadata).toEqual({ path: "/", httpMethod: "get" });
  });
});
