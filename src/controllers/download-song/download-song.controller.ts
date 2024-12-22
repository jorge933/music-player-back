import fs from "fs";

import { Request, Response } from "express";

import { HttpStatusCode } from "axios";
import { ApiError } from "../../classes/api-error";
import { DownloadSongService } from "../../services/download-song/download-song.service";
import { Post } from "../../decorators/post.decorator";
import { Controller } from "../../interfaces/route-metadata";

export class DownloadSongController implements Controller {
  prefix = "/download/" as const;
  private readonly downloadSongService = new DownloadSongService();
  private readonly idRegex = /^[a-zA-Z0-9-_]{11}$/;

  @Post("")
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
