import { Category } from "./category";

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

export interface PostData {
  postId: number;
  title: string;
  maxMember: number;
  category: Category[];
  contact: string;
  content: string[];
  count: number;
  member: number;
  date: string;
  recruitStatus: number;
  isHost: boolean;
  userStatus: number;
  host: string;
}
