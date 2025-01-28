import "dotenv/config";
import "reflect-metadata";

import { fastify, FastifyInstance } from "fastify";

import { DownloadSongController } from "./controllers/download-song/download-song.controller";
import { SearchSongsController } from "./controllers/search-songs/search-songs.controller";
import {
  ControllerRouteMetadata,
  Metadata,
} from "./interfaces/route-metadata.interface";

class App {
  private readonly app = fastify({ logger: true });
  private readonly controllers = [
    DownloadSongController,
    SearchSongsController,
  ];

  constructor() {
    this.initializeRoutes(this.app);
    this.app.listen({ port: 1234, host: "0.0.0.0" });
  }

  initializeRoutes(fastify: FastifyInstance) {
    this.controllers.forEach((controllerClass) => {
      const controller = new controllerClass();

      const routes = this.getMethodsWithMetadata(controllerClass);

      const controllerRoutes = (fastify: FastifyInstance) => {
        routes.forEach(({ callback, httpMethod, path }) => {
          fastify.route({
            handler: callback.bind(controller),
            method: httpMethod,
            url: path,
          });
        });
      };

      fastify.register(controllerRoutes, { prefix: controller.prefix });
    });
  }

  getMethodsWithMetadata({ prototype }: (typeof this.controllers)[number]) {
    const properties = Object.getOwnPropertyNames(
      prototype
    ) as (keyof typeof prototype)[];

    const routesMetadata = properties.reduce(
      (previousValue: ControllerRouteMetadata[], property) => {
        const metadata: Metadata = Reflect.getMetadata(
          "route",
          prototype,
          property
        );
        const callback = prototype[property];

        if (!metadata || typeof callback !== "function") return previousValue;

        return [
          ...previousValue,
          { callback: callback as () => {}, ...metadata },
        ];
      },
      []
    );

    return routesMetadata;
  }
}

new App();
