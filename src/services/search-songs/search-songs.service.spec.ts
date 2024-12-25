import axios from "axios";
import { ApiError } from "../../classes/api-error";
import { SearchSongsService } from "./search-songs.service";

jest.mock("axios");

describe("SearchSongsService", () => {
  let service: SearchSongsService;

  beforeEach(() => {
    service = new SearchSongsService();
  });

  it("should be throw an error when request status is different from 200", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 500,
      data: { items: [] },
    });

    await expect(service.searchSongs("")).rejects.toThrow(ApiError);
  });

  it("should be return an array of songs", async () => {
    const items = [
      {
        id: "1",
        contentDetails: {
          duration: "PT1M",
          contentRating: {},
        },
      },
    ];

    axios.get = jest.fn().mockResolvedValue({ status: 200, data: {} });
    service.getVideosIds = jest.fn().mockResolvedValue(["1"]);
    service.getVideoInfos = jest.fn().mockResolvedValue({ data: { items } });
    service.filterVideosByAgeRestriction = jest.fn().mockResolvedValue(items);

    const result = await service.searchSongs("");

    expect(result).toEqual(items);
  });

  it("should be return an array with filtered items", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: { items: [] },
    });

    const result = await service.searchSongs("");

    expect(result).toEqual([]);
  });

  it("should be return id of items", async () => {
    const results = [{ id: { videoId: "1" } }];

    const ids = await service.getVideosIds(results);

    expect(ids).toEqual(["1"]);
  });

  it("should make request and return video infos", async () => {
    const ids = ["1"];
    const items = [
      {
        id: "1",
        contentDetails: {
          duration: "PT1M",
          contentRating: {},
        },
      },
    ];

    (axios.get as jest.Mock).mockResolvedValue({
      data: { items },
      status: 200,
    });

    const result = await service.getVideoInfos(ids);

    expect(axios.get).toHaveBeenCalled();
    expect(result).toEqual(items);
  });

  it("should be throw error on request error", async () => {
    const ids = ["1"];

    (axios.get as jest.Mock).mockResolvedValue({
      status: 500,
      data: { items: [] },
    });

    await expect(service.getVideoInfos(ids)).rejects.toThrow(ApiError);
  });

  it("should be return filtered videos", async () => {
    const items = [
      {
        id: "1",
        contentDetails: {
          duration: "PT1M",
          contentRating: {
            ytRating: "ytRating",
          },
        },
      },
      {
        id: "2",
        contentDetails: {
          duration: "PT1M",
          contentRating: {
            ytRating: "ytAgeRestricted",
          },
        },
      },
    ];

    const result = await service.filterVideosByAgeRestriction(items);

    expect(result.length).toBe(1);
  });
});
