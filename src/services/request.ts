import { clearAuthCache, getToken, setAuthCache } from '@/utils/auth';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { message } from '@/components/GlobalToast';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { refreshTokens } from '@/services/user';
import NProgress from '@/settings/n_progress';
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
          (config as Recordable).headers['Authorization'] = `${token.token_type} ${token.access_token}`;
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
        } else if (data.refresh_token) {
          return data;
        } else {
          message.error(data.msg);
          return Promise.reject(new Error(data.msg));
        }
      },
      async (error) => {
        NProgress.done();
        const originalRequest = error.config;

        // 判断认证失败和认证过期的情况
        if (error.response.status === 401 && !originalRequest._retry) {
          debugger;
          originalRequest._retry = true;
          try {
            const oldToken = getToken();
            const token = await refreshTokens({ refresh_token: oldToken.refresh_token });
            setAuthCache(TOKEN_KEY, token as any);
            return this.instance(originalRequest);
          } catch (error) {
            console.log(error);
            debugger;
            clearAuthCache();
            location.href = '/login';
          }
        }
        message.error(error.msg || '服务开小差啦');
        return Promise.reject(error.message || error);
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
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10 * 1000,
  // 是否允许跨域携带凭证
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true' || true,
};

const axiosInstance = new HttpRequest(config);

export default axiosInstance;
