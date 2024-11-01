import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { TableParams } from '@/types/common';
import { LoginForm, LoginResponse, UserCreate, UserQuery, UserTableData } from '@/types/user';

export function login(data: LoginForm) {
  return axiosInstance.post<LoginResponse>('/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function refreshTokens(data: LoginResponse) {
  return axiosInstance.post<LoginResponse>('/user/refreshTokens', {
    refresh_token: data.refresh_token,
    remember: data.remember,
  });
}

export function meInfo(): Promise<never> {
  return axiosInstance.get('/user/me');
}

export function userMenu(): Promise<AppMenu[]> {
  return axiosInstance.get('/user/menu');
}

export function logoutApi() {
  return axiosInstance.get('/user/logout');
}

export function register(data: UserCreate) {
  return axiosInstance.post('/user/register', data);
}

export function userList(pagination: TableParams) {
  const data = {
    page: pagination?.page,
    size: pagination?.size,
  };
  return axiosInstance.post<UserTableData>('/user/list', data);
}

export function userUpdate(data: UserQuery) {
  return axiosInstance.put<UserQuery>('/user/', data);
}

export function userDelete(data: UserQuery) {
  return axiosInstance.delete(`/user/${data.id}`);
}

export function userRecover(data: UserQuery) {
  return axiosInstance.post(`/user/recover`, data);
}
