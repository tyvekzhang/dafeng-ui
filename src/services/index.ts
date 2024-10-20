import type { AppMenu } from '@/router/types';
import httpClient from '@/utils/request';

interface LoginParams {
  username: string;
  password: string;
}

// User login services
export function loginApi(data: LoginParams): Promise<any> {
  return httpClient.post('/login', data); // 使用 httpClient 的 post 方法
}

// Get User info
export function getUserInfo(): Promise<never> {
  return httpClient.get('/getUserInfo'); // 使用 httpClient 的 get 方法
}

// Get dynamic menu
export function dynamicMenu(): Promise<AppMenu[]> {
  return httpClient.get('/dynamicMenu'); // 使用 httpClient 的 get 方法
}

export function logoutApi() {
  return httpClient.get('/logout');
}
