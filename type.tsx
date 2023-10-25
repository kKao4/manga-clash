import { UserType } from "./models/user";
import { initialGlobalState } from "./features/GlobalSlice";
import { MangaType } from "./models/manga";
import { ChapterType } from "./models/chapter";
import { initialSearchState } from "./features/search/SearchSlice";

export type MangasResponse = {
  length: number;
  search?: string | string[] | undefined;
  message: string;
  data: MangaType[] | null;
};

export type MangaResponse = {
  message?: string;
  error?: string;
  data?: MangaType;
};

export type ChapterResponse = {
  message?: string,
  error?: string,
  data?: {
    name: string,
    _id: string,
    href: string,
    chapter: ChapterType["chapters"][number]
  }
}

export type ChaptersResponse = {
  message?: string,
  error?: string,
  data?: {
    name: string,
    href: string,
    chapters: string[]
  }
}

export type UserResponse = {
  message?: string;
  error?: string;
  data?: Omit<UserType, "password">;
};

export type UserRatingResponse = {
  message?: string;
  error?: string;
  data?: {
    star: number
  }
}

export type ChartResponse = {
  message?: string,
  error?: string,
  data?: {
    mangas: MangaType[],
    length: number
  }
}

export type NormalResponse = {
  message?: string;
  error?: string
};

export type UpdateMangaResponse = {
  message?: string,
  error?: string,
  data?: {
    href: string
  }
}

export type SignatureResponse = {
  message?: string,
  error?: string,
  data?: {
    timestamp: number,
    signature: string,
    apiKey: string
  }
}

export type StarType = 1 | 2 | 3 | 4 | 5

export const shortName = "manga-clash-disqus-com"

export type MangasLength = { length: number };

export const mangasPerPage = 10;

export const HOST_URL = "http://localhost:3000";
// export const HOST_URL = "https://manga-clash.vercel.app/";

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

export const usernameReg = /^[a-zA-Z0-9 ]{4,50}$/g;
export const passwordReg = /[\S]{8,50}/g;
export const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export function searchQueryFn(search: (typeof initialSearchState)) {
  let searchQuery: string = "";
  searchQuery = `name=${search.name}&author=${search.author}&completed=${search.completed}`;
  if (search.tags.length) {
    search.tags.forEach((tag) => {
      searchQuery += `&tags=${tag}`;
    });
  }
  return searchQuery;
}
