import fs, { createReadStream } from "fs";

import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { Post } from "@mp/decorators";
import { DownloadSongService } from "@mp/services";

export class DownloadSongController {
  prefix = "/download" as const;
  private readonly downloadSongService = new DownloadSongService();

  @Post("", {
    body: {
      type: "object",
      required: ["videoId"],
      properties: {
        videoId: { type: "string", pattern: "^[a-zA-Z0-9-_]{11}$" },
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
