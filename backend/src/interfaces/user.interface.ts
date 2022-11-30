export interface UserPayload {
  oauth_provider: string;
  oauth_uid: string;
}
export interface UserInfo {
  oauth_provider: string;
  oauth_uid: string;
  nickname: string;
  profile: string;
  id: number;
}
