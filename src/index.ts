import express from "express";
import bodyParser from "body-parser";

import "express-async-errors";
import "dotenv/config";

import { Controller } from "./interfaces/controller";

import { errorHandler } from "./middlewares/error-handler.middleware";

import { DownloadSongController } from "./controllers/downloadSong.controller";
import { SearchSongsController } from "./controllers/searchSongs.controller";

const app = express();

app.use(bodyParser.json());

const controllers: Controller[] = [
  new DownloadSongController(),
  new SearchSongsController(),
];

controllers.forEach(({ prefix, router }) => {
  app.use(prefix, router);
});

app.use(errorHandler);

app.listen(1234, () => console.log("listen on 1234"));
