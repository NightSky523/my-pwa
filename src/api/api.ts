import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API响应接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 创建axios实例
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 可以在这里添加token等认证信息
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // 统一处理响应数据
      if (response.data.code === 200) {
        return response;
      } else {
        // 业务错误处理
        throw new Error(response.data.message || '请求失败');
      }
    },
    (error) => {
      // 网络错误处理
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            // 未授权，清除token并跳转到登录页
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            throw new Error('没有权限访问');
          case 404:
            throw new Error('请求的资源不存在');
          case 500:
            throw new Error('服务器内部错误');
          default:
            throw new Error(data?.message || '请求失败');
        }
      } else if (error.request) {
        throw new Error('网络连接失败，请检查网络设置');
      } else {
        throw new Error(error.message || '请求配置错误');
      }
    }
  );

  return instance;
};

// 创建API实例
export const api = createApiInstance();

// 封装常用的HTTP方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.get(url, config).then(response => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.post(url, data, config).then(response => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.put(url, data, config).then(response => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.delete(url, config).then(response => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.patch(url, data, config).then(response => response.data),
};

export default api;
