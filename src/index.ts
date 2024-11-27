import bodyParser from "body-parser";
import express from "express";

import "dotenv/config";
import "express-async-errors";
import "reflect-metadata";

import { errorHandler } from "./middlewares/error-handler.middleware";

import { DownloadSongController } from "./controllers/downloadSong/downloadSong.controller";
import { SearchSongsController } from "./controllers/searchSongs.controller";
import {
  Controller,
  ControllerRouteMetadata,
  Metadata,
} from "./interfaces/route-metadata";

class App {
  private readonly app = express();
  private readonly controllers = [
    DownloadSongController,
    SearchSongsController,
  ];

  constructor() {
    this.app.use(bodyParser.json());

    this.initializeRoutes();

    this.app.use(errorHandler);

    this.app.listen(1234, () => console.log("listen on 1234"));
  }

  initializeRoutes() {
    this.controllers.forEach((controllerClass) => {
      const router = express.Router();
      const controller: Controller = new controllerClass();

      const routes = this.getMethodsWithMetadata(controllerClass);

      routes.forEach(({ httpMethod, callbackPropertyName, path }) => {
        const method = router[httpMethod].bind(router);
        const callback = controller[callbackPropertyName];

        method(path, callback.bind(controller));
      });

      this.app.use(controller.prefix, router);
    });
  }

  getMethodsWithMetadata({ prototype }: Controller) {
    const properties = Object.getOwnPropertyNames(prototype);

    const routesMetadata = properties.reduce(
      (previousValue: ControllerRouteMetadata[], property) => {
        const metadata: Metadata = Reflect.getMetadata(
          "route",
          prototype,
          property
        );

        if (!metadata) return previousValue;

        return [
          ...previousValue,
          { callbackPropertyName: property, ...metadata },
        ];
      },
      []
    );

    return routesMetadata;
  }
}

new App();
