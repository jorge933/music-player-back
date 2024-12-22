import { ApiError } from "../../classes/api-error";
import { VideoInfo } from "../../interfaces/yt-api-response.interface";
import { SearchSongsService } from "../../services/search-songs/search-songs.service";
import { SearchSongsController } from "./search-songs.controller";

jest.mock("../../decorators/get.decorator", () => ({
  Get: jest
    .fn()
    .mockImplementation(() => (target, key, descriptor) => descriptor),
}));
jest.mock("../../services/search-songs/search-songs.service");

describe("SearhSongsController", () => {
  let controller: SearchSongsController;
  let service: jest.Mocked<SearchSongsService>;

  beforeEach(() => {
    service = new SearchSongsService() as jest.Mocked<SearchSongsService>;
    controller = new SearchSongsController();

    (controller as any).searchSongsService = service;
  });

  it("should throw error on invalid query", async () => {
    const req = { query: { query: "" } };
    const res = { json: jest.fn() };

    await expect(
      controller.searchSongs(req as any, res as any)
    ).rejects.toThrow(ApiError);
  });

  it("should call res.json with service return", async () => {
    const req = { query: { query: "search" } };
    const res = { json: jest.fn() };
    const mockReturn: VideoInfo[] = [
      { id: "id", contentDetails: { duration: "PT1H", contentRating: {} } },
    ];

    service.searchSongs.mockResolvedValue(mockReturn);

    await controller.searchSongs(req as any, res as any);

    expect(res.json).toHaveBeenCalledWith(mockReturn);
  });
});
