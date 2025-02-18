import { clearAllAuthCache, getAuthCache, getCacheToken, setAuthCache } from '@/utils/auth';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import qs from 'qs';

import { message } from '@/components/GlobalToast';
import { REMEMBER_KEY, TOKEN_KEY } from '@/enums/cacheEnum';
import { refreshToken } from '@/service/user';
import NProgress from '@/settings/n_progress';

class HttpRequest {
  requestTracker = new Set();

  instance: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...config,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        NProgress.start();
        const token = getCacheToken();
        if (token) {
          config.headers.Authorization = `${token.token_type} ${token.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => {
        NProgress.done();
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition && contentDisposition.includes('attachment')) {
          return response;
        }
        const data = response.data;
        if (data.code === 0) {
          return data.data;
        } else if (data.refresh_token) {
          return data;
        } else {
          message.error(data.msg ? data.msg : '服务器出小差啦');
          return Promise.reject(new Error(data.msg || '服务器出小差啦'));
        }
      },
      async (error) => {
        NProgress.done();
        const originalRequest = error.config;

        // 检查是否已在处理中
        const requestKey = `${originalRequest.url}:${originalRequest.method}`;
        if (this.requestTracker.has(requestKey)) {
          return Promise.reject(error);
        }

        // 检查是否为 401/403 并且尚未重试
        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
          this.requestTracker.add(requestKey); // 添加到追踪器
          originalRequest._retry = true;

          try {
            const oldToken = getCacheToken();
            const localRemember = getAuthCache(true, REMEMBER_KEY) as boolean;

            if (oldToken) {
              const newToken = await refreshToken(oldToken);
              setAuthCache(localRemember, TOKEN_KEY, newToken);
            }

            // 使用新的 Token 重试请求
            return this.instance({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${getCacheToken()}`,
              },
            });
          } catch (refreshError) {
            // 刷新 Token 失败，清除登录状态
            message.error('登录状态已失效，请重新登录');
            clearAllAuthCache();
            location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.requestTracker.delete(requestKey); // 请求完成后移除追踪
          }
        }

        // 刷新 Token 请求本身失败的处理
        if (originalRequest.url.includes('/refresh-token')) {
          message.error('刷新 Token 失败，请重新登录');
          clearAllAuthCache();
          location.href = '/login';
          return Promise.reject(error);
        }

        // 其他错误处理
        message.error(error.response.data?.msg || '服务开小差啦');
        return Promise.reject(error);
      }
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.instance.get(url, { params, ..._object });
  }

  post<T>(url: string, data?: object, _object = {}): Promise<T> {
    return this.instance.post(url, data, _object);
  }

  put<T>(url: string, data?: object | string, _object = {}): Promise<T> {
    return this.instance.put(url, data, _object);
  }

  delete<T>(url: string, params?: Record<string, unknown>, _object: Record<string, unknown> = {}): Promise<T> {
    return this.instance.delete(url, { params, ..._object });
  }
}

const config = {
  // API 基础地址
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  // 超时时间
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 120 * 1000,
  // 是否允许跨域携带凭证
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true' || true,
};

const httpClient = new HttpRequest(config);

export default httpClient;
