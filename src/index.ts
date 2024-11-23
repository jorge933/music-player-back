import bodyParser from "body-parser";
import express from "express";

import "dotenv/config";
import "express-async-errors";
import "reflect-metadata";

import { errorHandler } from "./middlewares/error-handler.middleware";

import { DownloadSongController } from "./controllers/downloadSong.controller";
import { SearchSongsController } from "./controllers/searchSongs.controller";
import {
  Controller,
  ControllerRouteMetadata,
  Metadata,
} from "./interfaces/route-metadata";

const app = express();

app.use(bodyParser.json());

const controllers = [DownloadSongController, SearchSongsController];

function getMethodsWithMetadata({ prototype }: Controller) {
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

controllers.forEach((controllerClass) => {
  const router = express.Router();
  const controller: Controller = new controllerClass();

  const routes = getMethodsWithMetadata(controllerClass);

  routes.forEach(({ httpMethod, callbackPropertyName, path }) => {
    const method = router[httpMethod].bind(router);
    const callback = controller[callbackPropertyName];

    method(path, callback.bind(controller));
  });

  app.use(controller.prefix, router);
});

app.use(errorHandler);

app.listen(1234, () => console.log("listen on 1234"));
