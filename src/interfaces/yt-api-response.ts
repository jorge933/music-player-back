export interface VideoInfosResponse {
  items: Item[];
}

interface Item {
  id: string;
  contentDetails: ContentDetails;
}

interface ContentDetails {
  duration: string;
  contentRating: {
    ytRating?: string;
  };
}
