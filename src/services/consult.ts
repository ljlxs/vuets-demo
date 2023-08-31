import request from '@/utils/request'
import type { KnowledgeParams } from './types/consult'
import type {
  PageParams,
  KnowledgePage,
  DoctorPage,
  LikeParams
} from '@/types/consult'
// 首页关注
export const getUserInfo = (data: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'get', data)
}
// 首页关注列表
export const getPageDoc = (data: PageParams) => {
  return request<DoctorPage>('/home/page/doc', 'get', data)
}
// 关注
export const getlike = (data: LikeParams) => {
  return request('/like', 'post', data)
}
