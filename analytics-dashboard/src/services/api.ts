import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { env } from '@/config/env'

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: env.api.baseUrl,
      timeout: env.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (env.auth.enabled) {
          const token = localStorage.getItem(env.auth.tokenKey)
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // Log request in debug mode
        if (env.features.debugMode) {
          console.log('API Request:', {
            method: config.method,
            url: config.url,
            data: config.data,
            params: config.params,
          })
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in debug mode
        if (env.features.debugMode) {
          console.log('API Response:', {
            status: response.status,
            data: response.data,
          })
        }
        return response
      },
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status,
          code: error.code,
          details: error.response?.data,
        }

        // Log error in debug mode
        if (env.features.debugMode) {
          console.error('API Error:', apiError)
        }

        // Handle specific error codes
        if (error.response?.status === 401 && env.auth.enabled) {
          // Clear auth token and redirect to login
          localStorage.removeItem(env.auth.tokenKey)
          // You can dispatch a logout action here if using state management
        }

        return Promise.reject(apiError)
      }
    )
  }

  // HTTP methods
  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config)
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config)
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config)
  }

  public patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config)
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config)
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

// Export convenience methods
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
}