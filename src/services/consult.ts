import request from '@/utils/request'
import type { KnowledgeParams, KnowPageDocParams } from './types/consult'
import type { KnowledgePage } from '@/types/consult'
// 首页关注
export const getUserInfo = (data: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'get', data)
}
// 首页关注列表
export const getPageDoc = (data: KnowPageDocParams) => {
  return request('/home/page/doc', 'get', data)
}
