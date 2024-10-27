interface UserCreate {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expired_at: number;
  refresh_token: string;
  re_expired_at: number;
}
