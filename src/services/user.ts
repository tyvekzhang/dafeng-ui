import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { LoginForm, LoginResponse, UserCreate } from '@/types/user';

// User login services
export function login(data: LoginForm) {
  return axiosInstance.post<LoginResponse>('/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// Refresh token
export function refreshTokens(data: LoginResponse) {
  return axiosInstance.post<LoginResponse>('/user/refreshTokens', {
    refresh_token: data.refresh_token,
    remember: data.remember,
  });
}

// Get User info
export function getUserInfo(): Promise<never> {
  return axiosInstance.get('/user/me'); // 使用 httpClient 的 get 方法
}

// Get dynamic menu
export function dynamicMenu(): Promise<AppMenu[]> {
  return axiosInstance.get('/user/dynamicMenu'); // 使用 httpClient 的 get 方法
}

export function logoutApi() {
  return axiosInstance.get('/user/logout');
}

export function register(data: UserCreate) {
  return axiosInstance.post('/user/register', data);
}
