import axios from "axios";

import { buildUrlSearchParams } from "../helpers/buildUrlSearchParams";

import { VideoInfosResponse } from "../interfaces/yt-api-response";

import {
  MusicAlbumCompact,
  MusicArtistCompact,
  MusicClient,
  MusicPlaylistCompact,
  MusicVideoCompact,
  Shelf,
} from "youtubei";

type SearchResults = Shelf<
  | MusicVideoCompact[]
  | MusicAlbumCompact[]
  | MusicPlaylistCompact[]
  | MusicArtistCompact[]
>[];

export class SearchSongsService {
  private readonly client = new MusicClient();
  private readonly videoTypes = ["Songs", "Videos", "Podcasts", "Episodes"];

  async searchSongs(query: string) {
    const results = await this.client.search(query);
    const ids = await this.getVideosIds(results);

    if (!ids.length) return [];

    const filteredSongs = await this.filterVideosByAgeRestriction(ids);

    return filteredSongs;
  }

  private async getVideosIds(results: SearchResults) {
    const ids = results.reduce((previousValue: string[], { title, items }) => {
      const isIncluded = this.videoTypes.includes(title);
      const newValue = [...previousValue];

      if (isIncluded) {
        items.forEach(({ id }) => {
          if (id) newValue.push(id);
        });
      }

      return newValue;
    }, []);

    return ids;
  }

  private async filterVideosByAgeRestriction(ids: string[]) {
    const {
      data: { items },
    } = await this.getVideoInfos(ids);

    const filteredVideos = items.filter(
      ({ contentDetails: { contentRating } }) => {
        const { ytRating } = contentRating;

        return ytRating !== "ytAgeRestricted";
      }
    );

    return filteredVideos;
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
}
