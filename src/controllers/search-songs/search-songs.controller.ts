import { HttpStatusCode } from "axios";

import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../../classes/api-error";
import { Get } from "../../decorators/get.decorator";
import { SearchSongsService } from "../../services/search-songs/search-songs.service";

export class SearchSongsController {
  prefix = "/" as const;
  private readonly searchSongsService = new SearchSongsService();

  @Get("")
  async searchSongs(
    req: FastifyRequest<{ Querystring: { query: string } }>,
    reply: FastifyReply
  ) {
    const { query } = req.query;

    const length = query?.length as number;

    if (length < 1)
      throw new ApiError(
        "The query must be longer than 1 character",
        HttpStatusCode.BadRequest,
        "invalidQueryLength"
      );

    const songs = await this.searchSongsService.searchSongs(query as string);

    reply.send(songs);
  }
}
