import type { AppMenu } from '@/router/types';
import axiosInstance from '@/services/request';
import { downloadBlob } from '@/services/util';
import { UserInfo } from '@/types';
import { LoginForm, Token, UserAdd, UserBatchModify, UserQuery, UserQueryForm, UserTableData } from '@/types/user';
import { AxiosResponse } from 'axios';
import { RcFile } from 'rc-upload/lib/interface';

export function userAdd(data: UserAdd) {
  return axiosInstance.post('/user/add', data);
}

export function login(data: LoginForm) {
  return axiosInstance.post<Token>('/user/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function refreshToken(data: Token) {
  return axiosInstance.post<Token>('/user/refreshtoken', {
    refresh_token: data.refresh_token,
  });
}

export function me(): Promise<UserInfo | null> {
  return axiosInstance.get('/user/me');
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

export function users(userFilterForm: UserQueryForm) {
  return axiosInstance.get<UserTableData>('/user/users', userFilterForm);
}

export async function userExport(userFilterForm: UserQueryForm, fileName: string = 'users.xlsx') {
  try {
    const response = await axiosInstance.get<AxiosResponse>('/user/export', userFilterForm, {
      responseType: 'blob',
    });
    downloadBlob(response, fileName);
  } catch (error) {
    console.error(error);
  }
}

export function userModify(data: UserQuery) {
  return axiosInstance.put<UserQuery>('/user/modify', data);
}

export function userBatchModify(ids_data: number[], user_batch_modify_data: UserBatchModify) {
  return axiosInstance.put('/user/batchmodify', {
    ids: { ids: ids_data },
    data: user_batch_modify_data,
  });
}

export function userRemove(data: UserQuery) {
  return axiosInstance.delete(`/user/remove/${data.id}`);
}

export function userRecover(data: UserQuery) {
  return axiosInstance.post(`/user/recover`, data);
}

export function userBatchRemove(ids: number[]) {
  return axiosInstance.delete(`/user/batchremove`, { ids: ids });
}

export function logout() {
  return axiosInstance.post('/user/logout');
}

export function userMenus() {
  return axiosInstance.get<AppMenu[]>('/user/menus');
}
