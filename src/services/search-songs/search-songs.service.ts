import axios, { HttpStatusCode } from "axios";

import { ApiError } from "@mp/classes";
import { buildUrlSearchParams } from "@mp/helpers";
import {
  SearchItem,
  VideoInfo,
  VideoInfosResponse,
  YouTubeSearchResponse,
} from "@mp/interfaces";
export class SearchSongsService {
  BASE_PROPERTIES = {
    topicId: "/m/04rlf",
    part: "snippet",
    maxResults: "10",
    type: "video",
  };

  async searchSongs(query: string) {
    const { API_KEY, BASE_API_URL } = process.env;
    const params = buildUrlSearchParams({
      ...this.BASE_PROPERTIES,
      key: API_KEY as string,
      q: query,
    });
    const url = `${BASE_API_URL}/search?${params.toString()}`;
    const { data: results, status } = await axios.get<YouTubeSearchResponse>(
      url
    );

    if (status !== 200)
      throw new ApiError("Error on youtube api", status, "youtubeApiError");

    const ids = await this.getVideosIds(results.items);

    if (!ids.length) return [];

    const items = await this.getVideoInfos(ids);

    const filteredSongs = await this.filterVideosByAgeRestriction(items);

    return filteredSongs;
  }

  async getVideosIds(results: SearchItem[]) {
    const ids = results.reduce(
      (previous: string[], item) => [...previous, item.id.videoId],
      []
    );

    return ids;
  }

  async getVideoInfos(ids: string[]) {
    const { BASE_API_URL, API_KEY } = process.env;
    const params = buildUrlSearchParams({
      key: API_KEY as string,
      id: ids,
      part: ["contentDetails", "snippet"],
    });
    const stringParams = params.toString();
    const url = BASE_API_URL + "/videos?" + stringParams;
    const {
      status,
      data: { items },
    } = await axios.get<VideoInfosResponse>(url);

    if (status !== 200)
      throw new ApiError(
        "Error on youtube api",
        HttpStatusCode.InternalServerError,
        "youtubeApiError"
      );

    return items;
  }

  async filterVideosByAgeRestriction(items: VideoInfo[]) {
    const filteredVideos = items.filter(
      ({ contentDetails: { contentRating } }) => {
        const { ytRating } = contentRating;

        return ytRating !== "ytAgeRestricted";
      }
    );

    return filteredVideos;
  }
}
