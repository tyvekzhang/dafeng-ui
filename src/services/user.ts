import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { downloadBlob, extractFilename } from '@/services/util';
import { LoginForm, LoginResponse, UserCreate, UserQuery, UserResearchForm, UserTableData } from '@/types/user';
import { AxiosResponse } from 'axios';

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

export function userList(userFilterForm: UserResearchForm) {
  return axiosInstance.get<UserTableData>('/user/users', userFilterForm);
}

export function userUpdate(data: UserQuery) {
  return axiosInstance.put<UserQuery>('/user/update', data);
}

export function userDelete(data: UserQuery) {
  return axiosInstance.delete(`/user/delete/${data.id}`);
}

export function userRecover(data: UserQuery) {
  return axiosInstance.post(`/user/recover`, data);
}

export function userRemove(ids: number[]) {
  return axiosInstance.delete(`/user/remove`, { ids: ids });
}

export async function userExport(page: number, size: number, fileName: string = 'users.xlsx') {
  try {
    const response = await axiosInstance.get<AxiosResponse>('/user/export', {
      params: {
        page: page,
        size: size,
        count: false,
      },
      responseType: 'blob',
    });
    const blob = response.data;
    const disposition = response.headers['content-disposition'];
    const filename = extractFilename(disposition) || fileName;

    downloadBlob(blob, filename);
  } catch (error) {
    console.error(error);
  }
}
