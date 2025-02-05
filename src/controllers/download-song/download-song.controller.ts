import { Get } from "@mp/decorators";
import { DownloadSongService } from "@mp/services";
import { FastifyReply, FastifyRequest } from "fastify";

export class DownloadSongController {
  readonly prefix = "/download";
  private readonly downloadSongService = new DownloadSongService();

  @Get("", {
    querystring: {
      type: "object",
      required: ["videoId"],
      properties: {
        videoId: { type: "string", pattern: "^[a-zA-Z0-9-_]{11}$" },
      },
    },
  })
  async downloadVideo(
    request: FastifyRequest<{
      Querystring: { videoId: string };
    }>,
    reply: FastifyReply
  ) {
    const { videoId } = request.query;

    const blob = await this.downloadSongService.downloadSong(videoId);

    reply.header("Content-Type", "audio/mpeg");

    reply.send(blob);
  }
}
