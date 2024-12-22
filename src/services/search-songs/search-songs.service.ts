import axios from "axios";

import { buildUrlSearchParams } from "../../helpers/buildUrlSearchParams";

import {
  SearchItem,
  VideoInfo,
  VideoInfosResponse,
  YouTubeSearchResponse,
} from "../../interfaces/yt-api-response.interface";
import { ApiError } from "../../classes/api-error";
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
      key: API_KEY,
      q: query,
    });
    const url = `${BASE_API_URL}/search?${params.toString()}`;
    const { data: results, status } = await axios.get<YouTubeSearchResponse>(
      url
    );

    if (status !== 200)
      throw new ApiError("Error on youtube api", 500, "youtubeApiError");

    const ids = await this.getVideosIds(results.items);

    if (!ids.length) return [];

    const {
      data: { items },
    } = await this.getVideoInfos(ids);

    const filteredSongs = await this.filterVideosByAgeRestriction(items);

    return filteredSongs;
  }

  private async getVideosIds(results: SearchItem[]) {
    const ids = results.reduce(
      (previous: string[], item) => [...previous, item.id.videoId],
      []
    );

    return ids;
  }

  private async getVideoInfos(ids: string[]) {
    const { BASE_API_URL, API_KEY } = process.env;
    const params = buildUrlSearchParams({
      key: API_KEY,
      id: ids,
      part: ["contentDetails", "snippet"],
    });
    const stringParams = params.toString();
    const url = BASE_API_URL + "/videos?" + stringParams;
    const videos = await axios.get<VideoInfosResponse>(url);

    return videos;
  }

  private async filterVideosByAgeRestriction(items: VideoInfo[]) {
    const filteredVideos = items.filter(
      ({ contentDetails: { contentRating } }) => {
        const { ytRating } = contentRating;

        return ytRating !== "ytAgeRestricted";
      }
    );

    return filteredVideos;
  }
}
