export type LoginForm = {
  username: string;
  password: string;
  remember: boolean;
};

export interface UserCreate {
  username: string;
  password: string;
  nickname: string;
  remark?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expired_at: number;
  refresh_token: string;
  re_expired_at: number;
  remember: boolean;
}
