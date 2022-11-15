export interface Post {
  title: string;
  hashtag: string[];
  user: string;
  view: number;
}
export interface PostProp {
  post: Post;
}

export interface Posts {
  posts: Post[];
}
