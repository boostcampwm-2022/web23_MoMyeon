import { Category as CategoryGet } from "./category";

export interface Post {
  interview_id: number;
  title: string;
  maxMember: number;
  contact: string;
  content: string;
  recruitStatue: number;
  date: string;
  category: CategoryGet[];
}

export interface Category {
  id: number;
  name: string;
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
