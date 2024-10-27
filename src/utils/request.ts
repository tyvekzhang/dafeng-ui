import { clearAuthCache, getToken } from '@/utils/auth';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import NProgress from '@/settings/n_progress';
import { message } from 'antd';
import { Recordable } from 'vite-plugin-mock';

class HttpRequest {
  instance: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);

    this.instance.interceptors.request.use(
      (config) => {
        NProgress.start();
        // 添加token
        const token = getToken();
        if (token) {
          (config as Recordable).headers['Authorization'] = `${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => {
        NProgress.done();
        const data = response.data;

        if (data.code === 0) {
          return data.data;
        } else {
          message.error(data.msg);
          return;
        }
      },
      (error) => {
        NProgress.done();
        const data = error.response?.data;
        // 判断认证失败和认证过期的情况
        if (data && (data.code === 401 || data.code === 400)) {
          clearAuthCache();
          location.href = '/login';
        }
        message.error(data.msg || '服务出小差啦');
        return;
      },
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.instance.get(url, { params, ..._object });
  }

  post<T>(url: string, data?: object, _object = {}): Promise<T> {
    return this.instance.post(url, data, _object);
  }

  put<T>(url: string, data?: object, _object = {}): Promise<T> {
    return this.instance.put(url, data, _object);
  }

  delete<T>(url: string, params?: Record<string, unknown>, _object: Record<string, unknown> = {}): Promise<T> {
    return this.instance.delete(url, { params, ..._object });
  }
}

const config = {
  // 默认地址请求地址，在 .env 开头文件中修改
  baseURL: '/api/v1',
  // 设置超时时间（10s）
  timeout: 10 * 1000,
  // 跨域时候允许携带凭证
  withCredentials: true,
};
const httpClient = new HttpRequest(config);

export const axiosClient = axios.create(config);

export default httpClient;
