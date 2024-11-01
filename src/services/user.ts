import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { LoginForm, LoginResponse, UserCreate, UserQuery } from '@/types/user';

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

export function userList() {
  return axiosInstance.post<UserQuery[]>('/user/list', {});
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
