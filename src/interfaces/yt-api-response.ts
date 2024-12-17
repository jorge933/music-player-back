export interface VideoInfosResponse {
  items: VideoInfo[];
}

export interface VideoInfo {
  id: string;
  contentDetails: ContentDetails;
}

interface ContentDetails {
  duration: string;
  contentRating: {
    ytRating?: string;
  };
}

export interface YouTubeSearchResponse {
  items: SearchItem[];
}

export interface SearchItem {
  id: {
    videoId: string;
  };
}
