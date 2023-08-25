import axios, { type Method } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '../router'
import type { Data } from '../types/reuqest'
const instance = axios.create({
  baseURL: '/dev-api',
  timeout: 10000
})
//请求拦截
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = useUserStore()
    if (store.user?.token) {
      config.headers.Authorization = 'Bearer ' + store.user?.token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
//响应拦截
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data.code !== 10000) {
      showToast(res.data.message)
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err) => {
    if (err.response.status == 401) {
      const store = useUserStore()
      store.delUser()
      // 返回登陆页currentRoute查看当前页面路径fullPath可以携带参数Path不可以携带参数
      router.push(`/login?${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

const request = <T>(
  url: string,
  method: Method = 'GET',
  submitData?: object
) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export default request
