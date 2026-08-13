export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};

export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
};

export type UserResponse = {
  user: User;
};

export type ProfileResponse = {
  profile: Profile;
};

export type SingleArticleResponse = {
  article: Article;
};

export type MultipleArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export type GenericErrorModel = {
  errors: Record<string, string[]>;
};
