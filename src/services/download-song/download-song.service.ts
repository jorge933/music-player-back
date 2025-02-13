import ytdl from "@distube/ytdl-core";
import { ApiError } from "@mp/classes";
import { SongTimeRange } from "@mp/interfaces";
import { HttpStatusCode } from "axios";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";

export class DownloadSongService {
  async downloadSong(id: string, { start, end }: SongTimeRange) {
    const stream = ytdl(id, {
      quality: "highestaudio",
    });
    const buffers: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => {
        buffers.push(chunk);
      });

      stream.on("error", (error: any) => {
        const statusCode =
          error.statusCode || HttpStatusCode.InternalServerError;
        const apiError = new ApiError(
          error.message,
          statusCode,
          "downloadError"
        );

        reject(apiError);
      });

      stream.on("end", async () => {
        const buffersConcatenated = Buffer.concat(buffers);

        if (!start && !end) return resolve(buffersConcatenated);

        const now = Date.now();
        const tempDir = this.getTempDirectoryPath();
        const filePath = `${tempDir}/${id}-${now}`;

        fs.writeFileSync(filePath, buffersConcatenated);

        const cutAudioPromise = this.cutAudio(filePath, { start, end });

        cutAudioPromise
          .then((outputFilePath) => {
            const audioCut = fs.readFileSync(outputFilePath);
            resolve(audioCut);

            fs.rmSync(filePath);
            fs.rmSync(outputFilePath);
          })
          .catch(reject);
      });
    });
  }

  getTempDirectoryPath() {
    const path = process.cwd() + "/temp";
    const existsPath = fs.existsSync(path);

    if (!existsPath) fs.mkdirSync(path);

    return path;
  }

  cutAudio(filePath: string, { start = 0, end }: SongTimeRange) {
    return new Promise<string>((resolve, reject) => {
      const outputPath = filePath + "-cut.mp3";
      const ffmpegOptions = ffmpeg(filePath);

      ffmpegOptions
        .output(outputPath)
        .setFfmpegPath(ffmpegPath)
        .setStartTime(start)
        .on("error", reject)
        .on("end", () => resolve(outputPath));

      if (end) ffmpegOptions.setDuration(end - start);

      ffmpegOptions.run();
    });
  }
}
