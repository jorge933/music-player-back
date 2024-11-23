import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { ApiError } from "../classes/api-error";
import { Get } from "../decorators/get.decorator";
import { SearchSongsService } from "../services/searchSongs.service";

export class SearchSongsController {
  prefix = "";
  private readonly searchSongsService = new SearchSongsService();

  @Get("/")
  public async searchSongs(req: Request, res: Response) {
    const { query } = req.query;

    const length = query?.length as number;

    if (length < 1)
      throw new ApiError(
        "The query must be longer than 1 character",
        HttpStatusCode.BadRequest,
        "invalidQueryLength"
      );

    const songs = await this.searchSongsService.searchSongs(query as string);

    res.json(songs);
  }
}
