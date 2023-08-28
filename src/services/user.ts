import request from '@/utils/request'
// import type { loginParamsRules } from './types/user.d'
import type { User } from '@/types/user.d'
import type { CodeTypeRules } from '@/services/types/user.d'

export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', { mobile, password })
}
// 获取验证码
export const sendMobileCode = (mobile: string, type: CodeTypeRules) => {
  return request('/code', 'get', { mobile, type })
}
// 手机验证码
export const loginByMobile = (mobile: string, code: string) => {
  return request<User>('/login', 'post', { mobile, code })
}
