import { FastifyReply, FastifyRequest } from "fastify";
import { Get } from "@mp/decorators";
import { SearchSongsService } from "@mp/services";

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
