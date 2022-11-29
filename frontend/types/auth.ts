export interface Cookie {
  cookie: string;
}

export interface UserData {
  profile: string | null;
  nickname: string | null;
}

export interface UserDataProps {
  userData: UserData;
}

export interface GithubCodeProps {
  code: string | null;
}
