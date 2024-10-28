import type { AppMenu } from '@/router/types';
import httpClient from '@/services/request';
import { LoginParams } from '@/types';
import { LoginResponse } from '@/types/user';

// User login services
export function login(data: LoginParams) {
  return httpClient.post<LoginResponse>('/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

// Get User info
export function getUserInfo(): Promise<never> {
  return httpClient.get('/user/me'); // 使用 httpClient 的 get 方法
}

// Get dynamic menu
export function dynamicMenu(): Promise<AppMenu[]> {
  return httpClient.get('/dynamicMenu'); // 使用 httpClient 的 get 方法
}

export function logoutApi() {
  return httpClient.get('/logout');
}
