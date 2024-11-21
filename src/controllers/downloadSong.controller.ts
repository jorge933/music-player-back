import fs from "fs";

import express, { Request, Response } from "express";

import { HttpStatusCode } from "axios";
import { ApiError } from "../classes/api-error";
import { Controller } from "../interfaces/controller";
import { DownloadSongService } from "../services/downloadSong.service";

export class DownloadSongController implements Controller {
  prefix = "/download";
  router = express.Router();
  private readonly downloadSongService = new DownloadSongService();
  private readonly idRegex = /^[a-zA-Z0-9-_]{11}$/;

  constructor() {
    this.router.post("", this.downloadVideo.bind(this));
  }

  async downloadVideo(req: Request, res: Response) {
    const { videoId } = req.body;

    const idIsValid = this.idRegex.test(videoId);

    if (!idIsValid)
      throw new ApiError(
        "Invalid Video Id",
        HttpStatusCode.BadRequest,
        "invalidVideoId"
      );

    const outputFile = await this.downloadSongService.downloadSong(videoId);
    res.sendFile(outputFile, () => fs.rmSync(outputFile));
  }
}
