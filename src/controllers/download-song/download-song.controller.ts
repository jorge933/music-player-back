import fs, { createReadStream } from "fs";

import { HttpStatusCode } from "axios";
import { ApiError } from "../../classes/api-error";
import { DownloadSongService } from "../../services/download-song/download-song.service";
import { Post } from "../../decorators/post.decorator";
import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";

export class DownloadSongController {
  prefix = "/download" as const;
  private readonly downloadSongService = new DownloadSongService();

  @Post("", {
    body: {
      type: "object",
      required: ["videoId", "videoIdd"],
      properties: {
        videoId: { type: "string", pattern: "^[a-zA-Z0-9-_]{11}$" },
        videoIdd: { type: "string", pattern: "^[a-zA-Z0-9-_]{11}$" },
      },
    },
  })
  async downloadVideo(
    request: FastifyRequest<{ Body: { videoId: string } }>,
    reply: FastifyReply
  ) {
    const { videoId } = request.body;

    const outputFile = await this.downloadSongService.downloadSong(videoId);

    const filePath = path.join(__dirname, outputFile);

    const stream = createReadStream(filePath);

    reply.header("Content-Type", "text/plain");
    reply.header(
      "Content-Disposition",
      `attachment; filename="${videoId}.mp3"`
    );

    reply.send(stream).then(
      () => fs.rmSync(outputFile),
      () => {}
    );
  }
}
