import fs from "fs";
import path, { dirname } from "path";

import ytdl, { videoInfo as VideoInfo } from "@distube/ytdl-core";
import { ApiError } from "../../classes/api-error";
import { HttpStatusCode } from "axios";

export class DownloadSongService {
  private readonly BASE_URL = "https://www.youtube.com/watch?v=";

  async downloadSong(id: string) {
    const currentDirectory = dirname(require.main?.path as string);
    const folder = path.join(currentDirectory + "/musics/");
    const existFolder = fs.existsSync(folder);

    if (!existFolder) fs.mkdirSync(folder);

    const date = new Date();
    const fileName = date.getTime() + id + ".mp3";
    const outputFileName = folder + fileName;
    const outputFile = path.join(outputFileName);

    const url = this.BASE_URL + id;
    const info = await ytdl.getInfo(url);

    const videoData = await this.downloadVideo(info);

    fs.writeFileSync(outputFile, videoData);

    return outputFileName;
  }

  async downloadVideo(info: VideoInfo): Promise<Buffer> {
    const stream = ytdl.downloadFromInfo(info, {
      quality: "highestaudio",
    });
    const buffers: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => {
        buffers.push(chunk);
      });

      stream.on("error", (error) => {
        const apiError = new ApiError(
          error.message,
          HttpStatusCode.InternalServerError,
          "downloadError"
        );

        reject(apiError);
      });

      stream.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
