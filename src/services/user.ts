import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { downloadBlob } from '@/services/util';
import {
  LoginForm,
  LoginResponse,
  UserBatchUpdate,
  UserCreate,
  UserQuery,
  UserResearchForm,
  UserTableData,
} from '@/types/user';
import { AxiosResponse } from 'axios';
import { RcFile } from 'rc-upload/lib/interface';

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

export async function userExport(userFilterForm: UserResearchForm, fileName: string = 'users.xlsx') {
  try {
    const response = await axiosInstance.get<AxiosResponse>('/user/export', userFilterForm, {
      responseType: 'blob',
    });
    downloadBlob(response, fileName);
  } catch (error) {
    console.error(error);
  }
}

export async function userExportTemplate(fileName: string = 'user_import_template.xlsx') {
  const response = await axiosInstance.get<AxiosResponse>(
    '/user/exportTemplate',
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, fileName);
}

export function userImport(file: RcFile) {
  const formData = new FormData();

  formData.append('file', file);
  return axiosInstance.post('/user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function userBatchUpdate(ids_data: number[], user_batch_update_data: UserBatchUpdate) {
  return axiosInstance.put('/user/batchUpdate', {
    ids_data: { ids: ids_data },
    user_batch_update_data: user_batch_update_data,
  });
}
