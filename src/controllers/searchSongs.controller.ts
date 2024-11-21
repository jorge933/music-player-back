import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";

import { ApiError } from "../classes/api-error";
import { Controller } from "../interfaces/controller";
import { SearchSongsService } from "../services/searchSongs.service";

export class SearchSongsController implements Controller {
  prefix = "";
  router = Router();
  private readonly searchSongsService = new SearchSongsService();

  constructor() {
    this.router.get("", this.searchSongs.bind(this));
  }

  private async searchSongs(req: Request, res: Response) {
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
