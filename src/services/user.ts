import request from '@/utils/request'
import type { loginParamsRules } from './types/user.d'

export const loginByPassword = (loginParams: loginParamsRules) => {
  return request('/login/password', 'post', loginParams)
}
