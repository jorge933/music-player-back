import { HttpStatusCode } from "axios";

import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../classes/api-error";
import { Get } from "../../decorators/get.decorator";
import { SearchSongsService } from "../../services/search-songs/search-songs.service";

export class SearchSongsController {
  prefix = "/" as const;
  private readonly searchSongsService = new SearchSongsService();

  @Get("", {
    querystring: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string", minLength: 1 } },
    },
  })
  async searchSongs(
    req: FastifyRequest<{ Querystring: { query: string } }>,
    reply: FastifyReply
  ) {
    const { query } = req.query;

    const songs = await this.searchSongsService.searchSongs(query as string);

    reply.send(songs);
  }
}
