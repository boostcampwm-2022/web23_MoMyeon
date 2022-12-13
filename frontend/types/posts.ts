import { Category as CategoryGet } from './category';

export interface Post {
  interview_id: number;
  title: string;
  recruitStatus: number;
  currentMember: number;
  maxMember: number;
  contact: string;
  content: string;
  recruitStatue: number;
  date: string;
  category: CategoryGet[];
  host: string;
  profile: string;
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
  postId: string;
  title: string;
  maxMember: number; //최대 멤버 수
  category: Category[];
  contact: string;
  content: string[];
  count: number;
  member: number; //멤버 수
  date: string;
  recruitStatus: number;
  isHost: boolean;
  userStatus: number;
  host: string;
}
