import { service } from '@/utils/axios';
import type { AppMenu } from '@/router/types';

interface LoginParams {
  username: string;
  password: string;
}

// User login api
export function loginApi(data: LoginParams): Promise<any> {
  return service({
    url: '/login',
    method: 'post',
    data,
  });
}

// Get User info
export function getUserInfo(): Promise<never> {
  return service({
    url: '/getUserInfo',
    method: 'get',
  });
}

export function dynamicMenu(): Promise<AppMenu[]> {
  return service({
    url: '/dynamicMenu',
    method: 'get',
  })
}
