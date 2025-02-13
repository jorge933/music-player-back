import { Get } from "@mp/decorators";
import { DownloadSongService } from "@mp/services";
import { SongTimeRange } from "@mp/interfaces";
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
        start: { type: "string" },
        end: { type: "string" },
      },
    },
  })
  async downloadVideo(
    request: FastifyRequest<{
      Querystring: { videoId: string } & SongTimeRange;
    }>,
    reply: FastifyReply
  ) {
    const { videoId, start, end } = request.query;

    const blob = await this.downloadSongService.downloadSong(videoId, {
      start,
      end,
    });

    reply.header("Content-Type", "audio/mpeg");

    reply.send(blob);
  }
}
