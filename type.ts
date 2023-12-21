import { UserType } from "./models/user";
import { MangaType } from "./models/manga";
import { ChapterType } from "./models/chapter";
import { initialSearchState } from "./features/search/SearchSlice";

export interface NormalResponse {
  message?: string;
  error?: string;
}

export interface MangasResponse extends NormalResponse {
  data?: MangaType[];
  length?: number;
}

export interface HistoryResponse extends NormalResponse {
  length?: number;
  data?: {
    manga: MangaType;
    chapter: string;
    createdAt: string;
  }[];
}

export interface MangaResponse extends NormalResponse {
  data?: MangaType;
}

export interface ChapterResponse extends NormalResponse {
  data?: {
    name: string;
    _id: string;
    href: string;
    chapter: ChapterType["chapters"][number];
  };
}

export interface ChaptersResponse extends NormalResponse {
  data?: {
    name: string;
    href: string;
    chapters: { num: string; description: string }[];
  };
}

export interface UserResponse extends NormalResponse {
  data?: Omit<UserType, "password">;
}

export interface UserRatingResponse extends NormalResponse {
  data?: number;
}

export interface ChartResponse extends NormalResponse {
  length?: number;
  data?: MangaType[];
  trendingManga?: MangaType;
}

export interface UpdateMangaResponse extends NormalResponse {
  data?: {
    href: string;
  };
}

export interface SignatureResponse extends NormalResponse {
  data?: {
    timestamp: number;
    signature: string;
    apiKey: string;
  };
}

export type MangasLength = { length: number };

export type StarType = 1 | 2 | 3 | 4 | 5;

export const shortName = "manga-clash-disqus-com";

export const mangasPerPage = 12;

export const tagsArray = [
  {
    id: "action",
    title: "Action",
  },
  {
    id: "adult",
    title: "Adult",
  },
  {
    id: "adventure",
    title: "Adventure",
  },
  {
    id: "isekai",
    title: "Isekai",
  },
  {
    id: "comedy",
    title: "Comedy",
  },
  {
    id: "drama",
    title: "Drama",
  },
  {
    id: "ecchi",
    title: "Ecchi",
  },
  {
    id: "fantasy",
    title: "Fantasy",
  },
  {
    id: "gender bender",
    title: "Gender Bender",
  },
  {
    id: "harem",
    title: "Harem",
  },
  {
    id: "manhua",
    title: "Manhua",
  },
  {
    id: "martial arts",
    title: "Martial Arts",
  },
  {
    id: "mature",
    title: "Mature",
  },
  {
    id: "mystery",
    title: "Mystery",
  },
  {
    id: "one shot",
    title: "One Shot",
  },
  {
    id: "psychological",
    title: "Psychological",
  },
  {
    id: "romance",
    title: "Romance",
  },
  {
    id: "school life",
    title: "School Life",
  },
  {
    id: "seinen",
    title: "Seinen",
  },
  {
    id: "shoujo",
    title: "Shoujo",
  },
  {
    id: "shounen",
    title: "Shounen",
  },
  {
    id: "slice of life",
    title: "Slice of Life",
  },
  {
    id: "yuri",
    title: "Yuri",
  },
  {
    id: "mecha",
    title: "Mecha",
  },
];

export const dndItemTypes = {
  QUICK_MENU: "quick_menu",
};

export const usernameReg = /^[a-zA-Z0-9 ]{4,50}$/g;
export const passwordReg = /[\S]{8,50}/g;
export const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export function searchQueryFn(search: typeof initialSearchState) {
  let searchQuery: string = "";
  searchQuery = `name=${search.name}&author=${search.author}&completed=${search.completed}`;
  if (search.tags.length) {
    search.tags.forEach((tag) => {
      searchQuery += `&tags=${tag}`;
    });
  }
  return searchQuery;
}
