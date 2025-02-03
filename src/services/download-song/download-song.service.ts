import ytdl from "@distube/ytdl-core";
import { ApiError } from "@mp/classes";
import { HttpStatusCode } from "axios";

export class DownloadSongService {
  async downloadSong(id: string) {
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

      stream.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
