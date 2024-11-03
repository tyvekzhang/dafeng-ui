import { BaseModel, BasePage } from '@/types/common';

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

export interface UserSearch {
  username?: string;
  nickname?: string;
  status?: number;
  create_time?: any;
}

export type UserResearchForm = BasePage & UserSearch;

export interface UserQuery extends BaseModel {
  username: string;
  password: string;
  nickname: string;
  status: number;
  remark?: string;
}

export interface UserTableData {
  records: UserQuery[] | undefined;
  total_count: number | undefined;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expired_at: number;
  refresh_token: string;
  re_expired_at: number;
  remember: boolean;
}

export interface userSearch {
  username?: string;
  nickname?: string;
  status?: number;
  created_time?: string;
}
